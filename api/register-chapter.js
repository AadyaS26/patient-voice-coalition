// api/register-chapter.js
//
// Receives chapter registration submissions and forwards them to a Google
// Apps Script Web App that appends a row to a Google Sheet. ES module
// syntax to match this project's "type": "module" setting.
//
// Required environment variables (Vercel > Settings > Environment Variables):
//   CHAPTER_SHEET_WEBHOOK_URL  - the deployed Apps Script /exec URL
//   CHAPTER_SHEET_SECRET       - shared secret, must match the Apps Script's CHAPTER_SECRET

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const webhookUrl = process.env.CHAPTER_SHEET_WEBHOOK_URL;
  const secret = process.env.CHAPTER_SHEET_SECRET;
  if (!webhookUrl || !secret) {
    console.error("Missing CHAPTER_SHEET_WEBHOOK_URL or CHAPTER_SHEET_SECRET");
    return res.status(500).json({ ok: false, error: "Server is not configured yet." });
  }

  const body = req.body || {};
  const {
    fullName,
    email,
    city,
    state,
    chapterName,
    connection = "",
    interestedCount = "",
    social = "",
  } = body;

  if (!isNonEmptyString(fullName)) {
    return res.status(400).json({ ok: false, error: "Name is required." });
  }
  if (!isNonEmptyString(email) || !EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, error: "A valid email is required." });
  }
  if (!isNonEmptyString(city)) {
    return res.status(400).json({ ok: false, error: "City is required." });
  }
  if (!isNonEmptyString(state)) {
    return res.status(400).json({ ok: false, error: "State is required." });
  }
  if (!isNonEmptyString(chapterName)) {
    return res.status(400).json({ ok: false, error: "Chapter name is required." });
  }

  const payload = {
    secret,
    submittedAt: new Date().toISOString(),
    fullName: fullName.trim(),
    email: email.trim(),
    city: city.trim(),
    state: state.trim(),
    chapterName: chapterName.trim(),
    connection: String(connection).trim(),
    interestedCount: String(interestedCount).trim(),
    social: String(social).trim(),
  };

  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await upstream.json().catch(() => ({}));
    if (!upstream.ok || !result.ok) {
      console.error("Sheet webhook error", upstream.status, result);
      return res.status(502).json({ ok: false, error: "Could not save your registration. Please try again." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Sheet webhook request failed", err);
    return res.status(502).json({ ok: false, error: "Could not save your registration. Please try again." });
  }
}
