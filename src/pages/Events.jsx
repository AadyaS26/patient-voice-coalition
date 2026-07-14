import React from "react";
import Nav from "../components/Nav";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');`;

const EVENTS = [
  {
    date: "Jul 14, 2026",
    title: "Celiac 101 Book Release",
    location: "Online",
    body: "The official release of Celiac 101 — a plain-language guide to living with celiac disease, covering diagnosis, the gluten-free diet, school and travel, and how to advocate for yourself.",
  },
  {
    date: "Tue, Jul 21, 2026 · 7pm",
    title: "What Is CYLC Like? Q&A",
    location: "Online (Zoom)",
    body: "A live Q&A with current Celiac Youth Leadership Council members. Open to individuals ages 10–19 diagnosed with celiac disease who are under the care of Seattle Children's Celiac Disease Program.",
    url: "https://us06web.zoom.us/meeting/register/63PZ6FKZTHqgGcmTTb3kPQ",
    secondaryUrl: "https://docs.google.com/forms/d/e/1FAIpQLSf1_cfkMgcNCS9UnQakKbvGnjE5dOCHtTo1KChSHglcpFJyHQ/viewform?usp=header",
    secondaryLabel: "Application",
  },
];

export default function EventsPage() {
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
            {(e.url || e.secondaryUrl) && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, alignSelf: "center" }}>
                {e.url && (
                  <a
                    href={e.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 13, fontWeight: 500, color: "#1B2A4A", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
                  >
                    Register <ArrowRight size={13} />
                  </a>
                )}
                {e.secondaryUrl && (
                  <a
                    href={e.secondaryUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 12.5, color: "#8A8880", textDecoration: "none" }}
                  >
                    {e.secondaryLabel || "Learn more"}
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
