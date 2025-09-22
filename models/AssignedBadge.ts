// models/AssignedBadge.ts
import mongoose from 'mongoose';
import { AssignedBadgeDocument } from '@/types/assignBadge';

const assignedBadgeSchema = new mongoose.Schema<AssignedBadgeDocument>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  badgeId: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    refPath: 'badgeType'
  },
  badgeType: {
    type: String,
    required: true,
    enum: ['template', 'custom'],
    default: 'template'
  },
  assignedBy: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Badge details for display purposes
  badgeName: {
    type: String,
    required: true
  },
  badgeDescription: {
    type: String,
    default: ''
  },
  badgeIcon: {
    type: String,
    default: ''
  },
  badgeColor: {
    type: String,
    default: '#000000'
  }
}, {
  timestamps: {
    createdAt: 'assignedAt',
    updatedAt: true
  }
});

// Create compound index to prevent duplicate active assignments
assignedBadgeSchema.index({ userId: 1, badgeId: 1, isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } });

// Create indexes for better query performance
assignedBadgeSchema.index({ userId: 1, isActive: 1 });
assignedBadgeSchema.index({ assignedAt: -1 });

// Prevent re-compilation during development
const AssignedBadgeModel = mongoose.models.AssignedBadge || mongoose.model<AssignedBadgeDocument>('AssignedBadge', assignedBadgeSchema);

export default AssignedBadgeModel;