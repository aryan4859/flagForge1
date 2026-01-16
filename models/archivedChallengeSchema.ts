import mongoose, { Schema, model } from "mongoose";

export interface ArchivedChallenge {
  title: string;
  description: string;
  challengeLink: string;
  eventName: string;
  eventDate: Date;
  category?: string;
  difficulty?: string;
  solveCount?: number;
  uploadedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const archivedChallengeSchema = new Schema<ArchivedChallenge>(
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
    challengeLink: {
      type: String,
      required: true,
      trim: true,
    },
    eventName: {
      type: String,
      required: true,
      default: "PGS CTF 2026 Archive",
      trim: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard", "Expert"],
    },
    solveCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    uploadedBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

archivedChallengeSchema.index({ eventName: 1, eventDate: -1 });
archivedChallengeSchema.index({ category: 1 });

const ArchivedChallengeModel =
  mongoose.models.ArchivedChallenge || 
  model("ArchivedChallenge", archivedChallengeSchema);

export default ArchivedChallengeModel;
