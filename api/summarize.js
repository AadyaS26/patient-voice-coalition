// Generates a plain-language summary of a bill using Google's Gemini API
// (free tier), called securely from the server so the API key never
// reaches the browser.

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-3.1-flash-lite";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: "Missing GEMINI_API_KEY on server" });
  }

  const { number, fullName, summary } = req.body || {};
  if (!number || !fullName || !summary) {
    return res.status(400).json({ error: "Missing bill details" });
  }

  const prompt = `Explain ${number}, "${fullName}," to a patient with no legal background. Here is a short factual description: ${summary}\n\nWrite 2-3 plain sentences covering what it would actually change for a patient, in a warm but concrete tone. No legal jargon, no bullet points, no headers.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: "Gemini API error", detail: errText });
    }

    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text).join(" ").trim() || "";

    return res.status(200).json({ text: text || "Summary unavailable right now." });
  } catch (err) {
    return res.status(500).json({ error: "Server error", detail: String(err) });
  }
}
