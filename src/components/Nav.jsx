import React from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Legislation", to: "/legislation" },
  { label: "Resource Library", to: "/resource-library" },
  { label: "Start a Chapter", to: "/create-chapter" },
  { label: "Events", to: "/events" },
  { label: "Impact", to: "/impact" },
  { label: "Brainstorm", to: "/brainstorm" },
];

const NAV_FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const BRAND_FONT = "'Fraunces', Georgia, serif";

export default function Nav() {
  const location = useLocation();

  const linkStyle = (isActive) => ({
    fontFamily: NAV_FONT,
    fontSize: 14,
    color: isActive ? "#1B2A4A" : "#5A5952",
    fontWeight: isActive ? 600 : 400,
    textDecoration: "none",
    borderBottom: isActive ? "2px solid #A87C2A" : "2px solid transparent",
    paddingBottom: 4,
  });

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
          style={{ fontFamily: BRAND_FONT, fontWeight: 600, fontSize: 18, color: "#1B2A4A", textDecoration: "none" }}
        >
          AutoimmuneVoices
        </Link>
        <nav style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {NAV_ITEMS.map((item) => (
            <Link key={item.to} to={item.to} style={linkStyle(location.pathname === item.to)}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
