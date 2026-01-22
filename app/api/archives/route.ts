import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db";
import ArchivedChallenge from "@/models/archivedChallengeSchema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET - Fetch archived challenges (public access)
export async function GET(req: NextRequest) {
  try {
    await connect();

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const eventName = searchParams.get("eventName");
    const category = searchParams.get("category");

    // Build query filters
    const query: any = {};
    if (eventName && eventName !== "All") {
      query.eventName = eventName;
    }
    if (category && category !== "All") {
      query.category = category;
    }

    const skip = (page - 1) * limit;

    // Fetch challenges and total count
    const [challenges, total] = await Promise.all([
      ArchivedChallenge.find(query)
        .sort({ eventDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ArchivedChallenge.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: challenges,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error: any) {
    console.error("Error fetching archived challenges:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch archived challenges" },
      { status: 500 }
    );
  }
}