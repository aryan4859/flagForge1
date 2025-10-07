import mongoose, { Schema, model, models } from "mongoose";

const badgeTemplateSchema = new Schema({
  name: { type: String, required: true, trim: true, unique: true },
  description: { type: String, required: true, trim: true },
  icon: { type: String, required: true },
  color: { type: String, default: "#8B5CF6" },
  isActive: { type: Boolean, default: true },
  createdBy: { type: String, required: true },
}, {
  timestamps: true,
});

const BadgeTemplate = models.BadgeTemplate || model("BadgeTemplate", badgeTemplateSchema);
export default BadgeTemplate;
