// api/chatbot.js
//
// Calls Google's Gemini API (free tier — Flash-Lite model) server-side.
// The API key never reaches the browser; only this function ever sees it.
//
// Required environment variable:
//   GEMINI_API_KEY — get one free, no credit card, at https://aistudio.google.com/app/apikey
//
// The free tier has real rate limits (roughly 1,500 requests/day, 30/minute
// for Flash-Lite as of when this was written). If it's ever exceeded, this
// returns a friendly "try again in a bit" message instead of erroring out.

const GEMINI_MODEL = "gemini-3.5-flash-lite";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_PROMPT = `You are the help assistant on autoimmune-voices.org, a nonprofit site for a patient-led autoimmune disease advocacy network called AutoimmuneVoices (AV).

Your job is to help visitors who are lost or have a question navigate the site and understand what AV does — not to give medical or legal advice.

Here's what's on the site, so you can point people to the right place:
- Home (/) — mission overview
- Legislation (/legislation) — tracks bills affecting people with autoimmune/chronic conditions, with plain-language AI summaries and a tool to email your own legislator about a specific bill
- Bills We've Supported (/bills-supported) — bills AV members have actually taken action on, with status timelines
- Advocacy Training (/advocacy-training) — 8 free training modules: Advocacy Basics, Finding Legislation, Contacting Representatives, Sharing Your Patient Story, Public Comment, Testimony, Policymaker Meetings, and Ballot Initiatives & Petitions — each with a short video, written lesson, and a quiz
- Resource Library (/resource-library) — condition guides and advocacy resources
- Start a Chapter (/create-chapter) — how to register a local AV chapter
- Current Chapters (/current-chapters) — directory of existing chapters worldwide
- Gallery (/gallery) — Instagram posts from AV chapters around the world
- Events (/events) — upcoming public hearings, comment periods, and AV events
- Impact (/impact) — AV's overall stats, patient stories, and community partners
- Brainstorm (/brainstorm) — a space for policy ideas

Guidelines:
- Keep answers short and friendly, usually 2-4 sentences.
- When relevant, tell people the specific page to visit (mention it by name).
- You are NOT a medical professional. If someone asks for medical advice, diagnosis, symptom interpretation, or treatment guidance, say you can't help with that specifically and gently suggest they talk to their doctor — you can still point them to the Resource Library if it has relevant general information, but don't offer clinical guidance yourself.
- You are NOT a lawyer. Don't give specific legal advice about a person's individual situation.
- Stay nonpartisan. If someone asks you to take a side on a political topic, explain that AV is nonpartisan and focuses on the policy process rather than taking positions.
- If you don't know something specific about the site, say so honestly rather than guessing, and suggest they explore the relevant page or reach out to the AV team directly.
- If someone seems to be in real distress or mentions self-harm, respond with warmth, don't try to be their therapist, and gently encourage them to reach out to a crisis line or a trusted person — the 988 Suicide & Crisis Lifeline (call or text 988 in the US) is a good one to mention if it seems relevant.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("Missing GEMINI_API_KEY");
    return res.status(500).json({ ok: false, error: "Chat isn't set up yet." });
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ ok: false, error: "No messages provided." });
  }

  // Keep only the last 12 turns (24 messages) — plenty of context for a
  // help-widget conversation, and keeps each request small and cheap.
  const trimmed = messages.slice(-24);

  const contents = trimmed.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: String(m.content || "").slice(0, 4000) }],
  }));

  try {
    const geminiRes = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          maxOutputTokens: 400,
          temperature: 0.4,
        },
      }),
    });

    if (geminiRes.status === 429) {
      return res.status(200).json({
        ok: true,
        reply: "I'm getting a lot of questions right now — mind trying again in a minute?",
      });
    }

    const data = await geminiRes.json().catch(() => ({}));

    if (!geminiRes.ok) {
      console.error("Gemini API error", geminiRes.status, data);
      return res.status(200).json({
        ok: true,
        reply: "Sorry, I'm having trouble answering right now. Try again in a moment, or explore the site using the menu above.",
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
      "Sorry, I didn't quite catch that — could you rephrase?";

    return res.status(200).json({ ok: true, reply });
  } catch (err) {
    console.error("chatbot handler error", err);
    return res.status(200).json({
      ok: true,
      reply: "Sorry, something went wrong on my end. Try again in a moment.",
    });
  }
}
