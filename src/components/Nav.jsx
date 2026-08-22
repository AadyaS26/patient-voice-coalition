import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

// "Chapter" and "Events" are hover/click dropdowns with two destinations
// each, instead of a single link — keeps the top bar from growing while
// still surfacing both the form and the directory / gallery.
const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Legislation", to: "/legislation" },
  { label: "Advocacy Training", to: "/advocacy-training" },
  { label: "Resource Library", to: "/resource-library" },
  {
    label: "Chapter",
    dropdown: [
      { label: "Start a Chapter", to: "/create-chapter" },
      { label: "Current Chapters", to: "/current-chapters" },
    ],
  },
  {
    label: "Events",
    dropdown: [
      { label: "Events", to: "/events" },
      { label: "Gallery", to: "/gallery" },
    ],
  },
  { label: "Impact", to: "/impact" },
  { label: "Brainstorm", to: "/brainstorm" },
];

const NAV_FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const BRAND_FONT = "'Fraunces', Georgia, serif";

export default function Nav() {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  // Plain object, no button/anchor-specific quirks baked in — used for
  // both the <Link> items and the dropdown trigger <span>s so they render
  // pixel-identically. Buttons carry their own baseline/line-height
  // behavior in some browsers that even a full CSS reset doesn't fully
  // erase, which is what caused "Chapter"/"Events" to sit slightly off
  // from the plain links — a <span> has none of that built-in styling to
  // fight against.
  const linkStyle = (isActive) => ({
    fontFamily: NAV_FONT,
    fontSize: 14,
    color: isActive ? "#1B2A4A" : "#5A5952",
    fontWeight: isActive ? 600 : 400,
    textDecoration: "none",
    borderBottom: isActive ? "2px solid #A87C2A" : "2px solid transparent",
    paddingBottom: 4,
    cursor: "pointer",
  });

  // A dropdown parent looks "active" if the current path matches any of
  // its own children — e.g. being on /events or /gallery both bold "Events".
  function isDropdownActive(item) {
    return item.dropdown.some((sub) => location.pathname === sub.to.split("#")[0]);
  }

  return (
    <header style={{ borderBottom: "1px solid #E4E0D6", padding: "16px 24px", background: "#FAF8F3", position: "relative" }}>
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
        <nav style={{ display: "flex", alignItems: "baseline", gap: 20, flexWrap: "wrap" }}>
          {NAV_ITEMS.map((item) => {
            if (!item.dropdown) {
              return (
                <Link key={item.to} to={item.to} style={linkStyle(location.pathname === item.to)}>
                  {item.label}
                </Link>
              );
            }

            const isOpen = openMenu === item.label;
            return (
              <div
                key={item.label}
                style={{ position: "relative", display: "inline-block" }}
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu((cur) => (cur === item.label ? null : cur))}
              >
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => setOpenMenu((cur) => (cur === item.label ? null : item.label))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setOpenMenu((cur) => (cur === item.label ? null : item.label));
                    }
                  }}
                  style={linkStyle(isDropdownActive(item))}
                >
                  {item.label}
                </span>
                {isOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      marginTop: 0,
                      paddingTop: 8,
                      background: "transparent",
                      zIndex: 20,
                    }}
                  >
                    <div
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid #E4E0D6",
                        borderRadius: 8,
                        boxShadow: "0 8px 24px rgba(27,42,74,0.12)",
                        minWidth: 190,
                        padding: "6px 0",
                      }}
                    >
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.to}
                          to={sub.to}
                          onClick={() => setOpenMenu(null)}
                          style={{
                            display: "block",
                            fontFamily: NAV_FONT,
                            fontSize: 14,
                            color: "#2B2A28",
                            textDecoration: "none",
                            padding: "9px 16px",
                          }}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
