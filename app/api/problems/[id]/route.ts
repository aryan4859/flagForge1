import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import QuestionModel from "@/models/qustionsSchema";
import { HttpStatusCode } from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import userSchema from "@/models/userSchema";
import UserQuestionModel from "@/models/userQuestionSchema";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await connect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: HttpStatusCode.Unauthorized }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const category = searchParams.get("category");

    // Build filter object
    const filter: any = {};
    if (category && category !== "All") {
      filter.category = category;
    }

    // Calculate pagination based on filtered results
    const skip = (page - 1) * limit;
    
    // Get total count for current filter
    const totalQuestions = await QuestionModel.countDocuments(filter);
    const totalPages = Math.ceil(totalQuestions / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    console.log('API Debug - Query results:', {
      totalQuestions,
      totalPages,
      hasNext,
      hasPrev,
      currentPage: page
    });

    // Fetch questions with filter applied on database level
    const questions = await QuestionModel.find(filter)
      .select('-flag')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Add expiry information
    const now = new Date();
    const questionsWithExpiry = questions.map(question => {
      let expired = false;
      let timeRemaining = null;

      if (question.expiryDate) {
        const expiryDate = new Date(question.expiryDate);
        expired = expiryDate < now;
        timeRemaining = Math.max(0, expiryDate.getTime() - now.getTime());
      }

      return {
        ...question,
        expired,
        timeRemaining,
      };
    });

    // Get user information
    const user = await userSchema.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: HttpStatusCode.NotFound }
      );
    }

    // Get user's solved questions
    const solvedQuestions = await UserQuestionModel.find({ userId: user._id })
      .select('questionId')
      .lean();

    const solvedQuestionIds = solvedQuestions.map(sq => sq.questionId.toString());

    return NextResponse.json({
      data: questionsWithExpiry,
      totalScore: user.totalScore || 0,
      questionDone: solvedQuestionIds,
      pagination: {
        currentPage: page,
        totalPages,
        hasNext,
        hasPrev,
        total: totalQuestions,
        limit
      },
      filter: {
        category: category || "All"
      }
    });

  } catch (error) {
    console.error("Error fetching problems:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}