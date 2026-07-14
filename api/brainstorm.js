// Real, shared brainstorm-ideas storage — works across every visitor and
// every device, backed by the same Redis database as /api/counter.
//
// GET  /api/brainstorm                -> returns the full list of ideas
// POST /api/brainstorm  { action: "create", condition, title, description }
// POST /api/brainstorm  { action: "upvote", id }

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

const IDEAS_KEY = "brainstorm-ideas";

async function getIdeas() {
  const raw = await redis.get(IDEAS_KEY);
  if (!raw) return [];
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
  return Array.isArray(raw) ? raw : [];
}

async function saveIdeas(ideas) {
  await redis.set(IDEAS_KEY, JSON.stringify(ideas));
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const ideas = await getIdeas();
      return res.status(200).json({ ideas });
    }

    if (req.method === "POST") {
      const { action } = req.body || {};

      if (action === "create") {
        const { condition, title, description } = req.body || {};
        if (!title || !String(title).trim()) {
          return res.status(400).json({ error: "Missing title" });
        }
        const ideas = await getIdeas();
        const newIdea = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          condition: condition || "",
          title: String(title).trim(),
          description: (description || "").trim(),
          votes: 1,
          createdAt: Date.now(),
        };
        const next = [newIdea, ...ideas];
        await saveIdeas(next);
        return res.status(200).json({ ideas: next, newIdea });
      }

      if (action === "upvote") {
        const { id } = req.body || {};
        if (!id) return res.status(400).json({ error: "Missing id" });
        const ideas = await getIdeas();
        const next = ideas.map((i) =>
          i.id === id ? { ...i, votes: (i.votes || 0) + 1 } : i
        );
        await saveIdeas(next);
        return res.status(200).json({ ideas: next });
      }

      return res.status(400).json({ error: "Unknown action" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    return res.status(500).json({ error: "Storage error", detail: String(err) });
  }
}
