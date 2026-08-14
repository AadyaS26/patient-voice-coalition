import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import ReachMap from "../components/ReachMap";
import { HeartHandshake, Lightbulb, ArrowRight } from "lucide-react";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');`;

const CURATED_BILLS = 212;
const CONDITIONS_COVERED = 146;
const INSTAGRAM_REACH = 25620;
const COUNTRIES_REACHED = 43;

// Real community partner orgs — logos live in public/partner-logos/,
// uploaded directly on GitHub the same way chapter photos are.
const PARTNERS = [
  { name: "RAFA Autoimmune Wellness", url: "https://myrafa.app/", logo: "/partner-logos/rafa.jpg" },
  { name: "T1D ASU", url: "https://www.instagram.com/asudiabeteslink/", logo: "/partner-logos/t1d-asu.jpg" },
  { name: "Autoimmune Atlas", url: "https://solsticestrategies.net/autoimmuneatlas/", logo: "/partner-logos/autoimmune-atlas.jpg" },
];

function CountUp({ value }) {
  const ref = React.useRef(null);
  const [display, setDisplay] = useState(typeof value === "number" ? 0 : value);
  const hasAnimated = React.useRef(false);

  React.useEffect(() => {
    if (typeof value !== "number") {
      setDisplay(value);
      return;
    }
    const node = ref.current;
    if (!node || hasAnimated.current) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            if (reduceMotion) {
              setDisplay(value);
            } else {
              const duration = 1200;
              const start = performance.now();
              const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                setDisplay(Math.floor(eased * value));
                if (progress < 1) requestAnimationFrame(tick);
                else setDisplay(value);
              };
              requestAnimationFrame(tick);
            }
            observer.unobserve(node);
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{typeof display === "number" ? display.toLocaleString() : display}</span>;
}

export default function ImpactPage() {
  const [peopleImpacted, setPeopleImpacted] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveBillCount, setLiveBillCount] = useState(null);
  const [billsLoading, setBillsLoading] = useState(true);
  const [statesCoveredCount, setStatesCoveredCount] = useState(null);
  const [stateBillCount, setStateBillCount] = useState(0);
  const [statesLoading, setStatesLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("https://raw.githubusercontent.com/AadyaS26/pvc-legislation-sync/main/bills.json");
        const data = await res.json();
        if (!cancelled) setLiveBillCount(typeof data.count === "number" ? data.count : 0);
      } catch {
        if (!cancelled) setLiveBillCount(0);
      } finally {
        if (!cancelled) setBillsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("https://raw.githubusercontent.com/AadyaS26/pvc-legislation-sync/main/state_bills.json");
        const data = await res.json();
        if (!cancelled) {
          const legiscanCount = typeof data.states_covered_count === "number" ? data.states_covered_count : 0;
          setStatesCoveredCount(Math.max(legiscanCount, 8));
          setStateBillCount(typeof data.count === "number" ? data.count : 0);
        }
      } catch {
        if (!cancelled) setStatesCoveredCount(8);
      } finally {
        if (!cancelled) setStatesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/counter?key=people-impacted");
        const data = await res.json();
        if (!cancelled) setPeopleImpacted(data.value || 0);
      } catch {
        if (!cancelled) setPeopleImpacted(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: "#2B2A28", background: "#FAF8F3", minHeight: "100%" }}>
      <style>{FONT_IMPORT}</style>

      <Nav />

      <section style={{ maxWidth: 700, margin: "0 auto", padding: "56px 24px 40px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 500, fontSize: "clamp(44px, 8vw, 76px)", lineHeight: 1.05, color: "#1B2A4A", letterSpacing: "-0.01em" }}>
          Our impact
        </h1>
      </section>

      {/* Hero counter */}
      <section style={{ background: "#1B2A4A", padding: "72px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(64px, 11vw, 108px)", color: "#FAF8F3", fontWeight: 500, lineHeight: 1 }}>
            <CountUp value={loading ? "—" : peopleImpacted + INSTAGRAM_REACH} />
          </div>
          <p style={{ fontSize: 15.5, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C4C8D6", marginTop: 16 }}>
            Total people reached
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 800, margin: "0 auto", padding: "56px 24px 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, textAlign: "center" }}>
          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 48, color: "#1B2A4A", fontWeight: 500, lineHeight: 1 }}>
              <CountUp value={CONDITIONS_COVERED} />
            </div>
            <div style={{ fontSize: 13, letterSpacing: "0.05em", textTransform: "uppercase", color: "#8A8880", marginTop: 10 }}>Conditions covered</div>
          </div>
          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 48, color: "#1B2A4A", fontWeight: 500, lineHeight: 1 }}>
              <CountUp value={statesLoading ? "—" : statesCoveredCount} />
            </div>
            <div style={{ fontSize: 13, letterSpacing: "0.05em", textTransform: "uppercase", color: "#8A8880", marginTop: 10 }}>States + federal</div>
          </div>
          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 48, color: "#1B2A4A", fontWeight: 500, lineHeight: 1 }}>
              <CountUp value={17335} />+
            </div>
            <div style={{ fontSize: 13, letterSpacing: "0.05em", textTransform: "uppercase", color: "#8A8880", marginTop: 10 }}>Federal bills scraped</div>
          </div>
          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 48, color: "#1B2A4A", fontWeight: 500, lineHeight: 1 }}>
              <CountUp value={COUNTRIES_REACHED} />
            </div>
            <div style={{ fontSize: 13, letterSpacing: "0.05em", textTransform: "uppercase", color: "#8A8880", marginTop: 10 }}>Countries reached</div>
          </div>
        </div>
      </section>

      {/* Reach map */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 56px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1B2A4A", margin: 0 }}>Where we've reached people</h2>
        </div>
        <ReachMap />
      </section>

      {/* Community partners */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 56px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <HeartHandshake size={17} color="#A87C2A" />
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1B2A4A", margin: 0 }}>Community partners</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          {PARTNERS.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                background: "#fff",
                border: "1px solid #E4E0D6",
                borderRadius: 8,
                padding: "20px",
                textDecoration: "none",
              }}
            >
              <img
                src={p.logo}
                alt={p.name}
                style={{ width: "100%", height: 140, borderRadius: 6, objectFit: "contain", background: "#F2EEE3" }}
              />
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1B2A4A", textAlign: "center" }}>{p.name}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Legislative gaps CTA */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 72px" }}>
        <div style={{ background: "#1B2A4A", borderRadius: 8, padding: "36px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div style={{ maxWidth: 420 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Lightbulb size={16} color="#C9A25A" />
              <span style={{ fontSize: 12, letterSpacing: "0.05em", textTransform: "uppercase", color: "#C9A25A", fontWeight: 500 }}>
                Where legislation doesn't exist yet
              </span>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "#FAF8F3", margin: 0 }}>
              Most of the conditions we track have no active bill right now. Pitch the policy you wish existed.
            </p>
          </div>
          <Link
            to="/brainstorm"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
              fontWeight: 500,
              color: "#1B2A4A",
              background: "#FAF8F3",
              padding: "12px 20px",
              borderRadius: 3,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Brainstorm ideas <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}
