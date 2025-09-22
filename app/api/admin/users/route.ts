import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import UserSchema from "@/models/userSchema";
import UserQuestionModel from "@/models/userQuestionSchema";

export const runtime = "nodejs";

// Admin authentication check - fetch from database
async function isAdmin(email: string): Promise<boolean> {
  try {
    await connect();
    
    // Check if user exists and has Admin role
    const adminUser = await UserSchema.findOne({
      email: email,
      role: 'Admin' // Matches your enum: ["User", "Admin"]
    }).lean();
    
    return !!adminUser;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}



export async function GET(req: NextRequest) {
  try {
    await connect();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin (now queries database)
    if (!await isAdmin(session.user.email)) {
      return NextResponse.json(
        { success: false, message: "Access denied. Admin privileges required." },
        { status: 403 }
      );
    }

    // Get all users with their badges
    const users = await UserSchema.find({})
      .select('name email image totalScore customBadges createdAt')
      .sort({ totalScore: -1 })
      .lean();

    // Get completion stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
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
      })
    );

    return NextResponse.json({
      success: true,
      users: usersWithStats,
      total: usersWithStats.length,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}