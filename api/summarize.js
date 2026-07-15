// Generates a plain-language summary of a bill using Claude, called securely
// from the server so the API key never reaches the browser.

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "Missing ANTHROPIC_API_KEY on server" });
  }

  const { number, fullName, summary } = req.body || {};
  if (!number || !fullName || !summary) {
    return res.status(400).json({ error: "Missing bill details" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: `Explain ${number}, "${fullName}," to a patient with no legal background. Here is a short factual description: ${summary}\n\nWrite 2-3 plain sentences covering what it would actually change for a patient, in a warm but concrete tone. No legal jargon, no bullet points, no headers.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: "Anthropic API error", detail: errText });
    }

    const data = await response.json();
    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join(" ")
      .trim();

    return res.status(200).json({ text: text || "Summary unavailable right now." });
  } catch (err) {
    return res.status(500).json({ error: "Server error", detail: String(err) });
  }
}
