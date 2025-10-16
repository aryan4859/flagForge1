import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connect from "@/utils/db";
import User from "@/models/userSchema";

export const runtime = "nodejs";

interface SessionUser {
  id?: string;
  email?: string;
  name?: string;
  image?: string;
}

interface CheckAdminResponse {
  isAdmin: boolean;
  user?: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
  message?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json(
        {
          isAdmin: false,
          message: "Not authenticated",
        } as CheckAdminResponse,
        { status: 401 }
      );
    }

    const sessionUser = session.user as SessionUser;

    if (!sessionUser.email) {
      return NextResponse.json(
        {
          isAdmin: false,
          message: "User email not found in session",
        } as CheckAdminResponse,
        { status: 400 }
      );
    }

    console.log(`Checking admin status for user: ${sessionUser.email}`);

    // Connect to database
    await connect();

    // Find user in database and cast to proper type
    const user = (await User.findOne({
      email: sessionUser.email,
    }).lean()) as any;

    if (!user) {
      console.log(`User ${sessionUser.email} not found in database`);
      return NextResponse.json(
        {
          isAdmin: false,
          message: "User not found in database",
        } as CheckAdminResponse,
        { status: 404 }
      );
    }

    // Check if user has admin role
    const isAdmin = user.role === "Admin";

    console.log(
      `Admin check result for ${sessionUser.email}: ${isAdmin} (role: ${user.role})`
    );

    const response: CheckAdminResponse = {
      isAdmin,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
      message: isAdmin ? "Admin access granted" : "Admin privileges required",
    };

    // Return appropriate status code
    return NextResponse.json(response, {
      status: isAdmin ? 200 : 403,
    });
  } catch (error) {
    console.error("Admin check error:", error);

    const errMsg =
      error instanceof Error ? error.message : "Unexpected error occurred";

    return NextResponse.json(
      {
        isAdmin: false,
        message: "Failed to verify admin status",
        details: errMsg,
      } as CheckAdminResponse,
      { status: 500 }
    );
  }
}
