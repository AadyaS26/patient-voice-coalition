import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Printer, Copy, Check, Heart } from "lucide-react";
import Nav from "../components/Nav";
import { CONDITIONS, ADVICE_QUOTES, DOCTOR_QUESTIONS, COMMUNITIES } from "../data/pcwContent";

// Free digital care package, part of Patients Can't Wait.
// Partners can hand out a direct link for a condition, e.g. /patients-cant-wait/care-package?c=celiac
// Nothing typed on this page leaves the browser. Only "a package was opened" and the 1–5 rating are counted.

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');`;
const PRINT_CSS = `@media print { header, .no-print { display: none !important; } body { background: #fff !important; } .pkg-section { break-inside: avoid; border: none !important; } }`;

const C = {
  navy: "#1B2A4A",
  gold: "#A87C2A",
  cream: "#FAF8F3",
  sand: "#F3EFE6",
  text: "#2B2A28",
  muted: "#5A5952",
  faint: "#6B6A64",
  border: "#E4E0D6",
  borderDark: "#C9C4B4",
  white: "#FFFFFF",
};
const SERIF = "Fraunces, serif";

const btn = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontSize: 14,
  fontWeight: 500,
  padding: "11px 18px",
  borderRadius: 3,
  textDecoration: "none",
  fontFamily: "Inter, sans-serif",
  cursor: "pointer",
  border: `1px solid ${C.borderDark}`,
  background: "transparent",
  color: C.navy,
};
const input = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 12px",
  fontSize: 15,
  fontFamily: "Inter, sans-serif",
  border: `1px solid ${C.borderDark}`,
  borderRadius: 3,
  background: C.white,
  color: C.text,
};

function useStats(refreshKey) {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    fetch("/api/pcw", { cache: "no-store" })
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
    const poll = setInterval(() => {
      fetch("/api/pcw", { cache: "no-store" })
        .then((r) => r.json())
        .then(setStats)
        .catch(() => {});
    }, 30000);
    return () => clearInterval(poll);
  }, [refreshKey]);
  return stats;
}

function useCountUp(target, duration = 1400) {
  const [shown, setShown] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    if (typeof target !== "number") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(target);
      from.current = target;
      return;
    }
    const begin = from.current;
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setShown(Math.round(begin + (target - begin) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
      else from.current = target;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return shown;
}

// Live counter: total packages opened, helpfulness, and a breakdown by condition.
function PackageCounter({ stats }) {
  const total = stats?.packagesOpened;
  const shown = useCountUp(typeof total === "number" ? total : null);
  const by = stats?.packagesByCondition || {};
  const rows = CONDITIONS.map((c) => ({ ...c, n: by[c.id] || 0 })).sort((a, b) => b.n - a.n);
  const max = Math.max(1, ...rows.map((r) => r.n));

  return (
    <div aria-live="polite" style={{ background: C.navy, color: C.cream, borderRadius: 4, padding: "clamp(24px, 4vw, 36px)", display: "flex", flexWrap: "wrap", gap: 32 }}>
      <div style={{ flex: "1 1 240px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span style={{ width: 8, height: 8, borderRadius: 99, background: "#8FD19E" }} aria-hidden="true" />
          <span style={{ fontSize: 12.5, letterSpacing: "0.08em", textTransform: "uppercase", color: C.borderDark }}>Live</span>
        </div>
        <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(52px, 7vw, 72px)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
          {typeof total === "number" ? shown.toLocaleString() : "—"}
        </div>
        <p style={{ fontSize: 15, color: "#D8D4C6", margin: "10px 0 0" }}>care packages delivered and opened</p>
        {stats?.helpfulCount > 0 && (
          <p style={{ fontSize: 14, color: "#D8D4C6", margin: "18px 0 0" }}>
            <span style={{ fontFamily: SERIF, fontSize: 24, color: C.cream }}>{stats.helpfulAvg}</span>
            <span style={{ opacity: 0.8 }}> / 5 helpful</span>
            <span style={{ display: "block", fontSize: 12.5, opacity: 0.7, marginTop: 2 }}>
              from {stats.helpfulCount.toLocaleString()} {stats.helpfulCount === 1 ? "rating" : "ratings"}
            </span>
          </p>
        )}
      </div>
      <div style={{ flex: "2 1 320px", display: "grid", gap: 10, alignContent: "center" }}>
        {rows.map((r) => (
          <div key={r.id} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "4px 12px", fontSize: 13.5 }}>
            <span style={{ color: "#D8D4C6" }}>{r.name}</span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{r.n.toLocaleString()}</span>
            <div style={{ gridColumn: "1 / -1", height: 4, background: "rgba(250,248,243,0.12)", borderRadius: 2 }}>
              <div style={{ width: `${(r.n / max) * 100}%`, height: 4, background: "#D9B66E", borderRadius: 2, transition: "width 600ms ease" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const FLARE_FIELDS = [
  ["signs", "My early warning signs", "e.g., more tired than usual, joint stiffness in the morning"],
  ["helps", "What helps me", "e.g., rest, heat pack, my prescribed plan, quiet"],
  ["avoid", "What makes it worse", "e.g., skipping meals, late nights, heat"],
  ["call", "Who I call, and when", "e.g., my doctor's office if a fever lasts more than a day"],
  ["tell", "What I tell school or work", "e.g., I may need to rest and catch up later"],
];

const ACCOMMODATIONS = [
  "Rest breaks when I need them",
  "Flexible deadlines during flares",
  "Access to a restroom without asking",
  "Permission to eat, drink or take medication when needed",
  "Excused time for medical appointments",
  "Remote work or remote learning on flare days",
];

function Section({ n, title, children, lead }) {
  return (
    <section className="pkg-section" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 4, padding: "clamp(22px, 4vw, 36px)" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontFamily: SERIF, fontSize: 15, color: C.gold }}>{String(n).padStart(2, "0")}</span>
        <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(22px, 2.6vw, 28px)", color: C.navy, margin: 0 }}>{title}</h2>
      </div>
      {lead && <p style={{ fontSize: 15, lineHeight: 1.6, color: C.muted, margin: "0 0 20px" }}>{lead}</p>}
      {children}
    </section>
  );
}

function Picker({ onPick, stats }) {
  return (
    <div>
      <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: C.gold, fontWeight: 500, margin: "0 0 14px" }}>
        Free · private · nothing to sign up for
      </p>
      <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(34px, 5vw, 54px)", lineHeight: 1.05, color: C.navy, margin: 0 }}>
        Your care package
      </h1>
      <p style={{ fontSize: 17, lineHeight: 1.65, color: C.muted, maxWidth: 560, margin: "20px 0 32px" }}>
        For anyone newly diagnosed, or anyone caring for someone who is. Pick a condition and your package opens right here.
        You can print it or save it as a PDF.
      </p>
      <div style={{ marginBottom: 36 }}>
        <PackageCounter stats={stats} />
      </div>
      <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 24, color: C.navy, margin: "0 0 16px" }}>Choose a condition</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
        {CONDITIONS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onPick(c.id)}
            style={{ textAlign: "left", padding: "18px 20px", fontSize: 15.5, fontFamily: "Inter, sans-serif", color: C.navy, background: C.white, border: `1px solid ${C.border}`, borderRadius: 3, cursor: "pointer" }}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function AccommodationLetter({ condition }) {
  const [name, setName] = useState("");
  const [to, setTo] = useState("");
  const [needs, setNeeds] = useState([ACCOMMODATIONS[0], ACCOMMODATIONS[1]]);
  const [copied, setCopied] = useState(false);

  const toggle = (a) => setNeeds((cur) => (cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a]));

  const letter = `Dear ${to || "[teacher, professor or manager]"},

I'm writing to let you know that I live with ${condition.name.toLowerCase()}, a long-term condition. Most days I can participate fully, but symptoms can change without warning, and some of them can't be seen.

To help me do my best work, I'd like to ask for the following:
${needs.map((n) => `- ${n}`).join("\n") || "- [what would help]"}

I'm happy to talk about what this looks like in practice, and I can share a note from my doctor if needed.

Thank you for your understanding,
${name || "[your name]"}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
      <div className="no-print" style={{ flex: "1 1 260px", display: "grid", gap: 14, alignContent: "start" }}>
        <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 500 }}>
          Your name
          <input value={name} onChange={(e) => setName(e.target.value)} style={input} />
        </label>
        <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 500 }}>
          Who it's for
          <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="e.g., Ms. Rivera" style={input} />
        </label>
        <fieldset style={{ border: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
          <legend style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>What would help</legend>
          {ACCOMMODATIONS.map((a) => (
            <label key={a} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: C.muted, cursor: "pointer" }}>
              <input type="checkbox" checked={needs.includes(a)} onChange={() => toggle(a)} style={{ marginTop: 3 }} />
              {a}
            </label>
          ))}
        </fieldset>
      </div>
      <div style={{ flex: "2 1 360px" }}>
        <pre style={{ whiteSpace: "pre-wrap", fontFamily: SERIF, fontSize: 15.5, lineHeight: 1.65, color: C.text, background: C.cream, border: `1px solid ${C.border}`, borderRadius: 3, padding: 24, margin: 0 }}>
          {letter}
        </pre>
        <button type="button" onClick={copy} className="no-print" style={{ ...btn, marginTop: 12 }}>
          {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Copied" : "Copy the letter"}
        </button>
      </div>
    </div>
  );
}

function Rating() {
  const [rated, setRated] = useState(null);
  const rate = (n) => {
    if (rated) return;
    setRated(n);
    fetch("/api/pcw", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "rate", rating: n }) }).catch(() => {});
  };
  return (
    <div className="no-print" style={{ textAlign: "center", padding: "36px 0 8px" }}>
      <p style={{ fontFamily: SERIF, fontSize: 22, color: C.navy, margin: "0 0 16px" }}>{rated ? "Thank you. That helps us make these better." : "Was this care package helpful?"}</p>
      {!rated && (
        <div style={{ display: "inline-flex", gap: 8 }} role="group" aria-label="Rate from 1 to 5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => rate(n)} aria-label={`${n} out of 5`} style={{ width: 48, height: 48, fontSize: 16, fontFamily: "Inter, sans-serif", border: `1px solid ${C.borderDark}`, borderRadius: 3, background: C.white, color: C.navy, cursor: "pointer" }}>
              {n}
            </button>
          ))}
        </div>
      )}
      {!rated && <p style={{ fontSize: 12.5, color: C.faint, marginTop: 10 }}>1 = not helpful · 5 = very helpful</p>}
    </div>
  );
}

function Package({ condition, onBack, myNumber }) {
  const [flare, setFlare] = useState({});
  const [checked, setChecked] = useState([]);
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/patients-cant-wait/care-package?c=${condition.id}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div className="no-print" style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "space-between", alignItems: "center" }}>
        <button type="button" onClick={onBack} style={{ ...btn, border: "none", padding: "8px 0", color: C.faint }}>
          <ArrowLeft size={15} /> Choose a different condition
        </button>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" onClick={copyLink} style={btn}>
            {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Link copied" : "Share this package"}
          </button>
          <button type="button" onClick={() => window.print()} style={{ ...btn, background: C.navy, color: C.cream, border: `1px solid ${C.navy}` }}>
            <Printer size={15} /> Print or save as PDF
          </button>
        </div>
      </div>

      {/* Cover */}
      <div style={{ background: C.navy, color: C.cream, borderRadius: 4, padding: "clamp(28px, 5vw, 52px)" }}>
        <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#D9B66E", margin: "0 0 14px" }}>
          Patients Can't Wait · Care package
        </p>
        <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.05, margin: 0 }}>For you, and {condition.name.toLowerCase()}</h1>
        <p style={{ fontSize: 16, lineHeight: 1.65, color: "#D8D4C6", maxWidth: 560, margin: "18px 0 0" }}>
          Seven things to help with the first weeks and months. Take them one at a time. There's no rush.
        </p>
        {typeof myNumber === "number" && (
          <p style={{ fontSize: 14, color: "#D9B66E", margin: "22px 0 0" }}>
            You're one of {myNumber.toLocaleString()} people who have received a Patients Can't Wait care package.
          </p>
        )}
      </div>

      <Section n={1} title="A letter for you">
        <div style={{ background: C.cream, border: `1px solid ${C.border}`, borderRadius: 3, padding: "clamp(22px, 4vw, 36px)", fontFamily: SERIF, fontSize: 17, lineHeight: 1.75, color: C.text }}>
          <p style={{ margin: "0 0 14px" }}>Hi,</p>
          <p style={{ margin: "0 0 14px" }}>
            If you're reading this, you've probably just heard the name of a condition you'll live with for a long time. Maybe
            it took years to get here. Maybe someone told you it was stress, or in your head. Maybe you're relieved to finally
            have an answer, and scared of it at the same time. All of that is normal.
          </p>
          <p style={{ margin: "0 0 14px" }}>
            We're a community of people who live with autoimmune diseases, and the people who love us. Every one of us
            remembers the beginning. It gets more manageable. You'll learn your body's signals, find the people who get it,
            and build routines that work for you.
          </p>
          <p style={{ margin: "0 0 14px" }}>You don't have to figure it out alone. This package is a start.</p>
          <p style={{ margin: 0 }}>
            With care,
            <br />
            Your friends at AutoimmuneVoices
          </p>
        </div>
      </Section>

      <Section n={2} title={`Starter guide: ${condition.name}`} lead="The basics, in plain language. Your care team knows your situation best, so bring your questions to them.">
        <ul style={{ margin: "0 0 20px", paddingLeft: 20, display: "grid", gap: 10, fontSize: 15.5, lineHeight: 1.6 }}>
          {condition.basics.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <a href={condition.org.url} target="_blank" rel="noreferrer" style={{ ...btn, borderColor: C.border }}>
          Learn more from the {condition.org.name} <ArrowUpRight size={15} />
        </a>
      </Section>

      <Section n={3} title="Questions to ask your doctor" lead="Tick the ones you want to ask, then print this page or screenshot it before your next appointment.">
        <div style={{ display: "grid", gap: 8 }}>
          {DOCTOR_QUESTIONS.map((q) => {
            const on = checked.includes(q);
            return (
              <label key={q} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", border: `1px solid ${on ? C.navy : C.border}`, borderRadius: 3, cursor: "pointer", fontSize: 15, background: on ? C.cream : C.white }}>
                <input type="checkbox" checked={on} onChange={() => setChecked((cur) => (on ? cur.filter((x) => x !== q) : [...cur, q]))} style={{ marginTop: 3 }} />
                {q}
              </label>
            );
          })}
        </div>
      </Section>

      <Section n={4} title="Your flare-day plan" lead="Fill this in on a good day, so it's ready on a hard one. It stays on your device, and it prints with the rest of the package.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          {FLARE_FIELDS.map(([key, label, ph]) => (
            <label key={key} style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 500 }}>
              {label}
              <textarea rows={3} value={flare[key] || ""} placeholder={ph} onChange={(e) => setFlare((f) => ({ ...f, [key]: e.target.value }))} style={{ ...input, resize: "vertical", lineHeight: 1.5 }} />
            </label>
          ))}
        </div>
      </Section>

      <Section n={5} title="A letter for school or work" lead="Fill in the blanks and choose what would help. You decide how much to share about your condition.">
        <AccommodationLetter condition={condition} />
      </Section>

      <Section n={6} title="From people who've been there" lead="Advice from people who shared their stories with the AutoimmuneVoices Collective.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          {ADVICE_QUOTES.map((a) => (
            <figure key={a.text} style={{ margin: 0, background: C.sand, borderRadius: 3, padding: 22 }}>
              <blockquote style={{ margin: "0 0 12px", fontFamily: SERIF, fontSize: 16.5, lineHeight: 1.55, color: C.navy }}>“{a.text}”</blockquote>
              <figcaption style={{ fontSize: 13, color: C.faint }}>{a.who}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section n={7} title="Where to find your people">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {[condition.org, ...COMMUNITIES.filter((c) => c.name !== condition.org.name)].map((c) =>
            c.url.startsWith("/") ? (
              <Link key={c.name} to={c.url} style={btn}>
                {c.name}
              </Link>
            ) : (
              <a key={c.name} href={c.url} target="_blank" rel="noreferrer" style={btn}>
                {c.name} <ArrowUpRight size={15} />
              </a>
            )
          )}
        </div>
      </Section>

      <Rating />
      <p style={{ fontSize: 12.5, color: C.faint, textAlign: "center", margin: 0 }}>
        This package is for support and information, not medical advice. Always follow your own care team's guidance.
      </p>
    </div>
  );
}

export default function CarePackage() {
  const [params, setParams] = useSearchParams();
  const conditionId = params.get("c");
  const condition = useMemo(() => CONDITIONS.find((c) => c.id === conditionId) || null, [conditionId]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [myNumber, setMyNumber] = useState(null);
  const stats = useStats(refreshKey);

  // Count each condition's package once per browser session.
  useEffect(() => {
    if (!condition) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    const flag = `pcw-pkg-${condition.id}`;
    try {
      const saved = sessionStorage.getItem(flag);
      if (saved) {
        setMyNumber(Number(saved) || null);
        return;
      }
      sessionStorage.setItem(flag, "1");
    } catch {}
    fetch("/api/pcw", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "package", condition: condition.id }) })
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.total === "number") {
          setMyNumber(d.total);
          try {
            sessionStorage.setItem(flag, String(d.total));
          } catch {}
        }
        setRefreshKey((k) => k + 1);
      })
      .catch(() => {});
  }, [condition]);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: C.text, background: C.cream, minHeight: "100vh" }}>
      <style>{FONT_IMPORT + PRINT_CSS}</style>
      <Nav />
      <div className="no-print" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "14px 24px", fontSize: 13.5 }}>
          <Link to="/patients-cant-wait" style={{ color: C.gold, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <ArrowLeft size={14} /> Patients Can't Wait
          </Link>
        </div>
      </div>
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "56px 24px 80px" }}>
        {condition ? (
          <Package condition={condition} myNumber={myNumber} onBack={() => setParams({})} />
        ) : (
          <Picker stats={stats} onPick={(id) => setParams({ c: id })} />
        )}
        {!condition && (
          <p style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: C.faint, marginTop: 36 }}>
            <Heart size={14} style={{ color: C.gold }} /> Supporting someone? Open their condition and use “Share this package” to send it.
          </p>
        )}
      </main>
    </div>
  );
}
