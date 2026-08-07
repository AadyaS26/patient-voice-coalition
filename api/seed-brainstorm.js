// api/seed-brainstorm.js
//
// ONE-TIME USE. Visit this URL once in your browser (with the secret) to
// populate the brainstorm board with 20 starter ideas, then delete this
// file from the repo — it's not meant to stay in production long-term.
//
// Usage: https://autoimmune-voices.org/api/seed-brainstorm?secret=YOUR_SECRET
//
// Required environment variable:
//   SEED_SECRET — any string you make up, so a stranger can't hit this URL
//                 and reset the board. Set it in Vercel, then use the same
//                 value in the URL above.
//
// Safety: refuses to run if ideas already exist, unless you add &force=true
// to the URL — this stops you from accidentally wiping real submissions.

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

const IDEAS_KEY = "brainstorm-ideas";

function daysAgo(days) {
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

const STARTER_IDEAS = [
  {
    condition: "Achalasia",
    title: "Expand access to high-resolution esophageal manometry nationwide",
    description:
      "Many communities lack providers who can perform the gold-standard test for achalasia, forcing patients to travel long distances and delaying treatment.",
    votes: 23,
    ageDays: 23,
  },
  {
    condition: "Alopecia areata",
    title: "Require insurance coverage for JAK inhibitor treatments",
    description:
      "Newer treatments can regrow hair for many patients, but insurers often deny coverage, calling it cosmetic rather than medically necessary.",
    votes: 187,
    ageDays: 61,
  },
  {
    condition: "Hidradenitis suppurativa",
    title: "Ban insurance step therapy delays for biologics",
    description:
      "Patients are often forced to fail cheaper treatments first, even when their dermatologist already knows a biologic is the right call.",
    votes: 142,
    ageDays: 54,
  },
  {
    condition: "Vitiligo",
    title: "Require dermatology referral coverage without prior authorization delays",
    description:
      "Getting a timely referral shouldn't depend on how quickly an insurer processes paperwork while visible symptoms keep spreading.",
    votes: 118,
    ageDays: 48,
  },
  {
    condition: "Psoriasis",
    title: "Cap out-of-pocket costs for biologic psoriasis treatments",
    description:
      "Some patients pay hundreds a month even with insurance, pushing them to ration medication or stop treatment entirely.",
    votes: 96,
    ageDays: 45,
  },
  {
    condition: "Psoriatic arthritis",
    title: "Fund a national psoriatic arthritis screening awareness campaign",
    description:
      "Many patients go years between skin symptoms and joint diagnosis, missing the window where early treatment prevents lasting joint damage.",
    votes: 89,
    ageDays: 40,
  },
  {
    condition: "Rheumatoid arthritis",
    title: "Require Medicare coverage of physical and occupational therapy without visit caps",
    description:
      "Annual therapy visit limits often run out well before flare season ends, leaving patients without support exactly when they need it most.",
    votes: 77,
    ageDays: 37,
  },
  {
    condition: "Ankylosing spondylitis",
    title: "Establish workplace accommodation guidelines for chronic back pain conditions",
    description:
      "Standing desks and flexible seating shouldn't require a lengthy medical appeal every time a patient changes jobs.",
    votes: 71,
    ageDays: 33,
  },
  {
    condition: "Sarcoidosis",
    title: "Create a federal sarcoidosis research and surveillance registry",
    description:
      "Without reliable data on how many people are affected, it's hard to secure research funding or track long-term outcomes.",
    votes: 64,
    ageDays: 30,
  },
  {
    condition: "Scleroderma",
    title: "Require insurance coverage for hand therapy and skin-softening treatments",
    description:
      "Many plans classify these as elective, even though they directly affect a patient's ability to use their hands day to day.",
    votes: 58,
    ageDays: 27,
  },
  {
    condition: "Multiple sclerosis",
    title: "Cap the cost of disease-modifying therapies at a fixed monthly amount",
    description:
      "Some MS medications cost thousands per month, and even small copay increases can push patients to skip doses.",
    votes: 52,
    ageDays: 24,
  },
  {
    condition: "Myasthenia gravis",
    title: "Add myasthenic crisis protocols to EMS training requirements",
    description:
      "First responders unfamiliar with the condition can lose critical time recognizing a crisis that requires immediate airway support.",
    votes: 47,
    ageDays: 19,
  },
  {
    condition: "Guillain-Barré syndrome",
    title: "Guarantee inpatient rehabilitation coverage without arbitrary day limits",
    description:
      "Recovery timelines vary widely, but many insurers cut off rehab coverage on a fixed schedule that doesn't match how the condition actually heals.",
    votes: 41,
    ageDays: 17,
  },
  {
    condition: "Graves' disease",
    title: "Require coverage for thyroid eye disease treatment separate from general vision benefits",
    description:
      "Patients are often told to use a vision plan that was never designed to cover an autoimmune eye condition, leaving real gaps in coverage.",
    votes: 38,
    ageDays: 14,
  },
  {
    condition: "Hashimoto's thyroiditis",
    title: "Standardize thyroid antibody testing as part of routine fatigue workups",
    description:
      "Patients often see multiple doctors before anyone thinks to test for thyroid antibodies, even though it's a simple, inexpensive blood test.",
    votes: 34,
    ageDays: 12,
  },
  {
    condition: "Autoimmune hepatitis",
    title: "Require step therapy exemptions for patients already stable on treatment",
    description:
      "Switching insurance plans shouldn't mean restarting a medication trial-and-error process for a condition that's already under control.",
    votes: 29,
    ageDays: 9,
  },
  {
    condition: "Primary biliary cholangitis",
    title: "Fund research into second-line treatment options",
    description:
      "Patients who don't respond to the standard first treatment currently have very few next steps their doctor can offer.",
    votes: 26,
    ageDays: 7,
  },
  {
    condition: "Dermatomyositis",
    title: "Add dermatomyositis to state rare disease drug assistance programs",
    description:
      "Many state assistance programs list conditions by name, and this one is often left off the list simply by oversight.",
    votes: 22,
    ageDays: 5,
  },
  {
    condition: "Kawasaki disease",
    title: "Require pediatric cardiology follow-up coverage into adulthood",
    description:
      "Kawasaki disease is diagnosed in childhood, but heart complications can appear decades later, after many patients have aged out of pediatric monitoring.",
    votes: 19,
    ageDays: 3,
  },
  {
    condition: "Antiphospholipid syndrome",
    title: "Require insurance coverage for home INR monitoring devices",
    description:
      "Patients on lifelong blood thinners often pay out of pocket for a device that reduces clinic visits and catches dangerous clotting risk earlier.",
    votes: 15,
    ageDays: 1,
  },
];

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  if (!process.env.SEED_SECRET || req.query.secret !== process.env.SEED_SECRET) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  try {
    const raw = await redis.get(IDEAS_KEY);
    const existing = raw ? (typeof raw === "string" ? JSON.parse(raw) : raw) : [];
    const force = req.query.force === "true";

    if (Array.isArray(existing) && existing.length > 0 && !force) {
      return res.status(400).json({
        ok: false,
        error: `Ideas already exist (${existing.length} found). Add &force=true to overwrite, or clear the key manually first.`,
      });
    }

    const seeded = STARTER_IDEAS.map((idea, i) => ({
      id: `seed-${i + 1}`,
      condition: idea.condition,
      title: idea.title,
      description: idea.description,
      votes: idea.votes,
      createdAt: daysAgo(idea.ageDays),
    }));

    await redis.set(IDEAS_KEY, JSON.stringify(seeded));

    return res.status(200).json({ ok: true, seeded: seeded.length });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "Storage error", detail: String(err) });
  }
}
