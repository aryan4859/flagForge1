import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connect from "@/utils/db";
import UserSchema from "@/models/userSchema";
import ArchivedChallengeModel from "@/models/archivedChallengeSchema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin authentication check
async function isAdmin(email: string): Promise<boolean> {
  try {
    await connect();
    const adminUser = await UserSchema.findOne({
      email: email,
      role: "Admin",
    }).lean();
    return !!adminUser;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

// POST - Create new archived challenge
export async function POST(req: NextRequest) {
  try {
    await connect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!(await isAdmin(session.user.email))) {
      return NextResponse.json(
        { success: false, message: "Admin privileges required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, description, challengeLink, eventName, eventDate, category, difficulty, solveCount } = body;

    if (!title || !description || !challengeLink || !eventDate) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: title, description, challengeLink, eventDate" },
        { status: 400 }
      );
    }

    const archivedChallenge = await ArchivedChallengeModel.create({
      title,
      description,
      challengeLink,
      eventName: eventName || "PGS CTF 2026 Archive",
      eventDate: new Date(eventDate),
      category,
      difficulty,
      solveCount: solveCount || 0,
      uploadedBy: session.user.email,
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Archived challenge created successfully",
        data: archivedChallenge 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating archived challenge:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to create archived challenge" },
      { status: 500 }
    );
  }
}

// GET - Fetch archived challenges
export async function GET(req: NextRequest) {
  try {
    await connect();

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const eventName = searchParams.get("eventName");
    const category = searchParams.get("category");

    const query: any = {};
    if (eventName && eventName !== "All") {
      query.eventName = eventName;
    }
    if (category && category !== "All") {
      query.category = category;
    }

    const skip = (page - 1) * limit;

    const [challenges, total] = await Promise.all([
      ArchivedChallengeModel.find(query)
        .sort({ eventDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ArchivedChallengeModel.countDocuments(query),
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

// DELETE - Delete archived challenge
export async function DELETE(req: NextRequest) {
  try {
    await connect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!(await isAdmin(session.user.email))) {
      return NextResponse.json(
        { success: false, message: "Admin privileges required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Challenge ID is required" },
        { status: 400 }
      );
    }

    const deletedChallenge = await ArchivedChallengeModel.findByIdAndDelete(id);

    if (!deletedChallenge) {
      return NextResponse.json(
        { success: false, message: "Archived challenge not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Archived challenge deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting archived challenge:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete archived challenge" },
      { status: 500 }
    );
  }
}
