import { useState } from "react";
import Nav from "../components/Nav";
import "./CreateChapter.css";

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
                <label htmlFor="social">
                  Instagram or contact handle{" "}
                  <span className="chapter-optional">Optional</span>
                </label>
                <input
                  id="social"
                  type="text"
                  value={form.social}
                  onChange={update("social")}
                  placeholder="@handle"
                />
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
    </>
  );
}
