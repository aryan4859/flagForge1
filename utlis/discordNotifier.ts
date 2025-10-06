const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

const COLORS = {
  NEW_CHALLENGE: 0x2ecc71, // green
};

export async function sendDiscordNotification(
  title: string,
  description: string,
  type: "NEW_CHALLENGE" = "NEW_CHALLENGE",
  points?: number,
  category?: string,
  link?: string
) {
  if (!DISCORD_WEBHOOK_URL) {
    console.error("❌ DISCORD_WEBHOOK_URL not set");
    return;
  }

  const payload = {
    embeds: [
      {
        title,
        description,
        color: COLORS[type],
        timestamp: new Date().toISOString(),
        footer: { text: "FlagForge System" },
        fields: [
          ...(category
            ? [{ name: "Category", value: category, inline: true }]
            : []),
          ...(points !== undefined
            ? [{ name: "Points", value: points.toString(), inline: true }]
            : []),
          ...(link
            ? [
                {
                  name: "Challenge Link",
                  value: `[Click here](${link})`,
                  inline: false,
                },
              ]
            : []),
        ],
      },
    ],
  };

  try {
    const res = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok)
      console.error(`❌ Failed to send Discord message: ${res.statusText}`);
  } catch (err) {
    console.error("⚠️ Error sending Discord message:", err);
  }
}
