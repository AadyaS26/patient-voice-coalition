// src/pages/AdvocacyTrainingDetail.jsx
//
// Course-shell layout: a left sidebar listing every lesson (each expandable
// to show its quiz), a progress bar across the top, and the lesson itself
// — video slot, a short "in this lesson" summary, the full written
// content, then an interactive quiz at the bottom.
//
// Progress is tracked in localStorage (per-browser, not shared across
// devices) under "av-course-progress" as { [trainingId]: { lesson: bool,
// quiz: bool } }. The "advocates trained" counter on the catalog page still
// increments once per training per session the first time someone opens
// it, same as before.

import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate, Navigate } from "react-router-dom";
import Nav from "../components/Nav";
import { ChevronDown, ChevronLeft, PlayCircle, CheckCircle2, Circle } from "lucide-react";
import { TRAININGS, getTraining } from "../data/advocacyTrainings";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');

.av-training-body h4 { font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #A87C2A; margin: 28px 0 12px; }
.av-training-body h4:first-child { margin-top: 0; }
.av-training-body p { margin: 0 0 15px; font-size: 15px; line-height: 1.75; color: #2B2A28; }

.av-steps-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin: 4px 0 22px; }
.av-steps-grid-3 { grid-template-columns: repeat(3, 1fr); }
.av-steps-grid-2 { grid-template-columns: repeat(2, 1fr); }
.av-steps-grid-timeline { grid-template-columns: 1fr; gap: 0; }
@media (max-width: 640px) {
  .av-steps-grid, .av-steps-grid-3, .av-steps-grid-2 { grid-template-columns: 1fr; }
}
.av-step-card { background: #FFFFFF; border: 1px solid #E4E0D6; border-radius: 10px; padding: 16px 18px; }
.av-step-card h5 { font-family: 'Fraunces', serif; font-size: 15px; font-weight: 500; color: #1B2A4A; margin: 0 0 6px; }
.av-step-card p { margin: 0 !important; font-size: 13.5px !important; line-height: 1.6 !important; color: #5A5952 !important; }
.av-step-num { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: #F7F3EA; color: #A87C2A; font-family: 'Fraunces', serif; font-size: 12px; font-weight: 600; margin-bottom: 8px; }
.av-steps-grid-timeline .av-step-card { border-radius: 0; border: none; border-left: 2px solid #E4E0D6; padding: 4px 0 18px 20px; background: none; }
.av-step-time { display: block; font-family: 'Fraunces', serif; font-size: 13px; color: #A87C2A; font-weight: 600; margin-bottom: 4px; }
`;

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem("av-course-progress") || "{}");
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem("av-course-progress", JSON.stringify(progress));
  } catch {
    // localStorage unavailable — progress just won't persist
  }
}

function Sidebar({ activeId, progress, onNavigate }) {
  const [expandedId, setExpandedId] = useState(activeId);

  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E4E0D6", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ background: "#1B2A4A", padding: "18px 20px" }}>
        <p style={{ fontFamily: "Fraunces, serif", fontSize: 17, fontWeight: 500, color: "#FAF8F3", margin: 0 }}>
          Advocacy Training
        </p>
      </div>
      {TRAININGS.map((t) => {
        const isActive = t.id === activeId;
        const isExpanded = expandedId === t.id;
        const lessonDone = progress[t.id]?.lesson;
        const quizDone = progress[t.id]?.quiz;
        return (
          <div key={t.id} style={{ borderBottom: "1px solid #F0EEE7" }}>
            <button
              onClick={() => {
                setExpandedId(isExpanded ? null : t.id);
                onNavigate(t.id);
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 18px",
                background: isActive ? "#F7F3EA" : "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {lessonDone ? <CheckCircle2 size={16} color="#1B6B3F" style={{ flexShrink: 0 }} /> : <Circle size={16} color="#C9C4B6" style={{ flexShrink: 0 }} />}
              <span style={{ fontSize: 13.5, fontWeight: isActive ? 600 : 400, color: isActive ? "#1B2A4A" : "#2B2A28", flex: 1 }}>
                {t.index}. {t.title}
              </span>
              <ChevronDown size={14} color="#8A8880" style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
            </button>
            {isExpanded && (
              <div style={{ padding: "0 18px 12px 44px" }}>
                <button
                  onClick={() => onNavigate(t.id, true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "6px 0",
                    textAlign: "left",
                  }}
                >
                  {quizDone ? <CheckCircle2 size={13} color="#1B6B3F" /> : <Circle size={13} color="#C9C4B6" />}
                  <span style={{ fontSize: 12.5, color: "#5A5952" }}>Quiz: {t.title}</span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function VideoSlot({ videoUrl, title }) {
  if (videoUrl) {
    return (
      <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: 12, overflow: "hidden", marginBottom: 28, background: "#000" }}>
        <iframe
          src={videoUrl}
          title={title}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        height: 240,
        borderRadius: 12,
        border: "2px dashed #D9D3C2",
        background: "#F7F3EA",
        marginBottom: 28,
      }}
    >
      <PlayCircle size={30} color="#C4BEA8" />
      <p style={{ fontSize: 13, color: "#8A8880", margin: 0 }}>Video coming soon</p>
    </div>
  );
}

function Quiz({ training, passed, onPass }) {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const isCorrect = checked && selected === training.quiz.correctId;

  function handleCheck() {
    if (!selected) return;
    setChecked(true);
    if (selected === training.quiz.correctId) {
      onPass();
    }
  }

  return (
    <div style={{ marginTop: 48, background: "#FFFFFF", border: "1px solid #E4E0D6", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ background: "#1B2A4A", padding: "14px 22px" }}>
        <p style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "#FAF8F3", margin: 0 }}>
          Quiz {passed && "· Completed"}
        </p>
      </div>
      <div style={{ padding: "24px 22px" }}>
        <p style={{ fontFamily: "Fraunces, serif", fontSize: 18, fontWeight: 500, color: "#1B2A4A", margin: "0 0 18px" }}>
          {training.quiz.question}
        </p>
        <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
          {training.quiz.options.map((opt) => {
            const isSelected = selected === opt.id;
            const showCorrect = checked && opt.id === training.quiz.correctId;
            const showWrong = checked && isSelected && opt.id !== training.quiz.correctId;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  if (!checked) setSelected(opt.id);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "13px 16px",
                  borderRadius: 8,
                  border: `1px solid ${showCorrect ? "#1B6B3F" : showWrong ? "#B23B3B" : isSelected ? "#A87C2A" : "#E4E0D6"}`,
                  background: showCorrect ? "#EEF6F0" : showWrong ? "#FBEAEA" : isSelected ? "#F7F3EA" : "#FFFFFF",
                  cursor: checked ? "default" : "pointer",
                  textAlign: "left",
                  fontSize: 14,
                  color: "#2B2A28",
                }}
              >
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    border: `2px solid ${isSelected ? "#A87C2A" : "#C9C4B6"}`,
                    flexShrink: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isSelected && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#A87C2A" }} />}
                </span>
                {opt.text}
              </button>
            );
          })}
        </div>

        {checked && (
          <p
            style={{
              fontSize: 13.5,
              lineHeight: 1.6,
              color: isCorrect ? "#1B6B3F" : "#8A5C3B",
              background: isCorrect ? "#EEF6F0" : "#F7F3EA",
              padding: "12px 14px",
              borderRadius: 8,
              marginBottom: 18,
            }}
          >
            <strong>{isCorrect ? "Correct. " : "Not quite. "}</strong>
            {training.quiz.explanation}
          </p>
        )}

        <button
          onClick={checked ? () => { setChecked(false); setSelected(null); } : handleCheck}
          disabled={!selected && !checked}
          style={{
            background: "#1B2A4A",
            color: "#FAF8F3",
            border: "none",
            borderRadius: 8,
            padding: "10px 22px",
            fontSize: 13.5,
            fontWeight: 600,
            cursor: !selected && !checked ? "default" : "pointer",
            opacity: !selected && !checked ? 0.5 : 1,
          }}
        >
          {checked ? "Try again" : "Check"}
        </button>
      </div>
    </div>
  );
}

export default function AdvocacyTrainingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const training = getTraining(id);
  const index = TRAININGS.findIndex((t) => t.id === id);
  const next = index >= 0 ? TRAININGS[(index + 1) % TRAININGS.length] : null;

  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    if (!training) return;
    window.scrollTo(0, 0);

    const sessionKey = `av-training-opened-${training.id}`;
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, "1");
      fetch("/api/counter?key=advocates-trained&action=increment").catch(() => {});
    }

    setProgress((prev) => {
      if (prev[training.id]?.lesson) return prev;
      const next = { ...prev, [training.id]: { ...prev[training.id], lesson: true } };
      saveProgress(next);
      return next;
    });
  }, [training]);

  function markQuizPassed() {
    setProgress((prev) => {
      const updated = { ...prev, [id]: { ...prev[id], quiz: true } };
      saveProgress(updated);
      return updated;
    });
  }

  const totalSteps = TRAININGS.length * 2;
  const completedSteps = useMemo(
    () => Object.values(progress).reduce((sum, p) => sum + (p.lesson ? 1 : 0) + (p.quiz ? 1 : 0), 0),
    [progress]
  );
  const percent = Math.round((completedSteps / totalSteps) * 100);

  if (!training) {
    return <Navigate to="/advocacy-training" replace />;
  }

  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: "#2B2A28", background: "#FAF8F3", minHeight: "100%" }}>
      <style>{FONT_IMPORT}</style>
      <Nav />

      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E4E0D6", padding: "14px 24px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", alignItems: "center", gap: 20 }}>
          <Link to="/advocacy-training" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#8A8880", textDecoration: "none", flexShrink: 0 }}>
            <ChevronLeft size={14} /> All trainings
          </Link>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "#1B6B3F", whiteSpace: "nowrap" }}>
              {percent}% COMPLETE
            </span>
            <div style={{ flex: 1, height: 6, background: "#F0EEE7", borderRadius: 3, overflow: "hidden", maxWidth: 300 }}>
              <div style={{ width: `${percent}%`, height: "100%", background: "#1B6B3F", borderRadius: 3, transition: "width 0.2s" }} />
            </div>
            <span style={{ fontSize: 12, color: "#8A8880", whiteSpace: "nowrap" }}>
              {completedSteps}/{totalSteps} steps
            </span>
          </div>
        </div>
      </div>

      <section style={{ maxWidth: 1140, margin: "0 auto", padding: "36px 24px 90px", display: "grid", gridTemplateColumns: "280px 1fr", gap: 32, alignItems: "start" }}>
        <div style={{ position: "sticky", top: 24 }}>
          <Sidebar
            activeId={training.id}
            progress={progress}
            onNavigate={(newId, scrollToQuiz) => {
              if (newId !== training.id) {
                navigate(`/advocacy-training/${newId}`);
              } else if (scrollToQuiz) {
                document.getElementById("av-quiz")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
          />
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
            <span style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: 22, color: "#C4BEA8" }}>{training.index}.</span>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: training.level === "Intermediate" ? "#A87C2A" : "#5A5952" }}>
              {training.level}
            </span>
          </div>
          <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 500, fontSize: "clamp(28px, 5vw, 38px)", lineHeight: 1.15, color: "#1B2A4A", margin: "0 0 24px" }}>
            {training.title}
          </h1>

          <VideoSlot videoUrl={training.videoUrl} title={training.title} />

          {training.learnBullets && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E4E0D6", borderRadius: 10, padding: "18px 22px", marginBottom: 32 }}>
              <p style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "#A87C2A", margin: "0 0 12px" }}>
                In this lesson
              </p>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {training.learnBullets.map((b, i) => (
                  <li key={i} style={{ fontSize: 14, lineHeight: 1.7, color: "#2B2A28" }}>{b}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="av-training-body">{training.content}</div>

          {training.quiz && (
            <div id="av-quiz">
              <Quiz training={training} passed={progress[training.id]?.quiz} onPass={markQuizPassed} />
            </div>
          )}

          {next && (
            <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid #E4E0D6" }}>
              <p style={{ fontSize: 12, letterSpacing: "0.05em", textTransform: "uppercase", color: "#8A8880", marginBottom: 8 }}>Up next</p>
              <Link to={`/advocacy-training/${next.id}`} style={{ fontFamily: "Fraunces, serif", fontSize: 20, fontWeight: 500, color: "#1B2A4A", textDecoration: "none" }}>
                {next.index}. {next.title} →
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
