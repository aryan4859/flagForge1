
import { NextRequest, NextResponse } from 'next/server';
import connect from "@/utlis/db";
import { ObjectId } from 'mongodb';

export const runtime = "nodejs";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, isActive } = body;
    
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
    
    if (isActive === undefined || isActive === null) {
      return NextResponse.json(
        { error: 'isActive status is required' },
        { status: 400 }
      );
    }

    const { db } = await connect();
    
    // Check if template exists
    const template = await db.collection('badgeTemplates').findOne({ 
      _id: new ObjectId(templateId) 
    });
    
    if (!template) {
      return NextResponse.json(
        { error: 'Badge template not found' },
        { status: 404 }
      );
    }
    
    // Update the active status
    const result = await db.collection('badgeTemplates').updateOne(
      { _id: new ObjectId(templateId) },
      { 
        $set: { 
          isActive: Boolean(isActive),
          updatedAt: new Date()
        } 
      }
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
    
    console.log(`Badge template status updated: ${template.name} - ${isActive ? 'activated' : 'deactivated'}`);
    
    return NextResponse.json({
      success: true,
      template: updatedTemplate,
      message: `Badge template ${isActive ? 'activated' : 'deactivated'} successfully`
    });
    
  } catch (error) {
    console.error('Badge template status update error:', error);
    return NextResponse.json(
      { error: 'Failed to update badge template status' },
      { status: 500 }
    );
  }
}