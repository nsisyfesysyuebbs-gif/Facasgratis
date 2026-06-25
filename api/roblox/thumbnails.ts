import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") { res.status(200).end(); return; }

  const ids = req.query.ids as string;
  if (!ids) { res.status(400).json({ error: "ids query param required" }); return; }

  try {
    const response = await fetch(
      `https://thumbnails.roblox.com/v1/assets?assetIds=${ids}&size=420x420&format=Png&isCircular=false`
    );
    res.json(await response.json());
  } catch {
    res.status(502).json({ error: "Failed to fetch from Roblox" });
  }
}
