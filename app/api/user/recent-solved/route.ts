import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import userSchema from "@/models/userSchema";
import UserQuestionModel from "@/models/userQuestionSchema";
import QuestionModel from "@/models/qustionsSchema";
import { HttpStatusCode } from "axios";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    await connect();

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await userSchema.findOne({ email: session?.user?.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: HttpStatusCode.NotFound }
      );
    }

    // Get user's solved questions
    const userQuestions = await UserQuestionModel.find({
      userId: user.id,
    }).limit(10); // Limit to last 10 solved questions

    if (userQuestions.length === 0) {
      return NextResponse.json([]);
    }

    // Get the question details for each solved question
    const questionIds = userQuestions.map((uq) => uq.questionId);
    const questions = await QuestionModel.find({ _id: { $in: questionIds } })
      .select("title category points description createdAt") // Don't include flag
      .sort({ createdAt: -1 }); // Sort by when questions were created (most recent first)

    // Create a map for quick lookup of user question data
    const userQuestionMap = new Map();
    userQuestions.forEach((uq) => {
      userQuestionMap.set(uq.questionId.toString(), uq);
    });

    // Transform the data to match the expected format
    const recentSolved = questions
      .map((question) => {
        const userQuestion = userQuestionMap.get(question._id.toString());
        if (!userQuestion) return null;

        return {
          _id: question._id,
          title: question.title,
          category: question.category,
          points: question.points,
          description: question.description,
          solvedAt: userQuestion.createdAt, // When the user solved it
          questionCreatedAt: question.createdAt, // When the question was created
        };
      })
      .filter((item) => item !== null); // Remove null entries

    return NextResponse.json(recentSolved, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error fetching recent solved questions:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch recent solved questions" },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}
