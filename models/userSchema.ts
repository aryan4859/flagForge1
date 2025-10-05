import mongoose, { Schema, model, models } from "mongoose";
import { Users } from "@/interfaces"; 

const customBadgeSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
    default: "from-gray-400 to-gray-600", // Kept for potential styling
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
  assignedBy: {
    type: String,
    required: true,
  },
}, {
  timestamps: false,
});

// Define User Schema
const userSchema = new Schema<Users>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "User",
      enum: ["User", "Admin"],
    },
    totalScore: {
      type: Number,
      default: 0,
      min: 0,
    },
    customBadges: {
      type: [customBadgeSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getBadgeCount = function() {
  return this.customBadges.length;
};

userSchema.statics.findUsersWithBadge = function(badgeName: string) {
  return this.find({ "customBadges.name": badgeName });
};

const User = models.User || model("User", userSchema);
export default User;