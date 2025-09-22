import { Document, Types } from 'mongoose';

export interface AssignedBadge {
  _id?: string | Types.ObjectId;
  userId: string;
  badgeId: string | Types.ObjectId;
  badgeType: 'template' | 'custom';
  assignedBy: string;
  assignedAt: Date;
  reason?: string;
  isActive: boolean;
}

export interface AssignBadgeRequest {
  userId: string;
  badgeId: string;
  badgeType?: 'template' | 'custom';
  reason?: string;
  assignedBy: string;
}

export interface AssignedBadgeDocument extends Omit<AssignedBadge, '_id'>, Document {
  _id: Types.ObjectId;
}

// Response types
export interface AssignBadgeSuccessResponse {
  success: true;
  message: string;
  assignmentId: string;
  badge: {
    id: string;
    name: string;
    type: string;
  };
}

export interface AssignBadgeErrorResponse {
  success: false;
  error: string;
  details?: string;
}

export type AssignBadgeResponse = AssignBadgeSuccessResponse | AssignBadgeErrorResponse;