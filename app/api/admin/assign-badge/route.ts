// app/api/admin/assign-badge/route.ts
import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import AssignedBadgeModel from "@/models/AssignedBadge";
import BadgeImageModel from "@/models/badgeImage";
import UserSchema from "@/models/userSchema";
import {
  AssignBadgeRequest,
  AssignBadgeResponse,
  AssignBadgeSuccessResponse,
  AssignBadgeErrorResponse,
} from "@/types/assignBadge";
import { getServerSession } from "next-auth";
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

// POST - Assign a badge to a user
export async function POST(
  request: NextRequest
): Promise<NextResponse<AssignBadgeResponse>> {
  try {
    // Connect to database
    await connect();
    console.log("Database connected successfully");
    // Check admin privileges
    const adminCheck = await requireAdmin(request);
    if (adminCheck) return adminCheck;

    const body = await request.json();
    console.log("Received request body:", JSON.stringify(body, null, 2));

    // Validate request body exists
    if (!body || typeof body !== "object") {
      const errorResponse: AssignBadgeErrorResponse = {
        success: false,
        error: "Invalid request body",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Handle both old format (with badge object) and new format (direct fields)
    let userId, badgeId, badgeType, assignedBy, reason, badgeName;

    if (body.badge && typeof body.badge === "object") {
      // Frontend is sending badge as nested object
      userId = body.userId;
      // Handle potential null/empty assignedBy
      assignedBy =
        (body.badge.assignedBy && body.badge.assignedBy.trim()) || "system";
      badgeType = "template"; // Assuming template badges for now
      badgeName = body.badge.name;
      badgeId = body.badge.name; // Using name as identifier for now
      reason = "Badge assigned by admin";

      // Validate nested badge object
      if (!badgeName || !badgeName.trim()) {
        const errorResponse: AssignBadgeErrorResponse = {
          success: false,
          error: "Badge name is required and cannot be empty",
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }
    } else {
      // Direct format
      ({
        userId,
        badgeId,
        badgeType = "template",
        assignedBy = "system",
        reason,
      } = body);
      badgeName = badgeId;
      // Ensure assignedBy is not null/empty
      assignedBy = (assignedBy && assignedBy.trim()) || "system";
    }

    // Validate required fields
    if (!userId || typeof userId !== "string") {
      const errorResponse: AssignBadgeErrorResponse = {
        success: false,
        error:
          "Missing or invalid required field: userId must be a non-empty string",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (!badgeId || typeof badgeId !== "string") {
      const errorResponse: AssignBadgeErrorResponse = {
        success: false,
        error:
          "Missing or invalid required field: badgeId must be a non-empty string",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    console.log(
      `Processing badge assignment - User: ${userId}, Badge: ${badgeId}, Type: ${badgeType}`
    );

    // For template badges from frontend, create a simplified badge object
    let badge;
    if (body.badge && typeof body.badge === "object") {
      badge = {
        _id: badgeName, // Use badge name as ID for templates
        name: badgeName,
        description: body.badge.description || "",
        icon: body.badge.icon || "",
        color: body.badge.color || "#000000",
      };
      badgeId = badgeName; // Store badge name as string for templates
    } else if (badgeType === "custom") {
      try {
        badge = await BadgeImageModel.findById(badgeId);
        if (!badge) {
          const errorResponse: AssignBadgeErrorResponse = {
            success: false,
            error: `Custom badge not found with ID: ${badgeId}`,
          };
          return NextResponse.json(errorResponse, { status: 404 });
        }
        // For custom badges, keep the ObjectId
      } catch (dbError) {
        console.error("Error fetching custom badge:", dbError);
        const errorResponse: AssignBadgeErrorResponse = {
          success: false,
          error: "Error fetching custom badge from database",
        };
        return NextResponse.json(errorResponse, { status: 500 });
      }
    } else {
      // Fallback for template badges
      badge = {
        _id: badgeName || badgeId,
        name: badgeName || badgeId,
        description: "Template badge",
        icon: "",
        color: "#000000",
      };
      badgeId = badgeName || badgeId; // Use string for templates
    }

    console.log(`Badge object prepared:`, JSON.stringify(badge, null, 2));

    // Check if the badge is already assigned to this user
    const existingAssignment = await AssignedBadgeModel.findOne({
      userId: userId,
      badgeId: badgeId, // Now using the proper badgeId (ObjectId or string)
      isActive: true,
    });

    if (existingAssignment) {
      console.log(`Badge already assigned to user ${userId}`);
      const errorResponse: AssignBadgeErrorResponse = {
        success: false,
        error: `Badge "${
          badge.name || badgeId
        }" is already assigned to this user`,
      };
      return NextResponse.json(errorResponse, { status: 409 });
    }

    // Create the badge assignment data
    const assignmentData = {
      userId: userId,
      badgeId: badgeId, // Now using the proper badgeId (ObjectId or string)
      badgeType: badgeType,
      assignedBy: assignedBy,
      reason: reason || "Badge assigned by admin",
      isActive: true,
      assignedAt: new Date(),
      // Store badge details for template badges
      badgeName: badge.name || badgeId,
      badgeDescription: badge.description || "",
      badgeIcon: badge.icon || "",
      badgeColor: badge.color || "#000000",
    };

    console.log(
      `Creating assignment with data:`,
      JSON.stringify(assignmentData, null, 2)
    );

    // Create the assignment
    const assignment = await AssignedBadgeModel.create(assignmentData);
    console.log(`Assignment created successfully:`, assignment._id);

    // Also add the badge to the user's customBadges array for profile display
    try {
      const user = await UserSchema.findById(userId);
      if (user) {
        const customBadge = {
          name: badge.name || badgeId,
          description: badge.description || "",
          icon: badge.icon || "",
          color: badge.color || "#000000",
          assignedAt: new Date(),
          assignedBy: assignedBy,
        };

        // Check if badge already exists in user's customBadges
        const existingBadgeIndex = user.customBadges.findIndex(
          (cb: any) => cb.name === customBadge.name
        );

        if (existingBadgeIndex === -1) {
          user.customBadges.push(customBadge);
          await user.save();
          console.log(`Badge added to user's customBadges array`);
        } else {
          console.log(`Badge already exists in user's customBadges, skipping`);
        }
      } else {
        console.warn(`User not found with ID: ${userId}`);
      }
    } catch (userUpdateError) {
      console.error("Error updating user customBadges:", userUpdateError);
      // Don't fail the assignment if user update fails, just log it
    }

    const successResponse: AssignBadgeSuccessResponse = {
      success: true,
      message: `Badge "${badge.name || badgeId}" assigned successfully`,
      assignmentId: assignment._id.toString(),
      badge: {
        id: badge.name || badgeId,
        name: badge.name || badgeId,
        type: badgeType,
      },
    };

    console.log(
      `Badge ${
        badge.name || badgeId
      } assigned to user ${userId} by ${assignedBy}`
    );
    return NextResponse.json(successResponse, { status: 201 });
  } catch (error: unknown) {
    console.error("Badge assignment error:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    let errorMessage = "Failed to assign badge";
    let statusCode = 500;

    // Handle specific mongoose errors
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);

      if (
        error.message.includes("duplicate key") ||
        error.message.includes("E11000")
      ) {
        errorMessage = "Badge is already assigned to this user";
        statusCode = 409;
      } else if (error.message.includes("validation failed")) {
        errorMessage = "Invalid data provided for badge assignment";
        statusCode = 400;
      } else if (error.message.includes("Cast to ObjectId failed")) {
        errorMessage = "Invalid user ID or badge ID format";
        statusCode = 400;
      }
    }

    const errMsg =
      error instanceof Error ? error.message : "Unexpected error occurred";

    const errorResponse: AssignBadgeErrorResponse = {
      success: false,
      error: errorMessage,
      details: errMsg,
    };

    return NextResponse.json(errorResponse, { status: statusCode });
  }
}

// GET - Get user's assigned badges or all assignments
export async function GET(request: NextRequest): Promise<NextResponse<any>> {
  try {
    await connect();
    console.log("GET request - Database connected");

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    console.log(`GET request - userId: ${userId}`);

    // If userId is provided, get badges for that specific user
    if (userId) {
      const assignments = await AssignedBadgeModel.find({
        userId,
        isActive: true,
      })
        .sort({ assignedAt: -1 })
        .lean(); // Use lean() for better performance

      console.log(`Found ${assignments.length} assignments for user ${userId}`);

      return NextResponse.json({
        success: true,
        assignments,
        count: assignments.length,
      });
    } else {
      // If no userId, return all active assignments (for admin overview)
      const assignments = await AssignedBadgeModel.find({ isActive: true })
        .sort({ assignedAt: -1 })
        .lean();

      console.log(`Found ${assignments.length} total assignments`);

      return NextResponse.json({
        success: true,
        assignments,
        count: assignments.length,
      });
    }
  } catch (error: unknown) {
    console.error("Get assigned badges error:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    const errMsg =
      error instanceof Error ? error.message : "Unexpected error occurred";

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch assigned badges",
        details: errMsg,
      },
      { status: 500 }
    );
  }
}

// DELETE - Remove badge assignment
export async function DELETE(request: NextRequest): Promise<NextResponse<any>> {
  try {
    await connect();
    console.log("DELETE request - Database connected");

    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get("id");
    const userId = searchParams.get("userId");
    const badgeId = searchParams.get("badgeId");

    console.log(
      `DELETE request - assignmentId: ${assignmentId}, userId: ${userId}, badgeId: ${badgeId}`
    );

    // Allow deletion by assignment ID or by userId + badgeId combination
    let query: any = {};

    if (assignmentId) {
      query._id = assignmentId;
    } else if (userId && badgeId) {
      query = { userId, badgeId, isActive: true };
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Either assignmentId or both userId and badgeId are required",
        },
        { status: 400 }
      );
    }

    const assignment = await AssignedBadgeModel.findOne(query);

    if (!assignment) {
      console.log("Badge assignment not found with query:", query);
      return NextResponse.json(
        { success: false, error: "Badge assignment not found" },
        { status: 404 }
      );
    }

    // Soft delete - set isActive to false instead of actually deleting
    await AssignedBadgeModel.findByIdAndUpdate(assignment._id, {
      isActive: false,
    });

    // Also remove the badge from the user's customBadges array
    try {
      const user = await UserSchema.findById(assignment.userId);
      if (user) {
        const badgeIndex = user.customBadges.findIndex(
          (cb: any) =>
            cb.name === assignment.badgeName || cb.name === assignment.badgeId
        );

        if (badgeIndex !== -1) {
          user.customBadges.splice(badgeIndex, 1);
          await user.save();
          console.log(`Badge removed from user's customBadges array`);
        } else {
          console.log(`Badge not found in user's customBadges array`);
        }
      } else {
        console.warn(`User not found with ID: ${assignment.userId}`);
      }
    } catch (userUpdateError) {
      console.error(
        "Error updating user customBadges during removal:",
        userUpdateError
      );
      // Don't fail the removal if user update fails, just log it
    }

    console.log(`Badge assignment ${assignment._id} deactivated successfully`);

    return NextResponse.json({
      success: true,
      message: "Badge assignment removed successfully",
    });
  } catch (error: unknown) {
    console.error("Remove badge assignment error:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    const errMsg =
      error instanceof Error ? error.message : "Unexpected error occurred";

    return NextResponse.json(
      {
        success: false,
        error: "Failed to remove badge assignment",
        details: errMsg,
      },
      { status: 500 }
    );
  }
}
