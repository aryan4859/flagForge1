// File: /api/admin/badge-templates/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import  connect  from '@/utlis/db';

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, icon, color, isActive, createdBy } = body;
    
    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Badge name is required' },
        { status: 400 }
      );
    }
    
    if (!description || !description.trim()) {
      return NextResponse.json(
        { error: 'Badge description is required' },
        { status: 400 }
      );
    }
    
    if (!icon || !icon.trim()) {
      return NextResponse.json(
        { error: 'Badge icon is required' },
        { status: 400 }
      );
    }

    const { db } = await connect();
    
    // Check if template with same name already exists
    const existingTemplate = await db.collection('badgeTemplates').findOne({ 
      name: name.trim() 
    });
    
    if (existingTemplate) {
      return NextResponse.json(
        { error: 'A badge template with this name already exists' },
        { status: 400 }
      );
    }
    
    // Create new template
    const templateDoc = {
      name: name.trim(),
      description: description.trim(),
      icon: icon.trim(),
      color: color || '#8B5CF6',
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date(),
      createdBy: createdBy || 'unknown'
    };

    const result = await db.collection('badgeTemplates').insertOne(templateDoc);
    
    const createdTemplate = await db.collection('badgeTemplates').findOne({
      _id: result.insertedId
    });
    
    console.log(`Badge template created: ${name} by ${createdBy}`);
    
    return NextResponse.json({
      success: true,
      template: createdTemplate,
      message: 'Badge template created successfully'
    });
    
  } catch (error) {
    console.error('Badge template creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create badge template' },
      { status: 500 }
    );
  }
}

