import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connect from "@/utils/db";
import UserSchema from "@/models/userSchema";
import EventScoreboard from "@/models/eventScoreboardSchema";

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

// GET - Debug scoreboards data
export async function GET(req: NextRequest) {
  try {
    await connect();

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check admin privileges
    if (!(await isAdmin(session.user.email))) {
      return NextResponse.json(
        { success: false, message: "Admin privileges required" },
        { status: 403 }
      );
    }

    // Get raw data from database
    const rawScoreboards = await EventScoreboard.find({}).lean();
    
    const debugInfo = {
      totalScoreboards: rawScoreboards.length,
      scoreboards: rawScoreboards.map(scoreboard => ({
        _id: scoreboard._id,
        title: scoreboard.title,
        eventName: scoreboard.eventName,
        winnersCount: scoreboard.winners?.length || 0,
        winners: scoreboard.winners?.map((winner: any, index: number) => ({
          index,
          rank: winner.rank,
          teamName: winner.teamName,
          playerName: winner.playerName, // Check if old field exists
          totalScore: winner.totalScore,
          score: winner.score, // Check if old field exists
          solvedChallenges: winner.solvedChallenges,
          hasOldFormat: !!(winner.playerName || winner.score !== undefined)
        })) || []
      }))
    };

    return NextResponse.json({
      success: true,
      data: debugInfo
    });

  } catch (error) {
    console.error("Error debugging scoreboards:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to debug scoreboards", 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}