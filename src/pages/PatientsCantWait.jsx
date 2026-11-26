import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check, Share2, RotateCcw } from "lucide-react";
import Nav from "../components/Nav";
import { QUESTION_SETS, QUIZ_SOURCES, STORIES } from "../data/pcwContent";

// Patients Can't Wait — AutoimmuneVoices' global patient awareness initiative.
// Matches the Home page: Fraunces + Inter, navy #1B2A4A, gold #A87C2A, cream #FAF8F3.

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');`;

// Paste links here when they exist. Anything left empty is simply hidden.
const LINKS = {
  survey: "", // Patient Voice Report survey (Google Form / Tally)
  commitment: "", // Patient Voice Commitment sign-up
  donate: "https://www.justgiving.com/page/autoimmunevoices",
};

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
  good: "#2F6B45",
  goodBg: "#E8F2EA",
};
const SERIF = "Fraunces, serif";

// ---------- data hooks ----------
function useVisitCount() {
  const [visits, setVisits] = useState(null);
  useEffect(() => {
    let counted = false;
    try {
      counted = sessionStorage.getItem("pcw-counted") === "1";
    } catch {}
    const url = counted ? "/api/counter?key=pcw-visits" : "/api/counter?key=pcw-visits&action=increment";
    fetch(url, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.value === "number") setVisits(d.value);
        try {
          sessionStorage.setItem("pcw-counted", "1");
        } catch {}
      })
      .catch(() => {});
    const poll = setInterval(() => {
      fetch("/api/counter?key=pcw-visits", { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => typeof d.value === "number" && setVisits(d.value))
        .catch(() => {});
    }, 30000);
    return () => clearInterval(poll);
  }, []);
  return visits;
}

function useStats(refreshKey) {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    fetch("/api/counter?pcw=1", { cache: "no-store" })
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
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

// ---------- small pieces ----------
function Eyebrow({ children, light, style }) {
  return (
    <p
      style={{
        fontSize: 13,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: light ? "#D9B66E" : C.gold,
        fontWeight: 500,
        margin: "0 0 14px",
        ...style,
      }}
    >
      {children}
    </p>
  );
}

const btnBase = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontSize: 14.5,
  fontWeight: 500,
  padding: "13px 22px",
  borderRadius: 3,
  textDecoration: "none",
  fontFamily: "Inter, sans-serif",
  cursor: "pointer",
  border: "none",
};
const btn = {
  solid: { ...btnBase, color: C.cream, background: C.navy },
  outline: { ...btnBase, color: C.navy, background: "transparent", border: `1px solid ${C.borderDark}` },
  light: { ...btnBase, color: C.navy, background: C.cream },
  disabled: { ...btnBase, color: C.cream, background: C.navy, opacity: 0.35, cursor: "not-allowed" },
};

function Progress({ step, total, label }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: C.faint, marginBottom: 8 }}>
        <span style={{ letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
        <span>
          {step} of {total}
        </span>
      </div>
      <div style={{ height: 3, background: C.border, borderRadius: 2 }}>
        <div
          style={{
            width: `${(step / total) * 100}%`,
            height: 3,
            background: C.gold,
            borderRadius: 2,
            transition: "width 300ms ease",
          }}
        />
      </div>
    </div>
  );
}

// One question per screen. No right/wrong shown until the end, so the before-score is clean.
function Quiz({ questions, label, onDone }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [answers, setAnswers] = useState([]);
  const q = questions[i];

  const next = () => {
    const all = [...answers, picked];
    if (i + 1 < questions.length) {
      setAnswers(all);
      setI(i + 1);
      setPicked(null);
    } else {
      onDone(all);
    }
  };

  return (
    <div>
      <Progress step={i + 1} total={questions.length} label={label} />
      <h3 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(22px, 2.6vw, 28px)", lineHeight: 1.25, color: C.navy, margin: "0 0 24px" }}>
        {q.q}
      </h3>
      <div role="radiogroup" aria-label={q.q} style={{ display: "grid", gap: 10 }}>
        {q.options.map((opt, idx) => {
          const on = picked === idx;
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setPicked(idx)}
              style={{
                textAlign: "left",
                padding: "15px 18px",
                fontSize: 15.5,
                fontFamily: "Inter, sans-serif",
                color: on ? C.cream : C.text,
                background: on ? C.navy : C.white,
                border: `1px solid ${on ? C.navy : C.border}`,
                borderRadius: 3,
                cursor: "pointer",
                transition: "background 150ms ease",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
        <button type="button" onClick={next} disabled={picked === null} style={picked === null ? btn.disabled : btn.solid}>
          {i + 1 < questions.length ? "Next" : "Done"} <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

function StoryScreen({ story, index, onNext }) {
  const [choice, setChoice] = useState(null);
  return (
    <div>
      <Progress step={index + 1} total={STORIES.length} label="Three real stories" />
      <Eyebrow>
        Story {index + 1} · {story.theme}
      </Eyebrow>
      <h3 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(24px, 3vw, 32px)", color: C.navy, margin: "0 0 6px" }}>
        Living with {story.condition}
      </h3>
      <p style={{ fontSize: 13, color: C.faint, margin: "0 0 24px" }}>{story.where}</p>

      <div style={{ borderLeft: `2px solid ${C.gold}`, paddingLeft: 22 }}>
        {story.paragraphs.map((p, i) => (
          <p key={i} style={{ fontFamily: SERIF, fontSize: 17.5, lineHeight: 1.65, color: C.text, margin: "0 0 16px" }}>
            {p}
          </p>
        ))}
      </div>

      <div style={{ background: C.sand, borderRadius: 3, padding: "16px 20px", margin: "24px 0", fontSize: 14.5, color: C.muted }}>
        <strong style={{ color: C.navy, fontWeight: 600 }}>The myth they heard: </strong>
        {story.myth}
      </div>

      <p style={{ fontSize: 16, fontWeight: 600, color: C.navy, margin: "0 0 12px" }}>{story.choice.prompt}</p>
      <div style={{ display: "grid", gap: 10 }}>
        {story.choice.options.map((o, i) => {
          const on = choice === i;
          return (
            <button
              key={o.label}
              type="button"
              onClick={() => setChoice(i)}
              aria-pressed={on}
              style={{
                textAlign: "left",
                padding: "14px 18px",
                fontSize: 15,
                fontFamily: "Inter, sans-serif",
                color: on ? C.cream : C.text,
                background: on ? C.navy : C.white,
                border: `1px solid ${on ? C.navy : C.border}`,
                borderRadius: 3,
                cursor: "pointer",
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>

      {choice !== null && (
        <div style={{ marginTop: 20 }} aria-live="polite">
          <p style={{ fontSize: 15, lineHeight: 1.6, color: C.muted, margin: "0 0 18px" }}>{story.choice.options[choice].feedback}</p>
          <div style={{ border: `1px solid ${C.border}`, background: C.white, borderRadius: 3, padding: "18px 20px" }}>
            <Eyebrow style={{ marginBottom: 8 }}>Did you know</Eyebrow>
            <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0 }}>{story.fact}</p>
          </div>
          <p style={{ fontFamily: SERIF, fontSize: 19, color: C.navy, margin: "22px 0 0" }}>{story.takeaway}</p>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
            <button type="button" onClick={onNext} style={btn.solid}>
              {index + 1 < STORIES.length ? "Next story" : "See what you learned"} <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function score(questions, answers) {
  return answers.reduce((n, a, i) => n + (a === questions[i].answer ? 1 : 0), 0);
}

function Results({ preSet, postSet, preAnswers, postAnswers, chapter, onRestart }) {
  const pre = score(preSet, preAnswers);
  const post = score(postSet, postAnswers);
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/patients-cant-wait${chapter ? `?ch=${chapter}` : ""}`;

  const share = async () => {
    const text = `I just learned what millions of people with autoimmune diseases live with. Take 8 minutes: ${shareUrl}`;
    try {
      if (navigator.share) await navigator.share({ title: "Patients Can't Wait", text, url: shareUrl });
      else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
      }
    } catch {}
  };

  return (
    <div>
      <Eyebrow>Your results</Eyebrow>
      <h3 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(26px, 3.4vw, 36px)", color: C.navy, margin: "0 0 24px", lineHeight: 1.2 }}>
        {post > pre ? "You know more than you did 8 minutes ago." : "Thank you for listening."}
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12, maxWidth: 420 }}>
        {[
          ["Before", pre],
          ["After", post],
        ].map(([label, n]) => (
          <div key={label} style={{ background: label === "After" ? C.navy : C.white, color: label === "After" ? C.cream : C.navy, border: `1px solid ${label === "After" ? C.navy : C.border}`, borderRadius: 3, padding: "18px 20px" }}>
            <div style={{ fontSize: 12.5, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.75 }}>{label}</div>
            <div style={{ fontFamily: SERIF, fontSize: 40, fontWeight: 500 }}>
              {n}
              <span style={{ fontSize: 20, opacity: 0.6 }}>/5</span>
            </div>
          </div>
        ))}
      </div>

      <h4 style={{ fontSize: 15, fontWeight: 600, color: C.navy, margin: "32px 0 12px" }}>The answers</h4>
      <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 12 }}>
        {postSet.map((q, i) => (
          <li key={q.q} style={{ fontSize: 14.5, lineHeight: 1.55, color: C.muted }}>
            <span style={{ color: C.text }}>{q.q}</span>{" "}
            <strong style={{ color: C.good, fontWeight: 600 }}>{q.options[q.answer]}.</strong> {q.why}
            {postAnswers[i] === q.answer && (
              <Check size={14} style={{ color: C.good, marginLeft: 6, verticalAlign: "-2px" }} aria-label="You got this one" />
            )}
          </li>
        ))}
      </ol>
      <p style={{ fontSize: 12.5, color: C.faint, margin: "14px 0 0" }}>
        Sources:{" "}
        {QUIZ_SOURCES.map((s, i) => (
          <React.Fragment key={s.url}>
            {i > 0 && " · "}
            <a href={s.url} target="_blank" rel="noreferrer" style={{ color: C.gold }}>
              {s.label}
            </a>
          </React.Fragment>
        ))}
      </p>

      <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 32, paddingTop: 28 }}>
        <h4 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 24, color: C.navy, margin: "0 0 16px" }}>Now do one thing</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          <button type="button" onClick={share} style={{ ...btn.solid, justifyContent: "space-between" }}>
            {copied ? "Link copied" : "Send it to 3 friends"} <Share2 size={15} />
          </button>
          <Link to="/patients-cant-wait/care-package" style={{ ...btn.outline, justifyContent: "space-between" }}>
            Get or share a care package <ArrowRight size={15} />
          </Link>
          {LINKS.survey && (
            <a href={LINKS.survey} target="_blank" rel="noreferrer" style={{ ...btn.outline, justifyContent: "space-between" }}>
              Share your experience <ArrowUpRight size={15} />
            </a>
          )}
          <a href={LINKS.donate} target="_blank" rel="noreferrer" style={{ ...btn.outline, justifyContent: "space-between" }}>
            Give to patient advocacy <ArrowUpRight size={15} />
          </a>
        </div>
        <button type="button" onClick={onRestart} style={{ ...btnBase, background: "none", color: C.faint, padding: "18px 0 0", fontSize: 13 }}>
          <RotateCcw size={13} /> Start over
        </button>
      </div>
    </div>
  );
}

// ---------- the experience ----------
function Experience({ chapter, onComplete, startSignal }) {
  // Half of people get set A first, half get B first, so neither set being easier skews the results.
  const order = useMemo(() => (Math.random() < 0.5 ? "AB" : "BA"), []);
  const preSet = QUESTION_SETS[order[0]];
  const postSet = QUESTION_SETS[order[1]];

  const [stage, setStage] = useState("intro"); // intro | pre | story-0..2 | post | results
  const [preAnswers, setPreAnswers] = useState([]);
  const [postAnswers, setPostAnswers] = useState([]);
  const top = useRef(null);

  const go = (s) => {
    setStage(s);
    requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  useEffect(() => {
    if (startSignal) go("pre");
  }, [startSignal]);

  const finish = (answers) => {
    setPostAnswers(answers);
    go("results");
    const pre = score(preSet, preAnswers);
    const post = score(postSet, answers);
    fetch("/api/counter?pcw=1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete", pre, post, order, ch: chapter }),
    })
      .then(() => onComplete?.())
      .catch(() => {});
  };

  return (
    <div ref={top} style={{ scrollMarginTop: 24 }}>
      {stage === "intro" && (
        <div style={{ textAlign: "center", padding: "12px 0" }}>
          <Eyebrow>The experience</Eyebrow>
          <h3 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(26px, 3.4vw, 36px)", color: C.navy, margin: "0 0 14px" }}>
            8 minutes. 3 real stories.
          </h3>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: C.muted, maxWidth: 520, margin: "0 auto 28px" }}>
            Five quick questions, three patients in their own words, then five new questions to see what you learned. No
            sign-up. Nothing personal is collected.
          </p>
          <button type="button" onClick={() => go("pre")} style={btn.solid}>
            Start now <ArrowRight size={15} />
          </button>
        </div>
      )}
      {stage === "pre" && (
        <Quiz
          questions={preSet}
          label="Test what you know"
          onDone={(a) => {
            setPreAnswers(a);
            go("story-0");
          }}
        />
      )}
      {stage.startsWith("story-") &&
        (() => {
          const idx = Number(stage.split("-")[1]);
          return (
            <StoryScreen
              key={idx}
              story={STORIES[idx]}
              index={idx}
              onNext={() => go(idx + 1 < STORIES.length ? `story-${idx + 1}` : "post")}
            />
          );
        })()}
      {stage === "post" && <Quiz questions={postSet} label="See what you learned" onDone={finish} />}
      {stage === "results" && (
        <Results
          preSet={preSet}
          postSet={postSet}
          preAnswers={preAnswers}
          postAnswers={postAnswers}
          chapter={chapter}
          onRestart={() => {
            setPreAnswers([]);
            setPostAnswers([]);
            go("intro");
          }}
        />
      )}
    </div>
  );
}

// ---------- page ----------
export default function PatientsCantWait() {
  const [params] = useSearchParams();
  const chapter = (params.get("ch") || "").replace(/[^A-Za-z0-9-]/g, "").slice(0, 24) || null;

  const [refreshKey, setRefreshKey] = useState(0);
  const [startSignal, setStartSignal] = useState(0);
  const visits = useVisitCount();
  const shownVisits = useCountUp(visits);
  const stats = useStats(refreshKey);

  const stat = (v, suffix = "") => (v === null || v === undefined ? "—" : `${v.toLocaleString()}${suffix}`);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: C.text, background: C.cream }}>
      <style>{FONT_IMPORT}</style>
      <Nav />

      {/* Initiative strip */}
      <div style={{ background: C.navy, color: C.cream }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "10px 24px", display: "flex", flexWrap: "wrap", gap: "6px 20px", justifyContent: "space-between", fontSize: 13.5 }}>
          <span style={{ fontWeight: 500 }}>Patients Can't Wait · an AutoimmuneVoices initiative</span>
          <span style={{ color: C.borderDark }}>Online · free · join from anywhere</span>
        </div>
      </div>

      {/* Hero */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 24px 56px", display: "flex", flexWrap: "wrap", gap: 48, alignItems: "center" }}>
        <div style={{ flex: "999 1 520px", minWidth: 0 }}>
          <Eyebrow>AutoimmuneVoices presents</Eyebrow>
          <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(40px, 6vw, 68px)", lineHeight: 1.02, color: C.navy, letterSpacing: "-0.015em", margin: 0 }}>
            Patients can't wait.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: C.muted, maxWidth: 560, marginTop: 24 }}>
            Millions of people live with autoimmune diseases, often for years before anyone believes them. Spend 8 minutes
            hearing three of their stories, and see how much you learn.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 32, flexWrap: "wrap" }}>
            <button type="button" onClick={() => setStartSignal((n) => n + 1)} style={btn.solid}>
              Start now <ArrowRight size={15} />
            </button>
            <Link to="/patients-cant-wait/care-package" style={btn.outline}>
              Free care packages
            </Link>
          </div>
        </div>

        <div aria-live="polite" style={{ flex: "1 1 320px", background: C.navy, color: C.cream, borderRadius: 4, padding: "32px 32px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: "#8FD19E" }} aria-hidden="true" />
            <span style={{ fontSize: 12.5, letterSpacing: "0.08em", textTransform: "uppercase", color: C.borderDark }}>Live</span>
          </div>
          <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: "clamp(48px, 6vw, 64px)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
            {visits === null ? "—" : shownVisits.toLocaleString()}
          </div>
          <p style={{ fontSize: 15, color: "#D8D4C6", margin: "10px 0 0" }}>people have stopped by to listen</p>
          <div style={{ height: 1, background: "rgba(250,248,243,0.18)", margin: "22px 0 18px" }} />
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "#D8D4C6", margin: 0 }}>
            You're one of them. Every completed experience shows patients they're being heard.
          </p>
        </div>
      </section>

      {/* Live numbers */}
      <section style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24 }}>
          {[
            [stat(stats?.completions), "Experiences completed"],
            [stats?.avgGain === null || stats?.avgGain === undefined ? "—" : `${stats.avgGain > 0 ? "+" : ""}${stats.avgGain} pts`, "Average knowledge gain"],
            [stat(stats?.packagesOpened), "Care packages delivered"],
            ["3", "Patient stories"],
          ].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: SERIF, fontSize: 32, color: C.navy, fontWeight: 500 }}>{n}</div>
              <div style={{ fontSize: 13, color: C.faint, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* The experience */}
      <section id="experience" style={{ background: C.sand, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px" }}>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 4, padding: "clamp(24px, 5vw, 48px)" }}>
            <Experience chapter={chapter} startSignal={startSignal} onComplete={() => setRefreshKey((k) => k + 1)} />
          </div>
        </div>
      </section>

      {/* Care packages */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 48, alignItems: "center" }}>
          <div style={{ flex: "1 1 420px" }}>
            <Eyebrow>Free · for patients and families</Eyebrow>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3.4vw, 38px)", lineHeight: 1.12, color: C.navy, fontWeight: 500, margin: 0 }}>
              Just diagnosed? You don't have to figure it out alone.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: C.muted, margin: "18px 0 28px", maxWidth: 480 }}>
              A free digital care package for your condition: a welcome letter, a starter guide, questions for your doctor, a
              flare-day plan, a school or work letter, and advice from people who've been there.
            </p>
            <Link to="/patients-cant-wait/care-package" style={btn.solid}>
              Open a care package <ArrowRight size={15} />
            </Link>
          </div>
          <ul style={{ flex: "1 1 420px", listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
            {["A welcome letter", "Starter guide", "Questions for your doctor", "Your flare-day plan", "School or work letter", "Advice from patients"].map((item, i) => (
              <li key={item} style={{ background: i === 0 ? C.navy : C.white, color: i === 0 ? C.cream : C.text, border: `1px solid ${i === 0 ? C.navy : C.border}`, borderRadius: 3, padding: "16px 18px", fontSize: 14.5 }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Patient Voice Commitment + survey */}
      <section style={{ borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "72px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 4, padding: 28 }}>
            <Eyebrow>The Patient Voice Commitment</Eyebrow>
            <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 500, color: C.navy, margin: "0 0 12px" }}>
              We're asking healthcare organizations to make three promises
            </h3>
            <ol style={{ margin: "0 0 22px", paddingLeft: 20, fontSize: 14.5, lineHeight: 1.65, color: C.muted }}>
              <li>
                <strong style={{ color: C.text }}>Read</strong> the Patient Voice Report.
              </li>
              <li>
                <strong style={{ color: C.text }}>Listen</strong> to patients directly.
              </li>
              <li>
                <strong style={{ color: C.text }}>Act</strong> on one thing patients told them.
              </li>
            </ol>
            {LINKS.commitment && (
              <a href={LINKS.commitment} target="_blank" rel="noreferrer" style={btn.outline}>
                Add your name <ArrowUpRight size={15} />
              </a>
            )}
          </div>
          {LINKS.survey && (
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 4, padding: 28 }}>
              <Eyebrow>For patients and parents · 5 min · anonymous</Eyebrow>
              <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 500, color: C.navy, margin: "0 0 10px" }}>Add your voice to the Patient Voice Report</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.65, color: C.muted, margin: "0 0 22px" }}>
                How long did diagnosis take? Were you believed? Your answers go to the healthcare organizations we meet.
              </p>
              <a href={LINKS.survey} target="_blank" rel="noreferrer" style={btn.solid}>
                Share my experience <ArrowUpRight size={15} />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Give */}
      <section style={{ background: C.navy, color: C.cream }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "56px 24px", display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ flex: "1 1 460px" }}>
            <Eyebrow light>Give</Eyebrow>
            <h2 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 500, margin: 0 }}>Support patient advocacy with the Autoimmune Association</h2>
          </div>
          <a href={LINKS.donate} target="_blank" rel="noreferrer" style={btn.light}>
            Donate on JustGiving <ArrowUpRight size={15} />
          </a>
        </div>
      </section>

      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "32px 24px 48px", fontSize: 13, color: C.faint }}>
        Patients Can't Wait is run by AutoimmuneVoices chapters in 10 countries. Stories are shared with permission from the
        AutoimmuneVoices Collective. Nonpartisan.{" "}
        <Link to="/impact" style={{ color: C.gold }}>
          See our impact
        </Link>
      </section>
    </div>
  );
}
