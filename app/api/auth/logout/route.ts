// app/api/auth/logout/route.ts (for App Router)
// or pages/api/auth/logout.ts (for Pages Router)

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (session) {
      // Log the logout event for security monitoring
      console.log(`User logout: ${session.user.email} at ${new Date().toISOString()}`);
    }
    const response = new NextResponse(
      JSON.stringify({ success: true, message: 'Logged out successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

    // Clear NextAuth cookies with proper attributes
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };

    // Clear session token
    response.cookies.set('next-auth.session-token', '', {
      ...cookieOptions,
      expires: new Date(0),
    });

    // Clear callback URL
    response.cookies.set('next-auth.callback-url', '', {
      ...cookieOptions,
      expires: new Date(0),
    });

    // Clear CSRF token
    response.cookies.set('next-auth.csrf-token', '', {
      ...cookieOptions,
      expires: new Date(0),
    });

    // If using custom domain, also clear with domain prefix
    if (process.env.NODE_ENV === 'production' && process.env.NEXTAUTH_URL) {
      const domain = new URL(process.env.NEXTAUTH_URL).hostname;
      
      response.cookies.set('next-auth.session-token', '', {
        ...cookieOptions,
        domain,
        expires: new Date(0),
      });
    }

    return response;
  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}

