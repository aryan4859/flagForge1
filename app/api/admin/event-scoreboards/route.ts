import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connect from "@/utils/db";
import UserSchema from "@/models/userSchema";
import EventScoreboard from "@/models/eventScoreboardSchema";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

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

// GET - Fetch event scoreboards
export async function GET(req: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const eventName = searchParams.get("eventName");
    const isActive = searchParams.get("isActive");

    // Build query
    const query: any = {};
    if (eventName) query.eventName = { $regex: eventName, $options: "i" };
    if (isActive !== null) query.isActive = isActive === "true";

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch scoreboards with pagination
    const scoreboards = await EventScoreboard.find(query)
      .sort({ eventDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalCount = await EventScoreboard.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: scoreboards,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching event scoreboards:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch event scoreboards" },
      { status: 500 }
    );
  }
}

// POST - Create new event scoreboard
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

    const contentType = req.headers.get("content-type");
    let scoreboardData: any = {};
    let eventImage: string | undefined;

    if (contentType?.includes("multipart/form-data")) {
      // Handle file upload
      const formData = await req.formData();
      
      scoreboardData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        eventName: formData.get("eventName") as string,
        eventDate: formData.get("eventDate") as string,
        scoreboardUrl: formData.get("scoreboardUrl") as string,
        totalTeams: parseInt((formData.get("totalTeams") as string) || "0"),
        totalPlayers: parseInt((formData.get("totalPlayers") as string) || "0"),
        isActive: (formData.get("isActive") as string) === "true",
      };

      const file = formData.get("eventImage") as File;
      
      if (file && file.size > 0) {
        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
          return NextResponse.json(
            { success: false, message: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." },
            { status: 400 }
          );
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          return NextResponse.json(
            { success: false, message: "File size too large. Maximum 10MB allowed." },
            { status: 400 }
          );
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), "public", "uploads", "events");
        if (!existsSync(uploadsDir)) {
          await mkdir(uploadsDir, { recursive: true });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filename = `${timestamp}_${originalName}`;
        const filepath = path.join(uploadsDir, filename);

        // Save file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filepath, buffer);

        eventImage = `/uploads/events/${filename}`;
      }
    } else {
      // Handle JSON request
      scoreboardData = await req.json();
    }

    // Validate and clean winners data
    if (scoreboardData.winners && Array.isArray(scoreboardData.winners)) {
      scoreboardData.winners = scoreboardData.winners.map((winner: any) => ({
        rank: winner.rank || 0,
        teamName: winner.teamName || winner.playerName || 'Unknown Team',
        totalScore: winner.totalScore || winner.score || 0,
        solvedChallenges: winner.solvedChallenges || 0
      }));
    } else {
      scoreboardData.winners = [];
    }

    // Validate and clean data - no winners needed
    if (!scoreboardData.title || !scoreboardData.eventName || !scoreboardData.scoreboardUrl) {
      return NextResponse.json(
        { success: false, message: "Title, event name, and scoreboard URL are required" },
        { status: 400 }
      );
    }

    // Create new event scoreboard
    const newScoreboard = new EventScoreboard({
      ...scoreboardData,
      eventImage,
      uploadedBy: session.user.email,
    });

    await newScoreboard.save();

    return NextResponse.json({
      success: true,
      message: "Event scoreboard created successfully",
      data: newScoreboard,
    });
  } catch (error) {
    console.error("Error creating event scoreboard:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create event scoreboard" },
      { status: 500 }
    );
  }
}

// PUT - Update event scoreboard
export async function PUT(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const scoreboardId = searchParams.get("id");

    if (!scoreboardId) {
      return NextResponse.json(
        { success: false, message: "Scoreboard ID is required" },
        { status: 400 }
      );
    }

    console.log("Updating scoreboard with ID:", scoreboardId);

    const contentType = req.headers.get("content-type");
    let updateData: any = {};
    let eventImage: string | undefined;

    if (contentType?.includes("multipart/form-data")) {
      // Handle file upload
      const formData = await req.formData();
      
      updateData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        eventName: formData.get("eventName") as string,
        eventDate: formData.get("eventDate") as string,
        scoreboardUrl: formData.get("scoreboardUrl") as string,
        totalTeams: parseInt((formData.get("totalTeams") as string) || "0"),
        totalPlayers: parseInt((formData.get("totalPlayers") as string) || "0"),
        isActive: (formData.get("isActive") as string) === "true",
      };

      console.log("Update data:", updateData);

      const file = formData.get("eventImage") as File;
      
      if (file && file.size > 0) {
        // Validate and save new image (same logic as POST)
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
          return NextResponse.json(
            { success: false, message: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." },
            { status: 400 }
          );
        }

        if (file.size > 10 * 1024 * 1024) {
          return NextResponse.json(
            { success: false, message: "File size too large. Maximum 10MB allowed." },
            { status: 400 }
          );
        }

        const uploadsDir = path.join(process.cwd(), "public", "uploads", "events");
        if (!existsSync(uploadsDir)) {
          await mkdir(uploadsDir, { recursive: true });
        }

        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filename = `${timestamp}_${originalName}`;
        const filepath = path.join(uploadsDir, filename);

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filepath, buffer);

        eventImage = `/uploads/events/${filename}`;
        updateData.eventImage = eventImage;
      }
    } else {
      // Handle JSON request
      updateData = await req.json();
    }

    // Validate required fields - no winners needed
    if (!updateData.title || !updateData.eventName || !updateData.scoreboardUrl) {
      return NextResponse.json(
        { success: false, message: "Title, event name, and scoreboard URL are required" },
        { status: 400 }
      );
    }

    // Check if scoreboard exists first
    const existingScoreboard = await EventScoreboard.findById(scoreboardId);
    if (!existingScoreboard) {
      return NextResponse.json(
        { success: false, message: "Event scoreboard not found" },
        { status: 404 }
      );
    }

    console.log("Existing scoreboard found, updating...");

    // Update the scoreboard with cleaned data
    const updatedScoreboard = await EventScoreboard.findByIdAndUpdate(
      scoreboardId,
      updateData,
      { 
        new: true, 
        runValidators: true, // Enable validators now that data is clean
        strict: false        // Allow flexibility for schema changes
      }
    );

    if (!updatedScoreboard) {
      return NextResponse.json(
        { success: false, message: "Failed to update event scoreboard" },
        { status: 500 }
      );
    }

    console.log("Scoreboard updated successfully");

    return NextResponse.json({
      success: true,
      message: "Event scoreboard updated successfully",
      data: updatedScoreboard,
    });
  } catch (error) {
    console.error("Error updating event scoreboard:", error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('validation')) {
        return NextResponse.json(
          { success: false, message: `Validation error: ${error.message}` },
          { status: 400 }
        );
      }
      if (error.message.includes('Cast to ObjectId failed')) {
        return NextResponse.json(
          { success: false, message: "Invalid scoreboard ID format" },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { success: false, message: "Failed to update event scoreboard", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete event scoreboard
export async function DELETE(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const scoreboardId = searchParams.get("id");

    if (!scoreboardId) {
      return NextResponse.json(
        { success: false, message: "Scoreboard ID is required" },
        { status: 400 }
      );
    }

    // Find and delete the scoreboard
    const deletedScoreboard = await EventScoreboard.findByIdAndDelete(scoreboardId);

    if (!deletedScoreboard) {
      return NextResponse.json(
        { success: false, message: "Event scoreboard not found" },
        { status: 404 }
      );
    }

    // TODO: Optionally delete associated image file from filesystem
    // if (deletedScoreboard.eventImage) {
    //   const imagePath = path.join(process.cwd(), "public", deletedScoreboard.eventImage);
    //   if (existsSync(imagePath)) {
    //     await unlink(imagePath);
    //   }
    // }

    return NextResponse.json({
      success: true,
      message: "Event scoreboard deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event scoreboard:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete event scoreboard" },
      { status: 500 }
    );
  }
}