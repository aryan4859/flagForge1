import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import QuestionModel from "@/models/qustionsSchema";
import { HttpStatusCode } from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import userSchema from "@/models/userSchema";
import UserQuestionModel from "@/models/userQuestionSchema";
export const runtime = "nodejs";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const { id } = await params; // Await the params
    const session = await getServerSession(authOptions);
    const question = await QuestionModel.findById(id);
    
    if (question) {
      question.flag = undefined;
    }

    const user = await userSchema.findOne({ email: session?.user.email });

    const userQuestion = await UserQuestionModel.find({ userId: user?.id });

    const isDone = userQuestion.some(
      (item: { questionId: string }) =>
        item.questionId.toString() === id
    );

    if (question) {
      return NextResponse.json({ question, isDone });
    }
    return NextResponse.json(
      { message: `Product ${id} not found`, isDone: isDone },
      { status: HttpStatusCode.NotFound }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error },
      { status: HttpStatusCode.BadRequest }
    );
  }
}

export async function POST(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const { id } = await params; // Await the params
    const body: { flag: string } = await req.json();
    const question = await QuestionModel.findById(id);
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

    if (body.flag == question?.flag) {
      user.totalScore = (user.totalScore || 0) + question.points;
      const userQuestion = await UserQuestionModel.create({ 
        userId: user.id, 
        questionId: id 
      });

      await userQuestion.save();
      await user.save();

      return NextResponse.json(
        { success: true, message: "Your Flag Is Right!" },
        { status: HttpStatusCode.Created }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Incorrect flag" },
        { status: HttpStatusCode.BadRequest }
      );
    }

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "An error occurred" },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}