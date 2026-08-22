// src/pages/AdvocacyTrainingDetail.jsx
//
// One training's full content. Reached at /advocacy-training/:id from a
// card on the catalog page. The "advocates trained" counter increments
// here, once per training per browser session.

import React, { useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import Nav from "../components/Nav";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { TRAININGS, getTraining } from "../data/advocacyTrainings";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');

.av-training-body h4 { font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #A87C2A; margin: 30px 0 12px; }
.av-training-body h4:first-child { margin-top: 0; }
.av-training-body p { margin: 0 0 15px; font-size: 15.5px; line-height: 1.75; color: #2B2A28; }

.av-steps-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin: 4px 0 22px;
}
.av-steps-grid-3 { grid-template-columns: repeat(3, 1fr); }
.av-steps-grid-2 { grid-template-columns: repeat(2, 1fr); }
.av-steps-grid-timeline { grid-template-columns: 1fr; gap: 0; }
@media (max-width: 640px) {
  .av-steps-grid, .av-steps-grid-3, .av-steps-grid-2 { grid-template-columns: 1fr; }
}

.av-step-card {
  background: #FFFFFF;
  border: 1px solid #E4E0D6;
  border-radius: 10px;
  padding: 16px 18px;
  position: relative;
}
.av-step-card h5 { font-family: 'Fraunces', serif; font-size: 15.5px; font-weight: 500; color: #1B2A4A; margin: 0 0 6px; }
.av-step-card p { margin: 0 !important; font-size: 13.5px !important; line-height: 1.6 !important; color: #5A5952 !important; }
.av-step-num {
  display: inline-flex; align-items: center; justify-content: center;
  width: 22px; height: 22px; border-radius: 50%;
  background: #F7F3EA; color: #A87C2A;
  font-family: 'Fraunces', serif; font-size: 12px; font-weight: 600;
  margin-bottom: 8px;
}

.av-steps-grid-timeline .av-step-card {
  border-radius: 0;
  border: none;
  border-left: 2px solid #E4E0D6;
  padding: 4px 0 18px 20px;
  background: none;
}
.av-step-time {
  display: block;
  font-family: 'Fraunces', serif;
  font-size: 13px;
  color: #A87C2A;
  font-weight: 600;
  margin-bottom: 4px;
}
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
        </div>

        <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 500, fontSize: "clamp(32px, 6vw, 46px)", lineHeight: 1.1, color: "#1B2A4A", margin: "0 0 24px" }}>
          {training.title}
        </h1>

        {training.takeaways && training.takeaways.length > 0 && (
          <div
            style={{
              background: "#1B2A4A",
              borderRadius: 10,
              padding: "18px 22px",
              marginBottom: 36,
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9A25A", margin: "0 0 12px" }}>
              Key takeaways
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              {training.takeaways.map((tk, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <CheckCircle2 size={15} color="#7A8FB8" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 13.5, lineHeight: 1.5, color: "#E8EAF0" }}>{tk}</span>
                </div>
              ))}
            </div>
          </div>
        )}

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
