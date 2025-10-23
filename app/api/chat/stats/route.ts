import { NextResponse } from "next/server";
import connect from "@/utils/db";
import userSchema from "@/models/userSchema";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import mongoose from "mongoose";

const chatHintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  hintRequests: [
    {
      timestamp: { type: Date, default: Date.now },
      message: String,
      hintLevel: String,
      pointsDeducted: { type: Number, default: 0 },
    },
  ],
  totalPointsDeducted: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

chatHintSchema.index({ userId: 1, questionId: 1 }, { unique: true });

const ChatHintModel =
  mongoose.models.ChatHint || mongoose.model("ChatHint", chatHintSchema);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const challengeId = searchParams.get("challengeId");

    if (!challengeId) {
      return NextResponse.json(
        { message: "Challenge ID is required" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connect();

    const user = await userSchema.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const chatHint = await ChatHintModel.findOne({
      userId: user._id,
      questionId: challengeId,
    });

    return NextResponse.json({
      totalPointsDeducted: chatHint?.totalPointsDeducted || 0,
      totalHintsUsed: chatHint?.hintRequests?.length || 0,
    });
  } catch (error) {
    console.error("Error fetching chat stats:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}