// api/submit-story.js
//
// Stores patient stories directly in Redis — the same database your
// counters already use (KV_REST_API_URL / KV_REST_API_TOKEN), so there's
// no Google Sheet, no Apps Script, and no new environment variables to set
// up. This REPLACES the earlier Sheets-based version of this file.
//
// Stories publish immediately once submitted (if "share publicly" was
// checked) — there's no manual approval step in this version. If a bad
// submission ever shows up, you can open the Redis database in Vercel's
// Storage tab (or directly in the Upstash console) and use its Data
// Browser to find the "patient-stories" list and delete that one entry —
// no code changes needed for that.

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

const LIST_KEY = "patient-stories";

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");

  if (req.method === "POST") {
    const body = req.body || {};
    const {
      name = "",
      condition,
      state = "",
      country = "",
      category,
      story,
      shareAnonymously = false,
      sharePublicly = true,
      useInAdvocacy = true,
      website = "", // honeypot — same pattern as send-legislator-email.js
    } = body;

    // Bots that fill the hidden honeypot get a silent fake success.
    if (isNonEmptyString(website)) {
      return res.status(200).json({ ok: true });
    }

    if (!isNonEmptyString(condition)) {
      return res.status(400).json({ ok: false, error: "Condition is required." });
    }
    if (!isNonEmptyString(story)) {
      return res.status(400).json({ ok: false, error: "Please write your story." });
    }
    if (!isNonEmptyString(category)) {
      return res.status(400).json({ ok: false, error: "Please choose a category." });
    }
    if (story.trim().length > 4000) {
      return res.status(400).json({ ok: false, error: "Please keep your story under 4000 characters." });
    }

    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      submittedAt: new Date().toISOString(),
      name: String(name).trim(),
      condition: condition.trim(),
      state: String(state).trim(),
      country: String(country).trim(),
      category: category.trim(),
      story: story.trim(),
      shareAnonymously: Boolean(shareAnonymously),
      sharePublicly: Boolean(sharePublicly),
      useInAdvocacy: Boolean(useInAdvocacy),
    };

    try {
      await redis.rpush(LIST_KEY, JSON.stringify(entry));
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("submit-story POST error", err);
      return res.status(500).json({ ok: false, error: "Could not save your story. Please try again." });
    }
  }

  if (req.method === "GET") {
    try {
      const raw = await redis.lrange(LIST_KEY, 0, -1);
      const stories = raw
        .map((r) => {
          try {
            return typeof r === "string" ? JSON.parse(r) : r;
          } catch {
            return null;
          }
        })
        .filter(Boolean)
        .filter((s) => s.sharePublicly)
        .reverse(); // newest first

      return res.status(200).json({ ok: true, stories });
    } catch (err) {
      console.error("submit-story GET error", err);
      return res.status(500).json({ ok: false, error: "Could not load stories." });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ ok: false, error: "Method not allowed" });
}
