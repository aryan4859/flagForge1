import mongoose, { Schema, model } from "mongoose";
import { Questions } from "@/interfaces";

const hintSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  pointsDeduction: {
    type: Number,
    required: true,
    min: 0,
  }
}, { _id: true });

const questionSchema = new Schema<Questions>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    flag: {
      type: String,
      required: true,
    },
    addilinks: {
      type: String,
    },
    link: {
      type: String,
    },
    challengeFile: {
      type: String,
    },
    challengeType: {
      type: String,
      enum: ['link', 'file'],
      default: 'link',
    },
    done: {
      type: Boolean
    },
    hints: {
      type: [hintSchema],
      default: []
    },
    isTimeLimited: {
      type: Boolean,
      default: false
    },
    timeLimit: {
      type: Number,
      min: 1
    },
    timeLimitUnit: {
      type: String,
      enum: ['hours', 'days', 'weeks']
    },
    expiryDate: {
      type: Date,
      default: null
    },
    uploadedBy: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

questionSchema.index({ expiryDate: 1 });

questionSchema.index({ category: 1, points: 1 });

const QuestionModel =
  mongoose.models.Question || model("Question", questionSchema);

export default QuestionModel;