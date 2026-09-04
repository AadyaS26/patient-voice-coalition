import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import ReachMap from "../components/ReachMap";
import { HeartHandshake, Lightbulb, ArrowRight, MessageCircleHeart } from "lucide-react";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');`;

const CURATED_BILLS = 212;
const CONDITIONS_COVERED = 146;
const INSTAGRAM_REACH = 43058;
const COUNTRIES_REACHED = 45;

// Real community partner orgs — logos live in public/partner-logos/,
// uploaded directly on GitHub the same way chapter photos are.
const PARTNERS = [
  { name: "RAFA Autoimmune Wellness", url: "https://myrafa.app/", logo: "/partner-logos/rafa.jpg" },
  { name: "T1D ASU", url: "https://www.instagram.com/asudiabeteslink/", logo: "/partner-logos/t1d-asu.jpg" },
  { name: "Autoimmune Atlas", url: "https://solsticestrategies.net/autoimmuneatlas/", logo: "/partner-logos/autoimmune-atlas.jpg" },
  { name: "Bald Girls Do Lunch", url: "https://www.baldgirlsdolunch.org/", logo: "/partner-logos/bald-girls-do-lunch.jpg" },
  { name: "Vasculitis Foundation", url: "https://vasculitisfoundation.org/", logo: "/partner-logos/vasculitis-foundation.jpg" },
  { name: "Gluten Free Shop", url: "https://www.facebook.com/people/Gluten-free-shop/100094473745210/", logo: "/partner-logos/gluten-free-shop.jpg" },
  { name: "Celi-Safe", url: "https://www.celi-safe.com/", logo: "/partner-logos/celi-safe.jpg" },
  { name: "Lupus Warriors of Idaho", url: "https://www.instagram.com/lupuswarriorsidaho/", logo: "/partner-logos/lupus-warriors-idaho.jpg" },
  { name: "Lupus Remedies Global Support Foundation", url: "https://www.instagram.com/luregsupport/", logo: "/partner-logos/lupus-remedies.jpg" },
  { name: "Graves' Disease & Thyroid Foundation", url: "https://gdatf.org/", logo: "/partner-logos/graves.jpg" },
  { name: "Community4Celiac", url: "https://www.community4celiac.com/", logo: "/partner-logos/c4c.jpg" },
  { name: "Lupus Foundation of America", url: "https://shopgr.id/lupusorg?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAaemDEtgYtHn64dLl2m_vvQBGYe5_j7D7W8ME6JF1ltltxHZHplOCrl83BMvfA_aem_76DpWZaWpT-9K6xpzTMusQ", logo: "/partner-logos/lupusf.jpg" },
];

const STORY_CATEGORIES = [
  { id: "delayed_diagnosis", label: "Delayed Diagnosis" },
  { id: "medication_access", label: "Medication Access" },
  { id: "prior_authorization", label: "Prior Authorization" },
  { id: "insurance_denial", label: "Insurance Denial" },
  { id: "food_affordability", label: "Food Affordability" },
  { id: "specialist_access", label: "Specialist Access" },
  { id: "disability_accommodations", label: "Disability Accommodations" },
  { id: "womens_health", label: "Women's Health" },
  { id: "mental_health", label: "Mental Health Effects" },
  { id: "rural_healthcare", label: "Rural Healthcare" },
  { id: "other", label: "Other" },
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

// ---- Patient Stories section (lives here on Impact instead of its own page/nav item) ----

const storyInputStyle = {
  width: "100%",
  fontFamily: "Inter, sans-serif",
  fontSize: 14.5,
  border: "1px solid #E4E0D6",
  borderRadius: 8,
  padding: "10px 12px",
  background: "#FAF8F3",
  color: "#2B2A28",
  boxSizing: "border-box",
};

const storyLabelStyle = {
  fontFamily: "Inter, sans-serif",
  fontSize: 13,
  fontWeight: 600,
  color: "#2B2A28",
  display: "block",
  marginBottom: 6,
};

function StoryForm({ onSubmitted }) {
  const [form, setForm] = useState({
    name: "",
    condition: "",
    state: "",
    country: "United States",
    category: STORY_CATEGORIES[0].id,
    story: "",
    shareAnonymously: false,
    sharePublicly: true,
    useInAdvocacy: true,
    website: "",
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/submit-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Could not submit your story.");
      setStatus("done");
      onSubmitted?.();
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div style={{ background: "#EEF6F0", border: "1px solid #CFE6D8", borderRadius: 8, padding: 24, textAlign: "center" }}>
        <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#1B6B3F" }}>Thank you for sharing your story.</p>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#3E6B4E", marginTop: 4 }}>
          It's live on this page now.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: "#fff", border: "1px solid #E4E0D6", borderRadius: 8, padding: 28, display: "grid", gap: 18 }}>
      <input
        type="text"
        value={form.website}
        onChange={(e) => update("website", e.target.value)}
        style={{ position: "absolute", left: "-9999px" }}
        tabIndex={-1}
        autoComplete="off"
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={storyLabelStyle}>Your name (leave blank if anonymous)</label>
          <input style={storyInputStyle} value={form.name} onChange={(e) => update("name", e.target.value)} />
        </div>
        <div>
          <label style={storyLabelStyle}>Condition</label>
          <input style={storyInputStyle} required placeholder="e.g. Celiac disease, Lupus, Type 1 Diabetes" value={form.condition} onChange={(e) => update("condition", e.target.value)} />
        </div>
        <div>
          <label style={storyLabelStyle}>State / Province</label>
          <input style={storyInputStyle} value={form.state} onChange={(e) => update("state", e.target.value)} />
        </div>
        <div>
          <label style={storyLabelStyle}>Country</label>
          <input style={storyInputStyle} value={form.country} onChange={(e) => update("country", e.target.value)} />
        </div>
      </div>
      <div>
        <label style={storyLabelStyle}>What category best fits your story?</label>
        <select style={storyInputStyle} value={form.category} onChange={(e) => update("category", e.target.value)}>
          {STORY_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label style={storyLabelStyle}>Your story — what do you wish policymakers knew?</label>
        <textarea
          style={{ ...storyInputStyle, resize: "vertical" }}
          rows={5}
          required
          value={form.story}
          onChange={(e) => update("story", e.target.value)}
          placeholder="Share your experience with diagnosis, treatment, insurance, or anything else that shaped how you think about healthcare policy."
        />
      </div>
      <div style={{ display: "grid", gap: 8, fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#5A5952" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={form.shareAnonymously} onChange={(e) => update("shareAnonymously", e.target.checked)} />
          Share my story anonymously (no name shown)
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={form.sharePublicly} onChange={(e) => update("sharePublicly", e.target.checked)} />
          I give permission to share this story publicly on the website
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={form.useInAdvocacy} onChange={(e) => update("useInAdvocacy", e.target.checked)} />
          I give permission to use this story in advocacy materials, testimony, or meetings with legislators
        </label>
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
          fontSize: 14.5,
          color: "#FAF8F3",
          background: "#1B2A4A",
          border: "none",
          borderRadius: 6,
          padding: "12px 0",
          cursor: status === "sending" ? "default" : "pointer",
          opacity: status === "sending" ? 0.6 : 1,
        }}
      >
        {status === "sending" ? "Submitting…" : "Share My Story"}
      </button>
      {status === "error" && <p style={{ color: "#B23B3B", fontSize: 13, fontFamily: "Inter, sans-serif" }}>{error}</p>}
    </form>
  );
}

function PatientStoriesSection() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchStories = () => {
    fetch("/api/submit-story", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setStories(Array.isArray(data.stories) ? data.stories : []))
      .catch(() => setStories([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <section style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 56px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <MessageCircleHeart size={17} color="#A87C2A" />
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1B2A4A", margin: 0 }}>
            Patient stories {stories.length > 0 && <span style={{ color: "#8A8880", fontWeight: 400 }}>· {stories.length.toLocaleString()} collected</span>}
          </h2>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link
            to="/patient-stories"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#FAF8F3",
              background: "#1B2A4A",
              borderRadius: 6,
              padding: "8px 16px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            View Patient Stories
          </Link>
          <button
            onClick={() => setShowForm((v) => !v)}
            style={{ fontSize: 13, fontWeight: 600, color: "#1B2A4A", background: "none", border: "1px solid #1B2A4A", borderRadius: 6, padding: "8px 16px", cursor: "pointer" }}
          >
            {showForm ? "Close form" : "Share your story"}
          </button>
        </div>
      </div>

      {showForm && (
        <div style={{ marginBottom: 24 }}>
          <StoryForm onSubmitted={fetchStories} />
        </div>
      )}
    </section>
  );
}

// ---- Main Impact page ----

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

      {/* Patient stories — moved here from its own page/nav item */}
      <PatientStoriesSection />

      {/* Community partners */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 56px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <HeartHandshake size={17} color="#A87C2A" />
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1B2A4A", margin: 0 }}>Community partners</h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {PARTNERS.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                flexDirection: "column",
                background: "#fff",
                border: "1px solid #E4E0D6",
                borderRadius: 8,
                padding: 14,
                textDecoration: "none",
              }}
            >
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", aspectRatio: "1.6 / 1" }}>
                <img
                  src={p.logo}
                  alt={p.name}
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                />
              </div>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: "#1B2A4A", textAlign: "center", marginTop: 10, lineHeight: 1.3 }}>
                {p.name}
              </span>
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
