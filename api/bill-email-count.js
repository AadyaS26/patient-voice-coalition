// api/bill-email-count.js
//
// Tracks how many times a constituent letter was drafted for a specific
// bill, keyed by the bill's `number` string (same value used in both
// src/pages/Legislation.jsx's BILLS array and src/data/billsSupported.js).
//
// POST { billId: "NJ A4163 / S3098" }  -> increments that bill's counter
// GET                                   -> returns all counts as { counts: { billId: n, ... } }

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

const PREFIX = "bill-emails:";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");

  if (req.method === "POST") {
    const { billId } = req.body || {};
    if (typeof billId !== "string" || !billId.trim()) {
      return res.status(400).json({ ok: false, error: "billId is required" });
    }
    try {
      const value = await redis.incr(`${PREFIX}${billId.trim()}`);
      return res.status(200).json({ ok: true, billId: billId.trim(), value });
    } catch (err) {
      console.error("bill-email-count increment error", err);
      return res.status(500).json({ ok: false, error: "Could not record count" });
    }
  }

  if (req.method === "GET") {
    try {
      const keys = await redis.keys(`${PREFIX}*`);
      if (keys.length === 0) return res.status(200).json({ ok: true, counts: {} });
      const values = await redis.mget(...keys);
      const counts = {};
      keys.forEach((k, i) => {
        counts[k.replace(PREFIX, "")] = Number(values[i]) || 0;
      });
      return res.status(200).json({ ok: true, counts });
    } catch (err) {
      console.error("bill-email-count fetch error", err);
      return res.status(500).json({ ok: false, error: "Could not fetch counts" });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ ok: false, error: "Method not allowed" });
}
