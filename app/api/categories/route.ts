import { NextResponse } from "next/server";
import connect from "@/utils/db";
import QuestionModel from "@/models/qustionsSchema";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connect();

    // Get distinct categories from the database
    const categories = await QuestionModel.distinct("category");

    // Filter out null/undefined categories, trim whitespace, and remove duplicates
    const validCategories = [
      ...new Set(
        categories
          .filter(
            (category) =>
              category && typeof category === "string" && category.trim() !== ""
          )
          .map((category) => category.trim())
          .sort((a, b) =>
            a.localeCompare(b, undefined, { sensitivity: "base" })
          )
      ),
    ];

    const categoriesWithAll = ["All", ...validCategories];

    return NextResponse.json({
      categories: categoriesWithAll,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "Internal server error", categories: ["All"] },
      { status: 500 }
    );
  }
}
