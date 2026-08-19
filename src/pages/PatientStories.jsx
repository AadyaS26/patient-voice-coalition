// src/pages/PatientStories.jsx
//
// Standalone full gallery of every patient story. Deliberately NOT in the
// top nav (src/components/Nav.jsx) — reached only via the "View Patient
// Stories" button in the Patient Stories section on the Impact page. The
// Impact page keeps its own shorter preview + share form; this page is
// just the complete, unfiltered gallery.

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import { ArrowLeft, MessageCircleHeart } from "lucide-react";

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

function StoryCard({ story }) {
  const label = CATEGORIES.find((c) => c.id === story.category)?.label || story.category;
  return (
    <div style={{ background: "#fff", border: "1px solid #E4E0D6", borderRadius: 12, padding: 24, breakInside: "avoid", marginBottom: 20 }}>
      <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#A87C2A" }}>
        {label}
      </span>
      <p style={{ fontFamily: "Fraunces, serif", fontSize: 17, lineHeight: 1.6, color: "#2B2A28", marginTop: 12 }}>
        "{story.story}"
      </p>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#8A8880", marginTop: 14 }}>
        — {story.shareAnonymously === "true" || story.shareAnonymously === true ? "Anonymous" : story.name || "Anonymous"}
        {story.condition ? `, living with ${story.condition}` : ""}
        {story.state ? ` · ${story.state}` : ""}
      </p>
    </div>
  );
}

export default function PatientStoriesPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetch("/api/submit-story", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setStories(Array.isArray(data.stories) ? data.stories : []))
      .catch(() => setStories([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = categoryFilter === "all" ? stories : stories.filter((s) => s.category === categoryFilter);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: "#2B2A28", background: "#FAF8F3", minHeight: "100%" }}>
      <style>{FONT_IMPORT}</style>
      <Nav />

      <section style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 0", textAlign: "center" }}>
        <Link to="/impact" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#8A8880", textDecoration: "none", marginBottom: 20 }}>
          <ArrowLeft size={13} /> Back to Impact
        </Link>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
          <MessageCircleHeart size={20} color="#A87C2A" />
        </div>
        <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 500, fontSize: "clamp(38px, 7vw, 60px)", lineHeight: 1.05, color: "#1B2A4A", letterSpacing: "-0.01em" }}>
          Patient stories
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: "#5A5952", maxWidth: 560, margin: "16px auto 0" }}>
          {stories.length.toLocaleString()} stories collected from people living with autoimmune
          and chronic conditions — the lived experience behind every bill we track. Want to add
          yours? Share it from the Patient Stories section on the{" "}
          <Link to="/impact" style={{ color: "#A87C2A" }}>Impact page</Link>.
        </p>
      </section>

      <section style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px 80px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 13.5,
              border: "none",
              borderBottom: "1px solid #C9C4B6",
              background: "transparent",
              color: "#2B2A28",
              padding: "4px 20px 4px 0",
            }}
          >
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p style={{ color: "#8A8880", textAlign: "center" }}>Loading stories…</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: "#8A8880", textAlign: "center" }}>
            {stories.length === 0 ? "No stories published yet — be the first to share yours." : "No stories in this category yet."}
          </p>
        ) : (
          <div style={{ columnCount: 2, columnGap: 20 }}>
            {filtered.map((s, i) => (
              <StoryCard key={i} story={s} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
