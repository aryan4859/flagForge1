import { NextResponse } from "next/server";
import UserSchema from "@/models/userSchema";
import connect from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET /api/user/role
export async function GET() {
  try {
    await connect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user data
    const user = await UserSchema.findOne({ email: session.user.email }).select('role');
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      role: user.role || 'User',
      isAdmin: user.role === 'Admin'
    });
  } catch (error) {
    console.error("User role API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}