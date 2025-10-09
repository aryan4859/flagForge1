import { NextRequest, NextResponse } from "next/server";

// ===== Types =====
type ReqBody = {
  message: string;
  challengeId?: string;
  hintLevel?: "nudge" | "tip" | "reveal";
};

// ===== Environment Variables =====
const OPENROUTER_BASE =
  process.env.OPENROUTER_BASE || "https://openrouter.ai/api";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

// ===== POST Handler =====
export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { message, challengeId, hintLevel } = (await req.json()) as ReqBody;
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid payload: message required" },
        { status: 400 }
      );
    }

    // Get user ID from headers
    const userId = req.headers.get("x-user-id") || "anonymous";

    // Log environment variables for debugging
    console.log("Environment variables:", {
      OPENROUTER_BASE,
      OPENROUTER_API_KEY: OPENROUTER_API_KEY ? "set" : "unset",
      APP_URL: process.env.APP_URL || "http://localhost:3000",
    });

    // Validate OpenRouter configuration
    if (!OPENROUTER_API_KEY) {
      console.error("Missing OpenRouter API key");
      return NextResponse.json(
        { error: "LLM provider not configured: missing API key" },
        { status: 500 }
      );
    }

    // Build OpenRouter messages
    const systemPrompt = `You are a hint bot for coding challenges. Provide concise hints for ${
      challengeId || "the challenge"
    } at ${
      hintLevel || "nudge"
    } level (nudge: conceptual, tip: explicit, reveal: strategic). Never share full solutions or secrets.`;
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ];

    // Construct OpenRouter request
    const openRouterUrl = `${OPENROUTER_BASE.replace(
      /\/$/,
      ""
    )}/v1/chat/completions`;
    console.log("OpenRouter URL:", openRouterUrl);
    const payload = {
      model: "openai/gpt-3.5-turbo",
      messages,
      temperature: 0.15,
      max_tokens: 600,
    };
    console.log("Sending to OpenRouter:", JSON.stringify(payload, null, 2));

    // Fetch from OpenRouter
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    let response;
    try {
      response = await fetch(openRouterUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
          "X-Title": "HintBot",
          "User-Agent": "HintBot/1.0",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch (err: any) {
      clearTimeout(timeout);
      console.error("Fetch error:", err.message);
      return NextResponse.json(
        { error: `LLM provider fetch failed: ${err.message}` },
        { status: 502 }
      );
    }
    clearTimeout(timeout);

    // Handle OpenRouter response
    if (!response.ok) {
      const text = await response.text();
      console.error("OpenRouter error:", response.status, text);
      return NextResponse.json(
        { error: `LLM provider error: ${response.status} - ${text}` },
        { status: 502 }
      );
    }

    const json = await response.json();
    const reply =
      json?.choices?.[0]?.message?.content || "No response from LLM.";
    return NextResponse.json({ reply, userId });
  } catch (err: any) {
    console.error("API error:", err.message);
    return NextResponse.json(
      { error: `Internal server error: ${err.message}` },
      { status: 500 }
    );
  }
}
