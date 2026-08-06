// api/send-legislator-email.js
//
// Sends an email to a state legislator on the constituent's behalf, using
// Resend. The email is sent FROM a verified AutoimmuneVoices address (so it
// actually delivers reliably) with the constituent's email set as Reply-To
// and CC'd, so the legislator's office can reply directly to the
// constituent, and the constituent gets a copy as proof of what was sent.
//
// Required environment variables:
//   RESEND_API_KEY    — from https://resend.com after creating an account
//   RESEND_FROM_EMAIL — a sender address on a domain verified in Resend,
//                       e.g. "AutoimmuneVoices Advocacy <advocacy@autoimmune-voices.org>"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    console.error("Missing RESEND_API_KEY or RESEND_FROM_EMAIL");
    return res.status(500).json({ ok: false, error: "Server is not configured yet." });
  }

  const body = req.body || {};
  const {
    legislatorEmail,
    legislatorName,
    senderName,
    senderEmail,
    subject,
    message,
    website, // honeypot field — real users never fill this in
  } = body;

  // Silently pretend success for bots that fill the hidden honeypot field,
  // rather than telling them exactly what tripped the filter.
  if (isNonEmptyString(website)) {
    return res.status(200).json({ ok: true });
  }

  if (!isNonEmptyString(legislatorEmail) || !EMAIL_RE.test(legislatorEmail)) {
    return res.status(400).json({ ok: false, error: "Missing or invalid legislator email." });
  }
  if (!isNonEmptyString(senderName)) {
    return res.status(400).json({ ok: false, error: "Please enter your name." });
  }
  if (!isNonEmptyString(senderEmail) || !EMAIL_RE.test(senderEmail)) {
    return res.status(400).json({ ok: false, error: "Please enter a valid email." });
  }
  if (!isNonEmptyString(subject)) {
    return res.status(400).json({ ok: false, error: "Please enter a subject." });
  }
  if (!isNonEmptyString(message)) {
    return res.status(400).json({ ok: false, error: "Please write a message." });
  }

  const fullMessage = `${message.trim()}\n\n— ${senderName.trim()}`;

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL,
        to: [legislatorEmail],
        reply_to: senderEmail,
        cc: [senderEmail],
        subject: subject.trim(),
        text: fullMessage,
      }),
    });

    const result = await resendRes.json().catch(() => ({}));

    if (!resendRes.ok) {
      console.error("Resend error", resendRes.status, result);
      return res.status(502).json({ ok: false, error: "Could not send your message. Please try again." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("send-legislator-email error", err);
    return res.status(502).json({ ok: false, error: "Could not send your message. Please try again." });
  }
}
