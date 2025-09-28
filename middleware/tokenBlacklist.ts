import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { TokenBlacklistService } from '@/lib/tokenBlacklist';

const publicPaths = [
  '/api/auth',
  '/login',
  '/signup',
  '/_next',
  '/favicon.ico',
  '/public'
];

const isPublicPath = (pathname: string): boolean => {
  return publicPaths.some(path => pathname.startsWith(path));
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  try {
    console.log('Middleware checking path:', pathname);

    // Get the JWT token from the request
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    console.log('Token from NextAuth:', token ? 'Found' : 'Not found');

    if (!token) {
      console.log('No token, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Get the raw session cookie
    const sessionToken = request.cookies.get('next-auth.session-token')?.value ||
                        request.cookies.get('__Secure-next-auth.session-token')?.value;
    
    console.log('Session cookie:', sessionToken ? 'Found' : 'Not found');
    
    if (sessionToken) {
      const isBlacklisted = await TokenBlacklistService.isBlacklisted(sessionToken);
      console.log('Token blacklisted:', isBlacklisted);
      
      if (isBlacklisted) {
        console.log('Token is blacklisted, clearing cookies and redirecting');
        // Token is blacklisted, clear cookies and redirect to login
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('next-auth.session-token');
        response.cookies.delete('__Secure-next-auth.session-token');
        response.cookies.delete('next-auth.csrf-token');
        response.cookies.delete('__Secure-next-auth.csrf-token');
        response.cookies.delete('next-auth.callback-url');
        response.cookies.delete('__Secure-next-auth.callback-url');
        return response;
      }
    }

    console.log('Token valid, proceeding');
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, redirect to login for security
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};