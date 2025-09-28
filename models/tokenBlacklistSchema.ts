import mongoose, { Document, Schema } from "mongoose";

interface ITokenBlacklist extends Document {
  jti: string; // JWT ID
  userId?: string;
  expiresAt: Date;
  blacklistedAt: Date;
}

const TokenBlacklistSchema = new Schema<ITokenBlacklist>({
  jti: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    required: false
  },
  expiresAt: {
    type: Date,
    required: true,
    // Auto-delete documents after they expire + grace period (3 months)
    expires: 60 * 60 * 24 * 90 // 90 days in seconds
  },
  blacklistedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries
TokenBlacklistSchema.index({ jti: 1, expiresAt: 1 });

const TokenBlacklistModel = mongoose.models.TokenBlacklist || 
  mongoose.model<ITokenBlacklist>("TokenBlacklist", TokenBlacklistSchema);

export default TokenBlacklistModel;