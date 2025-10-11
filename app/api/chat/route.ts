import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Problems from "@/models/qustionsSchema";
import type { NextRequest } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "YOUR_KEY_HERE";
export async function POST(req: NextRequest) {
  try {
    const { message, challengeId, userId, hintLevel } = await req.json();

    await connect();
    const question = await Problems.findById(challengeId);

    if (!question) {
      return NextResponse.json(
        { reply: "Challenge not found." },
        { status: 404 }
      );
    }

    // Combine challenge data & hints
    const hints = question.hints
      .map((h: any, i: number) => `Hint ${i + 1}: ${h.text}`)
      .join("\n");

    // Construct context
    const systemPrompt = `
You are FlagForge's CTF assistant your name is Hintsye. 
Help the user understand and solve the challenge but never reveal the flag directly. 
Provide progressive guidance based on hints.

Challenge: ${question.title}
Description: ${question.description}
Category: ${question.category}
Hints:\n${hints}
User's requested hint level: ${hintLevel}
Always encourage learning and problem-solving skills.
Respond in a concise manner.
Flag format is always FLAG{...}Forge or flag{...}forge.
Never reveal the flag at any cost.
`;

    const llmResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
        }),
      }
    );

    const data = await llmResponse.json();
    const reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a hint.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { reply: "Error processing your request." },
      { status: 500 }
    );
  }
}
