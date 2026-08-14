import { useState } from "react";
import Nav from "../components/Nav";
import "./CreateChapter.css";

// ---- Chapter directory data ----
// Real bios/photos only for chapters that have actually sent them, with
// consent to be shown publicly. Everyone else shows as an open "New
// chapter" card until their info comes in.
const CHAPTERS = [
  {
    first: "Katherine", lastInitial: "H", city: "Virginia Beach", region: "Virginia", country: "US",
    photo: "/chapter-photos/katie.jpg", handle: null,
    bio: "Hi, I'm Katie, a college student and autoimmune disease advocate who has navigated years of chronic illness, multiple autoimmune diagnoses, and the ongoing search for answers. I'm passionate about using my voice to raise awareness, connect with others, and remind people that even when the journey to a diagnosis is long and uncertain, no one has to navigate it alone.",
  },
  {
    first: "Jehan", lastInitial: "Z", city: "Orland Park", region: "Illinois", country: "US",
    photo: "/chapter-photos/jehan.jpg", handle: null,
    bio: "Hey everyone — I'm JZ from Chicago. I am 39 years old and have been fighting Crohn's disease since I was 12. I now have a permanent ileostomy bag. I joined a chapter because I want to help people cope with this disease. I love giving advice and being an ear to cry/vent to.",
  },
  {
    first: "Farnaz", lastInitial: "V", city: "Shiraz", region: null, country: "Iran",
    photo: "/chapter-photos/farnaz.jpg", handle: null,
    bio: "I'm a CIDP patient and I started CIDP Iran to raise awareness about CIDP and create a supportive space for people living with the condition in Iran. I wanted to connect patients, share reliable information and real-life experiences, and most importantly, help people feel less alone in their journey.",
  },
  {
    first: "Veronika", lastInitial: "M", city: "Prague", region: null, country: "Czech Republic",
    photo: "/chapter-photos/veronika.jpg", handle: "@autoimmunevoicesCzechia",
    bio: "Hi, my name is Veronika, I am from a little country in Central Europe named Czech Republic, or Czechia. I decided to join because I like helping people, so why not try it! My city is Prague, but since we are a small country, I'll be representing Czechia as a whole.",
  },
  {
    first: "Aadya", lastInitial: "S", city: "Sammamish", region: "Washington", country: "US",
    photo: null, handle: null, role: "founder",
    bio: "I founded AutoimmuneVoices after seeing how difficult it can be for people with autoimmune and chronic conditions to understand the policies that affect them. I wanted to create a space that makes advocacy easier and gives people a way to use their voices, connect with others, and create change in their own communities.",
  },
  { first: "Desiree", lastInitial: "B", city: "Wilmington", region: "North Carolina", country: "US", photo: null, handle: null, bio: null },
  { first: "Cecilia", lastInitial: "G", city: "Modesto", region: "California", country: "US", photo: null, handle: null, bio: null },
  { first: "Hana", lastInitial: "S", city: "Jefferson", region: "Massachusetts", country: "US", photo: null, handle: null, bio: null },
  {
    first: "Krystal", lastInitial: "P", city: "Detroit", region: "Michigan", country: "US",
    photo: "/chapter-photos/krystal.jpg", handle: null,
    bio: "My name is Krystal Parker, but most people call me Krys. I'm 40 years old and I live in Detroit, Michigan. I have Rheumatoid Arthritis, Lupus, and Sjogren's Syndrome. I have a B.A. in Business and I'm currently studying psychology to become a therapist. I became a Chapter Leader because I would love to bring more awareness to autoimmune diseases and the needs of the community within them — from education on autoimmune diseases, to providing information for our allies, to advocating for ourselves with doctors, insurance companies, and lawmakers.",
  },
  {
    first: "Liesel", lastInitial: "R", city: "Gold Coast", region: "Queensland", country: "Australia",
    photo: "/chapter-photos/liesel.jpg", handle: null,
    bio: "Hi! I'm Liesel, a doctor who lives with Crohn's Disease and an ileostomy. I'm passionate about supporting fellow ostomates, and advocating for the IBD community. I'm excited to be connected with a worldwide community of people living with autoimmune disease - together we can make a difference!!",
  },
  { first: "Astha", lastInitial: "", city: "Delhi", region: null, country: "India", photo: null, handle: null, bio: null },
  { first: "Cece", lastInitial: "P", city: "Brighton", region: null, country: "United Kingdom", photo: null, handle: null, bio: null },
  {
    first: "Alex", lastInitial: "B", city: "Sydney", region: "New South Wales", country: "Australia",
    photo: "/chapter-photos/alex.jpg", handle: null,
    bio: "I'm AB, the founder of @chronically_ill_af and part of the Sydney Chapter of AutoimmuneVoices. I joined because living with autoimmune disease can feel incredibly isolating, and I wanted to help create a community where people feel seen, heard and supported, while still being able to laugh at the absolute chaos of chronic illness. I'm passionate about advocacy, accessibility and making sure people with invisible illnesses know they're not alone.",
  },
  { first: "Lexi", lastInitial: "P", city: "Waltham", region: "Massachusetts", country: "US", photo: null, handle: null, bio: null },
  { first: "Jenna", lastInitial: "B", city: "Ellensburg", region: "Washington", country: "US", photo: null, handle: null, bio: null },
  { first: "Kayleigh", lastInitial: "J", city: "Trinidad", region: null, country: "Trinidad and Tobago", photo: null, handle: null, bio: null },
  { first: "Ry", lastInitial: "L", city: "Weatherford", region: "Texas", country: "US", photo: null, handle: null, bio: null },
  { first: "Nidhi", lastInitial: "N", city: "Charlotte", region: "North Carolina", country: "US", photo: null, handle: null, bio: null },
  { first: "Laura", lastInitial: "H", city: "Adelaide", region: "South Australia", country: "Australia", photo: null, handle: null, bio: null },
  { first: "Carlos", lastInitial: "P", city: "New Orleans", region: "Louisiana", country: "US", photo: "/chapter-photos/carlos.jpg", handle: null, bio: null },
  {
    first: "Cinta", lastInitial: "", city: "Bandung", region: null, country: "Indonesia",
    photo: "/chapter-photos/cinta.jpg", handle: null,
    bio: "Hi! My name is Cinta. I was diagnosed with lupus when I was 17 and being diagnosed with an autoimmune condition has been a significant struggle for me, mostly due to the difficulty of finding information about the disease and the fact that so many people are unfamiliar with or do not understand it. That is why I have joined this chapter — to make it easier for fellow survivors, friends, family members, and caregivers to access adequate information about autoimmune lupus.",
  },
  { first: "Alicia", lastInitial: "T", city: "Victorville", region: "California", country: "US", photo: null, handle: "@theinflamednurse", bio: null },
  {
    first: "Melitta", lastInitial: "T", city: "Chester", region: "Virginia", country: "US",
    photo: "/chapter-photos/melitta.jpg", handle: "@flarebutfavored",
    bio: "Hi, I'm Melitta Tweh, and I'm honored to lead the AutoimmuneVoices Chester, Virginia Chapter. I was diagnosed with lupus, rheumatoid arthritis, interstitial lung disease, MCTD (mixed connective tissue disease), and a nerve disorder. Living with chronic illness has shown me how important it is to have a community where people feel seen, supported, and understood, which inspired me to create a space for others navigating autoimmune disease. My hope is to bring people together through encouragement, advocacy, education, and genuine connection while reminding others that their diagnosis does not define who they are.",
  },
  {
    first: "Shayla", lastInitial: "C", city: "Rogers", region: "Arkansas", country: "US",
    photo: "/chapter-photos/shayla.jpg", handle: "@crafton_shayla",
    bio: "Hi there! My name is Shayla, and I'm a recent Bachelor of Science in Nursing graduate and a Registered Nurse. I'm also embarking on my Doctoral journey. I have 2 confirmed autoimmune diseases: Hashimoto's thyroiditis (since age 3), and UCTD. Throughout my experiences as a patient, student, coach, and nurse, I've gained a deep understanding of the healthcare system. I've noticed that symptoms in children and young adults are often dismissed or overlooked altogether. My goal is to raise awareness, build confidence, share reliable information, and help others feel less alone. This area is my home, and it's filled with small towns where access to healthcare can be limited. I'm passionate about making a difference in this community and ensuring that everyone has the support they deserve.",
  },
];

function chapterLocation(c) {
  if (c.country === "US") return `${c.city}, ${c.region}`;
  return c.region ? `${c.city}, ${c.region}, ${c.country}` : `${c.city}, ${c.country}`;
}

const PERSON_ICON_COLORS = ["#206060", "#123838", "#8A5C3B"];

function ChapterDirectory() {
  const [selected, setSelected] = useState(new Set());

  const usRegions = [...new Set(CHAPTERS.filter((c) => c.country === "US").map((c) => c.region))].sort();
  const intlCountries = [...new Set(CHAPTERS.filter((c) => c.country !== "US").map((c) => c.country))].sort();
  const filterOptions = [...usRegions, ...intlCountries];

  function toggleFilter(value) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  const visible =
    selected.size === 0
      ? CHAPTERS
      : CHAPTERS.filter((c) => selected.has(c.country === "US" ? c.region : c.country));

  return (
    <section className="chapter-directory">
      <div className="chapter-directory-head">
        <span className="chapter-eyebrow">Already registered</span>
        <h2>{CHAPTERS.length} chapters, and counting</h2>
        <p>
          See who's already building a chapter near you — or reach out if you'd rather join one than
          start your own.
        </p>
      </div>

      <div className="chapter-directory-filter-label">Filter by location</div>
      <p className="chapter-directory-filter-hint">
        Click as many as you want — showing chapters that match any selected location.
      </p>
      <div className="chapter-directory-pills">
        <button
          className={`chapter-directory-pill all-pill ${selected.size === 0 ? "active" : ""}`}
          onClick={() => setSelected(new Set())}
        >
          All
        </button>
        {filterOptions.map((opt) => (
          <button
            key={opt}
            className={`chapter-directory-pill ${selected.has(opt) ? "active" : ""}`}
            onClick={() => toggleFilter(opt)}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="chapter-directory-result-row">
        <span>
          {visible.length} of {CHAPTERS.length} chapters shown
        </span>
        {selected.size > 0 && (
          <button className="chapter-directory-clear" onClick={() => setSelected(new Set())}>
            Clear filters
          </button>
        )}
      </div>

      <div className="chapter-directory-grid">
        {visible.map((c, i) => (
          <div className="chapter-directory-card" key={`${c.first}-${c.city}`}>
            <div className="chapter-directory-card-header">
              {c.photo ? (
                <img className="chapter-directory-avatar-img" src={c.photo} alt={`${c.first} ${c.lastInitial}.`} />
              ) : (
                <div
                  className="chapter-directory-avatar"
                  style={{ background: PERSON_ICON_COLORS[i % PERSON_ICON_COLORS.length] }}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="8" r="4" fill="white" fillOpacity="0.9" />
                    <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="white" fillOpacity="0.9" />
                  </svg>
                </div>
              )}
              <div className="chapter-directory-text">
                <div className="chapter-directory-name">
                  {c.first}
                  {c.lastInitial ? ` ${c.lastInitial}.` : ""}
                </div>
                <div className="chapter-directory-loc">{chapterLocation(c)}</div>
                {c.role === "founder" ? (
                  <span className="chapter-directory-badge founder">Founder</span>
                ) : c.bio ? (
                  <span className="chapter-directory-badge real">Chapter lead</span>
                ) : (
                  <span className="chapter-directory-badge pending">New chapter</span>
                )}
              </div>
            </div>
            {c.bio && <div className="chapter-directory-bio">{c.bio}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada",
  "New Hampshire","New Jersey","New Mexico","New York","North Carolina",
  "North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island",
  "South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming",
  "Washington, D.C.", "Outside the U.S.",
];

const EMPTY_FORM = {
  fullName: "",
  email: "",
  city: "",
  state: "",
  chapterName: "",
  connection: "",
  interestedCount: "",
  social: "",
};

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function CreateChapter() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const errors = {
    fullName: form.fullName.trim() ? "" : "Enter your name.",
    email: isValidEmail(form.email) ? "" : "Enter a valid email.",
    city: form.city.trim() ? "" : "Enter your city.",
    state: form.state ? "" : "Choose a state.",
    chapterName: form.chapterName.trim() ? "" : "Give your chapter a name.",
    social: form.social.trim() ? "" : "Enter your Instagram or contact handle.",
  };
  const isValid = Object.values(errors).every((e) => !e);

  function update(field) {
    return (e) => {
      const value = e.target.value;
      setForm((f) => ({ ...f, [field]: value }));
      if (field === "city" || field === "state") {
        setForm((f) => {
          const nextCity = field === "city" ? value : f.city;
          const nextState = field === "state" ? value : f.state;
          const suggested = nextCity && nextState ? `${nextCity} Chapter` : f.chapterName;
          const wasAuto = !f.chapterName || f.chapterName.endsWith(" Chapter");
          return {
            ...f,
            [field]: value,
            chapterName: wasAuto ? suggested : f.chapterName,
          };
        });
      }
    };
  }

  function blur(field) {
    return () => setTouched((t) => ({ ...t, [field]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      fullName: true,
      email: true,
      city: true,
      state: true,
      chapterName: true,
      social: true,
    });
    if (!isValid) return;

    setStatus("submitting");
    setErrorMessage("");
    try {
      const res = await fetch("/api/register-chapter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
      setForm(EMPTY_FORM);
      setTouched({});
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <>
        <Nav />
        <section className="chapter-page">
          <div className="chapter-shell chapter-shell--confirm">
            <span className="chapter-eyebrow">Chapter request received</span>
            <h1 className="chapter-confirm-title">You just planted a pin.</h1>
            <p className="chapter-confirm-body">
              Your chapter request is in. We'll reach out at the email you gave us
              with next steps for getting your chapter listed and connected to the
              advocate network.
            </p>
            <button
              type="button"
              className="chapter-link-button"
              onClick={() => setStatus("idle")}
            >
              Register another chapter
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Nav />
      <section className="chapter-page">
        <div className="chapter-shell">
          <div className="chapter-intro">
            <span className="chapter-eyebrow">Chapters</span>
            <h1 className="chapter-title">
              Every state needs
              <br />a voice. Start yours.
            </h1>
            <p className="chapter-body">
              AutoimmuneVoices chapters are local advocacy hubs — a handful of
              people in one place who track the bills that affect their
              community and speak up when it matters. Starting one takes five
              minutes. Growing it takes whoever you bring with you.
            </p>
            <ul className="chapter-facts">
              <li>
                <span className="chapter-facts-num">01</span>
                We list your chapter and connect you with nearby advocates
                already tracking legislation in your state.
              </li>
              <li>
                <span className="chapter-facts-num">02</span>
                You get early notice on bills in your state before hearings and
                votes, so your chapter can act while it counts.
              </li>
              <li>
                <span className="chapter-facts-num">03</span>
                No minimum size. Some chapters are one person with a mailing
                list. That's a chapter.
              </li>
            </ul>
          </div>

          <form className="chapter-form" onSubmit={handleSubmit} noValidate>
            <div className="chapter-field-row">
              <div className="chapter-field">
                <label htmlFor="fullName">Your name</label>
                <input
                  id="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={update("fullName")}
                  onBlur={blur("fullName")}
                  autoComplete="name"
                />
                {touched.fullName && errors.fullName && (
                  <span className="chapter-error">{errors.fullName}</span>
                )}
              </div>
              <div className="chapter-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  onBlur={blur("email")}
                  autoComplete="email"
                />
                {touched.email && errors.email && (
                  <span className="chapter-error">{errors.email}</span>
                )}
              </div>
            </div>

            <div className="chapter-field-row">
              <div className="chapter-field">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  value={form.city}
                  onChange={update("city")}
                  onBlur={blur("city")}
                />
                {touched.city && errors.city && (
                  <span className="chapter-error">{errors.city}</span>
                )}
              </div>
              <div className="chapter-field">
                <label htmlFor="state">State</label>
                <select
                  id="state"
                  value={form.state}
                  onChange={update("state")}
                  onBlur={blur("state")}
                >
                  <option value="" disabled>
                    Choose one
                  </option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {touched.state && errors.state && (
                  <span className="chapter-error">{errors.state}</span>
                )}
              </div>
            </div>

            <div className="chapter-field">
              <label htmlFor="chapterName">Chapter name</label>
              <input
                id="chapterName"
                type="text"
                value={form.chapterName}
                onChange={update("chapterName")}
                onBlur={blur("chapterName")}
                placeholder="e.g. Bellevue Chapter"
              />
              {touched.chapterName && errors.chapterName && (
                <span className="chapter-error">{errors.chapterName}</span>
              )}
            </div>

            <div className="chapter-field">
              <label htmlFor="connection">
                What made you want to start a chapter?{" "}
                <span className="chapter-optional">Optional</span>
              </label>
              <textarea
                id="connection"
                rows={3}
                value={form.connection}
                onChange={update("connection")}
                placeholder="Your connection to autoimmune disease, what you're hoping to change locally, anything we should know."
              />
            </div>

            <div className="chapter-field-row">
              <div className="chapter-field">
                <label htmlFor="interestedCount">
                  People you'd bring with you{" "}
                  <span className="chapter-optional">Optional</span>
                </label>
                <input
                  id="interestedCount"
                  type="text"
                  inputMode="numeric"
                  value={form.interestedCount}
                  onChange={update("interestedCount")}
                  placeholder="Rough guess is fine"
                />
              </div>
              <div className="chapter-field">
                <label htmlFor="social">Instagram or contact handle</label>
                <input
                  id="social"
                  type="text"
                  value={form.social}
                  onChange={update("social")}
                  onBlur={blur("social")}
                  placeholder="@handle"
                />
                {touched.social && errors.social && (
                  <span className="chapter-error">{errors.social}</span>
                )}
              </div>
            </div>

            {status === "error" && (
              <p className="chapter-error chapter-error--submit">{errorMessage}</p>
            )}

            <button
              type="submit"
              className="chapter-submit"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Registering…" : "Register as an advocate"}
            </button>
          </form>
        </div>
      </section>
      <ChapterDirectory />
    </>
  );
}
