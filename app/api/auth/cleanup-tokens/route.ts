import { NextResponse } from 'next/server';
import { TokenBlacklistService } from '@/lib/tokenBlacklist';

export async function POST() {
  try {
    await TokenBlacklistService.cleanupExpired();
    return NextResponse.json({ message: 'Cleanup completed successfully' });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { error: 'Cleanup failed' },
      { status: 500 }
    );
  }
}