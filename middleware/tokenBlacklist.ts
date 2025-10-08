import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { TokenBlacklistService } from "@/lib/tokenBlacklist";

const publicPaths = [
  "/api/auth",
  "/auth/login", // make sure this page exists
  "/signup",
  "/_next",
  "/favicon.ico",
  "/public",
];

export const isPublicPath = (pathname: string) =>
  publicPaths.some((path) => pathname.startsWith(path));

export async function tokenBlacklistMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) return NextResponse.next();

  try {
    console.log("Middleware checking path:", pathname);

    // ✅ Use getToken() to get decoded session
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      console.log("No token, redirecting to login");
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // ✅ Check if token is blacklisted (use jti if using JWT)
    const jti = (token as any).jti; // if you are using JWT
    if (jti) {
      const isBlacklisted = await TokenBlacklistService.isBlacklisted(jti);
      if (isBlacklisted) {
        console.log("Token is blacklisted, clearing cookies and redirecting");
        const response = NextResponse.redirect(
          new URL("/auth/login", request.url)
        );
        response.cookies.delete("next-auth.session-token");
        response.cookies.delete("__Secure-next-auth.session-token");
        response.cookies.delete("next-auth.csrf-token");
        response.cookies.delete("__Secure-next-auth.csrf-token");
        response.cookies.delete("next-auth.callback-url");
        response.cookies.delete("__Secure-next-auth.callback-url");
        return response;
      }
    }

    console.log("Token valid, proceeding");
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
}
