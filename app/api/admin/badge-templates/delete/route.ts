// File: /api/admin/badge-templates/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connect from "@/utlis/db";
import { ObjectId } from 'mongodb';

export const runtime = "nodejs";

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId } = body;
    
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
    
    // Check if template is being used in any assigned badges
    const usageCount = await db.collection('users').countDocuments({
      'customBadges.name': template.name
    });
    
    if (usageCount > 0) {
      return NextResponse.json(
        { 
          error: `Cannot delete template. It is currently used by ${usageCount} assigned badge(s).`,
          inUse: true,
          usageCount
        },
        { status: 400 }
      );
    }
    
    // Delete the template
    const result = await db.collection('badgeTemplates').deleteOne({
      _id: new ObjectId(templateId)
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to delete badge template' },
        { status: 500 }
      );
    }
    
    console.log(`Badge template deleted: ${template.name}`);
    
    return NextResponse.json({
      success: true,
      deletedTemplate: {
        id: template._id,
        name: template.name
      },
      message: 'Badge template deleted successfully'
    });
    
  } catch (error) {
    console.error('Badge template deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete badge template' },
      { status: 500 }
    );
  }
}
