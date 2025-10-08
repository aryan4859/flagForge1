export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { tokenBlacklistMiddleware } from "./middleware/tokenBlacklist";
import { adminMiddleware } from "./middleware/adminToken";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block curl/wget/Postman
  if (pathname.startsWith("/api") || pathname.startsWith("/roles")) {
    const ua = request.headers.get("user-agent") || "";
    if (/curl|wget|python-requests|postman/i.test(ua)) {
      return NextResponse.json(
        { message: "Requests from curl/wget/Postman are blocked" },
        { status: 403 }
      );
    }
  }

  // Token blacklist
  const blacklistResponse = await tokenBlacklistMiddleware(request);
  if (blacklistResponse) return blacklistResponse;

  // Admin check
  if (
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/roles/developers/admins") ||
    pathname.startsWith("/auth/")
  ) {
    const adminResponse = await adminMiddleware(request);
    if (adminResponse) return adminResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/roles/:path*"],
};
