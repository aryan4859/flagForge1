import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import UserSchema from "@/models/userSchema";
import UserQuestionModel from "@/models/userQuestionSchema";

export const runtime = "nodejs";

// Helper function to create error responses
function createErrorResponse(message: string, status: number) {
  return NextResponse.json({ success: false, message }, { status });
}

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

async function getUserCompletionStats(user: any) {
  try {
    const completedCount = await UserQuestionModel.countDocuments({
      userId: user._id,
    });

    return {
      ...user,
      completedQuestions: completedCount,
      customBadges: user.customBadges || [],
    };
  } catch (error) {
    console.error(`Error getting stats for user ${user._id}:`, error);
    return {
      ...user,
      completedQuestions: 0,
      customBadges: user.customBadges || [],
    };
  }
}

export async function GET(req: NextRequest) {
  try {
    await connect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return createErrorResponse("Unauthorized", 401);
    }

    // Check if user is admin (now queries database)
    if (!(await isAdmin(session.user.email))) {
      return createErrorResponse(
        "Access denied. Admin privileges required.",
        403
      );
    }

    const users = await UserSchema.find({})
      .select("name email image totalScore customBadges createdAt")
      .sort({ totalScore: -1 })
      .lean();

    const usersWithStats = await Promise.all(users.map(getUserCompletionStats));

    return NextResponse.json({
      success: true,
      users: usersWithStats,
      total: usersWithStats.length,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return createErrorResponse("Failed to fetch users", 500);
  }
}
