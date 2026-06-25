import type { VercelRequest, VercelResponse } from "@vercel/node";

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") { res.status(200).end(); return; }
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

  const { knifeName, tier, username } = req.body as {
    knifeName?: string; tier?: string; username?: string;
  };

  if (!knifeName || !tier) {
    res.status(400).json({ error: "knifeName and tier required" });
    return;
  }

  const ip =
    ((req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim()) ?? "unknown";

  if (WEBHOOK_URL) {
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "MM2 Doações | Logs",
          embeds: [{
            title: "🔪 Pedido de Faca",
            color: 0xa855f7,
            fields: [
              { name: "⚔️ Faca",     value: `**${knifeName}**`,         inline: true },
              { name: "🏅 Tier",     value: `\`${tier}\``,              inline: true },
              { name: "👤 Username", value: `\`${username ?? "Anônimo"}\``, inline: true },
              { name: "🌐 IP",       value: `\`${ip}\``,                inline: true },
            ],
            footer: { text: "MM2 Doações — Pedidos" },
            timestamp: new Date().toISOString(),
          }],
        }),
      });
    } catch {}
  }

  res.json({ ok: true });
}
