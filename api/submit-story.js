// api/submit-story.js
//
// POST: forwards a story submission to a Google Sheet webhook, exactly the
// way api/register-chapter.js forwards chapter signups. No secrets are ever
// sent to the browser.
//
// GET: reads back only rows your team has marked "approved" in the Sheet,
// for the public gallery on the Patient Stories page.
//
// Required environment variables (set in Vercel, same tab where you set
// CHAPTER_SHEET_WEBHOOK_URL / CHAPTER_SHEET_SECRET):
//   STORY_SHEET_WEBHOOK_URL — Apps Script deployment URL for the Stories sheet
//   STORY_SHEET_SECRET      — shared secret, checked inside the Apps Script

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

export default async function handler(req, res) {
  const webhookUrl = process.env.STORY_SHEET_WEBHOOK_URL;
  const secret = process.env.STORY_SHEET_SECRET;

  if (!webhookUrl || !secret) {
    console.error("Missing STORY_SHEET_WEBHOOK_URL or STORY_SHEET_SECRET");
    return res.status(500).json({ ok: false, error: "Server is not configured yet." });
  }

  if (req.method === "POST") {
    const body = req.body || {};
    const {
      name = "",
      condition,
      state = "",
      country = "",
      category,
      story,
      shareAnonymously = false,
      sharePublicly = true,
      useInAdvocacy = true,
      website = "", // honeypot — same pattern as send-legislator-email.js
    } = body;

    // Bots that fill the hidden honeypot get a silent fake success.
    if (isNonEmptyString(website)) {
      return res.status(200).json({ ok: true });
    }

    if (!isNonEmptyString(condition)) {
      return res.status(400).json({ ok: false, error: "Condition is required." });
    }
    if (!isNonEmptyString(story)) {
      return res.status(400).json({ ok: false, error: "Please write your story." });
    }
    if (!isNonEmptyString(category)) {
      return res.status(400).json({ ok: false, error: "Please choose a category." });
    }

    const payload = {
      secret,
      submittedAt: new Date().toISOString(),
      name: String(name).trim(),
      condition: condition.trim(),
      state: String(state).trim(),
      country: String(country).trim(),
      category: category.trim(),
      story: story.trim(),
      shareAnonymously: Boolean(shareAnonymously),
      sharePublicly: Boolean(sharePublicly),
      useInAdvocacy: Boolean(useInAdvocacy),
    };

    try {
      const upstream = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await upstream.json().catch(() => ({}));
      if (!upstream.ok || !result.ok) {
        console.error("Story sheet webhook error", upstream.status, result);
        return res.status(502).json({ ok: false, error: "Could not save your story. Please try again." });
      }
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Story sheet webhook request failed", err);
      return res.status(502).json({ ok: false, error: "Could not save your story. Please try again." });
    }
  }

  if (req.method === "GET") {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    try {
      const upstream = await fetch(`${webhookUrl}?secret=${encodeURIComponent(secret)}&mode=approved`);
      const result = await upstream.json().catch(() => ({}));
      if (!upstream.ok) {
        return res.status(502).json({ ok: false, error: "Could not load stories." });
      }
      return res.status(200).json({ ok: true, stories: result.stories || [] });
    } catch (err) {
      console.error("Story sheet GET failed", err);
      return res.status(502).json({ ok: false, error: "Could not load stories." });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ ok: false, error: "Method not allowed" });
}

/*
--------------------------------------------------------------------------
Apps Script backend — new Google Apps Script project bound to a "Stories"
Google Sheet, deployed as a web app (Execute as: Me, Who has access:
Anyone). Same deployment steps you used for the chapter registration sheet.

Sheet columns (row 1 headers, exact order):
timestamp | name | condition | state | country | category | story |
shareAnonymously | sharePublicly | useInAdvocacy | approved

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (data.secret !== PropertiesService.getScriptProperties().getProperty("SECRET")) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false })).setMimeType(ContentService.MimeType.JSON);
  }
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Stories");
  sheet.appendRow([
    data.submittedAt, data.name, data.condition, data.state, data.country,
    data.category, data.story, data.shareAnonymously, data.sharePublicly,
    data.useInAdvocacy, false // approved starts false — flip it manually after review
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  if (e.parameter.secret !== PropertiesService.getScriptProperties().getProperty("SECRET")) {
    return ContentService.createTextOutput(JSON.stringify({ stories: [] })).setMimeType(ContentService.MimeType.JSON);
  }
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Stories");
  const rows = sheet.getDataRange().getValues();
  const headers = rows.shift();
  const approvedIdx = headers.indexOf("approved");
  const sharePubliclyIdx = headers.indexOf("sharePublicly");
  const stories = rows
    .filter(r => r[approvedIdx] === true && r[sharePubliclyIdx] === true)
    .map(r => Object.fromEntries(headers.map((h, i) => [h, r[i]])));
  return ContentService.createTextOutput(JSON.stringify({ stories }))
    .setMimeType(ContentService.MimeType.JSON);
}
--------------------------------------------------------------------------
*/
