import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedRoutes = [
  '/roles/developers/admins',
  '/api/badges',
  '/api/badge-templates',
  '/resources/upload',
];

const adminOnlyRoutes = [
  '/roles/developers/admins',
  '/api/badges',
  '/api/badge-templates',
  '/resources/upload',
];

export async function adminMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 🧭 Add your debug logs here
  console.log("🧭 Middleware running for:", pathname);
  console.log("🔑 Token:", token);
  console.log("👤 Role:", token?.role);

  if (!token) {
    const url = new URL('/auth', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  const isAdminRoute = adminOnlyRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isAdminRoute) {
    if (token.role !== 'admin') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          {
            error: 'Forbidden',
            message: 'Admin privileges required',
            isAdmin: false,
          },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', token.sub || '');
  requestHeaders.set('x-user-role', token.role as string || 'user');
  requestHeaders.set('x-user-email', token.email || '');

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/roles/developers/admins/:path*',
    '/api/badges/:path*',
    '/resources/upload',
    '/api/badge-templates/:path*',
  ],
};

