import React, { useState, useEffect } from "react";
import Nav from "../components/Nav";
import { Lightbulb, ArrowUp, Plus, X, Flame } from "lucide-react";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');`;

// Conditions we've verified currently have real, active bills (curated set).
// Everything else in the full list is treated as a legislative gap — a fair
// starting point, since most of the 146 real conditions genuinely have no
// standalone federal or state bill naming them right now.
const CONDITIONS_WITH_BILLS = new Set([
  "Celiac disease",
  "General autoimmune",
  "Lupus (SLE)",
  "Sjögren's disease",
  "Type 1 diabetes",
  "Inherited metabolic",
]);

const ALL_CONDITIONS = [
  "Achalasia",
  "Acute disseminated encephalomyelitis",
  "Addison's disease",
  "Adult Still's disease",
  "Agammaglobulinemia",
  "Alopecia areata",
  "Amyloidosis",
  "Ankylosing spondylitis",
  "Antiphospholipid syndrome",
  "Atopic dermatitis",
  "Autoimmune hepatitis",
  "Behçet's disease",
  "Celiac disease",
  "Crohn's disease",
  "Dermatomyositis",
  "General autoimmune",
  "Graves' disease",
  "Guillain-Barré syndrome",
  "Hashimoto's thyroiditis",
  "Hidradenitis suppurativa",
  "IgA nephropathy",
  "Inherited metabolic",
  "Kawasaki disease",
  "Lupus (SLE)",
  "Multiple sclerosis",
  "Myasthenia gravis",
  "Narcolepsy",
  "Pemphigus",
  "Polymyositis",
  "Primary biliary cholangitis",
  "Psoriasis",
  "Psoriatic arthritis",
  "Rheumatoid arthritis",
  "Sarcoidosis",
  "Scleroderma",
  "Sjögren's disease",
  "Stiff person syndrome",
  "Type 1 diabetes",
  "Ulcerative colitis",
  "Vasculitis",
  "Vitiligo",
].sort();

const GAP_CONDITIONS = ALL_CONDITIONS.filter((c) => !CONDITIONS_WITH_BILLS.has(c));

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// A few condition-flavored accent colors so cards don't all look identical —
// purely visual, cycles through a small palette that matches the site.
const ACCENTS = ["#A87C2A", "#1B2A4A", "#5C7A52", "#8A5C3B", "#7A4A6E"];
function accentFor(condition) {
  let hash = 0;
  for (let i = 0; i < condition.length; i++) hash = condition.charCodeAt(i) + ((hash << 5) - hash);
  return ACCENTS[Math.abs(hash) % ACCENTS.length];
}

export default function BrainstormPage() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [condition, setCondition] = useState(GAP_CONDITIONS[0] || "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [voted, setVoted] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/brainstorm");
        const data = await res.json();
        setIdeas(Array.isArray(data.ideas) ? data.ideas : []);
      } catch {
        setIdeas([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await fetch("/api/brainstorm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          condition,
          title: title.trim(),
          description: description.trim(),
        }),
      });
      const data = await res.json();
      if (Array.isArray(data.ideas)) setIdeas(data.ideas);
      if (data.newIdea) {
        setVoted((v) => ({ ...v, [data.newIdea.id]: true }));
      }
    } catch {
      // storage unavailable; the pitch just won't be saved this time
    }
    setTitle("");
    setDescription("");
    setShowForm(false);
  };

  const handleUpvote = async (id) => {
    if (voted[id]) return;
    setVoted((v) => ({ ...v, [id]: true }));
    // Optimistic update so it feels instant, then reconcile with the server.
    setIdeas((prev) => prev.map((i) => (i.id === id ? { ...i, votes: i.votes + 1 } : i)));
    try {
      const res = await fetch("/api/brainstorm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upvote", id }),
      });
      const data = await res.json();
      if (Array.isArray(data.ideas)) setIdeas(data.ideas);
    } catch {
      // storage unavailable; local optimistic update stands for this session
    }
  };

  const sorted = [...ideas].sort((a, b) => b.votes - a.votes);
  const totalVotes = ideas.reduce((sum, i) => sum + (i.votes || 0), 0);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: "#2B2A28", background: "#FAF8F3", minHeight: "100%" }}>
      <style>{`
        ${FONT_IMPORT}
        .bs-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .bs-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 30px rgba(27,42,74,0.09);
          border-color: #C9C4B4;
        }
        .bs-vote-btn {
          transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
        }
        .bs-vote-btn:not(:disabled):hover {
          transform: translateY(-2px);
          border-color: #A87C2A;
        }
        .bs-pitch-btn {
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .bs-pitch-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(27,42,74,0.2);
        }
      `}</style>

      <Nav />

      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(180deg, #FFF9EE 0%, #FAF8F3 100%)",
          borderBottom: "1px solid #E4E0D6",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px 40px", textAlign: "center" }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "#FAF0D9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <Lightbulb size={24} color="#A87C2A" />
          </div>
          <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#A87C2A", fontWeight: 600, marginBottom: 16 }}>
            Legislative gaps
          </p>
          <h1
            style={{
              fontFamily: "Fraunces, serif",
              fontWeight: 500,
              fontSize: "clamp(30px, 4.5vw, 42px)",
              lineHeight: 1.12,
              color: "#1B2A4A",
              letterSpacing: "-0.01em",
            }}
          >
            Brainstorm the bill that doesn't exist yet
          </h1>
          <p style={{ fontSize: 15.5, lineHeight: 1.65, color: "#5A5952", marginTop: 18, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            {GAP_CONDITIONS.length} conditions we track have no active federal or state legislation right now. That's not nothing — it's a starting
            point. Pitch the policy idea you wish existed, and see what other patients think.
          </p>
          <button
            className="bs-pitch-btn"
            onClick={() => setShowForm((v) => !v)}
            style={{
              marginTop: 28,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
              fontWeight: 600,
              color: "#FAF8F3",
              background: "#1B2A4A",
              border: "none",
              padding: "13px 24px",
              borderRadius: 24,
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(27,42,74,0.16)",
            }}
          >
            {showForm ? <X size={15} /> : <Plus size={15} />}
            {showForm ? "Close" : "Pitch an idea"}
          </button>

          {!loading && ideas.length > 0 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 36, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: 22, color: "#1B2A4A", fontWeight: 600 }}>{ideas.length}</div>
                <div style={{ fontSize: 12, color: "#8A8880", marginTop: 2 }}>Ideas pitched</div>
              </div>
              <div style={{ width: 1, background: "#E4E0D6" }} />
              <div>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: 22, color: "#1B2A4A", fontWeight: 600 }}>{totalVotes.toLocaleString()}</div>
                <div style={{ fontSize: 12, color: "#8A8880", marginTop: 2 }}>Total votes</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {showForm && (
        <section style={{ maxWidth: 640, margin: "0 auto", padding: "32px 24px 8px" }}>
          <form
            onSubmit={handleSubmit}
            style={{
              border: "1px solid #E4E0D6",
              borderRadius: 10,
              padding: "28px",
              background: "#fff",
              display: "grid",
              gap: 16,
              boxShadow: "0 4px 20px rgba(27,42,74,0.06)",
            }}
          >
            <div>
              <label style={{ fontSize: 12.5, color: "#5A5952", display: "block", marginBottom: 5, fontWeight: 500 }}>Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #C9C4B4", borderRadius: 5, fontSize: 14, background: "#FAF8F3" }}
              >
                {GAP_CONDITIONS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12.5, color: "#5A5952", display: "block", marginBottom: 5, fontWeight: 500 }}>Idea title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Require insurance coverage for..."
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #C9C4B4", borderRadius: 5, fontSize: 14, boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12.5, color: "#5A5952", display: "block", marginBottom: 5, fontWeight: 500 }}>Why this matters (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                style={{ width: "100%", padding: "11px 12px", border: "1px solid #C9C4B4", borderRadius: 5, fontSize: 13.5, lineHeight: 1.5, boxSizing: "border-box", fontFamily: "Inter, sans-serif" }}
              />
            </div>
            <button
              type="submit"
              className="bs-pitch-btn"
              style={{
                justifySelf: "start",
                fontSize: 13.5,
                fontWeight: 600,
                color: "#FAF8F3",
                background: "#1B2A4A",
                border: "none",
                padding: "11px 22px",
                borderRadius: 24,
                cursor: "pointer",
              }}
            >
              Submit idea
            </button>
            <p style={{ fontSize: 11.5, color: "#8A8880", margin: 0 }}>Visible to everyone who visits this page — no account needed.</p>
          </form>
        </section>
      )}

      <section style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px" }}>
        {loading ? (
          <p style={{ fontSize: 13.5, color: "#8A8880", textAlign: "center" }}>Loading ideas…</p>
        ) : sorted.length === 0 ? (
          <div style={{ textAlign: "center", padding: "56px 24px", border: "1px dashed #C9C4B4", borderRadius: 10, background: "#fff" }}>
            <Lightbulb size={24} color="#A87C2A" style={{ marginBottom: 12 }} />
            <p style={{ fontSize: 15, color: "#2B2A28", fontWeight: 500 }}>No ideas yet — be the first to pitch one.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {sorted.map((idea, i) => {
              const accent = accentFor(idea.condition || "General");
              const isTrending = i < 3 && idea.votes >= 15;
              return (
                <div
                  key={idea.id}
                  className="bs-card"
                  style={{
                    display: "flex",
                    gap: 18,
                    border: "1px solid #E4E0D6",
                    borderLeft: `3px solid ${accent}`,
                    borderRadius: 10,
                    padding: "20px 22px",
                    background: "#fff",
                    position: "relative",
                  }}
                >
                  <button
                    className="bs-vote-btn"
                    onClick={() => handleUpvote(idea.id)}
                    disabled={voted[idea.id]}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: 54,
                      border: `1.5px solid ${voted[idea.id] ? "#A87C2A" : "#C9C4B4"}`,
                      borderRadius: 8,
                      background: voted[idea.id] ? "#FAF0D9" : "#FAF8F3",
                      cursor: voted[idea.id] ? "default" : "pointer",
                      padding: "10px 0",
                      height: "fit-content",
                    }}
                  >
                    <ArrowUp size={15} color={voted[idea.id] ? "#A87C2A" : "#5A5952"} />
                    <span style={{ fontSize: 14, fontWeight: 700, color: voted[idea.id] ? "#A87C2A" : "#2B2A28", marginTop: 3 }}>{idea.votes}</span>
                  </button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                      <span style={{ fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.05em", color: accent, fontWeight: 700 }}>
                        {idea.condition}
                      </span>
                      {isTrending && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 3,
                            fontSize: 10.5,
                            fontWeight: 700,
                            color: "#B3541E",
                            background: "#FDEDE1",
                            padding: "2px 8px",
                            borderRadius: 10,
                            letterSpacing: "0.03em",
                          }}
                        >
                          <Flame size={10} /> TRENDING
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1B2A4A", margin: "0 0 8px", lineHeight: 1.4 }}>{idea.title}</h3>
                    {idea.description && (
                      <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "#5A5952", marginBottom: 10 }}>{idea.description}</p>
                    )}
                    <span style={{ fontSize: 11.5, color: "#8A8880" }}>{timeAgo(idea.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
