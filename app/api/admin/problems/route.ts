import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db";
import QuestionModel from "@/models/qustionsSchema";
import { HttpStatusCode } from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import userSchema from "@/models/userSchema";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await connect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: HttpStatusCode.Unauthorized });
    }

    const user = await userSchema.findOne({ email: session.user.email });
    if (!user || user.role !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: HttpStatusCode.Unauthorized });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = parseInt(searchParams.get("limit") ?? "100", 10);
    const skip = (page - 1) * limit;

    const questions = await QuestionModel.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await QuestionModel.countDocuments();

    return NextResponse.json({
      success: true,
      data: questions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching admin problems:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: HttpStatusCode.InternalServerError });
  }
}
