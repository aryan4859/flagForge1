
import { NextRequest, NextResponse } from 'next/server';
import connect from '@/utlis/db';
import { ObjectId } from 'mongodb';

export const runtime = "nodejs";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, name, description, icon, color, isActive } = body;
    
    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }
    
    if (!ObjectId.isValid(templateId)) {
      return NextResponse.json(
        { error: 'Invalid template ID format' },
        { status: 400 }
      );
    }
    
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
    
    // Check if template exists
    const existingTemplate = await db.collection('badgeTemplates').findOne({ 
      _id: new ObjectId(templateId) 
    });
    
    if (!existingTemplate) {
      return NextResponse.json(
        { error: 'Badge template not found' },
        { status: 404 }
      );
    }
    
    // Check if another template with same name exists (excluding current one)
    const duplicateTemplate = await db.collection('badgeTemplates').findOne({ 
      name: name.trim(),
      _id: { $ne: new ObjectId(templateId) }
    });
    
    if (duplicateTemplate) {
      return NextResponse.json(
        { error: 'A badge template with this name already exists' },
        { status: 400 }
      );
    }
    
    // Update template
    const updateData = {
      name: name.trim(),
      description: description.trim(),
      icon: icon.trim(),
      color: color || '#8B5CF6',
      isActive: isActive !== undefined ? isActive : true,
      updatedAt: new Date()
    };

    const result = await db.collection('badgeTemplates').updateOne(
      { _id: new ObjectId(templateId) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Badge template not found' },
        { status: 404 }
      );
    }
    
    const updatedTemplate = await db.collection('badgeTemplates').findOne({
      _id: new ObjectId(templateId)
    });
    
    console.log(`Badge template updated: ${name}`);
    
    return NextResponse.json({
      success: true,
      template: updatedTemplate,
      message: 'Badge template updated successfully'
    });
    
  } catch (error) {
    console.error('Badge template update error:', error);
    return NextResponse.json(
      { error: 'Failed to update badge template' },
      { status: 500 }
    );
  }
}

