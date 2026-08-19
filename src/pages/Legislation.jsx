import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import { Search, ExternalLink, Mail, Filter, CheckCircle2, FileCheck, ArrowRight } from "lucide-react";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');`;

const CONDITIONS = [
  "All conditions",
  "Alopecia areata",
  "Ankylosing spondylitis",
  "Antiphospholipid syndrome",
  "Atopic dermatitis",
  "Behçet's disease",
  "Bullous pemphigoid",
  "Celiac disease",
  "Crohn's disease",
  "Dermatitis herpetiformis",
  "Dermatomyositis",
  "Endometriosis",
  "Eosinophilic esophagitis",
  "Fibromyalgia",
  "General autoimmune",
  "Giant cell arteritis",
  "Glomerulonephritis",
  "Goodpasture's syndrome",
  "Granulomatosis with polyangiitis",
  "Graves' disease",
  "Guillain-Barré syndrome",
  "Hashimoto's thyroiditis",
  "Hemolytic anemia",
  "Henoch-Schönlein purpura",
  "Hidradenitis suppurativa",
  "IgA nephropathy",
  "IgG4-related disease",
  "Immune thrombocytopenic purpura",
  "Inclusion body myositis",
  "Interstitial cystitis",
  "Juvenile arthritis",
  "Kawasaki disease",
  "Lambert-Eaton myasthenic syndrome",
  "Lichen planus",
  "Lichen sclerosus",
  "Lupus (SLE)",
  "Mixed connective tissue disease",
  "Multiple sclerosis",
  "Myasthenia gravis",
  "Narcolepsy",
  "Optic neuritis",
  "Pemphigus",
  "Peripheral neuropathy",
  "Pernicious anemia",
  "Polyarteritis nodosa",
  "Polymyalgia rheumatica",
  "Polymyositis",
  "Primary biliary cholangitis",
  "Primary sclerosing cholangitis",
  "Psoriasis",
  "Psoriatic arthritis",
  "Pyoderma gangrenosum",
  "Raynaud's phenomenon",
  "Reactive arthritis",
  "Relapsing polychondritis",
  "Rheumatic fever",
  "Rheumatoid arthritis",
  "Sarcoidosis",
  "Scleroderma",
  "Sjögren's disease",
  "Stiff person syndrome",
  "Takayasu's arteritis",
  "Transverse myelitis",
  "Type 1 diabetes",
  "Ulcerative colitis",
  "Undifferentiated connective tissue disease",
  "Uveitis",
  "Vasculitis",
  "Vitiligo",
];

// Countries we currently track legislation/policy for. "United States" covers
// federal Congress.gov bills plus state-level bills (both the curated BILLS
// list and the live GitHub-synced feeds, none of which carry a country field
// of their own since they're US-only data sources).
// Countries we can filter by. Bills are tracked for a subset of these so far —
// selecting a country with nothing tracked yet gives an honest empty state
// plus a link to find your representative, rather than hiding the country.
const COUNTRIES = [
  "All countries",
  "United States",
  "United Kingdom",
  "Ireland",
  "Canada",
  "Australia",
  "European Union",
  "Argentina",
  "Bangladesh",
  "Barbados",
  "Belgium",
  "Brazil",
  "Chile",
  "Colombia",
  "Denmark",
  "Egypt",
  "France",
  "Germany",
  "Ghana",
  "Guyana",
  "India",
  "Indonesia",
  "Italy",
  "Jamaica",
  "Japan",
  "Kenya",
  "Malaysia",
  "Mexico",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Pakistan",
  "Philippines",
  "Poland",
  "Portugal",
  "Singapore",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "Sweden",
  "Switzerland",
  "Trinidad and Tobago",
  "Türkiye",
  "United Arab Emirates",
];

// EU member states — EU-level legislation (accessibility act, disability card,
// orphan drug rules) applies to these too, so selecting e.g. Germany should
// surface the EU entries rather than showing an empty list.
const EU_MEMBERS = new Set([
  "Belgium", "Denmark", "France", "Germany", "Ireland", "Italy",
  "Netherlands", "Poland", "Portugal", "Spain", "Sweden",
]);

// The address-based "find my legislators" lookup (/api/find-representatives)
// only covers US federal/state legislators. For other countries we point
// people to their own parliament's official member directory where we've
// verified one, and otherwise to IPU Parline — the Inter-Parliamentary
// Union's directory covering 193 national parliaments. We'd rather send
// someone to a real directory than guess at a URL that might not exist.
const REP_FINDER = {
  "United Kingdom": { label: "Find your MP — WriteToThem", url: "https://www.writetothem.com/" },
  Ireland: { label: "Find your TD — Oireachtas", url: "https://www.oireachtas.ie/en/members/members-of-the-oireachtas/" },
  Canada: { label: "Find your MP — House of Commons", url: "https://www.ourcommons.ca/members/en/search" },
  Australia: { label: "Find your MP — Parliament of Australia", url: "https://www.aph.gov.au/Senators_and_Members" },
  "European Union": { label: "Find your MEP — European Parliament", url: "https://www.europarl.europa.eu/meps/en/home" },
  "Trinidad and Tobago": { label: "Find your MP — Parliament of Trinidad and Tobago", url: "https://www.ttparliament.org/members/current-members/" },
};

const IPU_PARLINE = {
  label: "Find your parliament — IPU Parline",
  url: "https://data.ipu.org/",
};

function repFinderFor(country) {
  return REP_FINDER[country] || IPU_PARLINE;
}

// Exported so src/pages/BillsSupported.jsx can look up real bill details
// (name, summary, url) for any bill that receives a send, even ones not
// manually curated into src/data/billsSupported.js.
export const BILLS = [
  {
    number: "NJ A4163 / S3098",
    name: "New Jersey biomarker testing coverage",
    fullName: "New Jersey biomarker testing coverage law",
    sponsor: "New Jersey Legislature",
    introduced: "2025",
    status: "Signed into law",
    condition: "Rheumatoid arthritis",
    summary:
      "Now New Jersey law: requires insurance coverage for biomarker testing, helping arthritis patients get precision diagnosis and the right treatment plan faster instead of trial-and-error prescribing.",
    url: "https://www.arthritis.org/news/press-releases-and-statements/new-jersey-arthritis-advocacy-wins",
  },
  {
    number: "NJ A1825 / S3533",
    name: "New Jersey step therapy reform",
    fullName: "New Jersey step therapy reform law",
    sponsor: "New Jersey Legislature",
    introduced: "2025",
    status: "Signed into law",
    condition: "Rheumatoid arthritis",
    summary:
      "Now New Jersey law: reforms step therapy rules so arthritis and other chronic disease patients face less insurer-mandated delay before accessing the medication their doctor originally prescribed.",
    url: "https://www.arthritis.org/news/press-releases-and-statements/new-jersey-arthritis-advocacy-wins",
  },
  {
    number: "NJ A5217 / S3818",
    name: "New Jersey copay accumulator ban",
    fullName: "New Jersey copay assistance counting law",
    sponsor: "New Jersey Legislature",
    introduced: "2025",
    status: "Signed into law",
    condition: "Rheumatoid arthritis",
    summary:
      "Now New Jersey law: requires copay assistance from charities or drug manufacturers to actually count toward a patient's deductible and out-of-pocket costs, closing a common insurer loophole.",
    url: "https://www.arthritis.org/news/press-releases-and-statements/new-jersey-arthritis-advocacy-wins",
  },
  {
    number: "Wigs as DME Act",
    name: "Wigs as Durable Medical Equipment Act",
    fullName: "Wigs as Durable Medical Equipment Act",
    sponsor: "Rep. Pressley, Rep. McGovern, Sen. Blumenthal",
    introduced: "Feb 2026",
    status: "Reintroduced",
    condition: "Alopecia areata",
    summary:
      "Would allow Medicare to cover cranial prosthetics (wigs) for people with medical hair loss, including alopecia areata — currently many private plans cover this but Medicare does not.",
    url: "https://pressley.house.gov/2026/02/23/pressley-mcgovern-blumenthal-introduce-bill-to-support-people-experiencing-medical-hair-loss/",
  },
  {
    number: "H.R. 5467",
    name: "PAAT Act",
    fullName: "Patient Access to Autoimmune Treatments Act",
    sponsor: "Rep. Johnson (TX) and Rep. Kennedy (UT)",
    introduced: "Sept 18, 2025",
    status: "Referred to committee",
    condition: "General autoimmune",
    summary:
      "Would require Medicare Part D plans to cover drugs prescribed for autoimmune diseases and certain blood disorders, closing a gap where these treatments are currently left out of required coverage.",
    url: "https://www.congress.gov/bill/119th-congress/house-bill/5467",
  },
  {
    number: "H.R. 9048",
    name: "Celiac Safety Act of 2026",
    fullName: "Celiac Safety Act of 2026",
    sponsor: "Rep. Cleaver and Rep. McCollum",
    introduced: "May 29, 2026",
    status: "Referred to committee",
    condition: "Celiac disease",
    summary:
      "Would amend federal food labeling law to formally classify gluten-containing grain as a major food allergen, giving celiac patients the same labeling protections as other allergen groups.",
    url: "https://www.congress.gov/bill/119th-congress/house-bill/9048",
  },
  {
    number: "H.R. 5684",
    name: "Medical Foods and Formulas Access Act",
    fullName: "Medical Foods and Formulas Access Act of 2025",
    sponsor: "Rep. Rutherford, Rep. Dingell, Rep. Fitzpatrick",
    introduced: "Oct 3, 2025",
    status: "Referred to committee",
    condition: "Celiac disease",
    summary:
      "Would require federal health programs to cover medically necessary foods, including gluten-free foods prescribed for celiac disease, for people with digestive and inherited metabolic disorders.",
    url: "https://www.congress.gov/bill/119th-congress/house-bill/5684",
  },
  {
    number: "H.R. 6199",
    name: "MNT Act of 2025",
    fullName: "Medical Nutrition Therapy Act of 2025",
    sponsor: "Rep. Kelly (IL) and Rep. Kiggans (VA)",
    introduced: "Nov 2025",
    status: "Introduced",
    condition: "Celiac disease",
    summary:
      "Would expand Medicare Part B to cover dietitian-led medical nutrition therapy for celiac disease, so patients can get counseling on managing a lifelong gluten-free diet.",
    url: "https://celiac.org/2025/11/25/mnt-act-introduced-in-us-house-of-representatives/",
  },
  {
    number: "H.Res. 245",
    name: "Sjögren's Awareness Month",
    fullName: "Recognizing Sjögren's disease as a serious systemic autoimmune disease",
    sponsor: "Rep. Morelle",
    introduced: "Mar 2025",
    status: "Referred to committee",
    condition: "Sjögren's disease",
    summary:
      "A resolution supporting expanded research, better diagnostic tools, and improved physician awareness for Sjögren's disease, and designating April as Sjögren's Awareness Month.",
    url: "https://www.congress.gov/bill/119th-congress/house-resolution/245",
  },
  {
    number: "H.Res. 225",
    name: "Autoimmune Awareness Month",
    fullName: "Supporting the designation of March as Autoimmune Awareness Month",
    sponsor: "House sponsors",
    introduced: "Mar 14, 2025",
    status: "Introduced",
    condition: "General autoimmune",
    summary:
      "A resolution supporting increased federal funding for autoimmune disease research and public awareness of the roughly 24 million Americans living with an autoimmune condition.",
    url: "https://www.congress.gov/bill/119th-congress/house-resolution/225",
  },
  {
    number: "S. 2211",
    name: "Special Diabetes Program Reauthorization Act",
    fullName: "Special Diabetes Program Reauthorization Act of 2025",
    sponsor: "Sen. Collins and Sen. Shaheen",
    introduced: "Jul 8, 2025",
    status: "Referred to committee",
    condition: "Type 1 diabetes",
    summary:
      "Would reauthorize federal funding for the Special Diabetes Program, which supports type 1 diabetes research and diabetes care programs for Indian Health Service communities.",
    url: "https://www.congress.gov/bill/119th-congress/senate-bill/2211",
  },
  {
    number: "S. 2587",
    name: "FY26 Labor-HHS-Education Appropriations",
    fullName: "Departments of Labor, Health and Human Services, and Education Appropriations Act, 2026",
    sponsor: "Senate Appropriations Committee",
    introduced: "2025",
    status: "In committee",
    condition: "Lupus (SLE)",
    summary:
      "Sets FY2026 funding for HHS and NIH, including restored funding for the Department of Defense Lupus Research Program and continued NIH investment in autoimmune disease research.",
    url: "https://www.congress.gov/bill/119th-congress/senate-bill/2587",
  },
  {
    number: "H.R. 5509 / S. 2903",
    name: "Safe Step Act",
    fullName: "Safe Step Act",
    sponsor: "Rep. McBath, Rep. Allen, Sen. Murkowski and others",
    introduced: "Sept 2025",
    status: "Referred to committee",
    condition: "General autoimmune",
    summary:
      "Would require employer health plans to offer a clear exceptions process for step therapy, so patients with psoriasis, psoriatic arthritis, IBD, and other chronic conditions can't be forced to fail on cheaper drugs before getting the one their doctor prescribed.",
    url: "https://www.congress.gov/bill/119th-congress/house-bill/5509",
  },
  {
    number: "H.R. 3821",
    name: "ADINA Act",
    fullName: "Allergen Disclosure in Non-Food Articles Act",
    sponsor: "Rep. Morrison",
    introduced: "Jun 6, 2025",
    status: "Referred to committee",
    condition: "Celiac disease",
    summary:
      "Would require drug labels to disclose gluten-containing grains and other major allergens, closing a gap where medications aren't held to the same allergen labeling rules as food.",
    url: "https://www.congress.gov/bill/119th-congress/house-bill/3821",
  },
  {
    number: "H.R. 8385",
    name: "Food Labeling Modernization Act",
    fullName: "Food Labeling Modernization Act of 2026",
    sponsor: "Rep. Pallone and Rep. DeLauro",
    introduced: "Apr 20, 2026",
    status: "Referred to committee",
    condition: "Celiac disease",
    summary:
      "Would strengthen front-of-package labeling rules and require clearer disclosure of gluten-containing grains, making it easier for celiac patients to identify safe foods at a glance.",
    url: "https://www.congress.gov/bill/119th-congress/house-bill/8385",
  },
  {
    number: "IL SB 1288",
    name: "Illinois Allergen Awareness Training Law",
    fullName: "Illinois Public Act 104-0090",
    sponsor: "State Sen. Sally Turner",
    introduced: "2025",
    status: "Signed into law",
    condition: "Celiac disease",
    summary:
      "Now Illinois law: requires food managers to complete training on celiac disease, including symptoms, cross-contact prevention, and gluten-free labeling, and separately recognizes sesame as a major allergen.",
    url: "https://www.nprillinois.org/health-harvest/2025-08-04/new-law-requires-food-safety-training-on-celiac-disease",
  },
  {
    number: "PA SB 629",
    name: "Pennsylvania gluten labeling",
    fullName: "Pennsylvania Senate Bill 629",
    sponsor: "Pennsylvania General Assembly",
    introduced: "2025",
    status: "In committee",
    condition: "Celiac disease",
    summary:
      "Would require labeling of food products that contain gluten-containing grains sold in Pennsylvania, giving celiac patients clearer information at the point of purchase.",
    url: "https://nationalceliac.org/news/support-legislation-that-will-make-a-difference-for-people-living-gluten-free/",
  },
  {
    number: "CA SB 68",
    name: "California allergen notification",
    fullName: "California Senate Bill 68",
    sponsor: "California State Senate",
    introduced: "2025",
    status: "Referred to committee",
    condition: "Celiac disease",
    summary:
      "Would require food facilities that serve or sell restaurant-type food in California to provide written notification of major food allergens, including gluten, contained in each menu item.",
    url: "https://nationalceliac.org/news/support-legislation-that-will-make-a-difference-for-people-living-gluten-free/",
  },
  {
    number: "TX SB 25",
    name: "Texas health and nutrition standards",
    fullName: "Texas Senate Bill 25",
    sponsor: "Texas Legislature",
    introduced: "2025",
    status: "Passed, effective Sept 2025",
    condition: "Celiac disease",
    summary:
      "A signed Texas law setting new health and nutrition standards, including food labeling requirements and continuing education for health care professionals on nutrition-related conditions.",
    url: "https://legiscan.com/TX/text/SB25/id/3247967",
  },
  {
    number: "MA H.5013 / S.2928",
    name: "Massachusetts CAPE Act",
    fullName: "Celiac Awareness and Pediatric Evaluation Act",
    sponsor: "Massachusetts Legislature",
    introduced: "Jan 2026",
    status: "Introduced",
    condition: "Celiac disease",
    summary:
      "Would establish a celiac disease screening pilot program for children in Massachusetts, aimed at catching diagnoses earlier in kids who might otherwise go undiagnosed for years.",
    url: "https://miglutenfreegal.com/gluten-free-legislation-state-federal/",
  },
  {
    number: "NY S.4177",
    name: "New York celiac awareness",
    fullName: "New York Senate Bill S04177",
    sponsor: "New York State Senate",
    introduced: "2025",
    status: "Referred to committee",
    condition: "Celiac disease",
    summary:
      "Would establish a statewide approach to raising awareness of and supporting research for celiac disease in New York through coordinated public health initiatives.",
    url: "https://miglutenfreegal.com/gluten-free-legislation-state-federal/",
  },
  {
    number: "NJ A.2139",
    name: "New Jersey gluten-free certification",
    fullName: "New Jersey Assembly Bill 2139",
    sponsor: "New Jersey General Assembly",
    introduced: "2025",
    status: "Referred to committee",
    condition: "Celiac disease",
    summary:
      "Would establish a voluntary gluten-free certification program for food establishments in New Jersey, giving celiac patients a clearer way to identify safe places to eat.",
    url: "https://miglutenfreegal.com/gluten-free-legislation-state-federal/",
  },
  {
    number: "MD HB 105",
    name: "Maryland allergen disclosure",
    fullName: "Maryland House Bill 105",
    sponsor: "Maryland General Assembly",
    introduced: "2025",
    status: "Referred to committee",
    condition: "Celiac disease",
    summary:
      "Would require Maryland restaurants to make a written disclosure of major food allergens, including gluten, available for each menu item on request.",
    url: "https://miglutenfreegal.com/gluten-free-legislation-state-federal/",
  },

  // --- Insulin price cap laws (Type 1 diabetes) ---
  // 29 states + DC have passed some version of this per the American Diabetes
  // Association's official tracker. These are the specific states we could
  // individually verify by name from real sources — not a fabricated full list.
  ...[
    ["Colorado", "$100/mo", "Jan 2020", "First state in the nation to pass an insulin cap."],
    ["Illinois", "$100/mo", "2021", "Caps insulin copays for commercially insured patients."],
    ["New York", "$100/mo", "2021", "Caps insulin copays for commercially insured patients."],
    ["Washington", "$100/mo", "2021", "Caps insulin copays for commercially insured patients."],
    ["West Virginia", "$100/mo", "2021", "Caps insulin copays for commercially insured patients."],
    ["Virginia", "$50/mo", "2021", "Caps insulin copays for commercially insured patients."],
    ["Maine", "$35/mo", "2021", "Caps insulin copays for commercially insured patients."],
    ["Minnesota", "$35/mo", "2020", "Also created an emergency insulin access program for the uninsured."],
    ["Utah", "$30/mo", "2021", "Caps insulin copays for commercially insured patients."],
    ["New Mexico", "$25/mo", "2020", "One of the lowest state insulin copay caps in the country."],
    ["California", "$35/mo", "Effective 2026", "Signed Oct 2025 (SB 40); also bans step therapy as a prerequisite for insulin coverage."],
    ["Connecticut", "$25/mo", "2020", "Also caps diabetes devices and supplies at $100/month."],
    ["Delaware", "$100/mo", "2020", "Caps insulin copays for commercially insured patients."],
    ["Kentucky", "$35/mo", "2023", "Caps insulin copays for commercially insured patients."],
    ["Maryland", "$35/mo", "2021", "Caps insulin copays for commercially insured patients."],
    ["Montana", "$35/mo", "2023", "Signed into law after Arizona and California's similar efforts were vetoed or stalled."],
  ].map(([state, cap, year, note]) => ({
    number: `${state} — Insulin Cap`,
    name: `${state} insulin price cap`,
    fullName: `${state} insulin copay cap law`,
    sponsor: `${state} legislature`,
    introduced: year,
    status: "Signed into law",
    condition: "Type 1 diabetes",
    summary: `Caps out-of-pocket insulin costs at ${cap} for commercially insured residents. ${note}`,
    url: "https://diabetes.org/tools-resources/affordable-insulin/state-insulin-copay-caps",
  })),

  // --- Step therapy override laws (general chronic/autoimmune) ---
  // 37 states have passed some version per the Safe Step Act's own tracker;
  // these are the specific states we could individually verify by name.
  ...[
    ["New York", "2025 update strengthens override rights, effective Jan 2026"],
    ["Illinois", "2025 law bars step therapy in cases of contraindication or current stability on a drug"],
    ["Minnesota", "Establishes a step therapy override process for prescription drug coverage"],
    ["Mississippi", "Establishes step therapy / fail-first override protocol"],
    ["Missouri", "One of the earliest state step therapy override laws"],
    ["New Mexico", "Establishes guidelines for step therapy under the state insurance code"],
    ["Georgia", "Passed a step therapy override law after multi-year advocacy push"],
    ["Virginia", "Passed a step therapy override law after multi-year advocacy push"],
    ["Arkansas", "Requires 72-hour response time to override requests"],
    ["Texas", "Requires 72-hour response time to override requests"],
    ["New Jersey", "Effective Jan 2026; adds guardrails including for Medicaid plans"],
    ["Vermont", "2025 reform focused on chronic condition documentation and treatment continuity"],
  ].map(([state, note]) => ({
    number: `${state} — Step Therapy`,
    name: `${state} step therapy override law`,
    fullName: `${state} step therapy / "fail-first" override law`,
    sponsor: `${state} legislature`,
    introduced: "Varies by state",
    status: "Signed into law",
    condition: "General autoimmune",
    summary: `Requires insurers to provide a clear override/exception process for step therapy, so patients with conditions like psoriasis, RA, MS, or IBD aren't forced to fail on cheaper drugs first when their doctor prescribes something else. ${note}.`,
    url: "https://steptherapy.com/step-therapy-legislation-by-state/",
  })),
];

// International legislation and policy affecting autoimmune/chronic disease
// patients outside the US. This list is intentionally small right now — it's
// hand-verified against official or primary sources the same way the US list
// is, rather than pulled from a live feed (we don't yet have an
// international equivalent of the Congress.gov sync). It'll grow as chapter
// leads flag more country-specific legislation worth tracking.
export const INTERNATIONAL_BILLS = [
  // --- United Kingdom ---
  {
    number: "NHS England — Gluten-Free Prescribing",
    name: "NHS gluten-free prescription rollback",
    fullName: "Regional NHS decisions ending gluten-free food prescriptions",
    sponsor: "NHS England Integrated Care Boards",
    introduced: "2024–2026, ongoing region by region",
    status: "Being phased out in most areas",
    condition: "Celiac disease",
    country: "United Kingdom",
    summary:
      "Most NHS Integrated Care Boards in England have ended or are ending free prescriptions for gluten-free bread and flour for adults with coeliac disease, citing cost. Scotland and Wales currently maintain broader support. Coeliac UK is tracking these regional decisions and pushing back where consultations are still open.",
    url: "https://www.coeliac.org.uk/prescriptions-north-east-north-cumbria/",
  },
  {
    number: "UK Rare Diseases Framework — Action Plan",
    name: "England Rare Diseases Action Plan",
    fullName: "UK Rare Diseases Framework, implemented via annual England Rare Diseases Action Plans",
    sponsor: "Department of Health and Social Care",
    introduced: "Framework 2021, annual action plans ongoing",
    status: "Active — annual action plans continue",
    condition: "General autoimmune",
    country: "United Kingdom",
    summary:
      "Sets shared UK-wide priorities for rare disease patients — faster diagnosis, more clinician awareness, better-coordinated care, and improved access to specialist treatment — with England publishing a new action plan each year detailing concrete steps, including new Syndromes Without A Name diagnostic clinics.",
    url: "https://gov.uk/government/publications/england-rare-diseases-action-plan-2024/england-rare-diseases-action-plan-2024-main-report",
  },
  {
    number: "MHRA — Rare Disease Therapies Framework",
    name: "MHRA rare disease regulatory overhaul",
    fullName: "Draft rare disease therapies regulatory framework",
    sponsor: "Medicines and Healthcare products Regulatory Agency (MHRA)",
    introduced: "Nov 2025",
    status: "Consultation / in development",
    condition: "General autoimmune",
    country: "United Kingdom",
    summary:
      "A proposed overhaul of how the UK approves treatments for rare diseases, aiming to make testing, manufacturing, and approval faster for conditions with very small patient populations — of the roughly 3.5 million people in the UK with a rare disease, fewer than 5% currently have an approved treatment.",
    url: "https://www.gov.uk/government/consultations/draft-rare-disease-therapies-regulatory-framework/draft-rare-disease-therapies-regulatory-framework",
  },
  {
    number: "Universal Credit and PIP Bill 2024-25",
    name: "UK disability benefit reform (PIP)",
    fullName: "Universal Credit and Personal Independence Payment Bill",
    sponsor: "UK Government (DWP)",
    introduced: "2025",
    status: "PIP provisions withdrawn from the bill after pressure from disabled people and carers",
    condition: "General autoimmune",
    country: "United Kingdom",
    summary:
      "Originally proposed tightening PIP eligibility to require higher scores on 'daily living' activities, which disability charities warned would cut support for many with fluctuating chronic conditions. Following sustained campaigning, the government removed the PIP changes from the bill and committed to a fuller review process involving disabled people's organisations.",
    url: "https://commonslibrary.parliament.uk/research-briefings/cbp-10296/",
  },
  {
    number: "Employment Rights Act 2025 — Sick Pay",
    name: "UK statutory sick pay reform",
    fullName: "Employment Rights Act 2025, sections 10–13 (statutory sick pay)",
    sponsor: "UK Parliament",
    introduced: "Act passed Dec 2025; sick pay provisions effective 6 Apr 2026",
    status: "Signed into law",
    condition: "General autoimmune",
    country: "United Kingdom",
    summary:
      "Removes the old 3-day unpaid waiting period and the minimum-earnings threshold for statutory sick pay, so workers are paid from the first day of illness regardless of income — a meaningful change for anyone managing a chronic condition with unpredictable flare days.",
    url: "https://www.acas.org.uk/checking-sick-pay/statutory-sick-pay-ssp",
  },

  // --- Ireland ---
  {
    number: "Ireland — Revenue Tax Relief",
    name: "Irish tax relief for gluten-free food",
    fullName: "Revenue tax relief scheme for coeliac disease dietary costs",
    sponsor: "Irish Revenue Commissioners",
    introduced: "Ongoing scheme",
    status: "Active — advocacy continues for a broader HSE scheme",
    condition: "Celiac disease",
    country: "Ireland",
    summary:
      "People with a doctor-confirmed coeliac diagnosis can claim tax relief on gluten-free food purchases through Revenue. Advocacy groups, including the Coeliac Society of Ireland, continue pressing the HSE to reinstate the broader medical-card reimbursement scheme that was dropped in 2012.",
    url: "https://www.oireachtas.ie/en/debates/question/2025-01-22/1535/",
  },
  {
    number: "Ireland — Sick Leave Act 2022",
    name: "Irish statutory sick leave expansion (stalled)",
    fullName: "Sick Leave Act 2022 phased expansion",
    sponsor: "Oireachtas",
    introduced: "2022, phase-in through 2026",
    status: "Frozen at 5 days — planned increase to 7 and 10 days postponed",
    condition: "General autoimmune",
    country: "Ireland",
    summary:
      "Was meant to phase statutory paid sick leave up from 3 to 10 days a year by 2026, but the government paused the increase past 5 days in 2025 pending a cost review — meaning workers managing chronic conditions still have fewer paid sick days than originally planned.",
    url: "https://enterprise.gov.ie/en/news-and-events/department-news/2025/april/20250414.html",
  },
  {
    number: "Long-Term Illness Bill (reintroduced)",
    name: "Long-Term Illness Scheme reform",
    fullName: "Bill to amend the Health Act 1970's Long-Term Illness Scheme",
    sponsor: "Sinn Féin (Louise O'Reilly TD, David Cullinane TD)",
    introduced: "2025 (reintroduced)",
    status: "Introduced",
    condition: "General autoimmune",
    country: "Ireland",
    summary:
      "Would reform and expand the Long-Term Illness Scheme, which currently provides free medication for a fixed, decades-old list of conditions that leaves out many chronic and autoimmune diagnoses. The bill aims to modernize the list and the process for adding conditions to it.",
    url: "https://sinnfein.ie/news/sinn-fein-to-publish-bill-to-reform-long-term-illness-scheme-louise-oreilly-td/",
  },

  // --- Canada ---
  {
    number: "Canada — National Strategy for Drugs for Rare Diseases",
    name: "Canada's rare disease drug strategy",
    fullName: "National Strategy for Drugs for Rare Diseases (2023–2027)",
    sponsor: "Health Canada",
    introduced: "March 2023",
    status: "Active — all provinces and territories signed on",
    condition: "General autoimmune",
    country: "Canada",
    summary:
      "A federal strategy committing up to $1.5 billion to help provinces and territories cover new and existing drugs for rare diseases, plus screening and diagnostics. All 13 provinces and territories have now signed bilateral funding agreements with the federal government.",
    url: "https://www.canada.ca/en/health-canada/services/health-services-benefits/strategy-drugs-rare-diseases.html",
  },
  {
    number: "Canada — Gluten-Free Medical Expense Credit",
    name: "Canadian tax credit for gluten-free food",
    fullName: "Medical expense tax credit for celiac disease dietary costs",
    sponsor: "Canada Revenue Agency",
    introduced: "Ongoing",
    status: "Active",
    condition: "Celiac disease",
    country: "Canada",
    summary:
      "Canadians with a medical diagnosis of celiac disease can claim the extra cost of gluten-free food over its regular counterpart as a medical expense tax credit, under detailed receipt-tracking rules set by the CRA.",
    url: "https://celiac.org/gluten-free-living/global-associations-and-policies/policies-around-the-world/",
  },
  {
    number: "Bill C-22 — Canada Disability Benefit Act",
    name: "Canada Disability Benefit",
    fullName: "Canada Disability Benefit Act",
    sponsor: "Government of Canada",
    introduced: "2022; came into force June 2024",
    status: "Signed into law — payments began 2025",
    condition: "General autoimmune",
    country: "Canada",
    summary:
      "Establishes a federal monthly benefit for working-age Canadians with disabilities who hold the Disability Tax Credit, meant to reduce poverty and top up existing provincial supports. First payments began in 2025; advocates are pushing for a higher benefit amount and eligibility beyond the current DTC requirement.",
    url: "https://www.canada.ca/en/employment-social-development/programs/disability-benefit.html",
  },
  {
    number: "Bill C-422",
    name: "Canada Disability Benefit clawback protection",
    fullName: "An Act to amend the Canada Disability Benefit Act",
    sponsor: "MP Bonita Zarrillo",
    introduced: "2025",
    status: "Introduced",
    condition: "General autoimmune",
    country: "Canada",
    summary:
      "Would protect people receiving the Canada Disability Benefit from having it reduced based on household income or marital status, addressing a common criticism that the current benefit can effectively penalize recipients for living with a partner or spouse.",
    url: "https://www.canadadisabilitybenefit.ca/establishing-the-cdb",
  },

  // --- Australia ---
  {
    number: "Australia — Gluten-Free Subsidy Petition",
    name: "Coeliac Australia's gluten-free food subsidy campaign",
    fullName: "Petition to the House of Representatives for a gluten-free food subsidy",
    sponsor: "Coeliac Australia",
    introduced: "2025",
    status: "Active petition — not yet law",
    condition: "Celiac disease",
    country: "Australia",
    summary:
      "Coeliac Australia has launched a formal petition to the House of Representatives calling for a government subsidy on essential gluten-free foods, citing prices that can run 2–4x higher than gluten-containing equivalents.",
    url: "https://coeliac.org.au/news/press-release/",
  },
  {
    number: "PBS Listing — Anifrolumab (Saphnelo)",
    name: "PBS listing of first lupus biologic",
    fullName: "Pharmaceutical Benefits Scheme listing of anifrolumab for systemic lupus erythematosus",
    sponsor: "Australian Government Department of Health, Disability and Ageing",
    introduced: "Effective 1 Jul 2024",
    status: "Listed — active",
    condition: "Lupus (SLE)",
    country: "Australia",
    summary:
      "Added the first biologic treatment for systemic lupus erythematosus to Australia's subsidised medicines scheme, giving eligible patients affordable access to a treatment that specifically targets the immune cells involved in lupus rather than suppressing the whole immune system.",
    url: "https://creakyjoints.org.au/treatment/game-changing-lupus-treatment-now-listed-on-the-pbs/",
  },
  {
    number: "PBS Listing — Avacopan & Bimekizumab",
    name: "PBS expansion for vasculitis and inflammatory arthritis",
    fullName: "New and expanded PBS listings for avacopan (Tavneos) and bimekizumab (Bimzelx)",
    sponsor: "Australian Government Department of Health, Disability and Ageing",
    introduced: "Oct 2024",
    status: "Listed — active",
    condition: "Vasculitis",
    country: "Australia",
    summary:
      "Listed avacopan for the first time to treat severe ANCA-associated vasculitis (granulomatosis with polyangiitis and microscopic polyangiitis), and expanded bimekizumab's subsidised use to a wider range of inflammatory arthritis conditions — without subsidy, patients might otherwise pay around $18,000–22,000 a year.",
    url: "https://www.health.gov.au/ministers/the-hon-mark-butler-mp/media/new-cheaper-medicines-for-autoimmune-conditions-cancer-and-heart-disease",
  },
  {
    number: "PBS Listing — Ocrelizumab (Ocrevus)",
    name: "Cheaper, faster MS treatment on PBS",
    fullName: "PBS listing of a new form of ocrelizumab for relapsing-remitting multiple sclerosis",
    sponsor: "Australian Government Department of Health, Disability and Ageing",
    introduced: "Dec 2025",
    status: "Listed — active",
    condition: "Multiple sclerosis",
    country: "Australia",
    summary:
      "Listed a faster-infusion form of ocrelizumab for relapsing-remitting MS on the PBS, cutting administration time from hours to about 10 minutes for eligible patients — part of a broader push to expand subsidised access to autoimmune and rare-disease medicines.",
    url: "https://www.health.gov.au/ministers/the-hon-mark-butler-mp/media/cheaper-multiple-sclerosis-and-rare-cancer-medicines-now-on-pbs?language=en",
  },

  // --- European Union ---
  {
    number: "EU — Rare Disease Action Plan (proposed)",
    name: "European action plan for rare diseases",
    fullName: "Proposed comprehensive EU-level action plan for rare diseases, 2025–2029",
    sponsor: "European Commission / European Parliament",
    introduced: "2025, under discussion",
    status: "In development",
    condition: "General autoimmune",
    country: "European Union",
    summary:
      "Following calls from the European Parliament and the European Economic and Social Committee, the European Commission is developing a comprehensive EU action plan for rare diseases, aiming for diagnosis within one year of symptom onset and building on the existing European Reference Networks.",
    url: "https://epthinktank.eu/2025/11/27/rare-diseases-strengthening-eu-action/",
  },
  {
    number: "Directive (EU) 2019/882",
    name: "European Accessibility Act",
    fullName: "European Accessibility Act — accessibility requirements for products and services",
    sponsor: "European Parliament and Council",
    introduced: "Adopted 2019; applied from 28 Jun 2025",
    status: "In force",
    condition: "General autoimmune",
    country: "European Union",
    summary:
      "Requires everyday digital products and services sold in the EU — banking, e-commerce, e-books, phones, self-service terminals — to meet common accessibility standards, benefiting the roughly 100 million people in the EU living with a disability, including many with chronic illness-related impairments.",
    url: "https://commission.europa.eu/news-and-media/news/eu-becomes-more-accessible-all-2025-07-31_en",
  },
  {
    number: "Directives (EU) 2024/2841 & 2024/2842",
    name: "European Disability Card",
    fullName: "European Disability Card and European Parking Card for persons with disabilities",
    sponsor: "European Parliament and Council",
    introduced: "Adopted Oct 2024",
    status: "Adopted — member states implementing ahead of 2028 application date",
    condition: "General autoimmune",
    country: "European Union",
    summary:
      "Creates a mutually recognized disability status card so people with a recognized disability, including many chronic autoimmune conditions, don't have to re-prove their status when traveling or moving to another EU member state to access preferential services, transport, and parking.",
    url: "https://www.consilium.europa.eu/en/policies/european-disability-card/",
  },
  {
    number: "EU Pharmaceutical Legislation Revision",
    name: "EU orphan drug rules revision",
    fullName: "Revision of EU pharmaceutical legislation, including the Orphan Regulation",
    sponsor: "European Commission",
    introduced: "Launched 2023; Critical Medicines Act proposed Mar 2025",
    status: "In progress",
    condition: "General autoimmune",
    country: "European Union",
    summary:
      "An ongoing overhaul of the rules governing how medicines, including orphan drugs for rare autoimmune conditions, are incentivized and approved across the EU, paired with a proposed Critical Medicines Act aimed at addressing shortages and access gaps for patients with rare and complex diseases.",
    url: "https://epthinktank.eu/2025/11/27/rare-diseases-strengthening-eu-action/",
  },

  // --- Asia-Pacific ---
  {
    number: "Japan — Nanbyo Act",
    name: "Japan's designated intractable disease subsidy system",
    fullName: "Act on Medical Care for Patients with Intractable Diseases",
    sponsor: "Ministry of Health, Labour and Welfare",
    introduced: "Enacted 2014, effective 2015",
    status: "Active — list of covered diseases expanded annually",
    condition: "General autoimmune",
    country: "Japan",
    summary:
      "Japan's 'Nanbyo' system designates rare and intractable diseases — including lupus, ulcerative colitis, Sjögren's syndrome, autoimmune hepatitis, and dozens of other autoimmune conditions — as eligible for government medical expense subsidies. Coverage has grown from 56 diseases to over 300 since the law's predecessor programs began.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5243159/",
  },
  {
    number: "Korea — Rare Disease Medical Expense Support",
    name: "South Korea's rare disease cost-sharing expansion",
    fullName: "Rare Disease Medical Expenses Support Program (KDCA)",
    sponsor: "Korea Disease Control and Prevention Agency",
    introduced: "2025 expansion",
    status: "Active — expanded 2025",
    condition: "General autoimmune",
    country: "South Korea",
    summary:
      "The KDCA expanded eligibility for its rare disease co-payment support program in 2025, unifying and raising the household income threshold to 140% of the median regardless of patient age, so more families managing a rare or chronic autoimmune condition qualify for reduced medical costs.",
    url: "https://www.kdca.go.kr/bbs/eng/189/206307/artclView.do?layout=unknown",
  },
  {
    number: "India — National Policy for Rare Diseases",
    name: "India's rare disease financial assistance policy",
    fullName: "National Policy for Rare Diseases, 2021 (amended 2025)",
    sponsor: "Ministry of Health and Family Welfare",
    introduced: "2021; financial cap raised 2025",
    status: "Active",
    condition: "General autoimmune",
    country: "India",
    summary:
      "Provides financial support for rare disease treatment through the Rashtriya Arogya Nidhi scheme at government Centres of Excellence. In 2025 the government raised the support cap from ₹20 lakh to ₹50 lakh per patient and extended it to all categories of rare disease, not just those needing one-time treatment.",
    url: "https://www.rarediseases.in/big-relief-union-health-ministry-hikes-financial-grant-for-rare-disease-treatment-from-rs-20-lakh-to-rs-50-lakh-applies-to-all-categories/",
  },
  {
    number: "Malaysia — National Policy on Rare Diseases",
    name: "Malaysia's first national rare disease policy",
    fullName: "National Policy on Rare Diseases (NRDP)",
    sponsor: "Ministry of Health Malaysia",
    introduced: "Launched Aug 2025",
    status: "Active — implementation ongoing",
    condition: "General autoimmune",
    country: "Malaysia",
    summary:
      "Malaysia's first National Policy on Rare Diseases formally recognizes rare disease patients as a vulnerable group entitled to timely diagnosis, treatment access, and long-term care, building on the National Rare Disease Committee established in 2019. Advocates are now pushing for a dedicated funding mechanism to back the policy.",
    url: "https://www.malaymail.com/news/what-you-think/2025/09/11/malaysias-path-to-becoming-aseans-hub-for-rare-disease-healthcare-spinal-muscular-atrophy-malaysia/190820",
  },
  {
    number: "Philippines — RA 10747",
    name: "Rare Diseases Act of the Philippines",
    fullName: "Republic Act No. 10747",
    sponsor: "Congress of the Philippines",
    introduced: "Signed March 2016",
    status: "Signed into law",
    condition: "General autoimmune",
    country: "Philippines",
    summary:
      "A dedicated national law for rare disease patients: mandates a PhilHealth benefit package for treatment costs, tax and customs exemptions for orphan drugs and research donations, a national Rare Disease Registry, and grants rare disease patients the same rights and privileges as persons with disabilities.",
    url: "https://mirror.officialgazette.gov.ph/2016/03/03/republic-act-no-10747/",
  },
  {
    number: "Indonesia — BPJS Rare Disease Access Push",
    name: "Campaign for rare disease drug coverage under JKN",
    fullName: "Advocacy to include orphan drugs in Indonesia's national health insurance (BPJS Kesehatan)",
    sponsor: "RSCM, FKUI, and Yayasan MPS Indonesia",
    introduced: "2026",
    status: "Active advocacy campaign",
    condition: "General autoimmune",
    country: "Indonesia",
    summary:
      "BPJS Kesehatan (Indonesia's national health insurance, JKN) covers medically-indicated rare disease treatment under existing regulations, but of an estimated 25 million Indonesians living with a rare disease, only about 5% have been definitively diagnosed. Hospitals and patient groups marked Rare Disease Day 2026 by pushing for orphan drugs to be more explicitly and reliably included in the BPJS scheme.",
    url: "https://www.jpnn.com/news/dorong-kesetaraan-medis-rscm-dan-fkui-desak-obat-penyakit-langka-masuk-skema-bpjs",
  },
  {
    number: "Pakistan — Sehat Sahulat Program",
    name: "Pakistan's national health insurance card",
    fullName: "Sehat Sahulat Program (Sehat Card)",
    sponsor: "Government of Pakistan",
    introduced: "2015, nationwide by 2020",
    status: "Active",
    condition: "General autoimmune",
    country: "Pakistan",
    summary:
      "A government-funded health insurance program giving eligible families cash-free hospital treatment, explicitly including chronic disease management for conditions like rheumatologic disease, hepatitis, and kidney failure, with up to PKR 1 million in annual coverage per family.",
    url: "https://en.wikipedia.org/wiki/Sehat_Sahulat_Program",
  },
  {
    number: "Bangladesh — SSK Health Protection Scheme",
    name: "Bangladesh's health protection pilot scheme",
    fullName: "Shasthyo Surokhsha Karmasuchi (SSK)",
    sponsor: "Health Economics Unit, Ministry of Health and Family Welfare",
    introduced: "Piloted 2016, ongoing",
    status: "Active — limited pilot areas",
    condition: "General autoimmune",
    country: "Bangladesh",
    summary:
      "A government health protection scheme providing below-poverty-line households with inpatient coverage across dozens of disease groups at no premium cost, reducing out-of-pocket health spending by roughly a third in piloted subdistricts. Coverage remains geographically limited as the government works toward nationwide scale-up.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11079759/",
  },
  {
    number: "Singapore — Chronic Disease Management Programme",
    name: "Singapore's CDMP subsidy scheme",
    fullName: "Chronic Disease Management Programme (CDMP)",
    sponsor: "Ministry of Health, Singapore",
    introduced: "2006, list updated regularly",
    status: "Active — expanding to 25 conditions from 2027",
    condition: "General autoimmune",
    country: "Singapore",
    summary:
      "Lets patients use MediSave and CHAS subsidies for outpatient treatment of 23 listed chronic conditions at accredited clinics. The Ministry of Health reviews the covered list regularly — hyperthyroidism and hypothyroidism are set to be added from January 2027.",
    url: "https://www.moh.gov.sg/others/resources-and-statistics/chronic-disease-management-programme-cdmp/",
  },
  {
    number: "Sri Lanka — Free Healthcare & NCD Policy",
    name: "Sri Lanka's free healthcare system and chronic disease policy",
    fullName: "National Policy on Prevention and Control of Chronic Non-Communicable Diseases",
    sponsor: "Ministry of Health, Sri Lanka",
    introduced: "Ongoing",
    status: "Active",
    condition: "General autoimmune",
    country: "Sri Lanka",
    summary:
      "Sri Lanka's long-standing free public healthcare system provides government hospital treatment, including hemodialysis for kidney failure (relevant to lupus nephritis and vasculitis), at no cost, alongside a national policy specifically addressing chronic kidney and other non-communicable disease management.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12060758/",
  },

  {
    number: "NZ — Rare Disorders Strategy",
    name: "Aotearoa New Zealand Rare Disorders Strategy",
    fullName: "Aotearoa New Zealand Rare Disorders Strategy 2024, with Pharmac policy alignment",
    sponsor: "Ministry of Health / Pharmac",
    introduced: "Strategy released Jul 2024; Pharmac alignment effective Nov 2025",
    status: "Active",
    condition: "General autoimmune",
    country: "New Zealand",
    summary:
      "New Zealand's first national health-system strategy for rare disorders, aiming to improve diagnosis and coordinated care over a decade-long framework. Pharmac updated its own funding policy in November 2025 to align with the strategy's broader definition of a rare disorder, and is separately consulting on simplifying funding criteria for biologic medicines used to treat autoimmune and inflammatory conditions.",
    url: "https://www.health.govt.nz/strategies-initiatives/health-strategies/rare-disorders-strategy",
  },

  // --- Middle East & Africa ---
  {
    number: "UAE — Nationwide Mandatory Health Insurance",
    name: "UAE mandatory health insurance expansion",
    fullName: "Cabinet decision extending mandatory health insurance to all seven emirates",
    sponsor: "UAE Cabinet / Ministry of Human Resources and Emiratisation",
    introduced: "Effective 1 Jan 2025",
    status: "In force",
    condition: "General autoimmune",
    country: "United Arab Emirates",
    summary:
      "Extended mandatory employer-provided health insurance to private-sector employees and domestic workers in all seven emirates, following Abu Dhabi and Dubai's earlier mandates. The standardized Basic Health Insurance package explicitly covers chronic diseases and pre-existing conditions with no waiting period.",
    url: "https://www.shory.com/individual-health-insurance/blog/uae-insurance-guide-what-residents-must-know-in-2025/",
  },
  {
    number: "Egypt — Universal Health Insurance Law",
    name: "Egypt's universal health insurance rollout",
    fullName: "Universal Health Insurance Law No. 2 of 2018",
    sponsor: "Egyptian Parliament",
    introduced: "2018, phased rollout through 2032",
    status: "In progress — phased by governorate",
    condition: "General autoimmune",
    country: "Egypt",
    summary:
      "Creates a mandatory national health insurance system being phased in across Egypt's governorates, with people who have chronic diseases specifically exempted from co-payments on medications, imaging, labs, and inpatient care under the law.",
    url: "https://sis.gov.eg/en/egypt/society/health-care/universal-health-insurance-law-no-2-of-2018/",
  },
  {
    number: "Nigeria — NHIA Act 2022",
    name: "Nigeria's mandatory national health insurance",
    fullName: "National Health Insurance Authority Act 2022",
    sponsor: "National Assembly of Nigeria",
    introduced: "Signed May 2022",
    status: "Signed into law — implementation ongoing",
    condition: "General autoimmune",
    country: "Nigeria",
    summary:
      "Makes health insurance mandatory for every Nigerian and legal resident, replacing the earlier voluntary scheme, and establishes a Vulnerable Group Fund to subsidize care for the poorest households. Chronic disease coverage varies by plan, and out-of-pocket spending remains high while implementation continues to expand.",
    url: "https://www.nhia.gov.ng/",
  },
  {
    number: "Kenya — Social Health Insurance Act",
    name: "Kenya's Emergency, Chronic and Critical Illness Fund",
    fullName: "Social Health Insurance Act, 2023",
    sponsor: "Parliament of Kenya",
    introduced: "2023",
    status: "Signed into law — active",
    condition: "General autoimmune",
    country: "Kenya",
    summary:
      "Established Kenya's Social Health Insurance Fund and, under Section 28, a dedicated Emergency, Chronic and Critical Illness Fund that continues covering treatment costs once a patient's standard social health insurance cover is exhausted — directly relevant to long-term autoimmune disease management.",
    url: "https://www.hlbcezam.com/the-social-health-insurance-fund-shif/",
  },
  {
    number: "Ghana — National Health Insurance Scheme",
    name: "Ghana's National Health Insurance Scheme",
    fullName: "National Health Insurance Scheme (NHIS)",
    sponsor: "Government of Ghana / Parliament of Ghana",
    introduced: "2003, mandatory enrollment",
    status: "Active",
    condition: "General autoimmune",
    country: "Ghana",
    summary:
      "A mandatory national insurance scheme covering roughly 95% of disease conditions in Ghana, including diabetes, for a low annual premium with children, pregnant women, and those 70+ exempted. Chronic renal failure and a small list of other conditions remain outside the covered list.",
    url: "https://en.wikipedia.org/wiki/National_Health_Insurance_Scheme_(Ghana)",
  },
  {
    number: "South Africa — SASSA Disability Grant",
    name: "South Africa's disability grant for chronic illness",
    fullName: "SASSA Disability Grant",
    sponsor: "South African Social Security Agency",
    introduced: "Ongoing",
    status: "Active",
    condition: "General autoimmune",
    country: "South Africa",
    summary:
      "A non-contributory monthly grant available to South Africans with a disability or a chronic illness that significantly limits their ability to work, administered by SASSA. Rare disease advocacy groups continue pushing for a dedicated national rare disease policy alongside this existing safety net.",
    url: "https://www.pils.org.za/will-the-government-compensate-me-for-my-chronic-illness-from-when-i-was-diagnosed/",
  },

  // --- Latin America ---
  {
    number: "Argentina — Ley 26.689",
    name: "Argentina's rare disease comprehensive care law",
    fullName: "Ley Nacional de Enfermedades Poco Frecuentes (Ley 26.689)",
    sponsor: "Congreso de la Nación Argentina",
    introduced: "2011, regulated 2015",
    status: "Signed into law — active",
    condition: "General autoimmune",
    country: "Argentina",
    summary:
      "Requires all health insurers and provincial health systems to provide 100% coverage for diagnosis, treatment, and follow-up of designated rare diseases. Crohn's disease, ulcerative colitis, and indeterminate colitis are explicitly listed as qualifying conditions under Resolution 641/2021.",
    url: "https://masvida.org.ar/se-cumplen-10-anos-de-la-ley-de-epof-26-689-en-argentina/",
  },
  {
    number: "Chile — Ley Ricarte Soto",
    name: "Chile's high-cost treatment coverage law",
    fullName: "Ley 20.850, Sistema de Protección Financiera para Diagnósticos y Tratamientos de Alto Costo",
    sponsor: "Congreso Nacional de Chile",
    introduced: "2015",
    status: "Signed into law — active",
    condition: "General autoimmune",
    country: "Chile",
    summary:
      "Guarantees 100% financial coverage for high-cost oncological, immunological, and rare disease diagnoses and treatments for every Chilean, regardless of which health insurer (public or private) they use. Currently covers 27 high-cost conditions, of which about 19 are rare diseases.",
    url: "https://www.minsal.cl/ministerio-de-salud-incorpora-nueve-enfermedades-a-la-cobertura-de-la-ley-ricarte-soto/",
  },
  {
    number: "Colombia — Ley 1392",
    name: "Colombia's orphan disease recognition law",
    fullName: "Ley 1392 de 2010, actualizada por la Resolución 2625 de 2025",
    sponsor: "Congreso de la República de Colombia",
    introduced: "2010, list updated Dec 2025",
    status: "Signed into law — list updated regularly",
    condition: "General autoimmune",
    country: "Colombia",
    summary:
      "Recognizes orphan/rare diseases as a matter of special national health interest and requires the Ministry of Health to maintain and periodically update an official list — now over 2,000 conditions — that determines which patients get differentiated protection under Colombia's health system.",
    url: "https://www.minsalud.gov.co/Normatividad_Nuevo/Resolucion%20No%202625%20de%202025.pdf",
  },
  {
    number: "Mexico — Registro Nacional de Enfermedades Raras",
    name: "Mexico's proposed national rare disease registry",
    fullName: "Reforma a la Ley General de Salud para crear el Registro Nacional de Enfermedades Raras",
    sponsor: "Dip. Pedro Zenteno Santaella and others",
    introduced: "Approved by Cámara de Diputados, Mar 2025/2026",
    status: "Passed lower house — pending Senate",
    condition: "General autoimmune",
    country: "Mexico",
    summary:
      "Would amend Mexico's General Health Law to formally create a National Registry of Rare Diseases, aimed at ending what advocates call the 'institutional invisibility' of rare conditions and giving policymakers real data to plan diagnosis and treatment services for the estimated 8–10 million Mexicans living with one.",
    url: "https://www.informador.mx/mexico/diputados-aprueban-crear-un-registro-nacional-de-enfermedades-raras-en-mexico-20260325-0175.html",
  },
  {
    number: "Brazil — Política Nacional de Doenças Raras",
    name: "Brazil's national rare disease care policy",
    fullName: "Política Nacional de Atenção Integral às Pessoas com Doenças Raras (Portaria 199/2014)",
    sponsor: "Ministério da Saúde",
    introduced: "2014",
    status: "Signed into law — active",
    condition: "General autoimmune",
    country: "Brazil",
    summary:
      "Established Brazil's national policy for comprehensive rare disease care through the public SUS health system, including Reference Centers and Specialized Healthcare Centers. As of recent counts, SUS offers 152 medicines for rare disease treatment, though patients still frequently turn to the courts to access drugs not yet formally incorporated.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8867447/",
  },

  // --- Europe (non-EU / additional) ---
  {
    number: "Norway — Nasjonalt senter for sjeldne diagnoser",
    name: "Norway's National Centre for Rare Disorders",
    fullName: "Nasjonalt senter for sjeldne diagnoser (NSSD)",
    sponsor: "Norwegian Ministry of Health and Care Services",
    introduced: "Transitioned from NKSD, effective Jan 2025",
    status: "Active",
    condition: "General autoimmune",
    country: "Norway",
    summary:
      "Norway's national rare disease competence network was restructured into the new National Centre for Rare Disorders in 2025, continuing to coordinate diagnosis, treatment guidance, and equitable access to care for people with rare and complex conditions across the country's regional centers.",
    url: "https://www.oslo-universitetssykehus.no/fag-og-forskning/nasjonale-og-regionale-tjenester/nasjonalt-senter-for-sjeldne-diagnoser/national-advisory-unit-on-rare-disorders/",
  },
  {
    number: "Switzerland — Nationales Konzept Seltene Krankheiten",
    name: "Switzerland's national rare disease framework",
    fullName: "Nationales Konzept Seltene Krankheiten",
    sponsor: "Federal Council / Federal Office of Public Health (BAG)",
    introduced: "Adopted 2014, implementation completed 2021",
    status: "Active — ongoing improvements",
    condition: "General autoimmune",
    country: "Switzerland",
    summary:
      "Switzerland's national strategy created reference centers for rare diseases and a simplified authorization pathway for orphan drugs. Reimbursement gaps remain a live issue — the National Council adopted a 2023 motion specifically to improve access to orphan drugs not yet on the standard reimbursement list.",
    url: "https://www.bag.admin.ch/de/seltene-krankheiten-in-der-schweiz-und-das-nationale-konzept",
  },
  {
    number: "Türkiye — Nadir Hastalıklar Eylem Planı",
    name: "Türkiye's rare disease strategy and action plan",
    fullName: "2023–2027 Nadir Hastalıklar Sağlık Strateji Belgesi ve Eylem Planı",
    sponsor: "T.C. Sağlık Bakanlığı (Ministry of Health)",
    introduced: "2023, implementation ongoing",
    status: "Active",
    condition: "General autoimmune",
    country: "Türkiye",
    summary:
      "A five-year national strategy and action plan coordinated by the Ministry of Health's Rare Diseases Department, working with stakeholders on diagnosis, treatment access, and orphan drug availability for people living with rare and autoimmune conditions.",
    url: "https://shgm.saglik.gov.tr/TR-101118/2023---2027-nadir-hastaliklar-saglik-strateji-belgesi-ve-eylem-plani.html",
  },
  {
    number: "DM 279/2001 — LEA update 2025",
    name: "Italy's rare disease exemption list expansion",
    fullName: "Aggiornamento dei Livelli Essenziali di Assistenza (LEA) — national rare disease ticket-exemption list",
    sponsor: "Ministero della Salute",
    introduced: "Updated 2025, under the National Rare Disease Plan (PNMR) 2023–2026",
    status: "In force",
    condition: "General autoimmune",
    country: "Italy",
    summary:
      "Italy's 2025 update to its national essential care levels (LEA) added more than 100 new conditions — including several rare autoimmune diseases — to the official list entitling patients to exemption from healthcare co-pays (ticket) for related specialist visits and tests, building on the rare-disease exemption framework first established by Decreto Ministeriale 279/2001.",
    url: "https://www.malattierare.gov.it/esenzioni",
  },

  // --- Caribbean (CARICOM) ---
  {
    number: "CARICOM — Port of Spain Declaration",
    name: "Trinidad and Tobago's role in the Caribbean's chronic disease framework",
    fullName: "Port of Spain Declaration: Uniting to Stop the Epidemic of Chronic Non-Communicable Diseases",
    sponsor: "CARICOM Heads of Government, hosted by Trinidad and Tobago",
    introduced: "2007, renewed advocacy through 2025",
    status: "Active political commitment — implementation uneven",
    condition: "General autoimmune",
    country: "Trinidad and Tobago",
    summary:
      "Adopted at the world's first heads-of-government summit devoted to chronic disease, hosted in Trinidad and Tobago in 2007. It commits CARICOM states to national NCD commissions and stronger chronic-disease legislation; regional health advocates renewed pressure on CARICOM leaders in 2025 to accelerate follow-through, as most member states remain behind on their targets.",
    url: "https://barbadostoday.bb/2025/07/05/health-advocates-urge-caricom-leaders-to-renew-fight-against-ncds-mental-health-crisis/",
  },
  {
    number: "CARICOM — Port of Spain Declaration (Jamaica)",
    name: "Jamaica's chronic disease action plan under the Port of Spain Declaration",
    fullName: "Jamaica National Strategic and Action Plan for the Prevention and Control of NCDs",
    sponsor: "Ministry of Health, Jamaica",
    introduced: "Declaration 2007; Jamaica action plan ongoing",
    status: "Active",
    condition: "General autoimmune",
    country: "Jamaica",
    summary:
      "Jamaica's national chronic disease strategy implements the 2007 CARICOM Port of Spain Declaration domestically, coordinating prevention and care for chronic non-communicable conditions, including autoimmune and inflammatory disease management, across the public health system.",
    url: "https://www.moh.gov.jm/wp-content/uploads/2015/05/National-Strategic-and-Action-Plan-for-the-Prevention-and-Control-Non-Communicable-Diseases-NCDS-in-Jamaica-2013-2018.pdf",
  },
  {
    number: "CARICOM — Port of Spain Declaration (Barbados)",
    name: "Barbados' progress on the CARICOM chronic disease targets",
    fullName: "Port of Spain Declaration implementation, Barbados",
    sponsor: "CARICOM / Government of Barbados",
    introduced: "2007, ongoing",
    status: "Active — Barbados on track per 2025 PAHO review",
    condition: "General autoimmune",
    country: "Barbados",
    summary:
      "Barbados is one of only a few CARICOM states rated on track to meet the 2025 regional non-communicable disease targets under the Port of Spain Declaration framework, relevant to national policy on chronic and autoimmune disease care and prevention.",
    url: "https://blackstarnews.com/the-road-ahead-for-healthy-food-policy-in-the-caribbean/",
  },
  {
    number: "CARICOM — Port of Spain Declaration (Guyana)",
    name: "Guyana's chronic disease policy under the CARICOM framework",
    fullName: "Port of Spain Declaration implementation, Guyana",
    sponsor: "CARICOM / Government of Guyana",
    introduced: "2007, ongoing",
    status: "In progress — accelerated action needed per 2025 PAHO review",
    condition: "General autoimmune",
    country: "Guyana",
    summary:
      "Guyana was identified in 2025 regional health reviews as a country that could still meet CARICOM's 2025 non-communicable disease targets with accelerated action, under the chronic-disease framework set by the 2007 Port of Spain Declaration.",
    url: "https://blackstarnews.com/the-road-ahead-for-healthy-food-policy-in-the-caribbean/",
  },
];

// Every entry in BILLS/liveBills/stateBills comes from a US-only data source
// (Congress.gov, state legislatures) and doesn't carry its own country field.
// INTERNATIONAL_BILLS entries do. This helper lets filtering treat "no
// country field" as "United States" without having to stamp that string onto
// every one of the ~50 existing US entries by hand.
function billCountry(bill) {
  return bill.country || "United States";
}

// U.S. state/territory postal abbreviations — used to detect when a bill's
// `number` starts with a state code (e.g. "GA HB94", "NY S06603") so we can
// filter the letter tool's legislator results down to that exact state.
// Bills without a leading state code (e.g. "H.R. 6199", "H.Res. 245") are
// treated as federal.
const US_STATE_ABBREVS = new Set([
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC","PR",
]);

// Returns the two-letter state code a state-level bill belongs to, or null
// for federal bills. This is what makes it possible to only show legislators
// who actually have jurisdiction over the bill being viewed — without it,
// the letter tool would happily let a Virginia resident message their own
// Virginia state senator about a Georgia bill that senator has no authority
// over at all.
function billStateAbbrev(bill) {
  if (billCountry(bill) !== "United States") return null;
  const match = /^([A-Z]{2})\s/.exec(bill.number || "");
  if (!match) return null;
  return US_STATE_ABBREVS.has(match[1]) ? match[1] : null;
}

export default function LegislationDatabase() {
  const [query, setQuery] = useState("");
  const [condition, setCondition] = useState("All conditions");
  const [country, setCountry] = useState("All countries");
  const [selectedBill, setSelectedBill] = useState(null);
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [message, setMessage] = useState("");
  const [repName, setRepName] = useState("");
  const [repEmail, setRepEmail] = useState("");
  const [intlSendStatus, setIntlSendStatus] = useState("idle"); // idle | sending | sent | error
  const [intlSendError, setIntlSendError] = useState("");
  const [aiSummaries, setAiSummaries] = useState({});
  const [aiLoadingId, setAiLoadingId] = useState(null);
  const [legislators, setLegislators] = useState([]);
  const [legislatorMismatch, setLegislatorMismatch] = useState(false);
  const [lookupStatus, setLookupStatus] = useState("idle"); // idle | loading | found | error
  const [lookupError, setLookupError] = useState("");
  const [sendStatus, setSendStatus] = useState({}); // { [legislatorId]: 'idle'|'sending'|'sent'|'error' }
  const [sendErrors, setSendErrors] = useState({}); // { [legislatorId]: string } — the real error message from the API, shown to the user
  const [liveBills, setLiveBills] = useState([]);
  const [liveStatus, setLiveStatus] = useState("loading"); // loading | ready | error
  const [stateBills, setStateBills] = useState([]);
  const [stateStatus, setStateStatus] = useState("loading");
  const [regulations, setRegulations] = useState([]);
  const [regulationsStatus, setRegulationsStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("https://raw.githubusercontent.com/AadyaS26/pvc-legislation-sync/main/regulations.json");
        if (!res.ok) throw new Error("bad response");
        const data = await res.json();
        if (cancelled) return;
        setRegulations(data.documents || []);
        setRegulationsStatus("ready");
      } catch {
        if (!cancelled) setRegulationsStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Maps a raw keyword from the live bill-tracking feed (which can be
  // anything the matching script searched for, like "gluten-free" or
  // "step therapy" — not necessarily a real condition name) onto one of
  // our curated condition names. Falls back to "General autoimmune"
  // rather than inventing a fake condition label out of a policy term.
  function normalizeCondition(rawKeyword) {
    if (!rawKeyword) return "General autoimmune";
    const key = rawKeyword.trim().toLowerCase();
    const match = CONDITIONS.find((c) => {
      if (c === "All conditions") return false;
      const cLower = c.toLowerCase();
      return cLower === key || cLower.includes(key) || key.includes(cLower);
    });
    return match || "General autoimmune";
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("https://raw.githubusercontent.com/AadyaS26/pvc-legislation-sync/main/bills.json");
        if (!res.ok) throw new Error("bad response");
        const data = await res.json();
        if (cancelled) return;
        const mapped = (data.bills || []).map((b) => ({
          number: b.number,
          name: b.title,
          fullName: b.title,
          sponsor: "See official record",
          introduced: b.latestActionDate || "119th Congress",
          status: b.latestActionText || "See official record",
          condition: normalizeCondition(b.matched_keyword),
          country: "United States", // this feed only syncs from Congress.gov
          summary: b.latestActionText ? `Latest action: ${b.latestActionText}` : "See the official record for full details.",
          url: `https://www.congress.gov/bill/119th-congress/${b.number?.toLowerCase().startsWith("s") ? "senate-bill" : "house-bill"}/${(b.number || "").replace(/\D/g, "")}`,
          live: true,
        }));
        setLiveBills(mapped);
        setLiveStatus("ready");
      } catch {
        if (!cancelled) setLiveStatus("error");
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
        if (!res.ok) throw new Error("bad response");
        const data = await res.json();
        if (cancelled) return;
        const mapped = (data.bills || []).map((b) => ({
          number: `${b.state} ${b.number}`,
          name: b.title,
          fullName: b.title,
          sponsor: `${b.state} Legislature`,
          introduced: b.lastActionDate || "State session",
          status: b.lastAction || "See official record",
          condition: normalizeCondition(b.matched_keyword),
          country: "United States", // state legislature feed — US only
          summary: b.lastAction ? `Latest action: ${b.lastAction}` : "See the official record for full details.",
          url: b.url,
          live: true,
        }));
        setStateBills(mapped);
        setStateStatus("ready");
      } catch {
        if (!cancelled) setStateStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const allBills = useMemo(
    () => [...BILLS, ...INTERNATIONAL_BILLS, ...liveBills, ...stateBills],
    [liveBills, stateBills]
  );

  const filtered = useMemo(() => {
    return allBills.filter((b) => {
      const matchesCondition = condition === "All conditions" || b.condition === condition;
      const bCountry = billCountry(b);
      // EU-level legislation applies in member states, so selecting a member
      // state shows both its own tracked bills and the EU-wide ones.
      const matchesCountry =
        country === "All countries" ||
        bCountry === country ||
        (bCountry === "European Union" && EU_MEMBERS.has(country));
      const matchesQuery =
        query.trim() === "" ||
        (b.name + b.fullName + b.summary + b.number).toLowerCase().includes(query.toLowerCase());
      return matchesCondition && matchesCountry && matchesQuery;
    });
  }, [query, condition, country, allBills]);

  const recentlyPassed = useMemo(() => {
    return allBills
      .filter((b) => /signed|passed|enacted|effective/i.test(b.status || ""))
      .slice(0, 3);
  }, [allBills]);

  // Records that a letter was drafted about this specific bill, for the
  // Bills We've Supported page (src/pages/BillsSupported.jsx). Fires the
  // moment the letter modal opens — same trigger as the site-wide
  // letters-sent counter — not at actual send, since a send click can't be
  // confirmed for the off-site webmail links anyway.
  const trackBillEmailSent = (bill) => {
    if (!bill) return;
    fetch("/api/bill-email-count", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ billId: bill.number }),
    }).catch(() => {});
  };

  const openLetter = (bill) => {
    setSelectedBill(bill);
    setMessage(
      `I am writing as a constituent to ask you to support ${bill.number}, the ${bill.fullName}. ${bill.summary}\n\nThis legislation matters to me and to patients in our community managing this condition. I would appreciate your support.`
    );
    setLegislators([]);
    setLegislatorMismatch(false);
    setLookupStatus("idle");
    setLookupError("");
    setSendStatus({});
    setSendErrors({});
    setRepName("");
    setRepEmail("");
    setIntlSendStatus("idle");
    setIntlSendError("");
    // Counts every drafted letter, not just confirmed sends — same trigger
    // point as the per-bill counter below, so both numbers move together.
    fetch("/api/counter?key=letters-sent&action=increment").catch(() => {});
    trackBillEmailSent(bill);
  };

  const handleFindLegislators = async () => {
    if (!address.trim()) return;
    setLookupStatus("loading");
    setLookupError("");
    try {
      const res = await fetch("/api/find-representatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Couldn't find your legislators. Please try again.");
      }

      // Prefer legislators who actually have jurisdiction over the bill
      // being viewed. For a state bill, that means state legislators from
      // that exact state; for a federal bill, only federal members of
      // Congress. If none of the address's legislators have jurisdiction —
      // e.g. someone in Virginia looking at a Georgia bill — don't dead-end
      // the interaction. Fall back to their own real legislators and swap
      // the message to ask them to introduce similar legislation at home,
      // using this bill as a model, instead of "support this bill" (which
      // they have no power to act on).
      const billState = selectedBill ? billStateAbbrev(selectedBill) : null;
      const allResults = data.representatives || [];
      const relevant = billState
        ? allResults.filter((r) => r.stateAbbrev === billState)
        : allResults.filter((r) => r.isFederal);

      const mismatch = relevant.length === 0 && allResults.length > 0;
      setLegislators(mismatch ? allResults : relevant);
      setLegislatorMismatch(mismatch);

      if (mismatch && selectedBill) {
        setMessage(
          `I recently learned about ${selectedBill.number} (${selectedBill.fullName}), legislation in ${billState ? `${billState}` : "another jurisdiction"} that addresses an issue I care about: ${selectedBill.summary}\n\nI don't believe you have jurisdiction over that specific bill, but I'd ask you to consider introducing or sponsoring similar legislation here. This issue affects patients in our community too, and I'd welcome the chance to share more about why it matters.`
        );
      }

      setLookupStatus("found");
    } catch (err) {
      setLookupError(err.message || "Couldn't find your legislators. Please try again.");
      setLookupStatus("error");
    }
  };

  const handleSendToLegislator = async (legislator) => {
    if (!name.trim() || !senderEmail.trim() || !message.trim()) return;
    setSendStatus((prev) => ({ ...prev, [legislator.id]: "sending" }));
    setSendErrors((prev) => ({ ...prev, [legislator.id]: "" }));
    try {
      const res = await fetch("/api/send-legislator-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          legislatorEmail: legislator.email,
          legislatorName: legislator.name,
          senderName: name,
          senderEmail,
          subject: legislatorMismatch
            ? `Constituent request: consider legislation like ${selectedBill.number}`
            : `Constituent message: ${selectedBill.number}`,
          message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || `Could not send (status ${res.status}). Please try again.`);
      }
      setSendStatus((prev) => ({ ...prev, [legislator.id]: "sent" }));
    } catch (err) {
      // Log full context to the browser console so we can see exactly which
      // legislator/email combo failed and why, instead of just "error".
      console.error("Send failed for legislator:", legislator.name, legislator.email, err);
      setSendStatus((prev) => ({ ...prev, [legislator.id]: "error" }));
      setSendErrors((prev) => ({ ...prev, [legislator.id]: err.message || "Send failed. Please try again." }));
    }
  };

  // For international bills we don't have an address-based legislator lookup,
  // but /api/send-legislator-email itself is generic — it just sends whatever
  // recipient email it's given via Resend. So once the person has found their
  // representative's email (via the official finder link), we can actually
  // send it for them instead of only offering "copy and paste it yourself."
  const handleSendInternational = async () => {
    if (!name.trim() || !senderEmail.trim() || !message.trim() || !repEmail.trim()) return;
    setIntlSendStatus("sending");
    setIntlSendError("");
    try {
      const res = await fetch("/api/send-legislator-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          legislatorEmail: repEmail,
          legislatorName: repName || "Representative",
          senderName: name,
          senderEmail,
          subject: `Constituent message: ${selectedBill.number}`,
          message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || `Could not send (status ${res.status}). Please try again.`);
      }
      setIntlSendStatus("sent");
    } catch (err) {
      console.error("International send failed:", repName, repEmail, err);
      setIntlSendStatus("error");
      setIntlSendError(err.message || "Send failed. Please try again, or use the copy/mailto option below.");
    }
  };

  const getAiSummary = async (bill) => {
    if (aiSummaries[bill.number] || aiLoadingId) return;
    setAiLoadingId(bill.number);
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: bill.number,
          fullName: bill.fullName,
          summary: bill.summary,
        }),
      });
      const data = await response.json();
      setAiSummaries((prev) => ({ ...prev, [bill.number]: data.text || "Summary unavailable right now." }));
      // Count it once the plain-language summary is actually generated.
      fetch("/api/counter?key=bills-explained&action=increment").catch(() => {});
      // Also counts this summary view toward the site-wide "resources
      // distributed" total (same counter the Resource Library uses).
      fetch("/api/track-resource-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ condition: `billsummary:${bill.number}` }),
      }).catch(() => {});
    } catch (err) {
      setAiSummaries((prev) => ({ ...prev, [bill.number]: "Couldn't generate a summary right now. Try again in a moment." }));
    } finally {
      setAiLoadingId(null);
    }
  };

  const selectedBillCountry = selectedBill ? billCountry(selectedBill) : "United States";
  const selectedBillIsUS = selectedBillCountry === "United States";
  const repFinder = repFinderFor(selectedBillCountry);
  // If someone filtered to a specific non-US country, point the empty state at
  // that country's finder rather than the bill's own country.
  const emptyStateFinder = country !== "All countries" && country !== "United States" ? repFinderFor(country) : null;

  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: "#2B2A28", background: "#FAF8F3", minHeight: "100%" }}>
      <style>{FONT_IMPORT}</style>

      <Nav />

      {/* Links out to the curated "Bills We've Supported" page — not in the
          top nav, so it lives here instead, right where people are already
          looking at bills. */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 24px 0" }}>
        <Link
          to="/bills-supported"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            background: "#1B2A4A",
            borderRadius: 8,
            padding: "16px 22px",
            textDecoration: "none",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 14.5, color: "#FAF8F3" }}>
            See every bill our members have emailed legislators about, and how its status has changed since.
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 600, color: "#C9A25A", whiteSpace: "nowrap" }}>
            Bills We've Supported <ArrowRight size={14} />
          </span>
        </Link>
      </section>

      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 32px" }}>
        <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#A87C2A", fontWeight: 500, marginBottom: 16 }}>
          119th Congress · 2025–2026 · plus tracked international legislation
        </p>
        <h1
          style={{
            fontFamily: "Fraunces, serif",
            fontWeight: 500,
            fontSize: "clamp(28px, 4.5vw, 42px)",
            lineHeight: 1.1,
            color: "#1B2A4A",
            maxWidth: 680,
          }}
        >
          Legislation affecting autoimmune and chronic disease patients
        </h1>
        <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "#5A5952", maxWidth: 600, marginTop: 16 }}>
          US bills are verified against Congress.gov; international entries are verified against each country's official record. Every bill links back to its official source.
        </p>
      </section>

      {/* Filters */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 32px" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1 1 260px" }}>
            <Search size={15} style={{ position: "absolute", left: 12, top: 12, color: "#8A8880" }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by bill name, number, or keyword"
              style={{
                width: "100%",
                padding: "10px 12px 10px 36px",
                border: "1px solid #C9C4B4",
                borderRadius: 3,
                fontSize: 14,
                background: "#fff",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ position: "relative" }}>
            <Filter size={14} style={{ position: "absolute", left: 12, top: 13, color: "#8A8880" }} />
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              style={{
                padding: "10px 14px 10px 34px",
                border: "1px solid #C9C4B4",
                borderRadius: 3,
                fontSize: 14,
                background: "#fff",
                color: "#2B2A28",
              }}
            >
              {CONDITIONS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div style={{ position: "relative" }}>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={{
                padding: "10px 14px",
                border: "1px solid #C9C4B4",
                borderRadius: 3,
                fontSize: 14,
                background: "#fff",
                color: "#2B2A28",
              }}
            >
              {COUNTRIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <p style={{ fontSize: 12.5, color: "#8A8880", marginTop: 10 }}>
          {filtered.length} {filtered.length === 1 ? "bill" : "bills"} shown
          {liveStatus === "loading" && " · loading more from Congress.gov (can take up to a minute)…"}
          {liveStatus === "error" && " · live feed unavailable right now, showing verified bills only"}
          {country === "All countries" && " · international tracking is new and still growing — flag anything we're missing for your country"}
        </p>
      </section>

      {/* Regulatory actions — distinct from legislation: this is what agencies do once a law exists */}
      {regulations.length > 0 && (
        <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <FileCheck size={16} color="#5A6B8C" />
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "#1B2A4A", margin: 0 }}>Recent regulatory actions</h2>
          </div>
          <p style={{ fontSize: 12.5, color: "#8A8880", marginBottom: 16 }}>
            Actions federal agencies (FDA, HHS, CMS) have taken — different from legislation, which is what Congress and states are considering.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
              {regulations.slice(0, 12).map((r) => (
                <a
                  key={r.documentNumber}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  border: "1px solid #DCE1EA",
                  background: "#F4F6FA",
                  borderRadius: 4,
                  padding: "16px 18px",
                  textDecoration: "none",
                }}
              >
                <span style={{ fontSize: 11, color: "#5A6B8C", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {r.type} · {r.agencies?.[0] || "Federal agency"}
                </span>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1B2A4A", marginTop: 6, lineHeight: 1.4 }}>{r.title}</div>
                <div style={{ fontSize: 11.5, color: "#8A8880", marginTop: 6 }}>{r.publicationDate}</div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Recently passed */}
      {recentlyPassed.length > 0 && (
        <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <CheckCircle2 size={16} color="#5C7A52" />
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "#1B2A4A", margin: 0 }}>Recently passed</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {recentlyPassed.map((b) => (
                <a
                key={b.number}
                href={b.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  border: "1px solid #C9D6C2",
                  background: "#F3F7F1",
                  borderRadius: 4,
                  padding: "16px 18px",
                  textDecoration: "none",
                }}
              >
                <span style={{ fontSize: 11, color: "#5C7A52", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {b.status}
                </span>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1B2A4A", marginTop: 6 }}>{b.number}</div>
                <div style={{ fontSize: 13, color: "#5A5952", marginTop: 2 }}>{b.fullName}</div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Bill list */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 64px", display: "grid", gap: 16 }}>
        {filtered.map((b) => {
          const isPassed = /signed|passed|enacted|effective/i.test(b.status || "");
          const bCountry = billCountry(b);
          return (
          <div key={b.number} style={{ border: "1px solid #E4E0D6", borderRadius: 4, padding: "22px 24px", background: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
              <div>
                <span style={{ fontSize: 12, color: "#A87C2A", fontWeight: 500 }}>{b.number}</span>
                <span style={{ fontSize: 12, color: "#8A8880", marginLeft: 10 }}>{b.condition}</span>
                {bCountry !== "United States" && (
                  <span style={{ fontSize: 11, color: "#5A6B8C", marginLeft: 10, background: "#F4F6FA", padding: "2px 8px", borderRadius: 3 }}>
                    {bCountry}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: isPassed ? 600 : 400,
                  color: isPassed ? "#3F6B33" : "#5A5952",
                  background: isPassed ? "#E3EEDD" : "#F2EEE3",
                  padding: "3px 10px",
                  borderRadius: 3,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                {isPassed && <CheckCircle2 size={12} />}
                {b.status}
              </span>
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: "#1B2A4A", margin: "0 0 6px" }}>{b.fullName}</h3>
            <p style={{ fontSize: 13, color: "#8A8880", marginBottom: 10 }}>
              {b.sponsor} · introduced {b.introduced}
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "#5A5952", marginBottom: 12 }}>{b.summary}</p>

            {aiSummaries[b.number] && (
              <div style={{ background: "#F2EEE3", borderRadius: 3, padding: "12px 14px", marginBottom: 14 }}>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "#3A3934", margin: 0 }}>{aiSummaries[b.number]}</p>
              </div>
            )}

            <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
                <a
                href={b.url}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: 13, fontWeight: 500, color: "#1B2A4A", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                View official record <ExternalLink size={13} />
              </a>
              {!aiSummaries[b.number] && (
                <button
                  onClick={() => getAiSummary(b)}
                  disabled={aiLoadingId === b.number}
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#1B2A4A",
                    background: "none",
                    border: "1px solid #C9C4B4",
                    padding: "9px 14px",
                    borderRadius: 3,
                    cursor: aiLoadingId === b.number ? "default" : "pointer",
                  }}
                >
                  {aiLoadingId === b.number ? "Summarizing…" : "Explain in plain language"}
                </button>
              )}
              <button
                onClick={() => openLetter(b)}
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#FAF8F3",
                  background: "#1B2A4A",
                  border: "none",
                  padding: "9px 16px",
                  borderRadius: 3,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Mail size={13} /> {bCountry === "United States" ? "Contact your senators" : "Contact your representative"}
              </button>
            </div>
          </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 24px", border: "1px dashed #C9C4B4", borderRadius: 4 }}>
            <p style={{ fontSize: 14.5, color: "#2B2A28", marginBottom: 6 }}>
              {condition === "All conditions" && country === "All countries"
                ? "No bills match that search."
                : `No bills currently tracked${condition !== "All conditions" ? ` for ${condition}` : ""}${country !== "All countries" ? ` in ${country}` : ""}.`}
            </p>
            {(condition !== "All conditions" || country !== "All countries") && (
              <p style={{ fontSize: 13, color: "#8A8880", maxWidth: 460, margin: "0 auto 14px" }}>
                {country !== "All countries" && country !== "United States"
                  ? "We're building out international coverage country by country, so this most likely means we haven't added it yet — not that nothing exists. You can still contact your representative about the issues that matter to you, and tell your chapter lead what we should be tracking here."
                  : "We checked Congress.gov and didn't find active federal legislation naming this condition right now. That's real information too — it may mean this is a gap worth raising with your representative."}
              </p>
            )}
            {emptyStateFinder && (
              <a
                href={emptyStateFinder.url}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: 13, fontWeight: 500, color: "#1B2A4A", border: "1px solid #C9C4B4", padding: "9px 14px", borderRadius: 3, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                {emptyStateFinder.label} <ExternalLink size={13} />
              </a>
            )}
          </div>
        )}
      </section>

      {/* Contact modal (inline panel) */}
      {selectedBill && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(43,42,40,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 30 }}>
          <div style={{ background: "#FAF8F3", maxWidth: 520, width: "100%", borderRadius: 6, padding: "28px 28px 24px", maxHeight: "90vh", overflowY: "auto" }}>
            <p style={{ fontSize: 12, color: "#A87C2A", fontWeight: 500, marginBottom: 4 }}>{selectedBill.number}</p>
            <h3 style={{ fontFamily: "Fraunces, serif", fontSize: 19, color: "#1B2A4A", margin: "0 0 16px" }}>
              {selectedBillIsUS ? "Message your state legislators" : "Draft your message"}
            </h3>

            {!selectedBillIsUS ? (
              // International bills: we don't have an address-based legislator
              // lookup, so step 1 is finding your own representative's email
              // via the official finder link, then step 2 lets you actually
              // send it (same Resend-backed endpoint the US flow uses) or
              // fall back to copy/mailto if you'd rather use your own inbox.
              <div>
                <p style={{ fontSize: 13.5, color: "#5A5952", lineHeight: 1.6, marginBottom: 16 }}>
                  We can't automatically look up representatives outside the US yet — start with{" "}
                  <a href={repFinder.url} target="_blank" rel="noreferrer" style={{ color: "#1B2A4A", fontWeight: 500 }}>
                    {repFinder.label}
                  </a>{" "}
                  to find yours, then come back and paste their email below to send directly.
                </p>

                <label style={{ fontSize: 12.5, color: "#5A5952", display: "block", marginBottom: 4 }}>Your name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  style={{ width: "100%", padding: "9px 10px", border: "1px solid #C9C4B4", borderRadius: 3, fontSize: 14, marginBottom: 14, boxSizing: "border-box" }}
                />
                <label style={{ fontSize: 12.5, color: "#5A5952", display: "block", marginBottom: 4 }}>Your email</label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="Replies go here"
                  style={{ width: "100%", padding: "9px 10px", border: "1px solid #C9C4B4", borderRadius: 3, fontSize: 14, marginBottom: 14, boxSizing: "border-box" }}
                />

                <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 12.5, color: "#5A5952", display: "block", marginBottom: 4 }}>Representative's name (optional)</label>
                    <input
                      value={repName}
                      onChange={(e) => setRepName(e.target.value)}
                      placeholder="e.g. Jane Smith MP"
                      style={{ width: "100%", padding: "9px 10px", border: "1px solid #C9C4B4", borderRadius: 3, fontSize: 14, boxSizing: "border-box" }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 12.5, color: "#5A5952", display: "block", marginBottom: 4 }}>Representative's email</label>
                    <input
                      type="email"
                      value={repEmail}
                      onChange={(e) => setRepEmail(e.target.value)}
                      placeholder="From the finder link above"
                      style={{ width: "100%", padding: "9px 10px", border: "1px solid #C9C4B4", borderRadius: 3, fontSize: 14, boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <label style={{ fontSize: 12.5, color: "#5A5952", display: "block", marginBottom: 4 }}>Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  style={{ width: "100%", padding: "10px", border: "1px solid #C9C4B4", borderRadius: 3, fontSize: 13.5, lineHeight: 1.5, marginBottom: 10, boxSizing: "border-box", fontFamily: "Inter, sans-serif" }}
                />

                {intlSendStatus === "error" && (
                  <p style={{ fontSize: 12.5, color: "#B3261E", marginBottom: 10 }}>{intlSendError}</p>
                )}
                {intlSendStatus === "sent" && (
                  <p style={{ fontSize: 12.5, color: "#3F6B33", fontWeight: 600, marginBottom: 10 }}>Sent ✓</p>
                )}

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
                  <button
                    onClick={handleSendInternational}
                    disabled={!name.trim() || !senderEmail.trim() || !repEmail.trim() || !message.trim() || intlSendStatus === "sending" || intlSendStatus === "sent"}
                    style={{
                      fontSize: 13.5,
                      fontWeight: 500,
                      color: "#FAF8F3",
                      background: "#1B2A4A",
                      border: "none",
                      padding: "10px 18px",
                      borderRadius: 3,
                      cursor: "pointer",
                      opacity: (!name.trim() || !senderEmail.trim() || !repEmail.trim() || !message.trim()) ? 0.6 : 1,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Mail size={13} />
                    {intlSendStatus === "sending" ? "Sending…" : intlSendStatus === "sent" ? "Sent ✓" : intlSendStatus === "error" ? "Retry" : "Send email"}
                  </button>
                  <button
                    onClick={() => navigator.clipboard?.writeText(message)}
                    style={{ fontSize: 13.5, fontWeight: 500, color: "#1B2A4A", background: "none", border: "1px solid #C9C4B4", padding: "10px 16px", borderRadius: 3, cursor: "pointer" }}
                  >
                    Copy message
                  </button>
                </div>

                <p style={{ fontSize: 11.5, color: "#8A8880", marginBottom: 8 }}>
                  Prefer to send from your own inbox instead? These open your webmail with the recipient, subject, and message already filled in — you just hit send.
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(repEmail || "")}&su=${encodeURIComponent(`Constituent message: ${selectedBill.number}`)}&body=${encodeURIComponent(message)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 13, fontWeight: 500, color: "#1B2A4A", background: "none", border: "1px solid #C9C4B4", padding: "8px 14px", borderRadius: 3, textDecoration: "none" }}
                  >
                    Open in Gmail
                  </a>
                  <a
                    href={`https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(repEmail || "")}&subject=${encodeURIComponent(`Constituent message: ${selectedBill.number}`)}&body=${encodeURIComponent(message)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 13, fontWeight: 500, color: "#1B2A4A", background: "none", border: "1px solid #C9C4B4", padding: "8px 14px", borderRadius: 3, textDecoration: "none" }}
                  >
                    Open in Outlook
                  </a>
                  <a
                    href={`mailto:${repEmail || ""}?subject=${encodeURIComponent(`Constituent message: ${selectedBill.number}`)}&body=${encodeURIComponent(message)}`}
                    style={{ fontSize: 13, fontWeight: 500, color: "#1B2A4A", background: "none", border: "1px solid #C9C4B4", padding: "8px 14px", borderRadius: 3, textDecoration: "none" }}
                  >
                    Other (mailto)
                  </a>
                </div>

                <p style={{ fontSize: 11.5, color: "#8A8880", marginBottom: 14 }}>
                  "Send email" delivers it for you directly, the same way US messages are sent. The webmail links above open in a new tab pre-filled and work even without entering your name/email above — you just need the representative's email address.
                </p>

                <button
                  onClick={() => setSelectedBill(null)}
                  style={{ fontSize: 13.5, color: "#5A5952", background: "none", border: "none", padding: "10px 0", borderRadius: 3, cursor: "pointer" }}
                >
                  Close
                </button>
              </div>
            ) : lookupStatus === "found" ? (
              <div>
                <p style={{ fontSize: 13.5, color: "#5A5952", lineHeight: 1.6, marginBottom: 16 }}>
                  Sending as {name} ({senderEmail}). Edit your message below if needed, then send to each legislator.
                </p>

                {legislatorMismatch && (
                  <div style={{ background: "#FBF3E7", border: "1px solid #E8D6B6", borderRadius: 4, padding: "12px 14px", marginBottom: 16 }}>
                    <p style={{ fontSize: 13.5, color: "#8A5B1B", fontWeight: 600, marginBottom: 4 }}>
                      Your legislators can't act on this specific bill.
                    </p>
                    <p style={{ fontSize: 13, color: "#8A5B1B", lineHeight: 1.5 }}>
                      {billStateAbbrev(selectedBill)
                        ? `${selectedBill.number} is in the ${billStateAbbrev(selectedBill)} state legislature, outside their jurisdiction.`
                        : "This is federal legislation outside your state legislators' jurisdiction."}{" "}
                      You can still send a message asking them to introduce or sponsor similar legislation where you live — the draft below is already set up for that.
                    </p>
                  </div>
                )}

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  style={{ width: "100%", padding: "10px", border: "1px solid #C9C4B4", borderRadius: 3, fontSize: 13.5, lineHeight: 1.5, marginBottom: 18, boxSizing: "border-box", fontFamily: "Inter, sans-serif" }}
                />
                {legislators.length === 0 ? (
                  <p style={{ fontSize: 13.5, color: "#8A8880" }}>
                    No state legislators found for that address. Double-check it's a full street address.
                  </p>
                ) : (
                  <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
                    {legislators.map((leg) => {
                      const status = sendStatus[leg.id] || "idle";
                      return (
                        <React.Fragment key={leg.id}>
                          <div style={{ border: "1px solid #E4E0D6", borderRadius: 4, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                            <div>
                              <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1B2A4A" }}>{leg.name}</div>
                              <div style={{ fontSize: 12, color: "#8A8880" }}>
                                {leg.chamber}{leg.district ? ` · District ${leg.district}` : ""}{leg.party ? ` · ${leg.party}` : ""}
                              </div>
                            </div>
                            {leg.email ? (
                              status === "sent" ? (
                                <span style={{ fontSize: 12.5, color: "#3F6B33", fontWeight: 600 }}>Sent ✓</span>
                              ) : (
                                <button
                                  onClick={() => handleSendToLegislator(leg)}
                                  disabled={status === "sending"}
                                  style={{ fontSize: 12.5, fontWeight: 500, color: "#FAF8F3", background: "#1B2A4A", border: "none", padding: "7px 12px", borderRadius: 3, cursor: status === "sending" ? "default" : "pointer", whiteSpace: "nowrap" }}
                                >
                                  {status === "sending" ? "Sending…" : status === "error" ? "Retry" : "Send"}
                                </button>
                              )
                            ) : (
                              <a href={leg.contactUrl || leg.openstatesUrl || "#"} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#1B2A4A" }}>
                                Contact page
                              </a>
                            )}
                          </div>
                          {sendErrors[leg.id] && (
                            <p style={{ fontSize: 11.5, color: "#B3261E", margin: "-4px 0 0", paddingLeft: 2 }}>
                              {sendErrors[leg.id]}
                            </p>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => setLookupStatus("idle")}
                    style={{ fontSize: 13.5, color: "#5A5952", background: "none", border: "1px solid #C9C4B4", padding: "10px 18px", borderRadius: 3, cursor: "pointer" }}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setSelectedBill(null)}
                    style={{ fontSize: 13.5, color: "#5A5952", background: "none", border: "none", padding: "10px 18px", borderRadius: 3, cursor: "pointer" }}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <label style={{ fontSize: 12.5, color: "#5A5952", display: "block", marginBottom: 4 }}>Your name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  style={{ width: "100%", padding: "9px 10px", border: "1px solid #C9C4B4", borderRadius: 3, fontSize: 14, marginBottom: 14, boxSizing: "border-box" }}
                />
                <label style={{ fontSize: 12.5, color: "#5A5952", display: "block", marginBottom: 4 }}>Your email</label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="Replies go here"
                  style={{ width: "100%", padding: "9px 10px", border: "1px solid #C9C4B4", borderRadius: 3, fontSize: 14, marginBottom: 14, boxSizing: "border-box" }}
                />
                <label style={{ fontSize: 12.5, color: "#5A5952", display: "block", marginBottom: 4 }}>Your full address</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, Springfield, WA 98001"
                  style={{ width: "100%", padding: "9px 10px", border: "1px solid #C9C4B4", borderRadius: 3, fontSize: 14, marginBottom: 4, boxSizing: "border-box" }}
                />
                <p style={{ fontSize: 11.5, color: "#8A8880", marginBottom: 14 }}>
                  A full street address finds your exact legislators — district lines don't follow ZIP codes.
                </p>
                <label style={{ fontSize: 12.5, color: "#5A5952", display: "block", marginBottom: 4 }}>Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  style={{ width: "100%", padding: "10px", border: "1px solid #C9C4B4", borderRadius: 3, fontSize: 13.5, lineHeight: 1.5, marginBottom: 10, boxSizing: "border-box", fontFamily: "Inter, sans-serif" }}
                />
                {lookupStatus === "error" && (
                  <p style={{ fontSize: 12.5, color: "#B3261E", marginBottom: 10 }}>{lookupError}</p>
                )}
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={handleFindLegislators}
                    disabled={!name.trim() || !senderEmail.trim() || !address.trim() || !message.trim() || lookupStatus === "loading"}
                    style={{ fontSize: 13.5, fontWeight: 500, color: "#FAF8F3", background: "#1B2A4A", border: "none", padding: "10px 18px", borderRadius: 3, cursor: "pointer", opacity: (!name.trim() || !senderEmail.trim() || !address.trim() || !message.trim()) ? 0.6 : 1 }}
                  >
                    {lookupStatus === "loading" ? "Finding your legislators…" : "Find my legislators"}
                  </button>
                  <button
                    onClick={() => setSelectedBill(null)}
                    style={{ fontSize: 13.5, color: "#5A5952", background: "none", border: "1px solid #C9C4B4", padding: "10px 18px", borderRadius: 3, cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
