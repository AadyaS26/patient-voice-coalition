// src/pages/AdvocacyTrainingDetail.jsx
//
// One training's full content. Reached at /advocacy-training/:id from a
// card on the catalog page. The "advocates trained" counter increments
// here, once per training per browser session (tracked via sessionStorage)
// — this is what "opening a training" means for counting purposes.

import React, { useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import Nav from "../components/Nav";
import { ArrowLeft, Clock } from "lucide-react";
import { TRAININGS, getTraining } from "../data/advocacyTrainings";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');

.av-training-body h4 { font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #A87C2A; margin: 26px 0 10px; }
.av-training-body h4:first-child { margin-top: 0; }
.av-training-body p { margin: 0 0 15px; font-size: 15.5px; line-height: 1.75; color: #2B2A28; }
`;

const LEVEL_COLORS = {
  Beginner: "#5A5952",
  Intermediate: "#A87C2A",
};

export default function AdvocacyTrainingDetail() {
  const { id } = useParams();
  const training = getTraining(id);
  const index = TRAININGS.findIndex((t) => t.id === id);
  const next = index >= 0 ? TRAININGS[(index + 1) % TRAININGS.length] : null;

  useEffect(() => {
    if (!training) return;
    const sessionKey = `av-training-opened-${training.id}`;
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, "1");
      fetch("/api/counter?key=advocates-trained&action=increment").catch(() => {});
    }
    window.scrollTo(0, 0);
  }, [training]);

  if (!training) {
    return <Navigate to="/advocacy-training" replace />;
  }

  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: "#2B2A28", background: "#FAF8F3", minHeight: "100%" }}>
      <style>{FONT_IMPORT}</style>
      <Nav />

      <section style={{ maxWidth: 700, margin: "0 auto", padding: "48px 24px 0" }}>
        <Link
          to="/advocacy-training"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#8A8880", textDecoration: "none", marginBottom: 28 }}
        >
          <ArrowLeft size={13} /> All trainings
        </Link>

        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 10 }}>
          <span style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: 26, color: "#C4BEA8" }}>
            {training.index}.
          </span>
          <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: LEVEL_COLORS[training.level] }}>
            {training.level}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#8A8880" }}>
            <Clock size={12} /> {training.hours}
          </span>
        </div>

        <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 500, fontSize: "clamp(32px, 6vw, 46px)", lineHeight: 1.1, color: "#1B2A4A", margin: "0 0 32px" }}>
          {training.title}
        </h1>

        <div className="av-training-body">{training.content}</div>

        {next && (
          <div style={{ marginTop: 56, paddingTop: 28, borderTop: "1px solid #E4E0D6" }}>
            <p style={{ fontSize: 12, letterSpacing: "0.05em", textTransform: "uppercase", color: "#8A8880", marginBottom: 8 }}>
              Up next
            </p>
            <Link
              to={`/advocacy-training/${next.id}`}
              style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 500, color: "#1B2A4A", textDecoration: "none" }}
            >
              {next.index}. {next.title} →
            </Link>
          </div>
        )}
      </section>

      <div style={{ height: 80 }} />
    </div>
  );
}
