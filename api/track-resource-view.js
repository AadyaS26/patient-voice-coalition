// api/track-resource-view.js
//
// Called once every time a visitor opens a condition page in the resource
// library. Increments a single shared counter in Redis and returns the new
// total, so the counter badge reflects every visitor, not just the current
// browser. Reuses the same Upstash Redis instance as the rest of the site.
//
// Required environment variables (already set for the project, since
// Upstash Redis is used elsewhere):
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN
//
// Optional:
//   PHYSICAL_COPIES_DISTRIBUTED — a manually-updated number representing
//   print copies handed out offline, added on top of the digital-view
//   count so the public total reflects both. Defaults to 0 if unset.

const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});
const COUNTER_KEY = "resources_distributed_total";
const PER_CONDITION_PREFIX = "resources_distributed:";

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { condition } = req.body || {};

    const digitalViews = await redis.incr(COUNTER_KEY);
    if (typeof condition === "string" && condition.trim()) {
      // fire-and-forget per-condition breakdown, doesn't block the response
      redis.incr(PER_CONDITION_PREFIX + condition.trim()).catch(() => {});
    }

    const physicalBase = Number(process.env.PHYSICAL_COPIES_DISTRIBUTED || 0);
    const total = digitalViews + physicalBase;

    return res.status(200).json({ ok: true, total, digitalViews });
  } catch (err) {
    console.error("track-resource-view error", err);
    return res.status(500).json({ ok: false, error: "Could not record view" });
  }
};
