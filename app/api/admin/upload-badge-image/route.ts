// File: /api/admin/badge-images/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import connect from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import BadgeImageModel from "@/models/badgeTemplateSchema";
import userSchema from "@/models/userSchema";

export const runtime = "nodejs";

// Admin check helper
async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  await connect();
  const user = await userSchema.findOne({ email: session.user.email });
  if (!user || user.role !== "Admin") {
    return NextResponse.json(
      { error: "Admin privileges required" },
      { status: 403 }
    );
  }
  return null;
}

// POST /api/admin/badge-images
export async function POST(request: NextRequest) {
  const adminCheck = await requireAdmin();
  if (adminCheck) return adminCheck;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const category = (formData.get("category") as string) || "badge-template";
    const name = (formData.get("name") as string) || "unnamed";
    const uploadedBy = (formData.get("uploadedBy") as string) || "unknown";

    if (!file)
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: PNG, JPG, WebP, GIF, SVG." },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Max size: 5MB." },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const extension = path.extname(file.name).toLowerCase() || ".png";
    const filename = `badge-${timestamp}-${randomStr}${extension}`;

    const uploadDir = path.join(process.cwd(), "public", "badges", "images");
    if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const imagePath = `/badges/images/${filename}`;

    await connect(); // Ensure DB connected
    const badgeDoc = await BadgeImageModel.create({
      name: name || filename.split(".")[0],
      path: imagePath,
      category,
      uploadedAt: new Date(),
      uploadedBy,
    });

    console.log(`✅ Badge image uploaded: ${imagePath}`);

    return NextResponse.json({
      success: true,
      imagePath,
      filename,
      imageId: badgeDoc._id,
      message: "Badge image uploaded successfully",
    });
  } catch (error) {
    console.error("❌ Badge image upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload badge image" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/badge-images
export async function DELETE(request: NextRequest) {
  const adminCheck = await requireAdmin();
  if (adminCheck) return adminCheck;

  try {
    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get("path");
    if (!imagePath || !imagePath.startsWith("/badges/images/")) {
      return NextResponse.json(
        { error: "Invalid image path" },
        { status: 400 }
      );
    }

    await connect();
    const badgeDoc = await BadgeImageModel.findOne({ path: imagePath });
    if (!badgeDoc) {
      return NextResponse.json(
        { error: "Badge image not found in database" },
        { status: 404 }
      );
    }

    await badgeDoc.deleteOne();

    const fullPath = path.join(process.cwd(), "public", imagePath);
    if (existsSync(fullPath)) await unlink(fullPath);

    console.log(`✅ Badge image deleted: ${imagePath}`);

    return NextResponse.json({
      success: true,
      message: "Badge image deleted successfully",
    });
  } catch (error) {
    console.error("❌ Badge image deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete badge image" },
      { status: 500 }
    );
  }
}
