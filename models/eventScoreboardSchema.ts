import mongoose, { Schema, model, Document } from "mongoose";

export interface IEventScoreboard extends Document {
  title: string;
  description: string;
  eventName: string;
  eventDate: Date;
  scoreboardUrl: string;
  eventImage?: string;
  winners?: {
    rank: number;
    teamName: string;
    totalScore: number;
    solvedChallenges: number;
  }[];
  totalTeams: number;
  totalPlayers: number;
  uploadedBy: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const eventScoreboardSchema = new Schema<IEventScoreboard>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    scoreboardUrl: {
      type: String,
      required: true,
      trim: true,
    },
    eventImage: {
      type: String,
      trim: true,
    },
    winners: {
      type: [{
        rank: {
          type: Number,
          required: true,
        },
        teamName: {
          type: String,
          required: true,
          trim: true,
        },
        totalScore: {
          type: Number,
          required: true,
          default: 0,
        },
        solvedChallenges: {
          type: Number,
          required: true,
          default: 0,
        },
      }],
      default: []
    },
    totalTeams: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPlayers: {
      type: Number,
      required: true,
      default: 0,
    },
    uploadedBy: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    strict: false, // Allow flexibility for schema changes
  }
);

// Create indexes for better query performance
eventScoreboardSchema.index({ eventName: 1 });
eventScoreboardSchema.index({ eventDate: -1 });
eventScoreboardSchema.index({ isActive: 1 });

const EventScoreboard = mongoose.models.EventScoreboard || model<IEventScoreboard>("EventScoreboard", eventScoreboardSchema);

export default EventScoreboard;