import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import QuestionModel from "@/models/qustionsSchema";
import { HttpStatusCode } from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import userSchema from "@/models/userSchema";
import UserQuestionModel from "@/models/userQuestionSchema";
import mongoose from "mongoose";

export const runtime = "nodejs";

// Schema for user hints tracking (same as in hints route)
const userHintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  usedHints: [{ type: Number }], // Array of hint indices
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userHintSchema.index({ userId: 1, questionId: 1 }, { unique: true });

const UserHintModel = mongoose.models.UserHint || mongoose.model("UserHint", userHintSchema);

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    const question = await QuestionModel.findById(id);
    
    if (!question) {
      return NextResponse.json(
        { message: `Question ${id} not found` },
        { status: HttpStatusCode.NotFound }
      );
    }

    const now = new Date();
    let expired = false;
    let timeRemaining = null;

    if (question.expiryDate) {
      const expiryDate = new Date(question.expiryDate);
      expired = expiryDate < now;
      timeRemaining = Math.max(0, expiryDate.getTime() - now.getTime());
    }

    if (expired) {
      return NextResponse.json(
        { 
          message: "This time-limited challenge has expired",
          expired: true 
        },
        { status: 410 }
      );
    }

    const questionData = question.toObject();
    delete questionData.flag;

    const user = await userSchema.findOne({ email: session?.user.email });
    const userQuestion = await UserQuestionModel.findOne({ 
      userId: user?.id, 
      questionId: id 
    });

    const isDone = !!userQuestion;
    
    // Get used hints for this user and question
    let usedHints = [];
    if (user) {
      const userHint = await UserHintModel.findOne({
        userId: user._id,
        questionId: id
      });
      usedHints = userHint ? userHint.usedHints : [];
    }

    return NextResponse.json({ 
      question: questionData,
      isDone,
      expired,
      timeRemaining,
      expiryDate: question.expiryDate,
      usedHints: usedHints
    });

  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}

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

    // Get the submitted flag from request body
    const body = await request.json();
    const { flag: submittedFlag } = body;

    if (!submittedFlag || typeof submittedFlag !== 'string') {
      return NextResponse.json(
        { message: "Flag is required" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    // Find the question
    const question = await QuestionModel.findById(id);
    if (!question) {
      return NextResponse.json(
        { message: "Question not found" },
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

    // Find the user
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
        { message: "You have already solved this challenge!" },
        { status: HttpStatusCode.Ok }
      );
    }

    // Check if the submitted flag is correct
    const trimmedSubmittedFlag = submittedFlag.trim();
    const correctFlag = question.flag.trim();

    if (trimmedSubmittedFlag === correctFlag) {
      // Flag is correct - save the solution
      try {
        // Calculate final points considering hint penalties
        let finalPoints = Number(question.points) || 0;
        
        // Get used hints to calculate penalty
        const userHint = await UserHintModel.findOne({
          userId: user._id,
          questionId: id
        });

        if (userHint && userHint.usedHints.length > 0) {
          let totalPenalty = 0;
          const hints = question.hints || [];
          
          userHint.usedHints.forEach((hintIndex: number) => {
            if (hintIndex < hints.length && hints[hintIndex].pointsDeduction) {
              totalPenalty += Number(hints[hintIndex].pointsDeduction) || 0;
            }
          });
          
          // Note: Penalty was already deducted when hints were used
          // So we don't deduct again, but we can show the effective points earned
          console.log(`User ${user._id} solved with ${totalPenalty} points already deducted from hints`);
        }
        
        const newSolution = new UserQuestionModel({
          userId: user._id,
          questionId: id,
          solvedAt: new Date(),
          pointsEarned: finalPoints
        });

        await newSolution.save();

        const updateResult = await userSchema.findByIdAndUpdate(
          user._id,
          { $inc: { totalScore: finalPoints } },
          { 
            new: true,
            upsert: false 
          }
        );

        if (!updateResult) {
          console.error("Failed to update user score");
        } else {
          console.log(`User ${user._id} score updated. Added: ${finalPoints}, New total: ${updateResult.totalScore}`);
        }

        return NextResponse.json(
          { 
            message: "Right! Congratulations on solving the challenge!",
            points: finalPoints,
            success: true
          },
          { status: HttpStatusCode.Ok }
        );

      } catch (saveError) {
        console.error("Error saving solution:", saveError);
        return NextResponse.json(
          { message: "Error saving your solution. Please try again." },
          { status: HttpStatusCode.InternalServerError }
        );
      }
    } else {
      // Flag is incorrect
      return NextResponse.json(
        { 
          message: "Incorrect flag. Try again!",
          success: false
        },
        { status: HttpStatusCode.Ok }
      );
    }

  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}