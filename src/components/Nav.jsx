import React from "react";
import { Link, useLocation } from "react-router-dom";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "Legislation", to: "/legislation" },
  { label: "Impact", to: "/impact" },
  { label: "Events", to: "/events" },
  { label: "Brainstorm", to: "/brainstorm" },
];

export default function Nav() {
  const location = useLocation();

  return (
    <header style={{ borderBottom: "1px solid #E4E0D6", padding: "16px 24px", background: "#FAF8F3" }}>
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Link
          to="/"
          style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 18, color: "#1B2A4A", textDecoration: "none" }}
        >
          AutoimmuneVoices
        </Link>
        <nav style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                fontSize: 14,
                color: location.pathname === l.to ? "#1B2A4A" : "#5A5952",
                fontWeight: location.pathname === l.to ? 600 : 400,
                textDecoration: "none",
                borderBottom: location.pathname === l.to ? "2px solid #A87C2A" : "2px solid transparent",
                paddingBottom: 4,
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
