import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import connect from '@/utlis/db';

export const runtime = "nodejs";

// Badge image schema interface
interface BadgeImage {
  name: string;
  path: string;
  category: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Fixed: Use 'file' instead of 'badge-image' to match the frontend
    const file = formData.get('file') as File;
    const category = formData.get('category') as string || 'badge-template';
    const name = formData.get('name') as string || 'unnamed';
    const uploadedBy = formData.get('uploadedBy') as string || 'unknown';
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload PNG, JPG, WebP, GIF, or SVG images.' }, 
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' }, 
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const extension = path.extname(file.name).toLowerCase() || '.png';
    const filename = `badge-${timestamp}-${randomStr}${extension}`;
    
    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'badges', 'images');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);
    
    // Create public URL
    const imagePath = `/badges/images/${filename}`;
    
    // Save to database
    try {
      const { db } = await connect();
      
      const badgeImageDoc: BadgeImage = {
        name: name || filename.split('.')[0],
        path: imagePath,
        category,
        uploadedAt: new Date(),
        uploadedBy
      };

      const result = await db.collection('badge_images').insertOne(badgeImageDoc);
      
      console.log(`Badge image uploaded and saved to DB: ${imagePath}`);
      
      return NextResponse.json({
        success: true,
        imagePath,
        filename,
        imageId: result.insertedId,
        message: 'Badge image uploaded successfully'
      });
      
    } catch (dbError) {
      console.error('Database error:', dbError);
      // File was uploaded successfully, but DB save failed
      return NextResponse.json({
        success: true,
        imagePath,
        filename,
        message: 'Badge image uploaded successfully (database save failed)',
        warning: 'Image saved to filesystem but not to database'
      });
    }
    
  } catch (error) {
    console.error('Badge image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload badge image' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get('path');
    
    if (!imagePath || !imagePath.startsWith('/badges/images/')) {
      return NextResponse.json(
        { error: 'Invalid image path' }, 
        { status: 400 }
      );
    }
    
    // Remove from database first
    try {
      const { db } = await connect();
      await db.collection('badge_images').deleteOne({ path: imagePath });
    } catch (dbError) {
      console.error('Database deletion error:', dbError);
    }
    
    // Remove file from filesystem
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    
    if (existsSync(fullPath)) {
      const fs = await import('fs/promises');
      await fs.unlink(fullPath);
      return NextResponse.json({ 
        success: true, 
        message: 'Image deleted successfully' 
      });
    } else {
      return NextResponse.json(
        { error: 'Image file not found' }, 
        { status: 404 }
      );
    }
    
  } catch (error) {
    console.error('Badge image deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete badge image' },
      { status: 500 }
    );
  }
}