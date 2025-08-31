// File: app/api/problems/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import QuestionModel from "@/models/qustionsSchema";
import { HttpStatusCode } from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    
    const { id } = await params;
    
    // Validate ID format (assuming MongoDB ObjectId)
    if (!id || id.length !== 24) {
      return NextResponse.json(
        { message: "Invalid problem ID" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    // Find the specific question by ID
    const question = await QuestionModel.findById(id).select("-flag");
    
    if (!question) {
      return NextResponse.json(
        { message: "Problem not found" },
        { status: HttpStatusCode.NotFound }
      );
    }

    // Check if user has solved this problem (you'll need to implement this based on your user schema)
    // For now, defaulting to false - replace with actual logic
    const isDone = false; // TODO: Check user's solved problems

    return NextResponse.json({
      question: question,
      isDone: isDone
    });

  } catch (error) {
    console.error("Error fetching problem:", error);
    return NextResponse.json(
      { message: "Failed to fetch problem" },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    
    // Get user session for authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: HttpStatusCode.Unauthorized }
      );
    }

    const { id } = await params;
    const { flag } = await req.json();

    // Validate inputs
    if (!id || id.length !== 24) {
      return NextResponse.json(
        { message: "Invalid problem ID" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    if (!flag || typeof flag !== 'string') {
      return NextResponse.json(
        { message: "Flag is required" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    // Find the question with the flag included
    const question = await QuestionModel.findById(id);
    
    if (!question) {
      return NextResponse.json(
        { message: "Problem not found" },
        { status: HttpStatusCode.NotFound }
      );
    }

    // Check if flag is correct
    const trimmedFlag = flag.trim();
    const isCorrect = question.flag === trimmedFlag;

    if (isCorrect) {
      // TODO: Mark problem as solved for this user in your user/progress schema
      // Example: await UserProgress.findOneAndUpdate(
      //   { userId: session.user.id, questionId: id },
      //   { solved: true, solvedAt: new Date() },
      //   { upsert: true }
      // );

      return NextResponse.json({
        message: "Right! Well done!",
        correct: true
      });
    } else {
      return NextResponse.json({
        message: "Wrong flag. Try again!",
        correct: false
      });
    }

  } catch (error) {
    console.error("Error submitting flag:", error);
    return NextResponse.json(
      { message: "Failed to submit flag" },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}