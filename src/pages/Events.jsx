import React from "react";
import Nav from "../components/Nav";
import { Calendar, MapPin, ArrowRight, BookOpen } from "lucide-react";
import celiac101Cover from "../celiac-101-cover.png";

const AMAZON_URL =
  "https://www.amazon.com/Celiac-Disease-101-Everything-Diagnosis-ebook/dp/B0HC5XZ3WR";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');`;

const EVENTS = [
  {
    date: "Jul 14, 2026",
    title: "Celiac 101 Book Release",
    location: "Online",
    body: "The official release of Celiac 101 — a plain-language guide to living with celiac disease, covering diagnosis, the gluten-free diet, school and travel, and how to advocate for yourself.",
    url: AMAZON_URL,
    urlLabel: "Buy on Amazon",
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

      {/* Featured book */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 56px" }}>
        <div
          style={{
            border: "1px solid #E4E0D6",
            borderRadius: 6,
            background: "#fff",
            display: "flex",
            flexWrap: "wrap",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: 220,
              flexShrink: 0,
              background: "#F3EFE4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
          >
            <img
              src={celiac101Cover}
              alt="Celiac Disease 101: Everything You Need to Know After Diagnosis, book cover"
              style={{ width: "100%", maxWidth: 170, borderRadius: 3, boxShadow: "0 6px 18px rgba(27,42,74,0.18)" }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 260, padding: "28px 28px 28px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#A87C2A", fontWeight: 500, marginBottom: 10 }}>
              <BookOpen size={13} /> Now available
            </div>
            <h2 style={{ fontFamily: "Fraunces, serif", fontWeight: 500, fontSize: "clamp(20px, 3vw, 26px)", lineHeight: 1.2, color: "#1B2A4A", margin: "0 0 12px" }}>
              Celiac Disease 101: Everything You Need to Know After Diagnosis
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: "#5A5952", marginBottom: 14 }}>
              Written by AutoimmuneVoices founder Aadya S., this ten-chapter guide walks readers through
              a celiac diagnosis from the science and the testing process to the daily realities of
              shopping, cooking, eating out, traveling, and navigating social situations gluten-free.
              Later chapters cover nutrition and healing, the emotional side of diagnosis, current
              research, and a frequently-asked-questions section for quick reference.
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: "#8A8880", marginBottom: 18 }}>
              63 pages · Kindle Edition · Published July 30, 2026
            </p>
            
              href={AMAZON_URL}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13.5,
                fontWeight: 600,
                color: "#fff",
                background: "#1B2A4A",
                padding: "10px 18px",
                borderRadius: 4,
                textDecoration: "none",
              }}
            >
              Buy on Amazon <ArrowRight size={14} />
            </a>
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
            {(e.url || e.secondaryUrl) && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, alignSelf: "center" }}>
                {e.url && (
                  
                    href={e.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 13, fontWeight: 500, color: "#1B2A4A", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
                  >
                    {e.urlLabel || "Register"} <ArrowRight size={13} />
                  </a>
                )}
                {e.secondaryUrl && (
                  
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
