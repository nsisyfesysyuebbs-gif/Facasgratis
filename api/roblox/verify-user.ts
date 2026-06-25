import type { VercelRequest, VercelResponse } from "@vercel/node";

const MIN_DAYS = 70;
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

async function sendLog(embed: object) {
  if (!WEBHOOK_URL) return;
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "MM2 Doações | Logs",
        embeds: [{ ...embed, timestamp: new Date().toISOString() }],
      }),
    });
  } catch {}
}

function getIP(req: VercelRequest): string {
  return (
    (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") { res.status(200).end(); return; }

  const username = ((req.query.username as string) ?? "").trim();
  const ip = getIP(req);

  if (!username) {
    res.status(400).json({ error: "username query param required" });
    return;
  }

  try {
    const searchRes = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: false }),
    });
    const searchData = (await searchRes.json()) as {
      data: { id: number; name: string; displayName: string }[];
    };

    if (!searchData.data?.length) {
      await sendLog({
        title: "❌ Verificação Negada",
        color: 0xef4444,
        fields: [
          { name: "👤 Username Tentado", value: `\`${username}\``, inline: true },
          { name: "❗ Motivo", value: "Usuário não encontrado no Roblox.", inline: false },
          { name: "🌐 IP", value: `\`${ip}\``, inline: true },
        ],
        footer: { text: "MM2 Doações — Verificação" },
      });
      res.status(404).json({ error: "Usuário não encontrado no Roblox." });
      return;
    }

    const user = searchData.data[0];
    const userRes = await fetch(`https://users.roblox.com/v1/users/${user.id}`);
    const userDetail = (await userRes.json()) as { created?: string };

    if (!userDetail.created) {
      res.status(502).json({ error: "Não foi possível obter dados da conta." });
      return;
    }

    const ageDays = Math.floor(
      (Date.now() - new Date(userDetail.created).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (ageDays < MIN_DAYS) {
      await sendLog({
        title: "❌ Verificação Negada",
        color: 0xef4444,
        fields: [
          { name: "👤 Username", value: `\`${user.name}\``, inline: true },
          { name: "❗ Motivo", value: `Conta muito nova — ${ageDays} dias (mínimo: ${MIN_DAYS}).`, inline: false },
          { name: "🌐 IP", value: `\`${ip}\``, inline: true },
        ],
        footer: { text: "MM2 Doações — Verificação" },
      });
    } else {
      await sendLog({
        title: "✅ Verificação Aprovada",
        color: 0x10b981,
        fields: [
          { name: "👤 Username", value: `\`${user.name}\``, inline: true },
          { name: "🏷️ Display Name", value: `\`${user.displayName}\``, inline: true },
          { name: "📅 Idade da Conta", value: `**${ageDays} dias**`, inline: true },
          { name: "🌐 IP", value: `\`${ip}\``, inline: true },
        ],
        footer: { text: "MM2 Doações — Verificação" },
      });
    }

    res.json({ userId: user.id, username: user.name, displayName: user.displayName, accountAgeDays: ageDays });
  } catch {
    res.status(502).json({ error: "Erro ao conectar com o Roblox. Tente novamente." });
  }
}
