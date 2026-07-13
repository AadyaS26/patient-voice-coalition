import React, { useState } from "react";
import Nav from "../components/Nav";
import { Calendar, MapPin, ArrowRight, BookOpen, Check } from "lucide-react";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');`;

const EVENTS = [
  {
    date: "Aug 9, 2026",
    title: "Virtual advocacy training",
    location: "Online",
    body: "A one-hour session on how to write to your legislator, what happens after a bill is introduced, and how to track its progress.",
  },
  {
    date: "Sept 12, 2026",
    title: "Celiac Youth Leadership Council meeting",
    location: "Online",
    body: "Monthly council meeting for youth advocates working on celiac disease policy and awareness projects.",
  },
  {
    date: "Oct 3, 2026",
    title: "Congressional Celiac Disease Caucus briefing",
    location: "Washington, D.C.",
    body: "A briefing open to patient advocates on current legislative priorities for the celiac disease community.",
  },
  {
    date: "Nov 14, 2026",
    title: "Patient story workshop",
    location: "Online",
    body: "A working session for patients who want help turning their own diagnosis story into written or spoken testimony.",
  },
];

export default function EventsPage() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setJoined(true);
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: "#2B2A28", background: "#FAF8F3", minHeight: "100%" }}>
      <style>{FONT_IMPORT}</style>

      <Nav />

      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "56px 24px 40px" }}>
        <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#A87C2A", fontWeight: 500, marginBottom: 16 }}>
          Get involved
        </p>
        <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 500, fontSize: "clamp(28px, 4.5vw, 42px)", lineHeight: 1.1, color: "#1B2A4A", maxWidth: 620 }}>
          Upcoming events
        </h1>
        <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "#5A5952", maxWidth: 560, marginTop: 16 }}>
          Trainings, briefings, and community sessions for patients and caregivers working on autoimmune and chronic disease policy.
        </p>
      </section>

      {/* Book teaser */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 56px" }}>
        <div
          style={{
            background: "#1B2A4A",
            borderRadius: 6,
            padding: "36px 32px",
            display: "flex",
            gap: 28,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "1 1 320px" }}>
            <span
              style={{
                fontSize: 11.5,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#C9A25A",
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <BookOpen size={13} /> Coming soon
            </span>
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 26, color: "#FAF8F3", margin: "10px 0 10px", fontWeight: 500 }}>
              Celiac 101
            </h2>
            <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "#C4C8D6", maxWidth: 460 }}>
              A plain-language guide to living with celiac disease, written by a patient diagnosed at five years old — covering diagnosis, the gluten-free
              diet, school and travel, and how to advocate for yourself. Publication date to be announced.
            </p>
          </div>

          <div style={{ flex: "1 1 260px", minWidth: 260 }}>
            {joined ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#C9A25A", fontSize: 14 }}>
                <Check size={16} /> You're on the list — we'll email you at launch.
              </div>
            ) : (
              <form onSubmit={handleJoin} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  style={{
                    flex: "1 1 180px",
                    padding: "11px 12px",
                    borderRadius: 3,
                    border: "1px solid #3A4A6E",
                    background: "#22335A",
                    color: "#FAF8F3",
                    fontSize: 14,
                  }}
                />
                <button
                  type="submit"
                  style={{
                    fontSize: 13.5,
                    fontWeight: 500,
                    color: "#1B2A4A",
                    background: "#C9A25A",
                    border: "none",
                    padding: "11px 18px",
                    borderRadius: 3,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Notify me
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Events list */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 72px", display: "grid", gap: 16 }}>
        {EVENTS.map((e) => (
          <div
            key={e.title}
            style={{
              border: "1px solid #E4E0D6",
              borderRadius: 4,
              padding: "22px 24px",
              background: "#fff",
              display: "flex",
              gap: 24,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <div style={{ minWidth: 130 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#A87C2A", fontWeight: 500, marginBottom: 6 }}>
                <Calendar size={13} /> {e.date}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#8A8880" }}>
                <MapPin size={13} /> {e.location}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 240 }}>
              <h3 style={{ fontSize: 16.5, fontWeight: 600, color: "#1B2A4A", margin: "0 0 6px" }}>{e.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "#5A5952" }}>{e.body}</p>
            </div>
            <a
              href="#"
              style={{ fontSize: 13, fontWeight: 500, color: "#1B2A4A", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, alignSelf: "center" }}
            >
              Register <ArrowRight size={13} />
            </a>
          </div>
        ))}
      </section>
    </div>
  );
}
