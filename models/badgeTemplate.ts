import mongoose from 'mongoose';

const badgeTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    default: '#8B5CF6'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    default: 'unknown'
  }
}, {
  timestamps: true // This automatically adds createdAt and updatedAt
});

// Prevent re-compilation during development
const BadgeTemplate = mongoose.models.BadgeTemplate || mongoose.model('BadgeTemplate', badgeTemplateSchema);

export default BadgeTemplate;