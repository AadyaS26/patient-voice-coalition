import { useEffect, useRef, useState } from "react";
import * as d3 from "d3-geo";
import { feature } from "topojson-client";

// ---- 1. YOUR DATA -----------------------------------------------------
// Update this list (and TOTAL_REACHED) whenever your backend numbers change.
// Country names must match world-atlas's `properties.name` values —
// see the NAME_OVERRIDES map below for the few that differ from common usage.

const TOTAL_REACHED = 22199;

const COUNTRY_PERCENTAGES = {
  "United States": 50.9,
  "United Kingdom": 14.51,
  "India": 5.75,
  "Canada": 4.81,
  "Australia": 2.83,
  "Germany": 2.45,
  "Ireland": 1.32,
  "Brazil": 1.23,
  "South Africa": 1.23,
  "Spain": 1.23,
  "Pakistan": 1.04,
  "Netherlands": 0.94,
  "Turkey": 0.94,
  "Mexico": 0.85,
  "Chile": 0.66,
  "Italy": 0.66,
  "New Zealand": 0.57,
  "Nigeria": 0.57,
  "Indonesia": 0.47,
  "Argentina": 0.47,
  "France": 0.38,
  "Uganda": 0.38,
  "Egypt": 0.38,
  "Uruguay": 0.38,
  "Austria": 0.38,
  "Philippines": 0.38,
  "Bangladesh": 0.28,
  "Belgium": 0.28,
  "Finland": 0.28,
  "Saudi Arabia": 0.28,
  "Algeria": 0.28,
  "Kenya": 0.28,
  "United Arab Emirates": 0.28,
  "Iran": 0.28,
  "Serbia": 0.19,
  "Hong Kong SAR": 0.19,
  "Portugal": 0.19,
  "Honduras": 0.19,
  "Sweden": 0.19,
  "Morocco": 0.19,
  "Singapore": 0.19,
  "Maldives": 0.19,
  "Colombia": 0.19,
  "Peru": 0.19,
  "Poland": 0.19,
};

// world-atlas uses these exact feature names, which differ from the
// display names above. Add to this map if a country isn't shading in.
const NAME_OVERRIDES = {
  "United States of America": "United States",
  "Hong Kong S.A.R.": "Hong Kong SAR",
};

const WORLD_ATLAS_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ---- 2. COLORS (matches autoimmune-voices.org) -------------------------
const COLOR_REACHED = "#4a6da8"; // lighter navy/blue
const COLOR_REACHED_HOVER = "#c9a55c"; // site's gold accent
const COLOR_EMPTY = "#e8e3d5"; // muted cream
const COLOR_STROKE = "#faf7ef"; // site background cream
const COLOR_TOOLTIP_BG = "#1a2744"; // site navy

function displayName(rawName) {
  return NAME_OVERRIDES[rawName] || rawName;
}

export default function ReachMap() {
  const svgRef = useRef(null);
  const wrapRef = useRef(null);
  const [countries, setCountries] = useState(null);
  const [tooltip, setTooltip] = useState(null); // { x, y, name, count }
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(WORLD_ATLAS_URL)
      .then((res) => res.json())
      .then((world) => {
        if (cancelled) return;
        const geo = feature(world, world.objects.countries);
        setCountries(geo.features);
      })
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return null; // fail quietly rather than break the page
  if (!countries) {
    return (
      <div
        style={{
          width: "100%",
          aspectRatio: "900 / 480",
          background: COLOR_EMPTY,
          borderRadius: 12,
        }}
        aria-hidden="true"
      />
    );
  }

  const projection = d3
    .geoNaturalEarth1()
    .scale(150)
    .translate([450, 240]);
  const path = d3.geoPath(projection);

  const handleEnter = (event, feat) => {
    const rawName = feat.properties.name;
    const name = displayName(rawName);
    const pct = COUNTRY_PERCENTAGES[name];
    if (!pct) {
      setTooltip(null);
      return;
    }
    const count = Math.round((TOTAL_REACHED * pct) / 100);
    const rect = wrapRef.current ? wrapRef.current.getBoundingClientRect() : { left: 0, top: 0 };
    setTooltip({
      x: event.clientX - rect.left + 12,
      y: event.clientY - rect.top + 12,
      name,
      count,
    });
  };

  const handleLeave = () => setTooltip(null);

  return (
    <div
      ref={wrapRef}
      style={{ width: "100%", position: "relative" }}
      role="img"
      aria-label="World map showing countries AutoimmuneVoices has reached, with the United States highest at over 11,000 people"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 900 480"
        width="100%"
        style={{ display: "block" }}
      >
        {countries.map((feat, i) => {
          const name = displayName(feat.properties.name);
          const reached = !!COUNTRY_PERCENTAGES[name];
          const isHovered = tooltip && tooltip.name === name;
          return (
            <path
              key={i}
              d={path(feat)}
              fill={
                isHovered
                  ? COLOR_REACHED_HOVER
                  : reached
                  ? COLOR_REACHED
                  : COLOR_EMPTY
              }
              stroke={COLOR_STROKE}
              strokeWidth={0.6}
              style={{
                cursor: reached ? "pointer" : "default",
                transition: "fill 0.15s ease",
              }}
              onMouseEnter={(e) => handleEnter(e, feat)}
              onMouseLeave={handleLeave}
            />
          );
        })}
      </svg>

      {tooltip && (
        <div
          style={{
            position: "absolute",
            left: tooltip.x,
            top: tooltip.y,
            pointerEvents: "none",
            background: COLOR_TOOLTIP_BG,
            borderRadius: 6,
            padding: "8px 14px",
            fontSize: 13,
            boxShadow: "0 4px 12px rgba(26,39,68,0.25)",
            zIndex: 10,
          }}
        >
          <div style={{ fontWeight: 500, color: "#ffffff", marginBottom: 1 }}>
            {tooltip.name}
          </div>
          <div style={{ color: "#c9a55c", fontWeight: 500 }}>
            {tooltip.count.toLocaleString()} people reached
          </div>
        </div>
      )}
    </div>
  );
}
