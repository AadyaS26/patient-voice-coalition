import React from "react";
import { Link, useLocation } from "react-router-dom";

// Ordered for how people actually use the site: core content first
// (Legislation, Resource Library), then the two ways to get involved
// (Start a Chapter, Events), then results and background last.
const NAV_ITEMS = [
  { label: "Home", to: "/", type: "route" },
  { label: "Legislation", to: "/legislation", type: "route" },
  { label: "Resource Library", href: "/resource-library.html", type: "static" },
  { label: "Start a Chapter", to: "/create-chapter", type: "route" },
  { label: "Events", to: "/events", type: "route" },
  { label: "Impact", to: "/impact", type: "route" },
  { label: "Brainstorm", to: "/brainstorm", type: "route" },
];

// Every value here is explicit — including fontFamily — so this component
// renders identically no matter what font-family the surrounding page
// happens to set on its own wrapper. Previously fontFamily was only set on
// the logo, so nav links silently inherited whatever font each page used,
// which is why the nav looked different size/weight from page to page.
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
          {NAV_ITEMS.map((item) =>
            item.type === "route" ? (
              <Link key={item.to} to={item.to} style={linkStyle(location.pathname === item.to)}>
                {item.label}
              </Link>
            ) : (
              <a key={item.href} href={item.href} style={linkStyle(false)}>
                {item.label}
              </a>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
