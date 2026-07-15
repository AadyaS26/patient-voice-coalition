import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import { BookOpen, HeartHandshake, CheckCircle2, Lightbulb, ArrowRight } from "lucide-react";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');`;

const CURATED_BILLS = 212;
const CONDITIONS_COVERED = 146;
const INSTAGRAM_FOLLOWERS = 87;

const RECENTLY_PASSED = [
  { number: "IL SB 1288", label: "Illinois Public Act 104-0090 — allergen awareness training" },
  { number: "TX SB 25", label: "Texas health & nutrition standards — signed, effective Sept 2025" },
  { number: "NJ A4163/S3098", label: "New Jersey — biomarker testing coverage for arthritis" },
  { number: "NJ A1825/S3533", label: "New Jersey — step therapy reform" },
  { number: "NJ A5217/S3818", label: "New Jersey — copay assistance counts toward deductible" },
];

function AchievementRow({ icon, stat, label, detail }) {
  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start", padding: "24px 0", borderBottom: "1px solid #E4E0D6" }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "#F2EEE3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "Fraunces, serif", fontSize: 30, color: "#1B2A4A", fontWeight: 500 }}>{stat}</span>
          <span style={{ fontSize: 16, color: "#2B2A28" }}>{label}</span>
        </div>
        {detail && <p style={{ fontSize: 13.5, color: "#8A8880", marginTop: 4 }}>{detail}</p>}
      </div>
    </div>
  );
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
          // "8" states from curated hand-verified bills are always real, regardless
          // of what LegiScan finds — so the count is whichever is higher, real either way.
          const legiscanCount = typeof data.states_covered_count === "number" ? data.states_covered_count : 0;
          setStatesCoveredCount(Math.max(legiscanCount, 8));
          setStateBillCount(typeof data.count === "number" ? data.count : 0);
        }
      } catch {
        if (!cancelled) setStatesCoveredCount(8); // fall back to the curated real minimum
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
            {loading ? "—" : (peopleImpacted + INSTAGRAM_FOLLOWERS).toLocaleString()}
          </div>
          <p style={{ fontSize: 15.5, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C4C8D6", marginTop: 16 }}>
            Total people impacted
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 800, margin: "0 auto", padding: "56px 24px 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 32 }}>
          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 48, color: "#1B2A4A", fontWeight: 500, lineHeight: 1 }}>
              {billsLoading || statesLoading ? "—" : (CURATED_BILLS + liveBillCount + stateBillCount).toLocaleString()}
            </div>
            <div style={{ fontSize: 13, letterSpacing: "0.05em", textTransform: "uppercase", color: "#8A8880", marginTop: 10 }}>Bills tracked</div>
          </div>
          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 48, color: "#1B2A4A", fontWeight: 500, lineHeight: 1 }}>{CONDITIONS_COVERED}</div>
            <div style={{ fontSize: 13, letterSpacing: "0.05em", textTransform: "uppercase", color: "#8A8880", marginTop: 10 }}>Conditions covered</div>
          </div>
          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 48, color: "#1B2A4A", fontWeight: 500, lineHeight: 1 }}>
              {statesLoading ? "—" : statesCoveredCount}
            </div>
            <div style={{ fontSize: 13, letterSpacing: "0.05em", textTransform: "uppercase", color: "#8A8880", marginTop: 10 }}>States + federal</div>
          </div>
          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 48, color: "#1B2A4A", fontWeight: 500, lineHeight: 1 }}>17,335+</div>
            <div style={{ fontSize: 13, letterSpacing: "0.05em", textTransform: "uppercase", color: "#8A8880", marginTop: 10 }}>Federal bills scraped</div>
          </div>
        </div>
        <p style={{ fontSize: 12, color: "#8A8880", marginTop: 24, maxWidth: 560, lineHeight: 1.5 }}>
          "Federal bills scraped" is the full scale of the 119th Congress database our system searches — most aren't about autoimmune or chronic
          disease. "Bills tracked" and "States + federal" are real counts from our own verified and automated pipelines, updated daily.
        </p>
      </section>

      {/* Recently passed */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 56px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <CheckCircle2 size={17} color="#5C7A52" />
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1B2A4A", margin: 0 }}>Recently passed</h2>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {RECENTLY_PASSED.map((b) => (
            <div key={b.number} style={{ background: "#F3F7F1", border: "1px solid #C9D6C2", borderRadius: 4, padding: "14px 18px", display: "flex", gap: 12, alignItems: "baseline" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#3F6B33" }}>{b.number}</span>
              <span style={{ fontSize: 13.5, color: "#4A5940" }}>{b.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 56px" }}>
        <AchievementRow icon={<BookOpen size={20} color="#A87C2A" />} stat="—" label="patients reached by Celiac 101" detail="Publishing soon" />
        <AchievementRow icon={<HeartHandshake size={20} color="#A87C2A" />} stat="—" label="families supported" />
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
