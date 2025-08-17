import { NextResponse } from "next/server";
import User from "@/models/userSchema";
import UserQuestionModel from "@/models/userQuestionSchema";
import connect from "@/utlis/db";

// GET /api/leaderboard
export async function GET() {
    try {
        // Connect to the database
        await connect();

        // Fetch top 50 users sorted by totalScore in descending order
        const users = await User.find({})
            .sort({ totalScore: -1 })
            .limit(50) // Limit to top 50 users
            .select("name totalScore image _id");

        // Calculate roomsCompleted for each user
        const leaderboardPromises = users.map(async (user, index) => {
            // Count completed questions for this user
            // Remove the completion filter for now until we debug it properly
            const roomsCompleted = await UserQuestionModel.countDocuments({ 
                userId: user._id 
            });

            return {
                name: user.name,
                totalScore: user.totalScore,
                image: user.image,
                roomsCompleted,
                rank: index + 1, // Rank starts from 1
            };
        });

        // Wait for all promises to resolve
        const leaderboard = await Promise.all(leaderboardPromises);

        // Return the leaderboard as JSON
        return NextResponse.json(leaderboard);
    } catch (error) {
        console.error("Leaderboard API Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch leaderboard" },
            { status: 500 }
        );
    }
}