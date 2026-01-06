import { NextResponse } from "next/server";
import fallbackPosts from "@/lib/instagram-data.json";

// Simple in-memory cache to avoid hitting rate limits
let cache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION = 3600 * 1000; // 1 hour

export async function GET() {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const businessId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

    // If credentials are not provided, use fallback data
    if (!accessToken || !businessId) {
        console.warn("Instagram credentials missing. Using fallback data.");
        return NextResponse.json(fallbackPosts.slice(0, 3));
    }

    // Check cache
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
        return NextResponse.json(cache.data);
    }

    try {
        const response = await fetch(
            `https://graph.facebook.com/v21.0/${businessId}/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${accessToken}&limit=10`
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Instagram Graph API Error:", errorData);
            throw new Error(errorData.error?.message || "Failed to fetch from Instagram");
        }

        const { data } = await response.json();

        // Filter for images and map to our internal format
        const formattedPosts = data
            .filter((item: any) => item.media_type === "IMAGE" || item.media_type === "CAROUSEL_ALBUM")
            .slice(0, 3)
            .map((item: any) => ({
                id: item.id,
                link: item.permalink,
                imgUrl: item.media_url,
                caption: item.caption || "",
                timestamp: item.timestamp,
            }));

        // Update cache
        cache = {
            data: formattedPosts,
            timestamp: Date.now(),
        };

        return NextResponse.json(formattedPosts);
    } catch (error) {
        console.error("Instagram API Route Error:", error);
        // Fallback to static data if API fails
        return NextResponse.json(fallbackPosts.slice(0, 3));
    }
}
