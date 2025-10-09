import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { TokenBlacklistService } from '@/lib/tokenBlacklist';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { token, expiresAt } = await request.json();
    
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    // Parse expiration date or use default (1 hour from now)
    const expiration = expiresAt 
      ? new Date(expiresAt) 
      : new Date(Date.now() + 60 * 60 * 1000);

    // Add to blacklist with proper arguments
    await TokenBlacklistService.addToBlacklist(
      token,
      expiration,
      session.user.id // userId from session
    );
    
    console.log('✅ Token revoked:', {
      userId: session.user.id,
      expiresAt: expiration.toISOString(),
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Token revoked successfully' 
    });
  } catch (error) {
    console.error('❌ Token revocation error:', error);
    
    let message = 'Failed to revoke token';
    if (error instanceof Error) {
      message = error.message;
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to revoke token',
        details: message
      },
      { status: 500 }
    );
  }
}
