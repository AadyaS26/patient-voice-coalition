import { useState } from "react";
import Nav from "../components/Nav";
import "./FindRepresentatives.css";

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function ComposeForm({ legislator, onSent }) {
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [subject, setSubject] = useState("Constituent concern: autoimmune and chronic disease policy");
  const [message, setMessage] = useState(
    `Dear ${legislator.title || "Representative"} ${legislator.name.split(" ").slice(-1)[0]},\n\nI'm a constituent writing about policies affecting autoimmune and chronic disease patients in our district. [Add your specific concern, bill number, or personal story here.]\n\nThank you for your time and service.`
  );
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMessage, setErrorMessage] = useState("");

  const isValid =
    senderName.trim() && isValidEmail(senderEmail) && subject.trim() && message.trim();

  async function handleSend(e) {
    e.preventDefault();
    if (!isValid) return;
    setStatus("sending");
    setErrorMessage("");
    try {
      const res = await fetch("/api/send-legislator-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          legislatorEmail: legislator.email,
          legislatorName: legislator.name,
          senderName,
          senderEmail,
          subject,
          message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setStatus("sent");
      onSent?.();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  }

  if (status === "sent") {
    return (
      <div className="reps-compose-sent">
        Your message to {legislator.name} was sent, and a copy went to your own email.
      </div>
    );
  }

  return (
    <form className="reps-compose" onSubmit={handleSend}>
      <div className="reps-compose-row">
        <div className="reps-field">
          <label>Your name</label>
          <input value={senderName} onChange={(e) => setSenderName(e.target.value)} />
        </div>
        <div className="reps-field">
          <label>Your email</label>
          <input
            type="email"
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
            placeholder="Replies go here"
          />
        </div>
      </div>
      <div className="reps-field">
        <label>Subject</label>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>
      <div className="reps-field">
        <label>Message</label>
        <textarea rows={7} value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      {/* Honeypot field — hidden from real users via CSS, bots often fill every field */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="reps-honeypot"
        onChange={() => {}}
      />
      {status === "error" && <p className="reps-error">{errorMessage}</p>}
      <button type="submit" className="reps-send-btn" disabled={!isValid || status === "sending"}>
        {status === "sending" ? "Sending…" : `Send to ${legislator.name}`}
      </button>
    </form>
  );
}

function RepCard({ legislator }) {
  const [composing, setComposing] = useState(false);
  const initials = legislator.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="reps-card">
      <div className="reps-card-top">
        {legislator.image ? (
          <img src={legislator.image} alt="" className="reps-avatar" />
        ) : (
          <div className="reps-avatar reps-avatar-fallback">{initials}</div>
        )}
        <div>
          <h3>{legislator.name}</h3>
          <p className="reps-meta">
            {legislator.chamber}
            {legislator.district ? ` · District ${legislator.district}` : ""}
            {legislator.party ? ` · ${legislator.party}` : ""}
          </p>
        </div>
      </div>

      {legislator.email ? (
        composing ? (
          <ComposeForm legislator={legislator} onSent={() => {}} />
        ) : (
          <button className="reps-write-btn" onClick={() => setComposing(true)}>
            Write to {legislator.name.split(" ").slice(-1)[0]}
          </button>
        )
      ) : (
        <a
          className="reps-contact-link"
          href={legislator.contactUrl || legislator.openstatesUrl || "#"}
          target="_blank"
          rel="noreferrer"
        >
          No email on file — visit their contact page
        </a>
      )}
    </div>
  );
}

export default function FindRepresentatives() {
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [errorMessage, setErrorMessage] = useState("");
  const [reps, setReps] = useState([]);
  const [matchedAddress, setMatchedAddress] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!address.trim()) return;
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/find-representatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setReps(data.representatives || []);
      setMatchedAddress(data.matchedAddress || "");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <>
      <Nav />
      <div className="reps-page">
        <div className="reps-wrap">
          <div className="reps-hero">
            <span className="reps-eyebrow">Find Your Representatives</span>
            <h1 className="reps-hero-title">Know who to write to. Then write to them.</h1>
            <p className="reps-hero-body">
              Enter your address to find your state senator and state representative, and send
              them a message directly — no separate email app needed.
            </p>
          </div>

          <form className="reps-search" onSubmit={handleSubmit}>
            <label className="reps-search-label" htmlFor="address">
              Your full address
            </label>
            <div className="reps-search-row">
              <input
                id="address"
                type="text"
                placeholder="123 Main St, Springfield, WA 98001"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <button type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Searching…" : "Find my reps"}
              </button>
            </div>
            <p className="reps-search-hint">
              A full street address gives the most accurate result — district lines don't follow
              ZIP codes.
            </p>
          </form>

          {status === "error" && <p className="reps-error reps-error-page">{errorMessage}</p>}

          {status === "done" && (
            <div className="reps-results">
              {matchedAddress && (
                <p className="reps-matched">Showing results for: {matchedAddress}</p>
              )}
              {reps.length === 0 ? (
                <p className="reps-empty">
                  No representatives found for that address. Double check it's a full street
                  address within a U.S. state.
                </p>
              ) : (
                <div className="reps-grid">
                  {reps.map((r) => (
                    <RepCard key={r.id} legislator={r} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
