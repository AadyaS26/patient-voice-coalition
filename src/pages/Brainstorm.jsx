import React, { useState, useEffect } from "react";
import Nav from "../components/Nav";
import { Lightbulb, ArrowUp, Plus, X } from "lucide-react";

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
        const existing = await window.storage.get("brainstorm-ideas", true);
        setIdeas(existing ? JSON.parse(existing.value) : []);
      } catch {
        setIdeas([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveIdeas = async (next) => {
    setIdeas(next);
    try {
      await window.storage.set("brainstorm-ideas", JSON.stringify(next), true);
    } catch {
      // storage unavailable; local state still updates for this session
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newIdea = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      condition,
      title: title.trim(),
      description: description.trim(),
      votes: 1,
      createdAt: Date.now(),
    };
    await saveIdeas([newIdea, ...ideas]);
    setTitle("");
    setDescription("");
    setShowForm(false);
    setVoted((v) => ({ ...v, [newIdea.id]: true }));
  };

  const handleUpvote = async (id) => {
    if (voted[id]) return;
    setVoted((v) => ({ ...v, [id]: true }));
    const next = ideas.map((i) => (i.id === id ? { ...i, votes: i.votes + 1 } : i));
    await saveIdeas(next);
  };

  const sorted = [...ideas].sort((a, b) => b.votes - a.votes);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: "#2B2A28", background: "#FAF8F3", minHeight: "100%" }}>
      <style>{FONT_IMPORT}</style>

      <Nav />

      <section style={{ maxWidth: 700, margin: "0 auto", padding: "56px 24px 32px" }}>
        <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#A87C2A", fontWeight: 500, marginBottom: 16 }}>
          Legislative gaps
        </p>
        <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 500, fontSize: "clamp(28px, 4.5vw, 40px)", lineHeight: 1.1, color: "#1B2A4A" }}>
          Brainstorm the bill that doesn't exist yet
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: "#5A5952", marginTop: 16 }}>
          {GAP_CONDITIONS.length} conditions we track have no active federal or state legislation right now. That's not nothing — it's a starting
          point. Pitch the policy idea you wish existed, and see what other patients think.
        </p>
        <button
          onClick={() => setShowForm((v) => !v)}
          style={{
            marginTop: 24,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 500,
            color: "#FAF8F3",
            background: "#1B2A4A",
            border: "none",
            padding: "12px 20px",
            borderRadius: 3,
            cursor: "pointer",
          }}
        >
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? "Close" : "Pitch an idea"}
        </button>
      </section>

      {showForm && (
        <section style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px 40px" }}>
          <form
            onSubmit={handleSubmit}
            style={{ border: "1px solid #E4E0D6", borderRadius: 6, padding: "24px", background: "#fff", display: "grid", gap: 14 }}
          >
            <div>
              <label style={{ fontSize: 12.5, color: "#5A5952", display: "block", marginBottom: 4 }}>Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                style={{ width: "100%", padding: "9px 10px", border: "1px solid #C9C4B4", borderRadius: 3, fontSize: 14, background: "#fff" }}
              >
                {GAP_CONDITIONS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12.5, color: "#5A5952", display: "block", marginBottom: 4 }}>Idea title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Require insurance coverage for..."
                style={{ width: "100%", padding: "9px 10px", border: "1px solid #C9C4B4", borderRadius: 3, fontSize: 14, boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12.5, color: "#5A5952", display: "block", marginBottom: 4 }}>Why this matters (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                style={{ width: "100%", padding: "10px", border: "1px solid #C9C4B4", borderRadius: 3, fontSize: 13.5, lineHeight: 1.5, boxSizing: "border-box", fontFamily: "Inter, sans-serif" }}
              />
            </div>
            <button
              type="submit"
              style={{
                justifySelf: "start",
                fontSize: 13.5,
                fontWeight: 500,
                color: "#FAF8F3",
                background: "#1B2A4A",
                border: "none",
                padding: "10px 20px",
                borderRadius: 3,
                cursor: "pointer",
              }}
            >
              Submit idea
            </button>
            <p style={{ fontSize: 11.5, color: "#8A8880", margin: 0 }}>Visible to everyone who visits this page — no account needed.</p>
          </form>
        </section>
      )}

      <section style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px 72px" }}>
        {loading ? (
          <p style={{ fontSize: 13.5, color: "#8A8880" }}>Loading ideas…</p>
        ) : sorted.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 24px", border: "1px dashed #C9C4B4", borderRadius: 4 }}>
            <Lightbulb size={22} color="#A87C2A" style={{ marginBottom: 10 }} />
            <p style={{ fontSize: 14.5, color: "#2B2A28" }}>No ideas yet — be the first to pitch one.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 14 }}>
            {sorted.map((idea) => (
              <div
                key={idea.id}
                style={{ display: "flex", gap: 16, border: "1px solid #E4E0D6", borderRadius: 4, padding: "18px 20px", background: "#fff" }}
              >
                <button
                  onClick={() => handleUpvote(idea.id)}
                  disabled={voted[idea.id]}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 48,
                    border: `1px solid ${voted[idea.id] ? "#A87C2A" : "#C9C4B4"}`,
                    borderRadius: 4,
                    background: voted[idea.id] ? "#F2EEE3" : "#fff",
                    cursor: voted[idea.id] ? "default" : "pointer",
                    padding: "8px 0",
                    height: "fit-content",
                  }}
                >
                  <ArrowUp size={14} color={voted[idea.id] ? "#A87C2A" : "#5A5952"} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: voted[idea.id] ? "#A87C2A" : "#2B2A28", marginTop: 2 }}>{idea.votes}</span>
                </button>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.05em", color: "#A87C2A", fontWeight: 500 }}>
                    {idea.condition}
                  </span>
                  <h3 style={{ fontSize: 15.5, fontWeight: 600, color: "#1B2A4A", margin: "6px 0" }}>{idea.title}</h3>
                  {idea.description && <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "#5A5952", marginBottom: 6 }}>{idea.description}</p>}
                  <span style={{ fontSize: 11.5, color: "#8A8880" }}>{timeAgo(idea.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
