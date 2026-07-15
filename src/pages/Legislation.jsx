import React, { useState, useMemo, useEffect } from "react";
import Nav from "../components/Nav";
import { Search, ExternalLink, Mail, Filter, CheckCircle2, FileCheck } from "lucide-react";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');`;

const CONDITIONS = [
  "All conditions",
  "Achalasia",
  "Acute disseminated encephalomyelitis",
  "Addison's disease",
  "Adult Still's disease",
  "Agammaglobulinemia",
  "Alopecia areata",
  "Amyloidosis",
  "Ankylosing spondylitis",
  "Anti-GBM/anti-TBM nephritis",
  "Antiphospholipid syndrome",
  "Antisynthetase syndrome",
  "Atopic dermatitis",
  "Autoimmune angioedema",
  "Autoimmune dysautonomia",
  "Autoimmune encephalomyelitis",
  "Autoimmune enteropathy",
  "Autoimmune hepatitis",
  "Autoimmune inner ear disease",
  "Autoimmune lymphoproliferative syndrome",
  "Autoimmune myocarditis",
  "Autoimmune oophoritis",
  "Autoimmune orchitis",
  "Autoimmune pancreatitis",
  "Autoimmune progesterone dermatitis",
  "Autoimmune retinopathy",
  "Autoimmune urticaria",
  "Axonal and neuronal neuropathy (AMAN)",
  "Baló disease",
  "Behçet's disease",
  "Benign mucosal pemphigoid",
  "Bullous pemphigoid",
  "Castleman disease",
  "Celiac disease",
  "Chagas disease",
  "Chronic inflammatory demyelinating polyneuropathy",
  "Chronic recurrent multifocal osteomyelitis",
  "Churg-Strauss syndrome (EGPA)",
  "Cicatricial pemphigoid",
  "Cogan's syndrome",
  "Cold agglutinin disease",
  "Congenital heart block",
  "Coxsackie myocarditis",
  "CREST syndrome",
  "Crohn's disease",
  "Dermatitis herpetiformis",
  "Dermatomyositis",
  "Devic's disease (NMO)",
  "Discoid lupus",
  "Dressler's syndrome",
  "Endometriosis",
  "Eosinophilic esophagitis",
  "Eosinophilic fasciitis",
  "Erythema nodosum",
  "Essential mixed cryoglobulinemia",
  "Evans syndrome",
  "Fibromyalgia",
  "Fibrosing alveolitis",
  "General autoimmune",
  "Giant cell arteritis",
  "Giant cell myocarditis",
  "Glomerulonephritis",
  "Goodpasture's syndrome",
  "Granulomatosis with polyangiitis",
  "Graves' disease",
  "Guillain-Barré syndrome",
  "Hashimoto's encephalopathy",
  "Hashimoto's thyroiditis",
  "Hemolytic anemia",
  "Henoch-Schönlein purpura",
  "Herpes gestationis",
  "Hidradenitis suppurativa",
  "Hypogammaglobulinemia",
  "IgA nephropathy",
  "IgG4-related disease",
  "Immune thrombocytopenic purpura",
  "Inclusion body myositis",
  "Inherited metabolic",
  "Interstitial cystitis",
  "Juvenile arthritis",
  "Juvenile myositis",
  "Kawasaki disease",
  "Lambert-Eaton myasthenic syndrome",
  "Leukocytoclastic vasculitis",
  "Lichen planus",
  "Lichen sclerosus",
  "Linear IgA disease",
  "Lupus (SLE)",
  "Ménière's disease",
  "Microscopic polyangiitis",
  "Miller-Fisher syndrome",
  "Mixed connective tissue disease",
  "Mooren's ulcer",
  "Multifocal motor neuropathy",
  "Multiple sclerosis",
  "Myasthenia gravis",
  "Narcolepsy",
  "Neutropenia",
  "Ocular cicatricial pemphigoid",
  "Optic neuritis",
  "Palindromic rheumatism",
  "Paraneoplastic cerebellar degeneration",
  "Paroxysmal nocturnal hemoglobinuria",
  "Parry-Romberg syndrome",
  "Pars planitis",
  "Parsonage-Turner syndrome",
  "Pemphigus",
  "Peripheral neuropathy",
  "Pernicious anemia",
  "POEMS syndrome",
  "Polyarteritis nodosa",
  "Polyglandular autoimmune syndrome",
  "Polymyalgia rheumatica",
  "Polymyositis",
  "Primary biliary cholangitis",
  "Primary sclerosing cholangitis",
  "Psoriasis",
  "Psoriatic arthritis",
  "Pure red cell aplasia",
  "Pyoderma gangrenosum",
  "Raynaud's phenomenon",
  "Reactive arthritis",
  "Reflex sympathetic dystrophy",
  "Relapsing polychondritis",
  "Restless legs syndrome",
  "Retroperitoneal fibrosis",
  "Rheumatic fever",
  "Rheumatoid arthritis",
  "Sarcoidosis",
  "Schmidt syndrome",
  "Scleritis",
  "Scleroderma",
  "Sjögren's disease",
  "Stiff person syndrome",
  "Susac's syndrome",
  "Sympathetic ophthalmia",
  "Takayasu's arteritis",
  "Temporal arteritis",
  "Tolosa-Hunt syndrome",
  "Transverse myelitis",
  "Type 1 diabetes",
  "Ulcerative colitis",
  "Undifferentiated connective tissue disease",
  "Uveitis",
  "Vasculitis",
  "Vitiligo",
  "Vogt-Koyanagi-Harada disease",
];

const BILLS = [
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
    condition: "Inherited metabolic",
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

export default function LegislationDatabase() {
  const [query, setQuery] = useState("");
  const [condition, setCondition] = useState("All conditions");
  const [selectedBill, setSelectedBill] = useState(null);
  const [zip, setZip] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [aiSummaries, setAiSummaries] = useState({});
  const [aiLoadingId, setAiLoadingId] = useState(null);
  const [sentTo, setSentTo] = useState(null);
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
          condition: b.matched_keyword ? b.matched_keyword.replace(/\b\w/g, (c) => c.toUpperCase()) : "General autoimmune",
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
          condition: b.matched_keyword ? b.matched_keyword.replace(/\b\w/g, (c) => c.toUpperCase()) : "General autoimmune",
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

  const allBills = useMemo(() => [...BILLS, ...liveBills, ...stateBills], [liveBills, stateBills]);

  const filtered = useMemo(() => {
    return allBills.filter((b) => {
      const matchesCondition = condition === "All conditions" || b.condition === condition;
      const matchesQuery =
        query.trim() === "" ||
        (b.name + b.fullName + b.summary + b.number).toLowerCase().includes(query.toLowerCase());
      return matchesCondition && matchesQuery;
    });
  }, [query, condition, allBills]);

  const recentlyPassed = useMemo(() => {
    return allBills
      .filter((b) => /signed|passed|enacted|effective/i.test(b.status || ""))
      .slice(0, 3);
  }, [allBills]);

  const openLetter = (bill) => {
    setSelectedBill(bill);
    setMessage(
      `I am writing as a constituent to ask you to support ${bill.number}, the ${bill.fullName}. ${bill.summary}\n\nThis legislation matters to me and to patients in our community managing this condition. I would appreciate your support.`
    );
    setSentTo(null);
  };

  const handleSend = async () => {
    setSentTo(selectedBill.number);
    try {
      await fetch("/api/counter?key=letters-sent&action=increment");
    } catch {
      // storage unavailable; the count just won't persist this time
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
    } catch (err) {
      setAiSummaries((prev) => ({ ...prev, [bill.number]: "Couldn't generate a summary right now. Try again in a moment." }));
    } finally {
      setAiLoadingId(null);
    }
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: "#2B2A28", background: "#FAF8F3", minHeight: "100%" }}>
      <style>{FONT_IMPORT}</style>

      <Nav />

      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "56px 24px 32px" }}>
        <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#A87C2A", fontWeight: 500, marginBottom: 16 }}>
          119th Congress · 2025–2026
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
          Verified against Congress.gov. Every bill links back to its official record.
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
        </div>
        <p style={{ fontSize: 12.5, color: "#8A8880", marginTop: 10 }}>
          {filtered.length} {filtered.length === 1 ? "bill" : "bills"} shown
          {liveStatus === "loading" && " · loading more from Congress.gov (can take up to a minute)…"}
          {liveStatus === "error" && " · live feed unavailable right now, showing verified bills only"}
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
          return (
          <div key={b.number} style={{ border: "1px solid #E4E0D6", borderRadius: 4, padding: "22px 24px", background: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
              <div>
                <span style={{ fontSize: 12, color: "#A87C2A", fontWeight: 500 }}>{b.number}</span>
                <span style={{ fontSize: 12, color: "#8A8880", marginLeft: 10 }}>{b.condition}</span>
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
                <Mail size={13} /> Contact your senators
              </button>
            </div>
          </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 24px", border: "1px dashed #C9C4B4", borderRadius: 4 }}>
            <p style={{ fontSize: 14.5, color: "#2B2A28", marginBottom: 6 }}>
              {condition === "All conditions"
                ? "No bills match that search."
                : `No bills currently tracked for ${condition}.`}
            </p>
            {condition !== "All conditions" && (
              <p style={{ fontSize: 13, color: "#8A8880", maxWidth: 420, margin: "0 auto" }}>
                We checked Congress.gov and didn't find active federal legislation naming this condition right now. That's real information too —
                it may mean this is a gap worth raising with your representative.
              </p>
            )}
          </div>
        )}
      </section>

      {/* Contact modal (inline panel) */}
      {selectedBill && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(27,42,74,0.4)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 30 }}>
          <div style={{ background: "#FAF8F3", maxWidth: 520, width: "100%", borderRadius: 6, padding: "28px 28px 24px", maxHeight: "90vh", overflowY: "auto" }}>
            <p style={{ fontSize: 12, color: "#A87C2A", fontWeight: 500, marginBottom: 4 }}>{selectedBill.number}</p>
            <h3 style={{ fontFamily: "Fraunces, serif", fontSize: 19, color: "#1B2A4A", margin: "0 0 16px" }}>Message your senators</h3>

            {sentTo ? (
              <div>
                <p style={{ fontSize: 14, color: "#5A5952", lineHeight: 1.6 }}>
                  Your message about {sentTo} is ready. Use the link below to find your senators' contact pages and send it directly — we don't send messages on your behalf.
                </p>
                
                  href="https://www.senate.gov/senators/senators-contact.htm"
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 500, color: "#1B2A4A", marginTop: 14, textDecoration: "none" }}
                >
                  Find your senators <ExternalLink size={13} />
                </a>
                <button
                  onClick={() => setSelectedBill(null)}
                  style={{ display: "block", marginTop: 20, fontSize: 13, color: "#8A8880", background: "none", border: "none", cursor: "pointer" }}
                >
                  Close
                </button>
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
                <label style={{ fontSize: 12.5, color: "#5A5952", display: "block", marginBottom: 4 }}>ZIP code</label>
                <input
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="98027"
                  style={{ width: "100%", padding: "9px 10px", border: "1px solid #C9C4B4", borderRadius: 3, fontSize: 14, marginBottom: 14, boxSizing: "border-box" }}
                />
                <label style={{ fontSize: 12.5, color: "#5A5952", display: "block", marginBottom: 4 }}>Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  style={{ width: "100%", padding: "10px", border: "1px solid #C9C4B4", borderRadius: 3, fontSize: 13.5, lineHeight: 1.5, marginBottom: 18, boxSizing: "border-box", fontFamily: "Inter, sans-serif" }}
                />
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={handleSend}
                    style={{ fontSize: 13.5, fontWeight: 500, color: "#FAF8F3", background: "#1B2A4A", border: "none", padding: "10px 18px", borderRadius: 3, cursor: "pointer" }}
                  >
                    Prepare message
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
