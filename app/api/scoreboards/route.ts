import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db";
import EventScoreboard from "@/models/eventScoreboardSchema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET - Fetch public scoreboards (no auth required for public display)
export async function GET(req: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    // Fetch active scoreboards, sorted by event date (newest first)
    const scoreboards = await EventScoreboard.find({ isActive: true })
      .sort({ eventDate: -1 })
      .limit(limit)
      .select('title description eventName eventDate totalTeams totalPlayers winners isActive')
      .lean();

    return NextResponse.json(scoreboards);
  } catch (error) {
    console.error("Error fetching scoreboards:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch scoreboards" },
      { status: 500 }
    );
  }
}