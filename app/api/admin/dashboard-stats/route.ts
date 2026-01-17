import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connect from "@/utils/db";
import UserSchema from "@/models/userSchema";
import QuestionModel from "@/models/qustionsSchema";
import BadgeTemplate from "@/models/badgeTemplate";
import UserQuestionModel from "@/models/userQuestionSchema";
import ArchivedChallenge from "@/models/archivedChallengeSchema";

export const runtime = "nodejs";

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

    // Check if user is admin
    if (!(await isAdmin(session.user.email))) {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Admin privileges required.",
        },
        { status: 403 }
      );
    }

    // Get all statistics in parallel for better performance
    const [
      totalQuestions,
      totalUsers,
      totalBadgeTemplates,
      activeBadgeTemplates,
      recentCompletions,
      totalArchivedChallenges,
    ] = await Promise.all([
      // Total challenges
      QuestionModel.countDocuments({}),

      // Total users
      UserSchema.countDocuments({}),

      // Total badge templates
      BadgeTemplate.countDocuments({}),

      // Active badge templates
      BadgeTemplate.countDocuments({ isActive: true }),

      // Recent activity (completed challenges in last 24 hours)
      UserQuestionModel.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }),

      // Total archived challenges
      ArchivedChallenge.countDocuments({}),
    ]);

    // Calculate active challenges (non-expired)
    const now = new Date();
    const activeQuestions = await QuestionModel.countDocuments({
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: null },
        { expiryDate: { $gt: now } },
      ],
    });

    // Get additional insights
    const [topCategories, recentUsers] = await Promise.all([
      // Most popular categories
      QuestionModel.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),

      // Users registered in last week
      UserSchema.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
    ]);

    const stats = {
      totalChallenges: totalQuestions,
      activeChallenges: activeQuestions,
      totalBadgeTemplates: totalBadgeTemplates,
      activeBadgeTemplates: activeBadgeTemplates,
      totalUsers: totalUsers,
      recentActivity: recentCompletions,
      newUsersThisWeek: recentUsers,
      topCategories: topCategories,
      totalArchivedChallenges: totalArchivedChallenges,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      stats: stats,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}
