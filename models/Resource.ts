import mongoose, { Schema, model } from "mongoose";

export interface Resource {
  _id?: string;
  title: string;
  description: string;
  category: string;
  resourceLink: string;
  uploadedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const resourceSchema = new Schema<Resource>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    resourceLink: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

// Add indexes for better performance
resourceSchema.index({ category: 1, title: 1 });
resourceSchema.index({ createdAt: -1 });

const ResourceModel = mongoose.models.Resource || model("Resource", resourceSchema);

export default ResourceModel;