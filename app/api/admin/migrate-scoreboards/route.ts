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

// POST - Migrate old winner format to new team format
export async function POST(req: NextRequest) {
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

    console.log("Starting scoreboard migration...");

    // Find all scoreboards and clean up the data
    const allScoreboards = await EventScoreboard.find({}).lean();
    console.log(`Found ${allScoreboards.length} scoreboards to process`);

    let migratedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const scoreboard of allScoreboards) {
      try {
        console.log(`Processing scoreboard: ${scoreboard._id}`);
        
        let updatedWinners: {
          rank: number;
          teamName: string;
          totalScore: number;
          solvedChallenges: number;
        }[] = [];

        if (scoreboard.winners && Array.isArray(scoreboard.winners) && scoreboard.winners.length > 0) {
          updatedWinners = scoreboard.winners.map((winner: any, index: number) => {
            console.log(`Processing winner ${index}:`, winner);
            
            return {
              rank: winner.rank || index + 1,
              teamName: winner.teamName || winner.playerName || `Team ${index + 1}`,
              totalScore: winner.totalScore || winner.score || 0,
              solvedChallenges: winner.solvedChallenges || 0
            };
          });
        }

        console.log(`Updated winners for ${scoreboard._id}:`, updatedWinners);

        // Update the document with clean data using replaceOne for complete replacement
        const result = await EventScoreboard.replaceOne(
          { _id: scoreboard._id },
          {
            title: scoreboard.title,
            description: scoreboard.description,
            eventName: scoreboard.eventName,
            eventDate: scoreboard.eventDate,
            scoreboardUrl: scoreboard.scoreboardUrl,
            eventImage: scoreboard.eventImage,
            winners: updatedWinners,
            totalTeams: scoreboard.totalTeams || 0,
            totalPlayers: scoreboard.totalPlayers || 0,
            uploadedBy: scoreboard.uploadedBy,
            isActive: scoreboard.isActive !== false, // Default to true if undefined
            createdAt: scoreboard.createdAt,
            updatedAt: new Date()
          }
        );

        console.log(`Update result for ${scoreboard._id}:`, result);

        if (result.modifiedCount > 0) {
          migratedCount++;
          console.log(`Successfully migrated scoreboard: ${scoreboard._id}`);
        }
      } catch (error) {
        console.error(`Error migrating scoreboard ${scoreboard._id}:`, error);
        errorCount++;
        errors.push(`${scoreboard._id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    console.log(`Migration completed. Migrated: ${migratedCount}, Errors: ${errorCount}`);

    return NextResponse.json({
      success: errorCount === 0,
      message: `Migration completed. Successfully processed ${migratedCount} scoreboards${errorCount > 0 ? ` with ${errorCount} errors` : ''}`,
      migratedCount,
      errorCount,
      errors: errorCount > 0 ? errors : undefined
    });

  } catch (error) {
    console.error("Error during migration:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to migrate scoreboards", 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}