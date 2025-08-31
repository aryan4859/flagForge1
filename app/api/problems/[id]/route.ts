import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import QuestionModel from "@/models/qustionsSchema";
import { HttpStatusCode } from "axios";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    await connect();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const latest = searchParams.get("latest");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query
    const query: any = {};
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    // Build sort options
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    // If latest=true or sortBy=createdAt, prioritize newest first
    if (latest === "true" || sortBy === "createdAt") {
      sortOptions.createdAt = -1;
    }

    const skip = (page - 1) * limit;
    
    // Get total count for pagination
    const total = await QuestionModel.countDocuments(query);
    
    // Fetch questions with sorting
    const questions = await QuestionModel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .select("-flag"); // Exclude flag from response for security

    return NextResponse.json({
      data: questions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error("Error fetching problems:", error);
    return NextResponse.json(
      { message: "Failed to fetch problems" },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}