import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import QuestionModel from "@/models/qustionsSchema";
import { HttpStatusCode } from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import userSchema from "@/models/userSchema";
import UserQuestionModel from "@/models/userQuestionSchema";

export const runtime = "nodejs";

// Model for tracking used hints per user
import mongoose from "mongoose";

// Schema for user hints tracking
const userHintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  usedHints: [{ type: Number }], // Array of hint indices
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userHintSchema.index({ userId: 1, questionId: 1 }, { unique: true });

const UserHintModel = mongoose.models.UserHint || mongoose.model("UserHint", userHintSchema);

// GET - Fetch available hints for a question
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: HttpStatusCode.Unauthorized }
      );
    }

    const question = await QuestionModel.findById(id);
    
    if (!question) {
      return NextResponse.json(
        { message: `Question ${id} not found` },
        { status: HttpStatusCode.NotFound }
      );
    }

    // Check if question has expired
    if (question.expiryDate) {
      const now = new Date();
      const expiryDate = new Date(question.expiryDate);
      if (expiryDate < now) {
        return NextResponse.json(
          { message: "This challenge has expired" },
          { status: HttpStatusCode.Gone }
        );
      }
    }

    const user = await userSchema.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: HttpStatusCode.NotFound }
      );
    }

    // Get used hints for this user and question
    const userHint = await UserHintModel.findOne({
      userId: user._id,
      questionId: id
    });

    const usedHints = userHint ? userHint.usedHints : [];
    const hints = question.hints || [];

    return NextResponse.json({ 
      hints: hints,
      usedHints: usedHints
    });

  } catch (error) {
    console.error("Error fetching hints:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}

// POST - Request a specific hint
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: HttpStatusCode.Unauthorized }
      );
    }

    const body = await request.json();
    const { hintIndex } = body;

    if (typeof hintIndex !== 'number' || hintIndex < 0) {
      return NextResponse.json(
        { message: "Invalid hint index" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const question = await QuestionModel.findById(id);
    
    if (!question) {
      return NextResponse.json(
        { message: `Question ${id} not found` },
        { status: HttpStatusCode.NotFound }
      );
    }

    // Check if question has expired
    if (question.expiryDate) {
      const now = new Date();
      const expiryDate = new Date(question.expiryDate);
      if (expiryDate < now) {
        return NextResponse.json(
          { message: "This challenge has expired" },
          { status: HttpStatusCode.Gone }
        );
      }
    }

    const user = await userSchema.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: HttpStatusCode.NotFound }
      );
    }

    // Check if user has already solved this question
    const existingSolution = await UserQuestionModel.findOne({
      userId: user._id,
      questionId: id
    });

    if (existingSolution) {
      return NextResponse.json(
        { message: "You have already solved this challenge! Hints are not needed." },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const hints = question.hints || [];
    
    if (hintIndex >= hints.length) {
      return NextResponse.json(
        { message: "Hint not found" },
        { status: HttpStatusCode.NotFound }
      );
    }

    const requestedHint = hints[hintIndex];

    // Get or create user hint record
    let userHint = await UserHintModel.findOne({
      userId: user._id,
      questionId: id
    });

    if (!userHint) {
      userHint = new UserHintModel({
        userId: user._id,
        questionId: id,
        usedHints: []
      });
    }

    // Check if hint already used
    if (userHint.usedHints.includes(hintIndex)) {
      return NextResponse.json(
        { message: "You have already used this hint" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    // Add hint to used hints
    userHint.usedHints.push(hintIndex);
    userHint.updatedAt = new Date();
    await userHint.save();

    let message = `Hint revealed: ${requestedHint.text}`;
    let pointsDeducted = 0;

    // Deduct points if specified
    if (requestedHint.pointsDeduction && Number(requestedHint.pointsDeduction) > 0) {
      pointsDeducted = Number(requestedHint.pointsDeduction);
      
      // Update user's total score
      const updateResult = await userSchema.findByIdAndUpdate(
        user._id,
        { $inc: { totalScore: -pointsDeducted } },
        { new: true }
      );

      if (updateResult) {
        message = `Hint revealed: ${requestedHint.text}. ${pointsDeducted} points deducted from your score.`;
      } else {
        console.error("Failed to update user score for hint penalty");
      }
    }

    return NextResponse.json({
      message: message,
      hint: requestedHint.text,
      pointsDeducted: pointsDeducted,
      success: true
    });

  } catch (error) {
    console.error("Error requesting hint:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}