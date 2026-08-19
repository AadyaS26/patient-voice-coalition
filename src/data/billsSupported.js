// src/data/billsSupported.js
//
// Bills that AV members have actually taken action on (sent a legislator
// email, testified, or met with staff) — NOT the general legislation
// database in src/pages/Legislation.jsx, which tracks bills whether or not
// we've acted on them.
//
// `statusLog` is a dated history, oldest first. The first entry should be
// the bill's status on the day AV involvement started; the last entry is
// wherever it stands today. Add a new entry to the end whenever the status
// changes — don't overwrite old ones.

export const STATUS_LABELS = {
  introduced: "Introduced",
  referred_to_committee: "Referred to Committee",
  hearing_scheduled: "Hearing Scheduled",
  passed_committee: "Passed Committee",
  passed_chamber: "Passed One Chamber",
  passed_both_chambers: "Passed Both Chambers",
  signed_into_law: "Signed Into Law",
  adopted: "Adopted",
  failed: "Failed",
  stalled: "Stalled",
};

export const TOPICS = [
  { id: "celiac_screening", label: "Celiac Screening" },
  { id: "affordability", label: "Healthcare Affordability" },
  { id: "prior_authorization", label: "Prior Authorization" },
  { id: "medication_access", label: "Medication Access" },
  { id: "delayed_diagnosis", label: "Delayed Diagnosis" },
  { id: "disability_accommodations", label: "Disability Accommodations" },
  { id: "insurance_protections", label: "Insurance Protections" },
  { id: "research_funding", label: "Autoimmune Research" },
  { id: "specialty_access", label: "Specialty Care Access" },
];

// `id` must exactly match that bill's `number` string in the BILLS array
// inside src/pages/Legislation.jsx, if it's tracked there too — that's what
// ties the two pages' counters together automatically. If a bill only lives
// here (never entered into Legislation.jsx), any URL-safe slug is fine.
export const billsSupported = [
  // ---- duplicate this block per bill, then delete once you have real ones ----
  {
    id: "WA HB 0000",
    number: "WA HB 0000",
    name: "Example: Prior Authorization Reform Act",
    jurisdiction: "Washington",
    topic: "prior_authorization",
    summary:
      "Would require insurers to respond to prior authorization requests within 48 hours for chronic disease medications.",
    officialUrl: "https://app.leg.wa.gov/",
    avInvolvedSince: "2026-01-15",
    meetingsHeld: 0,
    result: "active", // "outcome" | "advanced" | "active" | "no_change" | "failed"
    statusLog: [
      { date: "2026-01-10", status: "introduced", note: "Bill introduced by primary sponsor." },
      {
        date: "2026-01-15",
        status: "referred_to_committee",
        note: "AV chapter leads began the constituent email campaign this same week.",
      },
    ],
  },
];
