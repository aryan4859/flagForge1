import connect from "@/utlis/db";
import { NextRequest, NextResponse } from "next/server";
import QuestionModel from "@/models/qustionsSchema";
import { Questions } from "@/interfaces";
import { HttpStatusCode } from "axios";
import userSchema from "@/models/userSchema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import UserQuestionModel from "@/models/userQuestionSchema";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    await connect();
    const body: Questions = await req.json();
    if (body.title && body.points && body.category && body.flag && body.description) {
      const product = await QuestionModel.create(body);

      return NextResponse.json(
        { success: true, message: "Your qustion has been created" },
        { status: HttpStatusCode.Created }
      );
    }
    return NextResponse.json(
      { message: "Something is missing!" },
      { status: HttpStatusCode.BadRequest }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message },
      { status: HttpStatusCode.BadRequest }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const qpage = parseInt(searchParams.get("page") ?? "1", 10);
  const page: number = qpage;
  
  // Allow custom limit from query params, default to 8 for normal pagination
  const requestedLimit = searchParams.get("limit");
  const limit = requestedLimit ? parseInt(requestedLimit, 10) : 8;
  
  const startIndex = (page - 1) * limit;
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  
  try {
    await connect();
    
    // Build the query
    let query = QuestionModel.find().select('-flag');
    
    // Add sorting - newest first by default
    query = query.sort({ createdAt: -1 });
    
    // Apply pagination only if limit is reasonable (not trying to get all)
    if (limit <= 1000) {
      query = query.skip(startIndex).limit(limit);
    }
    
    const questions = await query.exec();

    const user = await userSchema.findOne({ email: session?.user?.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: HttpStatusCode.NotFound }
      );
    }

    const userQuestion = await UserQuestionModel.find({ userId: user.id });

    // Get total count for pagination info
    const totalQuestions = await QuestionModel.countDocuments();

    return NextResponse.json({ 
      data: questions, 
      totalScore: user.totalScore, 
      questionDone: userQuestion,
      pagination: {
        page,
        limit,
        total: totalQuestions,
        totalPages: Math.ceil(totalQuestions / limit),
        hasNext: page < Math.ceil(totalQuestions / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    return NextResponse.json({ error });
  }
}