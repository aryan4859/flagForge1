import { NextRequest, NextResponse } from "next/server";
import { tokenBlacklistMiddleware } from "./middleware/tokenBlacklist";
import { adminMiddleware } from "./middleware/adminToken";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("🧭 Root middleware triggered for:", pathname);

  // 1️⃣ Run token blacklist check for all routes
  const blacklistResponse = await tokenBlacklistMiddleware(request);
  if (blacklistResponse) return blacklistResponse; // Blocked

  // 2️⃣ Run admin middleware only for admin routes
  const adminPaths = ["/api/admin", "/roles/developers/admins", "/auth/"];

  if (adminPaths.some((path) => pathname.startsWith(path))) {
    const adminResponse = await adminMiddleware(request);
    if (adminResponse) return adminResponse; // Not admin
  }

  // 3️⃣ Continue to route if all checks passed
  return NextResponse.next();
}

// Apply middleware to API and roles routes
export const config = {
  matcher: ["/api/admin/:path*", "/roles/:path*"],
  runtime: "nodejs",
};
