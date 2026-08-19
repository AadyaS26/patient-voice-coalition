// src/pages/BillsSupported.jsx
//
// "Bills We've Supported" — every bill AV members have sent a legislator
// email about, with a dated before/after status timeline pulled from
// src/data/billsSupported.js.
//
// Per-bill email counts come from Redis via /api/bill-email-count
// (see api/bill-email-count.js — new file, and the small patch to
// api/send-legislator-email.js that increments it).

import React, { useEffect, useMemo, useState } from "react";
import Nav from "../components/Nav";
import { ExternalLink, Mail, Users } from "lucide-react";
import { billsSupported, STATUS_LABELS, TOPICS } from "../data/billsSupported";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');`;

const RESULT_META = {
  outcome: { label: "Policy Outcome", color: "#1B6B3F", bg: "#E7F3EC" },
  advanced: { label: "Advanced", color: "#1B6B3F", bg: "#EEF6F0" },
  active: { label: "Active Campaign", color: "#A87C2A", bg: "#F7EEDD" },
  no_change: { label: "No Change Yet", color: "#5A5952", bg: "#F0EEE7" },
  failed: { label: "Did Not Advance", color: "#B23B3B", bg: "#FBEAEA" },
};

function StatusPill({ result }) {
  const meta = RESULT_META[result] || RESULT_META.active;
  return (
    <span
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: 12,
        fontWeight: 600,
        color: meta.color,
        background: meta.bg,
        borderRadius: 999,
        padding: "4px 12px",
      }}
    >
      {meta.label}
    </span>
  );
}

function Timeline({ statusLog }) {
  return (
    <div style={{ marginTop: 16, borderLeft: "2px solid #E4E0D6", paddingLeft: 20 }}>
      {statusLog.map((event, i) => (
        <div key={i} style={{ marginBottom: 14, position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: -25,
              top: 4,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#A87C2A",
            }}
          />
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#8A887F" }}>
            {event.date}
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14.5, fontWeight: 600, color: "#2B2A28" }}>
            {STATUS_LABELS[event.status] || event.status}
          </p>
          {event.note && (
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#5A5952", marginTop: 2 }}>
              {event.note}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function BillCard({ bill, emailCount }) {
  const [expanded, setExpanded] = useState(false);
  const before = bill.statusLog[0];
  const after = bill.statusLog[bill.statusLog.length - 1];

  return (
    <div
      style={{
        border: "1px solid #E4E0D6",
        borderRadius: 16,
        padding: 24,
        background: "#FFFFFF",
        marginBottom: 20,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "#A87C2A" }}>
            {bill.jurisdiction} · {bill.number}
          </p>
          <h3 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 20, fontWeight: 600, color: "#1B2A4A", marginTop: 4 }}>
            {bill.name}
          </h3>
        </div>
        <StatusPill result={bill.result} />
      </div>

      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14.5, lineHeight: 1.6, color: "#5A5952", marginTop: 12 }}>
        {bill.summary}
      </p>

      <div style={{ display: "flex", gap: 20, marginTop: 16, fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#5A5952" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Mail size={14} /> {(emailCount ?? 0).toLocaleString()} emails sent
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Users size={14} /> {bill.meetingsHeld} meetings
        </span>
        <span>AV involved since {bill.avInvolvedSince}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, fontFamily: "Inter, sans-serif", fontSize: 13.5 }}>
        <span style={{ background: "#F0EEE7", borderRadius: 8, padding: "4px 10px", color: "#5A5952" }}>
          Then: <strong>{STATUS_LABELS[before.status]}</strong>
        </span>
        <span style={{ color: "#A87C2A" }}>→</span>
        <span style={{ background: "#F7EEDD", borderRadius: 8, padding: "4px 10px", color: "#2B2A28" }}>
          Now: <strong>{STATUS_LABELS[after.status]}</strong>
        </span>
      </div>

      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          marginTop: 14,
          fontFamily: "Inter, sans-serif",
          fontSize: 13.5,
          fontWeight: 600,
          color: "#1B2A4A",
          background: "none",
          border: "none",
          textDecoration: "underline",
          cursor: "pointer",
          padding: 0,
        }}
      >
        {expanded ? "Hide full timeline" : "See full status timeline"}
      </button>

      {expanded && <Timeline statusLog={bill.statusLog} />}

      <a
        href={bill.officialUrl}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginTop: 16,
          fontFamily: "Inter, sans-serif",
          fontSize: 13.5,
          color: "#8A887F",
          textDecoration: "none",
        }}
      >
        View official bill text <ExternalLink size={13} />
      </a>
    </div>
  );
}

export default function BillsSupported() {
  const [emailCounts, setEmailCounts] = useState({});
  const [topicFilter, setTopicFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");

  useEffect(() => {
    fetch("/api/bill-email-count", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.ok) setEmailCounts(data.counts || {});
      })
      .catch((e) => console.error("bill-email-count fetch failed", e));
  }, []);

  const filtered = useMemo(
    () =>
      billsSupported.filter(
        (b) =>
          (topicFilter === "all" || b.topic === topicFilter) &&
          (resultFilter === "all" || b.result === resultFilter)
      ),
    [topicFilter, resultFilter]
  );

  const totals = useMemo(() => {
    const emails = Object.values(emailCounts).reduce((sum, v) => sum + (Number(v) || 0), 0);
    return {
      bills: billsSupported.length,
      emails,
      advanced: billsSupported.filter((b) => b.result === "advanced" || b.result === "outcome").length,
      outcomes: billsSupported.filter((b) => b.result === "outcome").length,
    };
  }, [emailCounts]);

  const selectStyle = {
    fontFamily: "Inter, sans-serif",
    fontSize: 14,
    border: "1px solid #E4E0D6",
    borderRadius: 8,
    padding: "8px 12px",
    background: "#FFFFFF",
    color: "#2B2A28",
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: "#2B2A28", background: "#FAF8F3", minHeight: "100%" }}>
      <style>{FONT_IMPORT}</style>
      <Nav />
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "56px 24px 32px" }}>
        <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#A87C2A", fontWeight: 500, marginBottom: 16 }}>
          Advocacy in Action
        </p>
        <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 40, fontWeight: 600, color: "#1B2A4A" }}>
          Bills We've Supported
        </h1>
        <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "#5A5952", maxWidth: 640, marginTop: 16 }}>
          Every bill below has been the subject of a constituent email campaign, testimony, or
          meeting organized through Autoimmune Voices. We track each bill's status from the day
          our advocates got involved through today.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, marginTop: 32 }}>
          {[
            ["Bills Tracked", totals.bills],
            ["Constituent Emails", totals.emails.toLocaleString()],
            ["Bills Advanced", totals.advanced],
            ["Policy Outcomes", totals.outcomes],
          ].map(([label, value]) => (
            <div key={label} style={{ textAlign: "center", background: "#FFFFFF", border: "1px solid #E4E0D6", borderRadius: 12, padding: "18px 8px" }}>
              <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 26, fontWeight: 600, color: "#A87C2A" }}>{value}</p>
              <p style={{ fontSize: 12.5, color: "#5A5952", marginTop: 4 }}>{label}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
          <select value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)} style={selectStyle}>
            <option value="all">All Topics</option>
            {TOPICS.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
          <select value={resultFilter} onChange={(e) => setResultFilter(e.target.value)} style={selectStyle}>
            <option value="all">All Statuses</option>
            <option value="outcome">Policy Outcomes</option>
            <option value="advanced">Advanced</option>
            <option value="active">Active Campaigns</option>
            <option value="no_change">No Change Yet</option>
            <option value="failed">Did Not Advance</option>
          </select>
        </div>

        <div style={{ marginTop: 24 }}>
          {filtered.map((bill) => (
            <BillCard key={bill.id} bill={bill} emailCount={emailCounts[bill.id]} />
          ))}
          {filtered.length === 0 && (
            <p style={{ color: "#8A887F", fontSize: 14.5 }}>No bills match those filters yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
