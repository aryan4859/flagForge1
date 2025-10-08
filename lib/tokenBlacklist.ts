import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import TokenBlacklistModel from "@/models/tokenBlacklistSchema";
import connect from "@/utlis/db";

export interface TokenPayload {
  jti: string;
  sub?: string;
  exp: number;
  iat: number;
  [key: string]: any;
}

export class TokenBlacklistService {
  // Add a token to blacklist
  static async addToBlacklist(tokenString: string): Promise<void> {
    try {
      await connect();

      let jti: string | undefined;
      let userId: string | undefined;
      let expiresAt: Date | undefined;

      // 1️⃣ Try decode as JWT
      const decoded = jwt.decode(tokenString) as TokenPayload | null;

      if (decoded && decoded.jti) {
        jti = decoded.jti;
        userId = decoded.sub || decoded.id;
        expiresAt = decoded.exp
          ? new Date(decoded.exp * 1000)
          : new Date(Date.now() + 60 * 60 * 1000);
      } else {
        // 2️⃣ If not JWT, treat as opaque token string
        jti = tokenString;
        userId = undefined;
        expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry by default
      }

      await TokenBlacklistModel.findOneAndUpdate(
        { jti },
        { jti, userId, expiresAt, blacklistedAt: new Date() },
        { upsert: true, new: true }
      );

      console.log("Token blacklisted:", { jti, userId });
    } catch (error) {
      console.error("Error adding token to blacklist:", error);
      throw error;
    }
  }

  // Check if token is blacklisted
  static async isBlacklisted(tokenString: string): Promise<boolean> {
    try {
      await connect();

      let jti: string;

      // 1️⃣ Try decode as JWT
      const decoded = jwt.decode(tokenString) as TokenPayload | null;

      if (decoded && decoded.jti) {
        jti = decoded.jti;
      } else {
        // 2️⃣ If not JWT, use token string itself
        jti = tokenString;
      }

      const blacklistedToken = await TokenBlacklistModel.findOne({ jti });
      const isBlacklisted = !!blacklistedToken;

      console.log("Blacklist check:", { jti, isBlacklisted });
      return isBlacklisted;
    } catch (error) {
      console.error("Error checking token blacklist:", error);
      return true; // Fail secure
    }
  }

  // Cleanup expired tokens older than 3 months
  static async cleanupExpired(): Promise<void> {
    try {
      await connect();

      const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

      const result = await TokenBlacklistModel.deleteMany({
        expiresAt: { $lt: threeMonthsAgo },
      });

      console.log(`Cleaned up ${result.deletedCount} expired tokens`);
    } catch (error) {
      console.error("Error cleaning up expired tokens:", error);
    }
  }

  // Generate a new JTI
  static generateJTI(): string {
    return randomUUID();
  }
}
