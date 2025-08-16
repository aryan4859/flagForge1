import { NextResponse } from "next/server";
import UserSchema from "@/models/userSchema";
import UserQuestionModel from "@/models/userQuestionSchema";
import connect from "@/utlis/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET /api/profile
export async function GET(_req: any) {
  try {
    await connect();
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user data
    const user = await UserSchema.findOne({ email: session.user?.email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get user's completed questions count
    const completedQuestions = await UserQuestionModel.countDocuments({ userId: user._id });
    
    // Get all users to calculate rank
    const allUsers = await UserSchema.find({}).sort({ totalScore: -1 }).select('_id totalScore');
    const userRank = allUsers.findIndex(u => u._id.toString() === user._id.toString()) + 1;
    
    // Calculate level based on score
    const getLevel = (score: number): string => {
      if (score < 200) return "[0x1][Newbie]";
      if (score < 500) return "[0x2][Scout]";
      if (score < 1000) return "[0x3][Codebreaker]";
      if (score < 1500) return "[0x4][Hacker]";
      if (score < 2000) return "[0x5][Cipher Hunter]";
      if (score < 3000) return "[0x6][Forger]";
      return "[0x7][Flag Conqueror]";
    };

    // Calculate badges (achievements based on completed questions)
    const getBadges = (completed: number): number => {
      let badges = 0;
      if (completed >= 1) badges++; // First solution badge
      if (completed >= 5) badges++; // 5 solutions badge
      if (completed >= 10) badges++; // 10 solutions badge
      if (completed >= 25) badges++; // 25 solutions badge
      if (completed >= 50) badges++; // 50 solutions badge
      if (completed >= 100) badges++; // 100 solutions badge
      return badges;
    };

    // Calculate streak (simplified - based on recent activity)
    const getStreak = (completed: number): number => {
      return Math.min(completed, 30); // Cap at 30 for simplicity
    };

    // Use session image as fallback if database image is invalid
    const getUserImage = () => {
      const dbImage = user.image;
      const sessionImage = session.user?.image;
      
      // Check if database image is valid
      if (dbImage && 
          dbImage.trim() !== '' && 
          dbImage !== 'undefined' && 
          dbImage !== 'null' && 
          dbImage !== null) {
        return dbImage;
      }
      
      // Fallback to session image
      return sessionImage || null;
    };

    const profileData = {
      name: user.name,
      email: user.email,
      image: getUserImage(), // Use the smart image selection
      totalScore: user.totalScore || 0,
      rank: userRank,
      level: getLevel(user.totalScore || 0),
      completedQuestions,
      badges: getBadges(completedQuestions),
      streak: getStreak(completedQuestions),
      createdAt: user.createdAt
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}