import mongoose, { Schema, model, Document } from "mongoose";

export interface IArchivedChallenge extends Document {
  title: string;
  description: string;
  challengeLink?: string;
  challengeFile?: string;
  challengeType: 'link' | 'file';
  eventName: string;
  eventDate: Date;
  category?: string;
  difficulty?: string;
  solveCount?: number;
  uploadedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const archivedChallengeSchema = new Schema<IArchivedChallenge>(
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
      trim: true,
    },
    challengeFile: {
      type: String,
      trim: true,
    },
    challengeType: {
      type: String,
      enum: ['link', 'file'],
      required: true,
      default: 'link',
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

// Validation: Either challengeLink or challengeFile must be provided
archivedChallengeSchema.pre('save', function(next) {
  if (this.challengeType === 'link' && !this.challengeLink) {
    next(new Error('Challenge link is required when type is link'));
  } else if (this.challengeType === 'file' && !this.challengeFile) {
    next(new Error('Challenge file is required when type is file'));
  } else {
    next();
  }
});

// Create indexes
archivedChallengeSchema.index({ eventName: 1, eventDate: -1 });
archivedChallengeSchema.index({ category: 1 });

// Export the model
export default mongoose.models.ArchivedChallenge || 
  model<IArchivedChallenge>("ArchivedChallenge", archivedChallengeSchema);