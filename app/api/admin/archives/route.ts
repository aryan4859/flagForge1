import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connect from "@/utils/db";
import UserSchema from "@/models/userSchema";
import ArchivedChallenge from "@/models/archivedChallengeSchema";
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

// POST - Create new archived challenge
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
    let challengeData: any = {};
    let challengeFile: string | undefined;

    if (contentType?.includes("multipart/form-data")) {
      // Handle file upload
      const formData = await req.formData();
      
      challengeData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        eventName: (formData.get("eventName") as string) || "PGS CTF 2026 Archive",
        eventDate: formData.get("eventDate") as string,
        category: formData.get("category") as string,
        difficulty: formData.get("difficulty") as string,
        solveCount: parseInt((formData.get("solveCount") as string) || "0"),
        challengeType: "file"
      };

      const file = formData.get("challengeFile") as File;
      
      if (!file) {
        return NextResponse.json(
          { success: false, message: "No file uploaded" },
          { status: 400 }
        );
      }

      // Validate file type
      const allowedTypes = [
        "application/zip",
        "application/x-zip-compressed",
        "application/pdf",
        "text/plain",
        "application/octet-stream",
        "image/png",
        "image/jpeg",
        "image/jpg"
      ];
      
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, message: "Invalid file type. Allowed: ZIP, PDF, TXT, PNG, JPG" },
          { status: 400 }
        );
      }

      // Validate file size (50MB)
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        return NextResponse.json(
          { success: false, message: "File too large. Max size: 50MB" },
          { status: 400 }
        );
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 15);
      const extension = path.extname(file.name).toLowerCase() || "";
      const filename = `challenge-${timestamp}-${randomStr}${extension}`;

      // Create upload directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), "public", "challenges", "files");
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      // Save file
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);

      challengeFile = `/challenges/files/${filename}`;
    } else {
      // Handle JSON data (link-based challenge)
      challengeData = await req.json();
      challengeData.challengeType = "link";
    }

    // Validate required fields
    if (!challengeData.title || !challengeData.description || !challengeData.eventDate) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: title, description, eventDate" },
        { status: 400 }
      );
    }

    // Validate challenge link or file based on type
    if (challengeData.challengeType === "link" && !challengeData.challengeLink) {
      return NextResponse.json(
        { success: false, message: "Challenge link is required for link-type challenges" },
        { status: 400 }
      );
    }

    if (challengeData.challengeType === "file" && !challengeFile) {
      return NextResponse.json(
        { success: false, message: "Challenge file is required for file-type challenges" },
        { status: 400 }
      );
    }

    // Create archived challenge
    const archivedChallenge = await ArchivedChallenge.create({
      title: challengeData.title,
      description: challengeData.description,
      challengeLink: challengeData.challengeLink,
      challengeFile: challengeFile,
      challengeType: challengeData.challengeType,
      eventName: challengeData.eventName || "PGS CTF 2026 Archive",
      eventDate: new Date(challengeData.eventDate),
      category: challengeData.category,
      difficulty: challengeData.difficulty,
      solveCount: challengeData.solveCount || 0,
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

// PUT - Update archived challenge
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
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Challenge ID is required" },
        { status: 400 }
      );
    }

    // Find existing challenge
    const existingChallenge = await ArchivedChallenge.findById(id);
    if (!existingChallenge) {
      return NextResponse.json(
        { success: false, message: "Archived challenge not found" },
        { status: 404 }
      );
    }

    const contentType = req.headers.get("content-type");
    let updateData: any = {};
    let newChallengeFile: string | undefined;

    if (contentType?.includes("multipart/form-data")) {
      // Handle file upload update
      const formData = await req.formData();
      
      updateData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        eventName: (formData.get("eventName") as string) || "PGS CTF 2026 Archive",
        eventDate: formData.get("eventDate") as string,
        category: formData.get("category") as string,
        difficulty: formData.get("difficulty") as string,
        solveCount: parseInt((formData.get("solveCount") as string) || "0"),
        challengeType: formData.get("challengeType") as string || existingChallenge.challengeType,
      };

      const file = formData.get("challengeFile") as File;
      
      // If a new file is uploaded
      if (file && file.size > 0) {
        // Validate file type
        const allowedTypes = [
          "application/zip",
          "application/x-zip-compressed",
          "application/pdf",
          "text/plain",
          "application/octet-stream",
          "image/png",
          "image/jpeg",
          "image/jpg"
        ];
        
        if (!allowedTypes.includes(file.type)) {
          return NextResponse.json(
            { success: false, message: "Invalid file type. Allowed: ZIP, PDF, TXT, PNG, JPG" },
            { status: 400 }
          );
        }

        // Validate file size (50MB)
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
          return NextResponse.json(
            { success: false, message: "File too large. Max size: 50MB" },
            { status: 400 }
          );
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 15);
        const extension = path.extname(file.name).toLowerCase() || "";
        const filename = `challenge-${timestamp}-${randomStr}${extension}`;

        // Create upload directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), "public", "challenges", "files");
        if (!existsSync(uploadDir)) {
          await mkdir(uploadDir, { recursive: true });
        }

        // Save new file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        newChallengeFile = `/challenges/files/${filename}`;

        // Delete old file if it exists
        if (existingChallenge.challengeFile) {
          try {
            const oldFilePath = path.join(process.cwd(), "public", existingChallenge.challengeFile);
            if (existsSync(oldFilePath)) {
              const { unlink } = await import("fs/promises");
              await unlink(oldFilePath);
            }
          } catch (fileError) {
            console.error("Error deleting old file:", fileError);
          }
        }
      }
    } else {
      // Handle JSON data update
      updateData = await req.json();
    }

    // Validate required fields
    if (!updateData.title || !updateData.description || !updateData.eventDate) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: title, description, eventDate" },
        { status: 400 }
      );
    }

    // Prepare update object
    const updateObject: any = {
      title: updateData.title,
      description: updateData.description,
      eventName: updateData.eventName || "PGS CTF 2026 Archive",
      eventDate: new Date(updateData.eventDate),
      category: updateData.category,
      difficulty: updateData.difficulty,
      solveCount: updateData.solveCount || 0,
    };

    // Handle challenge type changes
    if (updateData.challengeType) {
      updateObject.challengeType = updateData.challengeType;
      
      if (updateData.challengeType === 'link') {
        if (!updateData.challengeLink) {
          return NextResponse.json(
            { success: false, message: "Challenge link is required for link-type challenges" },
            { status: 400 }
          );
        }
        updateObject.challengeLink = updateData.challengeLink;
        updateObject.challengeFile = undefined;
      } else if (updateData.challengeType === 'file') {
        if (newChallengeFile) {
          updateObject.challengeFile = newChallengeFile;
        } else if (!existingChallenge.challengeFile) {
          return NextResponse.json(
            { success: false, message: "Challenge file is required for file-type challenges" },
            { status: 400 }
          );
        }
        updateObject.challengeLink = undefined;
      }
    } else {
      // Keep existing type and update accordingly
      if (updateData.challengeLink) {
        updateObject.challengeLink = updateData.challengeLink;
      }
      if (newChallengeFile) {
        updateObject.challengeFile = newChallengeFile;
      }
    }

    // Update the challenge
    const updatedChallenge = await ArchivedChallenge.findByIdAndUpdate(
      id,
      updateObject,
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      { 
        success: true, 
        message: "Archived challenge updated successfully",
        data: updatedChallenge 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating archived challenge:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update archived challenge" },
      { status: 500 }
    );
  }
}

// DELETE - Delete archived challenge
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
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Challenge ID is required" },
        { status: 400 }
      );
    }

    // Find and delete the challenge
    const deletedChallenge = await ArchivedChallenge.findByIdAndDelete(id);

    if (!deletedChallenge) {
      return NextResponse.json(
        { success: false, message: "Archived challenge not found" },
        { status: 404 }
      );
    }

    // If it was a file-based challenge, try to delete the file
    if (deletedChallenge.challengeFile) {
      try {
        const filePath = path.join(process.cwd(), "public", deletedChallenge.challengeFile);
        if (existsSync(filePath)) {
          const { unlink } = await import("fs/promises");
          await unlink(filePath);
        }
      } catch (fileError) {
        console.error("Error deleting file:", fileError);
        // Don't fail the request if file deletion fails
      }
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