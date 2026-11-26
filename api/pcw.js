// api/pcw.js — numbers for Patients Can't Wait.
//
// GET  /api/pcw                          -> public dashboard numbers
// POST /api/pcw  {action:"complete", pre, post, order, ch}   -> someone finished the experience
// POST /api/pcw  {action:"package", condition}               -> a care package was opened
// POST /api/pcw  {action:"rate", rating}                      -> care package helpfulness (1–5)
//
// Stores only counts and score totals. No names, emails, IPs or answers.
// Uses the same Upstash Redis connection as api/counter.js.

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

const CONDITIONS = ["celiac", "lupus", "ibd", "t1d", "thyroid", "arthritis", "other"];
const QUESTIONS = 5;

const isScore = (n) => Number.isInteger(n) && n >= 0 && n <= QUESTIONS;
const cleanChapter = (ch) =>
  typeof ch === "string" && /^[A-Za-z0-9-]{1,24}$/.test(ch) ? ch.toUpperCase() : null;

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");

  try {
    if (req.method === "GET") {
      const [visits, completions, preSum, postSum, packages, helpfulSum, helpfulCount, top, byCondition] = await Promise.all([
        redis.get("pcw-visits"),
        redis.get("pcw-completions"),
        redis.get("pcw-pre-sum"),
        redis.get("pcw-post-sum"),
        redis.get("pcw-packages"),
        redis.get("pcw-helpful-sum"),
        redis.get("pcw-helpful-count"),
        redis.zrange("pcw-chapters", 0, 4, { rev: true, withScores: true }),
        redis.mget(...CONDITIONS.map((c) => `pcw-packages:${c}`)),
      ]);

      const done = Number(completions) || 0;
      // Average gain in points out of 100 (5 questions, 20 points each).
      const avgGain = done ? Math.round((((Number(postSum) || 0) - (Number(preSum) || 0)) / done) * 20) : null;
      const avgPre = done ? Math.round(((Number(preSum) || 0) / done) * 20) : null;
      const avgPost = done ? Math.round(((Number(postSum) || 0) / done) * 20) : null;
      const ratings = Number(helpfulCount) || 0;

      const leaderboard = [];
      for (let i = 0; i < (top || []).length; i += 2) {
        leaderboard.push({ chapter: top[i], completions: Number(top[i + 1]) });
      }

      return res.status(200).json({
        visits: Number(visits) || 0,
        completions: done,
        avgPre,
        avgPost,
        avgGain,
        packagesOpened: Number(packages) || 0,
        packagesByCondition: Object.fromEntries(CONDITIONS.map((c, i) => [c, Number(byCondition?.[i]) || 0])),
        helpfulAvg: ratings ? Math.round(((Number(helpfulSum) || 0) / ratings) * 10) / 10 : null,
        helpfulCount: ratings,
        leaderboard,
      });
    }

    if (req.method !== "POST") {
      res.setHeader("Allow", "GET, POST");
      return res.status(405).json({ error: "Method not allowed" });
    }

    const body = req.body || {};

    if (body.action === "complete") {
      const pre = Number(body.pre);
      const post = Number(body.post);
      if (!isScore(pre) || !isScore(post)) return res.status(400).json({ error: "Bad scores" });
      const order = body.order === "BA" ? "BA" : "AB";
      const ch = cleanChapter(body.ch);

      const ops = [
        redis.incr("pcw-completions"),
        redis.incrby("pcw-pre-sum", pre),
        redis.incrby("pcw-post-sum", post),
        // Kept by order so you can check the two question sets are equally hard.
        redis.incr(`pcw-completions:${order}`),
        redis.incrby(`pcw-pre-sum:${order}`, pre),
        redis.incrby(`pcw-post-sum:${order}`, post),
        redis.incr(`pcw-completions:${new Date().toISOString().slice(0, 10)}`),
      ];
      if (ch) ops.push(redis.zincrby("pcw-chapters", 1, ch));
      await Promise.all(ops);
      return res.status(200).json({ ok: true });
    }

    if (body.action === "package") {
      const condition = CONDITIONS.includes(body.condition) ? body.condition : "other";
      const [total] = await Promise.all([
        redis.incr("pcw-packages"),
        redis.incr(`pcw-packages:${condition}`),
        redis.incr(`pcw-packages:${new Date().toISOString().slice(0, 10)}`),
      ]);
      return res.status(200).json({ ok: true, total });
    }

    if (body.action === "rate") {
      const rating = Number(body.rating);
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) return res.status(400).json({ error: "Bad rating" });
      await Promise.all([redis.incrby("pcw-helpful-sum", rating), redis.incr("pcw-helpful-count")]);
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: "Unknown action" });
  } catch (err) {
    console.error("pcw api error", err);
    return res.status(500).json({ error: "Storage error" });
  }
}
