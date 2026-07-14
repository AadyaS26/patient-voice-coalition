import React, { useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import { ArrowRight, Mail, ArrowUpRight } from "lucide-react";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');`;

const NAV_LINKS = [
  { label: "Legislation", href: "#legislation" },
  { label: "How it works", href: "#process" },
  { label: "Stories", href: "#spotlight" },
  { label: "About", href: "#about" },
];

const VALUES = ["Patient-led", "Evidence-based", "Nonpartisan", "Actionable"];

const PROCESS = [
  {
    n: "01",
    title: "Track",
    body: "We monitor federal and state bills that affect people living with autoimmune and chronic conditions, and translate the legal language into plain terms.",
  },
  {
    n: "02",
    title: "Act",
    body: "Patients read the plain-language summary, see who represents them, and send a message directly to their legislator in minutes.",
  },
  {
    n: "03",
    title: "Amplify",
    body: "Every message sent and every vote cast is counted in public, so legislators see the size of the community behind each bill.",
  },
];

const BILLS = [
  {
    tag: "Insurance coverage",
    title: "Medical foods and gluten-free labeling coverage",
    body: "Would require insurers to treat prescribed medical foods for diagnosed conditions the same as other prescribed treatments.",
    url: "https://www.congress.gov/bill/119th-congress/house-bill/5684",
  },
  {
    tag: "Research funding",
    title: "Autoimmune disease research investment",
    body: "Directs additional NIH funding toward early diagnosis and treatment research for autoimmune and chronic gastrointestinal conditions.",
    url: "https://www.congress.gov/bill/119th-congress/house-resolution/225",
  },
  {
    tag: "Food safety",
    title: "Celiac Safety Act of 2026",
    body: "Would amend federal food labeling law to formally classify gluten-containing grain as a major food allergen, giving celiac patients the same labeling protections as other allergen groups.",
    url: "https://www.congress.gov/bill/119th-congress/house-bill/9048",
  },
];

export default function PatientVoiceCoalition() {
  const [letters, setLetters] = useState(0);
  const [sent, setSent] = useState(false);
  const [billsTracked, setBillsTracked] = useState(null);
  const [statesCovered, setStatesCovered] = useState(null);

  const CURATED_BILLS = 23;

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/counter?key=letters-sent");
        const data = await res.json();
        setLetters(data.value || 0);
      } catch {
        setLetters(0);
      }
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      let federalCount = 0;
      let stateCount = 0;
      let stateList = [];
      try {
        const res = await fetch("https://raw.githubusercontent.com/AadyaS26/pvc-legislation-sync/main/bills.json");
        const data = await res.json();
        federalCount = typeof data.count === "number" ? data.count : 0;
      } catch {
        /* federal pipeline not reachable, fall back to 0 for that source */
      }
      try {
        const res = await fetch("https://raw.githubusercontent.com/AadyaS26/pvc-legislation-sync/main/state_bills.json");
        const data = await res.json();
        stateCount = typeof data.count === "number" ? data.count : 0;
        stateList = Array.isArray(data.states_covered) ? data.states_covered : [];
      } catch {
        /* state pipeline not reachable, fall back to 0 for that source */
      }
      setBillsTracked(CURATED_BILLS + federalCount + stateCount);
      setStatesCovered(Math.max(stateList.length, 8)); // 8 curated states are always real, regardless
    })();
  }, []);

  const handleSend = async () => {
    if (sent) return;
    setSent(true);
    try {
      const res = await fetch("/api/counter?key=letters-sent&action=increment");
      const data = await res.json();
      setLetters(data.value);
    } catch {
      setLetters((v) => v + 1);
    }
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: "#2B2A28", background: "#FAF8F3" }}>
      <style>{FONT_IMPORT}</style>

      {/* Nav */}
      <Nav />
      {/* Hero */}
      <section id="top" style={{ maxWidth: 1120, margin: "0 auto", padding: "88px 24px 64px" }}>
        <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#A87C2A", fontWeight: 500, marginBottom: 20 }}>
          Advocacy for autoimmune and chronic disease patients
        </p>
        <h1
          style={{
            fontFamily: "Fraunces, serif",
            fontWeight: 500,
            fontSize: "clamp(30px, 4.6vw, 50px)",
            lineHeight: 1.08,
            color: "#1B2A4A",
            maxWidth: 780,
            letterSpacing: "-0.01em",
          }}
        >
          Shaping the policies around autoimmune diseases. Our conditions. Our voices. Policies that matter.
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.65, color: "#5A5952", maxWidth: 560, marginTop: 24 }}>
          AutoimmuneVoices tracks the legislation that actually affects your diagnosis, translates it out of legal language, and connects you with Congress.
        </p>
        <div style={{ display: "flex", gap: 14, marginTop: 32, flexWrap: "wrap" }}>
          <Link
            to="/legislation"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
              fontWeight: 500,
              color: "#FAF8F3",
              background: "#1B2A4A",
              padding: "13px 22px",
              borderRadius: 3,
              textDecoration: "none",
            }}
          >
            See tracked legislation <ArrowRight size={15} />
          </Link>
          <a
            href="#process"
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: 14,
              fontWeight: 500,
              color: "#1B2A4A",
              padding: "13px 22px",
              border: "1px solid #C9C4B4",
              borderRadius: 3,
              textDecoration: "none",
            }}
          >
            How it works
          </a>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderTop: "1px solid #E4E0D6", borderBottom: "1px solid #E4E0D6" }}>
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "36px 24px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 24,
          }}
        >
          {[
            { n: billsTracked === null ? "—" : billsTracked.toLocaleString(), l: "Bills tracked" },
            { n: "146", l: "Conditions covered" },
            { n: statesCovered === null ? "—" : statesCovered, l: "States + federal" },
            { n: letters.toLocaleString(), l: "Letters sent" },
          ].map((s) => (
            <div key={s.l}>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: 32, color: "#1B2A4A", fontWeight: 500 }}>{s.n}</div>
              <div style={{ fontSize: 13, color: "#6B6A64", marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values strip */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 24px", display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center" }}>
        {VALUES.map((v, i) => (
          <span key={v} style={{ fontSize: 13, letterSpacing: "0.04em", color: "#8A8880" }}>
            {v}
            {i < VALUES.length - 1 && <span style={{ margin: "0 0 0 32px", color: "#D8D4C6" }}>·</span>}
          </span>
        ))}
      </section>

      {/* Process */}
      <section id="process" style={{ maxWidth: 1120, margin: "0 auto", padding: "72px 24px" }}>
        <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 28, color: "#1B2A4A", fontWeight: 500, marginBottom: 44 }}>How it works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 40 }}>
          {PROCESS.map((p) => (
            <div key={p.n}>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: 15, color: "#A87C2A", marginBottom: 10 }}>{p.n}</div>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: "#1B2A4A", marginBottom: 10 }}>{p.title}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "#5A5952" }}>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Legislation */}
      <section id="legislation" style={{ background: "#F2EEE3", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 44, flexWrap: "wrap", gap: 12 }}>
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 28, color: "#1B2A4A", fontWeight: 500 }}>Legislation we're tracking</h2>
            <span style={{ fontSize: 13, color: "#8A8880" }}>119th Congress, 2025–2026</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {BILLS.map((b) => (
              <div
                key={b.title}
                style={{
                  background: "#FAF8F3",
                  border: "1px solid #E4E0D6",
                  borderRadius: 4,
                  padding: "24px 22px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span style={{ fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.06em", color: "#A87C2A", fontWeight: 500 }}>{b.tag}</span>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1B2A4A", margin: "10px 0" }}>{b.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "#5A5952", marginBottom: 16, flex: 1 }}>{b.body}</p>
                <a
                  href={b.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#1B2A4A",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: "auto",
                  }}
                >
                  Read the summary <ArrowUpRight size={13} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spotlight */}
      <section id="spotlight" style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <p style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(20px, 3vw, 26px)", lineHeight: 1.5, color: "#1B2A4A", fontStyle: "italic" }}>
          "I was diagnosed at five. Testifying in front of legislators who write the rules for my medical foods was the first time I felt like my diagnosis had a seat in the room."
        </p>
        <p style={{ fontSize: 13, color: "#8A8880", marginTop: 20, letterSpacing: "0.03em" }}>Patient advocate, Washington State delegate</p>
      </section>

      {/* CTA */}
      <section style={{ borderTop: "1px solid #E4E0D6", padding: "56px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 24, color: "#1B2A4A", fontWeight: 500, marginBottom: 12 }}>
            Send a letter about a bill that affects you
          </h2>
          <p style={{ fontSize: 14.5, color: "#5A5952", marginBottom: 24 }}>Takes about two minutes. We draft it, you review it, your legislator reads it.</p>
          <button
            onClick={handleSend}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
              fontWeight: 500,
              color: "#FAF8F3",
              background: sent ? "#7A8A6A" : "#1B2A4A",
              padding: "13px 24px",
              borderRadius: 3,
              border: "none",
              cursor: sent ? "default" : "pointer",
            }}
          >
            <Mail size={15} /> {sent ? "Letter counted, thank you" : "Draft my letter"}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" style={{ borderTop: "1px solid #E4E0D6", background: "#1B2A4A", color: "#D8DAE0", padding: "48px 24px 32px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 17, color: "#FAF8F3", marginBottom: 10 }}>AutoimmuneVoices</div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: "#A9ADBB" }}>A nonpartisan advocacy platform for patients navigating autoimmune and chronic disease policy.</p>
          </div>
          <div>
            <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "#7C8199", marginBottom: 12 }}>Explore</div>
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} style={{ display: "block", fontSize: 13.5, color: "#D8DAE0", textDecoration: "none", marginBottom: 8 }}>
                {l.label}
              </a>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "#7C8199", marginBottom: 12 }}>Contact</div>
            <p style={{ fontSize: 13.5, color: "#D8DAE0" }}>hello@autoimmunevoices.org</p>
          </div>
        </div>
        <div style={{ maxWidth: 1120, margin: "40px auto 0", paddingTop: 20, borderTop: "1px solid #2E3B5C", fontSize: 12, color: "#7C8199" }}>
          © 2026 AutoimmuneVoices
        </div>
      </footer>

      <style>{`
        @media (max-width: 720px) {
          .pvc-desktop-nav { display: none !important; }
          .pvc-mobile-toggle { display: block !important; }
        }
      `}</style>
    </div>
  );
}
