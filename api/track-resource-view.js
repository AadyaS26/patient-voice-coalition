// api/track-resource-view.js
//
// Called once every time a visitor opens a condition page in the resource
// library. Increments a single shared counter in Redis and returns the new
// total. ES module syntax to match this project's "type": "module" setting.

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const COUNTER_KEY = "resources_distributed_total";
const PER_CONDITION_PREFIX = "resources_distributed:";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { condition } = req.body || {};

    const digitalViews = await redis.incr(COUNTER_KEY);
    if (typeof condition === "string" && condition.trim()) {
      redis.incr(PER_CONDITION_PREFIX + condition.trim()).catch(() => {});
    }

    const physicalBase = Number(process.env.PHYSICAL_COPIES_DISTRIBUTED || 0);
    const total = digitalViews + physicalBase;

    return res.status(200).json({ ok: true, total, digitalViews });
  } catch (err) {
    console.error("track-resource-view error", err);
    return res.status(500).json({ ok: false, error: "Could not record view" });
  }
}
