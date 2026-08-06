// api/resource-stats.js
//
// Returns the current shared "resources distributed" total, so the counter
// badge shows the right number on page load (before anyone has clicked
// anything in this browser session).
//
// Same environment variables as track-resource-view.js.

const { Redis } = require("@upstash/redis");

const redis = Redis.fromEnv();
const COUNTER_KEY = "resources_distributed_total";

module.exports = async function handler(req, res) {
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
};
