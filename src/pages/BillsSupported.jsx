// src/pages/BillsSupported.jsx
//
// Not in the top nav — reached via a link inside the Legislation page.
//
// Design matches the rest of the site rather than a generic card grid:
// the navy stat band from Impact.jsx, Fraunces headline treatment, and a
// horizontal status stepper per bill instead of boxed white cards.

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import { ExternalLink, Mail, Users, ArrowLeft } from "lucide-react";
import { billsSupported, STATUS_LABELS, TOPICS } from "../data/billsSupported";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');`;

const STAGE_ORDER = [
  "introduced",
  "referred_to_committee",
  "hearing_scheduled",
  "passed_committee",
  "passed_chamber",
  "passed_both_chambers",
  "signed_into_law",
];

const RESULT_META = {
  outcome: { label: "Policy Outcome", color: "#1B6B3F" },
  advanced: { label: "Advanced", color: "#1B6B3F" },
  active: { label: "Active Campaign", color: "#A87C2A" },
  no_change: { label: "No Change Yet", color: "#8A8880" },
  failed: { label: "Did Not Advance", color: "#B23B3B" },
};

function Stepper({ statusLog, result }) {
  const reached = new Set(statusLog.map((e) => e.status));
  const currentStatus = statusLog[statusLog.length - 1].status;
  const currentIdx = STAGE_ORDER.indexOf(currentStatus);
  const isTerminalOther = result === "failed" || result === "adopted"; // off the normal ladder

  if (isTerminalOther) {
    return (
      <p style={{ fontSize: 13, color: RESULT_META[result]?.color || "#8A8880", fontWeight: 600 }}>
        {STATUS_LABELS[currentStatus] || currentStatus}
      </p>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {STAGE_ORDER.map((stage, i) => {
        const isPast = i < currentIdx || reached.has(stage);
        const isCurrent = i === currentIdx;
        return (
          <React.Fragment key={stage}>
            <div
              title={STATUS_LABELS[stage]}
              style={{
                width: isCurrent ? 10 : 7,
                height: isCurrent ? 10 : 7,
                borderRadius: "50%",
                background: isCurrent ? "#A87C2A" : isPast ? "#1B2A4A" : "#E4E0D6",
                flexShrink: 0,
              }}
            />
            {i < STAGE_ORDER.length - 1 && (
              <div style={{ width: 18, height: 2, background: i < currentIdx ? "#1B2A4A" : "#E4E0D6" }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function BillRow({ bill, emailCount }) {
  const [expanded, setExpanded] = useState(false);
  const before = bill.statusLog[0];
  const after = bill.statusLog[bill.statusLog.length - 1];
  const meta = RESULT_META[bill.result] || RESULT_META.active;

  return (
    <div style={{ borderBottom: "1px solid #E4E0D6", padding: "32px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 380px", minWidth: 280 }}>
          <p style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "#A87C2A", marginBottom: 6 }}>
            {bill.jurisdiction} · {bill.number}
          </p>
          <h3 style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 500, color: "#1B2A4A", margin: 0 }}>
            {bill.name}
          </h3>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "#5A5952", marginTop: 10, maxWidth: 520 }}>
            {bill.summary}
          </p>

          <div style={{ display: "flex", gap: 20, marginTop: 16, fontSize: 13, color: "#8A8880" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Mail size={13} /> {emailCount.toLocaleString()} {emailCount === 1 ? "email" : "emails"} sent
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Users size={13} /> {bill.meetingsHeld} {bill.meetingsHeld === 1 ? "meeting" : "meetings"}
            </span>
          </div>

          {(emailCount > 0 || bill.meetingsHeld > 0 || bill.outcome) && (
            <div
              style={{
                marginTop: 16,
                background: "#FFFFFF",
                border: "1px solid #E4E0D6",
                borderLeft: "3px solid #A87C2A",
                borderRadius: 4,
                padding: "16px 18px",
                maxWidth: 520,
              }}
            >
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#A87C2A", marginBottom: 6 }}>
                AV's role
              </p>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "#5A5952", margin: 0 }}>
                AV advocates have been engaged with this bill since {bill.avInvolvedSince}
                {emailCount > 0 ? `, sending ${emailCount.toLocaleString()} constituent ${emailCount === 1 ? "email" : "emails"} to legislators` : ""}
                {bill.meetingsHeld > 0 ? ` and holding ${bill.meetingsHeld} ${bill.meetingsHeld === 1 ? "meeting" : "meetings"} with legislative staff` : ""}.
              </p>

              {bill.outcome && (
                <>
                  <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#1B2A4A", marginTop: 14, marginBottom: 6 }}>
                    What changed
                  </p>
                  <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "#2B2A28", margin: 0 }}>
                    {bill.outcome}
                  </p>
                </>
              )}
            </div>
          )}


          <a
            href={bill.officialUrl}
            target="_blank"
            rel="noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 12, fontSize: 13, color: "#8A8880", textDecoration: "none" }}
          >
            Official bill text <ExternalLink size={11} />
          </a>
        </div>

        <div style={{ flex: "0 0 220px", textAlign: "right" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: meta.color, marginBottom: 12 }}>{meta.label}</p>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Stepper statusLog={bill.statusLog} result={bill.result} />
          </div>
          <p style={{ fontSize: 12, color: "#8A8880", marginTop: 10 }}>
            Since {bill.avInvolvedSince}: <strong style={{ color: "#2B2A28" }}>{STATUS_LABELS[before.status]}</strong> → <strong style={{ color: "#2B2A28" }}>{STATUS_LABELS[after.status]}</strong>
          </p>
          <button
            onClick={() => setExpanded((v) => !v)}
            style={{ marginTop: 10, fontSize: 12.5, fontWeight: 600, color: "#1B2A4A", background: "none", border: "none", textDecoration: "underline", cursor: "pointer", padding: 0 }}
          >
            {expanded ? "Hide timeline" : "Full timeline"}
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: 20, paddingLeft: 4, borderLeft: "2px solid #E4E0D6" }}>
          {bill.statusLog.map((event, i) => (
            <div key={i} style={{ padding: "0 0 14px 18px", position: "relative" }}>
              <div style={{ position: "absolute", left: -6, top: 4, width: 8, height: 8, borderRadius: "50%", background: "#A87C2A" }} />
              <p style={{ fontSize: 12, color: "#8A8880" }}>{event.date}</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#2B2A28" }}>{STATUS_LABELS[event.status] || event.status}</p>
              {event.note && <p style={{ fontSize: 13.5, color: "#5A5952" }}>{event.note}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BillsSupported() {
  const [liveCounts, setLiveCounts] = useState({});
  const [topicFilter, setTopicFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");

  useEffect(() => {
    fetch("/api/bill-email-count", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => data.ok && setLiveCounts(data.counts || {}))
      .catch(() => {});
  }, []);

  // Total shown per bill = whatever's been sent since tracking started
  // (Redis) + whatever you already knew about from before (baseline).
  const emailCountFor = (bill) => (liveCounts[bill.id] || 0) + (bill.historicalEmailsBaseline || 0);

  const filtered = useMemo(
    () =>
      billsSupported.filter(
        (b) => (topicFilter === "all" || b.topic === topicFilter) && (resultFilter === "all" || b.result === resultFilter)
      ),
    [topicFilter, resultFilter]
  );

  const totals = useMemo(() => {
    const emails = billsSupported.reduce((sum, b) => sum + emailCountFor(b), 0);
    return {
      bills: billsSupported.length,
      emails,
      advanced: billsSupported.filter((b) => b.result === "advanced" || b.result === "outcome").length,
      outcomes: billsSupported.filter((b) => b.result === "outcome").length,
    };
  }, [liveCounts]);

  const selectStyle = {
    fontFamily: "Inter, sans-serif",
    fontSize: 13.5,
    border: "none",
    borderBottom: "1px solid #C9C4B6",
    background: "transparent",
    color: "#2B2A28",
    padding: "4px 20px 4px 0",
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: "#2B2A28", background: "#FAF8F3", minHeight: "100%" }}>
      <style>{FONT_IMPORT}</style>
      <Nav />

      <section style={{ maxWidth: 700, margin: "0 auto", padding: "48px 24px 0", textAlign: "center" }}>
        <Link to="/legislation" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#8A8880", textDecoration: "none", marginBottom: 20 }}>
          <ArrowLeft size={13} /> Back to Legislation
        </Link>
        <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 500, fontSize: "clamp(38px, 7vw, 60px)", lineHeight: 1.05, color: "#1B2A4A", letterSpacing: "-0.01em" }}>
          Bills we've supported
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: "#5A5952", maxWidth: 520, margin: "16px auto 0" }}>
          Every bill here has been the subject of a constituent email campaign, testimony, or
          meeting organized through AV. We track each one's status from the day our advocates
          got involved through today.
        </p>
      </section>

      {/* Stat band — same navy treatment as the Impact page */}
      <section style={{ background: "#1B2A4A", padding: "48px 24px", marginTop: 40 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, textAlign: "center" }}>
          {[
            [totals.bills, "Bills tracked"],
            [totals.emails.toLocaleString(), "Constituent emails"],
            [totals.advanced, "Bills advanced"],
            [totals.outcomes, "Policy outcomes"],
          ].map(([value, label]) => (
            <div key={label}>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(32px, 5vw, 48px)", color: "#FAF8F3", fontWeight: 500, lineHeight: 1 }}>
                {value}
              </div>
              <div style={{ fontSize: 12, letterSpacing: "0.05em", textTransform: "uppercase", color: "#C4C8D6", marginTop: 8 }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 800, margin: "0 auto", padding: "12px 24px 0" }}>
        <p style={{ fontSize: 12.5, color: "#8A8880", textAlign: "center" }}>
          Counts only emails sent about the specific bills below. See the full picture of every
          letter sent across all tracked legislation on the{" "}
          <Link to="/legislation" style={{ color: "#A87C2A" }}>Legislation page</Link>.
        </p>
      </section>

      <section style={{ maxWidth: 800, margin: "0 auto", padding: "24px 24px 80px" }}>
        <div style={{ display: "flex", gap: 24, marginBottom: 8 }}>
          <select value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)} style={selectStyle}>
            <option value="all">All topics</option>
            {TOPICS.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
          <select value={resultFilter} onChange={(e) => setResultFilter(e.target.value)} style={selectStyle}>
            <option value="all">All statuses</option>
            <option value="outcome">Policy outcomes</option>
            <option value="advanced">Advanced</option>
            <option value="active">Active campaigns</option>
            <option value="no_change">No change yet</option>
            <option value="failed">Did not advance</option>
          </select>
        </div>

        <div style={{ marginTop: 12 }}>
          {filtered.map((bill) => (
            <BillRow key={bill.id} bill={bill} emailCount={emailCountFor(bill)} />
          ))}
          {filtered.length === 0 && <p style={{ color: "#8A8880", padding: "24px 0" }}>No bills match those filters yet.</p>}
        </div>
      </section>
    </div>
  );
}
