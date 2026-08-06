// api/resource-stats.js
//
// Returns the current shared "resources distributed" total. ES module
// syntax to match this project's "type": "module" setting.
//
// Explicitly disables caching — without this, Vercel/the browser can cache
// the GET response, which makes every fresh page load show a stale (often
// zero) number even though the real count in Redis has moved on.

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const COUNTER_KEY = "resources_distributed_total";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const digitalViews = Number((await redis.get(COUNTER_KEY)) || 0);
    const physicalBase = Number(process.env.PHYSICAL_COPIES_DISTRIBUTED || 0);
    const total = digitalViews + physicalBase;

    return res.status(200).json({ ok: true, total, digitalViews });
  } catch (err) {
    console.error("resource-stats error", err);
    return res.status(500).json({ ok: false, error: "Could not fetch stats" });
  }
}
