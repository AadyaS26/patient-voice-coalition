// Real, shared counter storage — works across every visitor and every device,
// unlike the old localStorage-based version which only ever counted the
// person currently looking at their own browser.
//
// Requires a Redis database connected via Vercel's Storage tab (Marketplace →
// Upstash Redis → Connect Project). Once connected, Vercel automatically
// injects the right environment variables — no manual .env setup needed for
// production.

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Only these two keys are allowed — keeps this from becoming an endpoint
// that lets anyone write arbitrary values to arbitrary keys.
const ALLOWED_KEYS = ["people-impacted", "letters-sent"];

export default async function handler(req, res) {
  const { key, action } = req.query;

  if (!key || !ALLOWED_KEYS.includes(key)) {
    return res.status(400).json({ error: "Missing or unknown key" });
  }

  try {
    if (action === "increment") {
      const value = await redis.incr(key);
      return res.status(200).json({ key, value });
    }

    const value = (await redis.get(key)) || 0;
    return res.status(200).json({ key, value: Number(value) });
  } catch (err) {
    return res.status(500).json({ error: "Storage error", detail: String(err) });
  }
}
