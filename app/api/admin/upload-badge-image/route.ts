import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('badge-image') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload PNG, JPG, or WebP images.' }, 
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
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
    const uploadDir = path.join(process.cwd(), 'public', 'badges', 'custom');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Save to public directory
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);
    
    // Return the public URL
    const imagePath = `/badges/custom/${filename}`;
    
    console.log(`Badge image uploaded: ${imagePath}`);
    
    return NextResponse.json({
      success: true,
      imagePath,
      filename,
      message: 'Badge image uploaded successfully'
    });
    
  } catch (error) {
    console.error('Badge image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload badge image' },
      { status: 500 }
    );
  }
}

// Optional: DELETE endpoint to remove uploaded badge images
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get('path');
    
    if (!imagePath || !imagePath.startsWith('/badges/custom/')) {
      return NextResponse.json(
        { error: 'Invalid image path' }, 
        { status: 400 }
      );
    }
    
    // Remove leading slash and construct full path
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    
    // Check if file exists and delete
    if (existsSync(fullPath)) {
      await import('fs/promises').then(fs => fs.unlink(fullPath));
      return NextResponse.json({ success: true, message: 'Image deleted successfully' });
    } else {
      return NextResponse.json(
        { error: 'Image not found' }, 
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