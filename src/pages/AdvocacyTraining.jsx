// src/pages/AdvocacyTraining.jsx
//
// Course-catalog style grid, one card per training. Clicking a card goes
// to its own page at /advocacy-training/:id (src/pages/AdvocacyTrainingDetail.jsx)
// rather than expanding in place.

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import { GraduationCap, ArrowRight } from "lucide-react";
import { TRAININGS } from "../data/advocacyTrainings";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');`;

const LEVEL_COLORS = {
  Beginner: "#5A5952",
  Intermediate: "#A87C2A",
};

export default function AdvocacyTraining() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    fetch("/api/counter?key=advocates-trained", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setCount(typeof data.value === "number" ? data.value : 0))
      .catch(() => setCount(0));
  }, []);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: "#2B2A28", background: "#FAF8F3", minHeight: "100%" }}>
      <style>{FONT_IMPORT}</style>
      <Nav />

      <section style={{ maxWidth: 800, margin: "0 auto", padding: "56px 24px 0", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
          <GraduationCap size={22} color="#A87C2A" />
        </div>
        <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 500, fontSize: "clamp(40px, 7vw, 64px)", lineHeight: 1.05, color: "#1B2A4A", letterSpacing: "-0.01em" }}>
          Advocacy Training
        </h1>
        <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "#5A5952", maxWidth: 540, margin: "16px auto 0" }}>
          Everything you need to go from "I care about this" to "I did something about this" — no
          experience required, free, always available.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 48, marginTop: 40 }}>
          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 30, fontWeight: 500, color: "#1B2A4A" }}>{TRAININGS.length}</div>
            <div style={{ fontSize: 11.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8A8880", marginTop: 4 }}>Modules</div>
          </div>
          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 30, fontWeight: 500, color: "#1B2A4A" }}>
              {count === null ? "…" : count.toLocaleString()}
            </div>
            <div style={{ fontSize: 11.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8A8880", marginTop: 4 }}>Advocates Trained</div>
          </div>
          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 30, fontWeight: 500, color: "#1B2A4A" }}>Free</div>
            <div style={{ fontSize: 11.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8A8880", marginTop: 4 }}>Always</div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px 90px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          {TRAININGS.map((t) => (
            <Link
              key={t.id}
              to={`/advocacy-training/${t.id}`}
              style={{
                display: "block",
                background: "#FFFFFF",
                border: "1px solid #E4E0D6",
                borderRadius: 12,
                padding: "28px 26px",
                textDecoration: "none",
                color: "inherit",
                transition: "box-shadow 0.15s ease, transform 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 10px 28px rgba(27,42,74,0.10)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "none";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                <span style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: 22, color: "#C4BEA8" }}>
                  {t.index}.
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: LEVEL_COLORS[t.level] }}>
                  {t.level}
                </span>
              </div>

              <h3 style={{ fontFamily: "Fraunces, serif", fontSize: 20, fontWeight: 500, color: "#1B2A4A", margin: "0 0 10px" }}>
                {t.title}
              </h3>

              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "#5A5952", margin: "0 0 20px" }}>
                {t.excerpt}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 16,
                  borderTop: "1px solid #F0EEE7",
                }}
              >
                <span style={{ fontSize: 12, letterSpacing: "0.04em", textTransform: "uppercase", color: "#8A8880" }}>
                  {t.hours}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 600, color: "#A87C2A" }}>
                  Read <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
