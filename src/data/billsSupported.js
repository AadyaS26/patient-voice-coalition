// src/data/billsSupported.js
//
// Bills that AV members have actually taken action on — a curated subset
// of what's in src/pages/Legislation.jsx's BILLS array, specifically the
// ones we've run an email/testimony/meeting campaign around.
//
// ABOUT historicalEmailsBaseline:
// Per-bill email counts only started being tracked in Redis when this page
// launched, so Redis has no record of emails sent before that. If you know
// roughly how many were sent for a specific bill before this tracking
// existed — from a chapter's log or your own records — put that number
// here. The page adds it to the live Redis count. Leave it at 0 for bills
// where you genuinely don't have a per-bill record, rather than guessing —
// the site-wide "letters-sent" total (currently 715) covers letters about
// every bill on the whole Legislation page, most of which aren't in this
// curated list, so it can't be split evenly across these bills without
// making up numbers.
//
// ABOUT outcome:
// Optional. A short, factual sentence about what actually changed as a
// result of the bill becoming law/policy — NOT a claim that AV specifically
// caused it, unless you have documented proof (a legislator's staff or a
// hearing record crediting AV by name). Per your own Barron checklist:
// say "the bill advanced while AV advocates were involved," not "our
// advocacy caused it," unless you can prove causation. The page shows this
// next to a separately-generated "AV's role" line built from real tracked
// data (email count, campaign start date, meetings) rather than invented
// prose, so nothing here needs to assert what AV did — just what changed.
// Leave blank for active campaigns with no result yet.

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
  { id: "awareness", label: "Disease Awareness" },
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
    outcome:
      "Signed into law in New Jersey — insurers in the state must now cover biomarker testing for eligible patients, removing a cost barrier that previously forced many arthritis patients through months of trial-and-error prescribing before reaching an effective treatment.",
    officialUrl: "https://www.arthritis.org/news/press-releases-and-statements/new-jersey-arthritis-advocacy-wins",
    avInvolvedSince: "2025-06-01",
    meetingsHeld: 0,
    historicalEmailsBaseline: 0, // fill in from your own records if you have a per-bill count
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
    outcome:
      "Signed into law in New Jersey — insurers must now follow reformed step therapy rules, shortening the delay chronic disease patients face before getting the medication their doctor originally prescribed instead of insurer-mandated alternatives first.",
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
    outcome: "", // no result yet — active campaign
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
    outcome: "",
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
  {
    id: "GA HB94",
    number: "GA HB94",
    name: "Georgia fertility preservation coverage",
    jurisdiction: "Georgia",
    topic: "insurance_protections",
    summary:
      "Now Georgia law: requires health insurance policies to cover standard fertility preservation services (egg, sperm, embryo, and ovarian tissue cryopreservation) for patients whose medically necessary treatment for cancer, sickle cell disease, or lupus may cause infertility.",
    outcome:
      "Signed into law in Georgia, effective January 1, 2026 — insurers must cover fertility preservation procedures for eligible lupus, cancer, and sickle cell patients, including evaluation, lab assessments, medication, and one year of gamete storage.",
    officialUrl: "https://legiscan.com/GA/bill/HB94/2025",
    avInvolvedSince: "2026-08-17", // approximate — see note in comment block at top of file
    meetingsHeld: 0,
    historicalEmailsBaseline: 0, // see flagged legislator-routing issue in Legislation.jsx before backfilling this
    result: "outcome",
    statusLog: [
      { date: "2025-05-01", status: "signed_into_law", note: "Signed into Georgia law, effective the same day." },
    ],
  },
  {
    id: "NY S06603",
    number: "NY S06603",
    name: "New York Lupus Research Enhancement Program (Senate)",
    jurisdiction: "New York",
    topic: "research_funding",
    summary:
      "Would create a Lupus Research Enhancement Program and Fund within the NY Department of Health, providing grants to state academic medical institutions conducting basic, clinical, translational, and epidemiological lupus research. Senate companion to A01175.",
    outcome: "",
    officialUrl: "https://www.nysenate.gov/legislation/bills/2025/S6603",
    avInvolvedSince: "2026-08-17",
    meetingsHeld: 0,
    historicalEmailsBaseline: 0,
    result: "active",
    statusLog: [
      { date: "2025-03-18", status: "introduced" },
    ],
  },
  {
    id: "NY A01175",
    number: "NY A01175",
    name: "New York Lupus Research Enhancement Program (Assembly)",
    jurisdiction: "New York",
    topic: "research_funding",
    summary:
      "Assembly companion to S06603 — would create a Lupus Research Enhancement Program and Fund within the NY Department of Health, providing grants to state academic medical institutions conducting lupus research.",
    outcome: "",
    officialUrl: "https://www.nysenate.gov/legislation/bills/2025/A1175",
    avInvolvedSince: "2026-08-17",
    meetingsHeld: 0,
    historicalEmailsBaseline: 0,
    result: "active",
    statusLog: [
      { date: "2025-01-09", status: "introduced" },
    ],
  },
  {
    id: "GA HR1473",
    number: "GA HR1473",
    name: "Georgia House Study Committee on Lupus",
    jurisdiction: "Georgia",
    topic: "research_funding",
    summary:
      "A resolution creating a House Study Committee on Lupus to examine the disease's impact on Georgians and recommend legislative action.",
    outcome: "",
    officialUrl: "https://legiscan.com/GA/bill/HR1473/2025",
    avInvolvedSince: "2026-08-17",
    meetingsHeld: 0,
    historicalEmailsBaseline: 0,
    result: "active",
    statusLog: [
      { date: "2026-02-25", status: "introduced" },
      { date: "2026-03-03", status: "referred_to_committee", note: "House Second Readers; pending House Special Rules Committee." },
    ],
  },
  {
    id: "CA SR107",
    number: "CA SR107",
    name: "California Lupus Awareness Month resolution",
    jurisdiction: "California",
    topic: "awareness",
    summary:
      "A Senate resolution relative to Lupus Awareness Month, recognizing the impact of lupus on Californians.",
    outcome: "",
    officialUrl: "https://legiscan.com/CA/bill/SR107/2025",
    avInvolvedSince: "2026-08-17",
    meetingsHeld: 0,
    historicalEmailsBaseline: 0,
    result: "active",
    statusLog: [
      { date: "2026-04-30", status: "introduced", note: "Referred to Senate Rules Committee." },
    ],
  },
  {
    id: "NJ S793",
    number: "NJ S793",
    name: "New Jersey IBD/Crohn's disability parking access",
    jurisdiction: "New Jersey",
    topic: "disability_accommodations",
    summary:
      "Would allow people diagnosed with inflammatory bowel disease, IBS, or Crohn's disease to qualify for parking privileges currently reserved for persons with disabilities — recognizing the urgent, unpredictable nature of flares.",
    outcome: "",
    officialUrl: "https://legiscan.com/NJ/bill/S793/2026",
    avInvolvedSince: "2026-08-17",
    meetingsHeld: 0,
    historicalEmailsBaseline: 0,
    result: "active",
    statusLog: [
      { date: "2026-01-13", status: "introduced", note: "Carryover of previous session's S689/A4103; referred to Senate Transportation Committee." },
    ],
  },
  {
    id: "H.R. 6199",
    number: "H.R. 6199",
    name: "MNT Act of 2025",
    jurisdiction: "Federal",
    topic: "medication_access",
    summary:
      "Would expand Medicare Part B to cover dietitian-led medical nutrition therapy for celiac disease, so patients can get counseling on managing a lifelong gluten-free diet.",
    outcome: "",
    officialUrl: "https://celiac.org/2025/11/25/mnt-act-introduced-in-us-house-of-representatives/",
    avInvolvedSince: "2026-08-17",
    meetingsHeld: 0,
    historicalEmailsBaseline: 0,
    result: "active",
    statusLog: [
      { date: "2025-11-01", status: "introduced" },
    ],
  },
  {
    id: "H.Res. 245",
    number: "H.Res. 245",
    name: "Sjögren's Awareness Month",
    jurisdiction: "Federal",
    topic: "awareness",
    summary:
      "A resolution supporting expanded research, better diagnostic tools, and improved physician awareness for Sjögren's disease, and designating April as Sjögren's Awareness Month.",
    outcome: "",
    officialUrl: "https://www.congress.gov/bill/119th-congress/house-resolution/245",
    avInvolvedSince: "2026-08-17",
    meetingsHeld: 0,
    historicalEmailsBaseline: 0,
    result: "active",
    statusLog: [
      { date: "2025-03-01", status: "introduced", note: "Referred to committee." },
    ],
  },
];
