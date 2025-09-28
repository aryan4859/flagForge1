import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import TokenBlacklistModel from '@/models/tokenBlacklistSchema';
import connect from '@/utlis/db';

export interface TokenPayload {
  jti: string;
  sub?: string;
  exp: number;
  iat: number;
  [key: string]: any;
}

export class TokenBlacklistService {
  static async addToBlacklist(tokenString: string): Promise<void> {
    try {
      await connect();
      
      // Try to decode the JWT token
      let decoded: TokenPayload;
      
      try {
        // First try to decode as a proper JWT
        decoded = jwt.decode(tokenString) as TokenPayload;
        
        // If that fails, try to verify it (this will also decode it)
        if (!decoded) {
          decoded = jwt.verify(tokenString, process.env.NEXTAUTH_SECRET!) as TokenPayload;
        }
      } catch (jwtError) {
        // If it's not a proper JWT, try to parse as JSON (for our mock tokens)
        try {
          decoded = JSON.parse(tokenString) as TokenPayload;
        } catch (parseError) {
          console.error('Unable to parse token:', parseError);
          throw new Error('Invalid token format');
        }
      }
      
      if (!decoded?.jti) {
        throw new Error('Token missing JTI');
      }

      const expiresAt = decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + (60 * 60 * 1000));
      
      // Add token to blacklist
      const result = await TokenBlacklistModel.findOneAndUpdate(
        { jti: decoded.jti },
        {
          jti: decoded.jti,
          userId: decoded.sub || decoded.id,
          expiresAt: expiresAt,
          blacklistedAt: new Date()
        },
        { upsert: true, new: true }
      );
      
      console.log('Token blacklisted:', { jti: decoded.jti, userId: decoded.sub || decoded.id });
      
    } catch (error) {
      console.error('Error adding token to blacklist:', error);
      throw error;
    }
  }

  static async isBlacklisted(tokenString: string): Promise<boolean> {
    try {
      await connect();
      
      let decoded: TokenPayload;
      
      try {
        // Try to decode as JWT first
        decoded = jwt.decode(tokenString) as TokenPayload;
        if (!decoded) {
          decoded = jwt.verify(tokenString, process.env.NEXTAUTH_SECRET!) as TokenPayload;
        }
      } catch (jwtError) {
        // If not JWT, try JSON parse
        try {
          decoded = JSON.parse(tokenString) as TokenPayload;
        } catch (parseError) {
          console.error('Unable to parse token for blacklist check:', parseError);
          return true; // Consider invalid tokens as blacklisted
        }
      }
      
      if (!decoded?.jti) {
        return true; // Consider tokens without JTI as blacklisted
      }

      const blacklistedToken = await TokenBlacklistModel.findOne({ 
        jti: decoded.jti 
      });
      
      const isBlacklisted = !!blacklistedToken;
      console.log('Blacklist check:', { jti: decoded.jti, isBlacklisted });
      
      return isBlacklisted;
    } catch (error) {
      console.error('Error checking token blacklist:', error);
      return true; // Fail secure
    }
  }

  static async cleanupExpired(): Promise<void> {
    try {
      await connect();
      
      const now = new Date();
      const threeMonthsAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
      
      const result = await TokenBlacklistModel.deleteMany({
        expiresAt: { $lt: threeMonthsAgo }
      });
      
      console.log(`Cleaned up ${result.deletedCount} expired tokens`);
    } catch (error) {
      console.error('Error cleaning up expired tokens:', error);
    }
  }

  static generateJTI(): string {
    return randomUUID();
  }
}
