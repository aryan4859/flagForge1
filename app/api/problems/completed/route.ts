// /api/problems/completed/route.ts
import connect from "@/utlis/db";
import { NextRequest, NextResponse } from "next/server";
import QuestionModel from "@/models/qustionsSchema";
import { HttpStatusCode } from "axios";
import userSchema from "@/models/userSchema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import UserQuestionModel from "@/models/userQuestionSchema";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: HttpStatusCode.Unauthorized }
    );
  }

  try {
    await connect();

    // Find the user
    const user = await userSchema.findOne({ email: session?.user?.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: HttpStatusCode.NotFound }
      );
    }

    // Get all completed questions by this user
    const completedUserQuestions = await UserQuestionModel.find({ 
      userId: user._id 
    }).populate({
      path: 'questionId',
      select: '-flag', // Exclude the flag field for security
      model: QuestionModel
    });

    // Extract the populated question data and add completion info
    const completedProblems = completedUserQuestions
      .filter(userQuestion => userQuestion.questionId) // Filter out any null/undefined
      .map(userQuestion => ({
        ...userQuestion.questionId.toObject(),
        completedAt: userQuestion.createdAt, // When they completed it
        pointsEarned: userQuestion.questionId.points // Points they earned
      }))
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()); // Sort by completion date, newest first

    return NextResponse.json({
      success: true,
      completedProblems,
      totalCompleted: completedProblems.length
    });

  } catch (error: any) {
    console.error("Error fetching completed problems:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch completed problems" },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}