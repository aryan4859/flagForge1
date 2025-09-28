import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { TokenBlacklistService } from '@/lib/tokenBlacklist';

export async function POST(request: NextRequest) {
  try {
    // Get the current session token
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    const sessionToken = request.cookies.get('next-auth.session-token')?.value ||
                        request.cookies.get('__Secure-next-auth.session-token')?.value;

    if (token && sessionToken) {
      // Blacklist the token
      await TokenBlacklistService.addToBlacklist(sessionToken);
      console.log('Token blacklisted during manual signout');
    }

    // Clear all auth cookies
    const response = NextResponse.json({ message: 'Signed out successfully' });
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('__Secure-next-auth.session-token');
    response.cookies.delete('next-auth.csrf-token');
    response.cookies.delete('__Secure-next-auth.csrf-token');
    response.cookies.delete('next-auth.callback-url');
    response.cookies.delete('__Secure-next-auth.callback-url');

    return response;
  } catch (error) {
  console.error('Manual signout error:', error);

  let message = 'Signout failed';
  if (error instanceof Error) {
    message = error.message;
  }

  return NextResponse.json(
    { error: 'Signout failed', details: message },
    { status: 500 }
  );
  }}