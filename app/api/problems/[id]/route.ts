import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import QuestionModel from "@/models/qustionsSchema";
import { HttpStatusCode } from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import userSchema from "@/models/userSchema";
import UserQuestionModel from "@/models/userQuestionSchema";
export const runtime = "nodejs";

// app/api/problems/[id]/route.ts
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
        { status: 410
        }
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

    return NextResponse.json({ 
      question: questionData,
      isDone,
      expired,
      timeRemaining,
      expiryDate: question.expiryDate
    });

  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}