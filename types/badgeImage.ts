import { Document, Types } from 'mongoose';

export interface BadgeImage {
  _id?: string | Types.ObjectId;
  name: string;
  originalName: string;
  filename: string;
  path: string;
  category: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
  uploadedBy: string;
}

// For creating new badge images (without Mongoose-specific fields)
export interface BadgeImageCreate {
  name: string;
  originalName: string;
  filename: string;
  path: string;
  category: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
  uploadedBy: string;
}

// For Mongoose document type - properly extends Document without _id conflict
export interface BadgeImageDocument extends Omit<BadgeImage, '_id'>, Document {
  _id: Types.ObjectId;
}

// Response types
export interface BadgeImageListResponse {
  success: true;
  images: BadgeImage[];
  count: number;
}

export interface BadgeImageUploadResponse {
  success: true;
  imagePath: string;
  filename: string;
  imageId: string;
  message: string;
}

export interface BadgeImageDeleteResponse {
  success: true;
  message: string;
}

export interface BadgeImageErrorResponse {
  success: false;
  error: string;
  details?: string;
}

export type BadgeImageResponse = 
  | BadgeImageListResponse 
  | BadgeImageUploadResponse 
  | BadgeImageDeleteResponse
  | BadgeImageErrorResponse;

export const ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg', 
  'image/jpg',
  'image/webp',
  'image/svg+xml',
  'image/gif'
] as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export type AllowedImageType = typeof ALLOWED_IMAGE_TYPES[number];