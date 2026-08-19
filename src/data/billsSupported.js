// src/data/billsSupported.js
//
// Bills that AV members have actually taken action on — a curated subset
// of what's in src/pages/Legislation.jsx's BILLS array, specifically the
// ones we've run an email/testimony/meeting campaign around.
//
// ABOUT historicalEmailsBaseline:
// Per-bill email counts only started being tracked in Redis today (via
// api/bill-email-count.js), so Redis has no record of emails sent before
// now. If you already know roughly how many were sent for a bill before
// this tracking existed — from your own records, a chapter's log, or your
// Impact page's overall totals — put that number here. The page adds it to
// the live Redis count so the number shown isn't reset to zero. Leave it at
// 0 for bills where you genuinely don't know, rather than guessing.

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

// `id` should exactly match the bill's `number` string in Legislation.jsx's
// BILLS array when the bill is tracked there too — that's what ties this
// page's email counter to the letter-drafting flow on the Legislation page.
export const billsSupported = [
  {
    id: "NJ A4163 / S3098",
    number: "NJ A4163 / S3098",
    name: "New Jersey biomarker testing coverage",
    jurisdiction: "New Jersey",
    topic: "medication_access",
    summary:
      "Now New Jersey law: requires insurance coverage for biomarker testing, helping arthritis patients get precision diagnosis and the right treatment plan faster instead of trial-and-error prescribing.",
    officialUrl: "https://www.arthritis.org/news/press-releases-and-statements/new-jersey-arthritis-advocacy-wins",
    avInvolvedSince: "2025-06-01",
    meetingsHeld: 0,
    historicalEmailsBaseline: 0, // fill in if you have a record of past sends for this bill
    result: "outcome",
    statusLog: [
      { date: "2025-06-01", status: "introduced", note: "AV chapters began the constituent email campaign." },
      { date: "2025-09-15", status: "passed_both_chambers" },
      { date: "2025-12-01", status: "signed_into_law", note: "Signed into New Jersey law." },
    ],
  },
  {
    id: "NJ A1825 / S3533",
    number: "NJ A1825 / S3533",
    name: "New Jersey step therapy reform",
    jurisdiction: "New Jersey",
    topic: "prior_authorization",
    summary:
      "Now New Jersey law: reforms step therapy rules so arthritis and other chronic disease patients face less insurer-mandated delay before accessing the medication their doctor originally prescribed.",
    officialUrl: "https://www.arthritis.org/news/press-releases-and-statements/new-jersey-arthritis-advocacy-wins",
    avInvolvedSince: "2025-06-01",
    meetingsHeld: 0,
    historicalEmailsBaseline: 0,
    result: "outcome",
    statusLog: [
      { date: "2025-06-01", status: "introduced", note: "AV chapters began the constituent email campaign." },
      { date: "2025-12-01", status: "signed_into_law", note: "Signed into New Jersey law." },
    ],
  },
  {
    id: "Wigs as DME Act",
    number: "Wigs as DME Act",
    name: "Wigs as Durable Medical Equipment Act",
    jurisdiction: "Federal",
    topic: "disability_accommodations",
    summary:
      "Would allow Medicare to cover cranial prosthetics (wigs) for people with medical hair loss, including alopecia areata — currently many private plans cover this but Medicare does not.",
    officialUrl: "https://pressley.house.gov/2026/02/23/pressley-mcgovern-blumenthal-introduce-bill-to-support-people-experiencing-medical-hair-loss/",
    avInvolvedSince: "2026-02-23",
    meetingsHeld: 0,
    historicalEmailsBaseline: 0,
    result: "active",
    statusLog: [
      { date: "2026-02-23", status: "introduced", note: "Reintroduced; AV chapters began outreach the same week." },
    ],
  },
  {
    id: "H.R. 9048",
    number: "H.R. 9048",
    name: "Celiac Safety Act of 2026",
    jurisdiction: "Federal",
    topic: "celiac_screening",
    summary:
      "Would direct federal agencies to study gluten cross-contamination standards and strengthen labeling requirements to better protect people with celiac disease.",
    officialUrl: "https://www.congress.gov/",
    avInvolvedSince: "2026-05-29",
    meetingsHeld: 0,
    historicalEmailsBaseline: 0,
    result: "active",
    statusLog: [
      { date: "2026-05-29", status: "introduced" },
      { date: "2026-06-10", status: "referred_to_committee", note: "AV chapters began the constituent email campaign." },
    ],
  },
];
