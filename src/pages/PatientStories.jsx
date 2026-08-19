// src/pages/PatientStories.jsx
//
// Public patient story gallery + submission form. Submissions go to
// api/submit-story.js, which forwards to a Google Sheet webhook exactly
// the way api/register-chapter.js already does for chapter signups —
// same env var pattern, same "no client-side secrets" approach.
//
// GET /api/submit-story returns only rows your Sheet has marked approved,
// so nothing goes public until you've reviewed it (see the Apps Script
// snippet at the bottom of api/submit-story.js).

import React, { useEffect, useState } from "react";
import Nav from "../components/Nav";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');`;

const CATEGORIES = [
  { id: "delayed_diagnosis", label: "Delayed Diagnosis" },
  { id: "medication_access", label: "Medication Access" },
  { id: "prior_authorization", label: "Prior Authorization" },
  { id: "insurance_denial", label: "Insurance Denial" },
  { id: "food_affordability", label: "Food Affordability" },
  { id: "specialist_access", label: "Specialist Access" },
  { id: "disability_accommodations", label: "Disability Accommodations" },
  { id: "womens_health", label: "Women's Health" },
  { id: "mental_health", label: "Mental Health Effects" },
  { id: "rural_healthcare", label: "Rural Healthcare" },
  { id: "other", label: "Other" },
];

const inputStyle = {
  width: "100%",
  fontFamily: "Inter, sans-serif",
  fontSize: 14.5,
  border: "1px solid #E4E0D6",
  borderRadius: 8,
  padding: "10px 12px",
  background: "#FFFFFF",
  color: "#2B2A28",
  boxSizing: "border-box",
};

const labelStyle = {
  fontFamily: "Inter, sans-serif",
  fontSize: 13.5,
  fontWeight: 600,
  color: "#2B2A28",
  display: "block",
  marginBottom: 6,
};

function StoryForm({ onSubmitted }) {
  const [form, setForm] = useState({
    name: "",
    condition: "",
    state: "",
    country: "United States",
    category: CATEGORIES[0].id,
    story: "",
    shareAnonymously: false,
    sharePublicly: true,
    useInAdvocacy: true,
    website: "", // honeypot, same pattern as send-legislator-email.js
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/submit-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Could not submit your story.");
      setStatus("done");
      onSubmitted?.();
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div style={{ background: "#EEF6F0", border: "1px solid #CFE6D8", borderRadius: 12, padding: 24, textAlign: "center" }}>
        <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#1B6B3F" }}>
          Thank you for sharing your story.
        </p>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#3E6B4E", marginTop: 4 }}>
          Our team reviews every submission before it's added to the public collection.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: "#FFFFFF", border: "1px solid #E4E0D6", borderRadius: 16, padding: 28, display: "grid", gap: 18 }}>
      {/* honeypot — hidden from real users */}
      <input
        type="text"
        value={form.website}
        onChange={(e) => update("website", e.target.value)}
        style={{ position: "absolute", left: "-9999px" }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={labelStyle}>Your name (leave blank if anonymous)</label>
          <input style={inputStyle} value={form.name} onChange={(e) => update("name", e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Condition</label>
          <input
            style={inputStyle}
            required
            placeholder="e.g. Celiac disease, Lupus, Type 1 Diabetes"
            value={form.condition}
            onChange={(e) => update("condition", e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>State / Province</label>
          <input style={inputStyle} value={form.state} onChange={(e) => update("state", e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Country</label>
          <input style={inputStyle} value={form.country} onChange={(e) => update("country", e.target.value)} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>What category best fits your story?</label>
        <select style={inputStyle} value={form.category} onChange={(e) => update("category", e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelStyle}>Your story — what do you wish policymakers knew?</label>
        <textarea
          style={{ ...inputStyle, resize: "vertical" }}
          rows={6}
          required
          value={form.story}
          onChange={(e) => update("story", e.target.value)}
          placeholder="Share your experience with diagnosis, treatment, insurance, or anything else that shaped how you think about healthcare policy."
        />
      </div>

      <div style={{ display: "grid", gap: 8, fontFamily: "Inter, sans-serif", fontSize: 14, color: "#5A5952" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={form.shareAnonymously} onChange={(e) => update("shareAnonymously", e.target.checked)} />
          Share my story anonymously (no name shown)
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={form.sharePublicly} onChange={(e) => update("sharePublicly", e.target.checked)} />
          I give permission to share this story publicly on the website
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={form.useInAdvocacy} onChange={(e) => update("useInAdvocacy", e.target.checked)} />
          I give permission to use this story in advocacy materials, testimony, or meetings with legislators
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
          fontSize: 15,
          color: "#FFFFFF",
          background: "#1B2A4A",
          border: "none",
          borderRadius: 10,
          padding: "12px 0",
          cursor: status === "sending" ? "default" : "pointer",
          opacity: status === "sending" ? 0.6 : 1,
        }}
      >
        {status === "sending" ? "Submitting…" : "Share My Story"}
      </button>
      {status === "error" && (
        <p style={{ color: "#B23B3B", fontSize: 13.5, fontFamily: "Inter, sans-serif" }}>{error}</p>
      )}
    </form>
  );
}

function StoryCard({ story }) {
  const label = CATEGORIES.find((c) => c.id === story.category)?.label || story.category;
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E4E0D6", borderRadius: 16, padding: 24, breakInside: "avoid", marginBottom: 20 }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#A87C2A" }}>
        {label}
      </span>
      <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 16.5, lineHeight: 1.6, color: "#2B2A28", marginTop: 12 }}>
        "{story.story}"
      </p>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#8A887F", marginTop: 14 }}>
        — {story.shareAnonymously === "true" || story.shareAnonymously === true ? "Anonymous" : story.name || "Anonymous"}
        {story.condition ? `, living with ${story.condition}` : ""}
        {story.state ? ` · ${story.state}` : ""}
      </p>
    </div>
  );
}

export default function PatientStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("/api/submit-story", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setStories(Array.isArray(data.stories) ? data.stories : []))
      .catch(() => setStories([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: "#2B2A28", background: "#FAF8F3", minHeight: "100%" }}>
      <style>{FONT_IMPORT}</style>
      <Nav />
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "56px 24px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#A87C2A", fontWeight: 500, marginBottom: 16 }}>
              Lived Experience
            </p>
            <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 40, fontWeight: 600, color: "#1B2A4A" }}>
              Patient Stories
            </h1>
            <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "#5A5952", maxWidth: 600, marginTop: 16 }}>
              {stories.length.toLocaleString()} stories collected from people living with
              autoimmune and chronic conditions — the lived experience behind every bill we track.
            </p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: 14.5,
              color: "#FFFFFF",
              background: "#1B2A4A",
              border: "none",
              borderRadius: 10,
              padding: "12px 22px",
              cursor: "pointer",
              height: "fit-content",
            }}
          >
            {showForm ? "Close form" : "Share Your Story"}
          </button>
        </div>

        {showForm && <div style={{ marginTop: 32 }}><StoryForm onSubmitted={() => {}} /></div>}

        <div style={{ marginTop: 40 }}>
          {loading ? (
            <p style={{ color: "#8A887F" }}>Loading stories…</p>
          ) : stories.length === 0 ? (
            <p style={{ color: "#8A887F" }}>No stories published yet — be the first to share yours.</p>
          ) : (
            <div style={{ columnCount: 2, columnGap: 20 }}>
              {stories.map((s, i) => (
                <StoryCard key={i} story={s} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
