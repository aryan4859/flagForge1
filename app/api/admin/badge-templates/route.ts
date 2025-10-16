import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db";
import BadgeTemplate from "@/models/badgeTemplate";
import { getServerSession } from "next-auth/next";
import UserSchema from "@/models/userSchema";

export const runtime = "nodejs";

async function requireAdmin(request: NextRequest) {
  const session = await getServerSession();
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json(
      { success: false as false, error: "Not authenticated" },
      { status: 401 }
    );
  }
  await connect();
  const user = await UserSchema.findOne({ email: session.user.email });
  if (!user || user.role !== "Admin") {
    return NextResponse.json(
      { success: false as false, error: "Admin privileges required" },
      { status: 403 }
    );
  }
  return null; // Means admin check passed
}

// Type definitions
interface BadgeTemplateRequest {
  name: string;
  description: string;
  icon: string;
  color?: string;
  isActive?: boolean;
  createdBy?: string;
}

interface MongooseError extends Error {
  name: string;
  errors?: { [key: string]: { message: string } };
  code?: number;
}

// GET - Fetch all badge templates
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await connect();
    // Admin check
    const adminCheck = await requireAdmin(request);
    if (adminCheck) return adminCheck;

    console.log("Fetching badge templates");

    const templates = await BadgeTemplate.find({})
      .sort({ createdAt: -1 })
      .select("-createdBy")
      .lean(); // Use lean() for better performance when you don't need Mongoose document methods

    console.log(`Fetched ${templates.length} badge templates`);

    return NextResponse.json({
      success: true,
      templates: templates,
      count: templates.length,
    });
  } catch (error) {
    console.error("Badge template fetch error:", error);

    const errMsg =
      error instanceof Error ? error.message : "Unexpected error occurred";

    return NextResponse.json(
      { error: "Failed to fetch badge templates", details: errMsg },
      { status: 500 }
    );
  }
}

// POST - Create new badge template
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Admin check
    const adminCheck = await requireAdmin(request);
    if (adminCheck) return adminCheck;

    // Parse request body
    const body: BadgeTemplateRequest = await request.json();
    const { name, description, icon, color, isActive, createdBy } = body;

    console.log("Creating badge template:", {
      name,
      description,
      icon,
      color,
      isActive,
      createdBy,
    });

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Badge name is required" },
        { status: 400 }
      );
    }

    if (!description || !description.trim()) {
      return NextResponse.json(
        { error: "Badge description is required" },
        { status: 400 }
      );
    }

    if (!icon || !icon.trim()) {
      return NextResponse.json(
        { error: "Badge icon is required" },
        { status: 400 }
      );
    }

    await connect();

    // Check if template with same name already exists
    const existingTemplate = await BadgeTemplate.findOne({
      name: name.trim(),
    });

    if (existingTemplate) {
      return NextResponse.json(
        { error: "A badge template with this name already exists" },
        { status: 400 }
      );
    }

    // Create new template
    const templateData = {
      name: name.trim(),
      description: description.trim(),
      icon: icon.trim(),
      color: color || "#8B5CF6",
      isActive: isActive !== undefined ? isActive : true,
      createdBy: createdBy || "unknown",
    };

    const createdTemplate = await BadgeTemplate.create(templateData);

    console.log(`Badge template created: ${name} by ${createdBy}`);

    return NextResponse.json({
      success: true,
      template: createdTemplate,
      message: "Badge template created successfully",
    });
  } catch (error) {
    console.error("Badge template creation error:", error);

    const mongooseError = error as MongooseError;

    // Handle Mongoose validation errors
    if (mongooseError.name === "ValidationError" && mongooseError.errors) {
      const validationErrors = Object.values(mongooseError.errors).map(
        (err) => err.message
      );
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors.join(", ") },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (mongooseError.code === 11000) {
      return NextResponse.json(
        { error: "A badge template with this name already exists" },
        { status: 400 }
      );
    }

    const errMsg =
      error instanceof Error ? error.message : "Unexpected error occurred";

    return NextResponse.json(
      { error: "Failed to create badge template", details: errMsg },
      { status: 500 }
    );
  }
}
