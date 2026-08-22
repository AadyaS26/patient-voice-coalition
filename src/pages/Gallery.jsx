// src/pages/Gallery.jsx
//
// Reached via the Events dropdown in the nav (not a standalone top-level
// nav item). A tight multi-column grid of embedded Instagram posts, one
// tile per post, labeled with the chapter it's from.
//
// Each embedded post uses Instagram's official public embed widget
// (embed.js) — the same sanctioned mechanism sites use to embed a tweet or
// YouTube video. It pulls the post live from Instagram's own servers, so
// nothing is copied or hosted here.
//
// This widget only works for individual POST permalinks
// (instagram.com/p/POST_ID/), not whole profile feeds, and it always
// renders the full post card (photo + caption + like button) rather than
// a bare thumbnail — Instagram doesn't offer a public "just the thumbnail"
// API without a full Meta Graph API app + access token setup. Chapters
// with no post links yet fall back to a "Follow on Instagram" tile in the
// same grid instead.

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import { ArrowLeft, Instagram } from "lucide-react";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');`;

// Add new chapters or new posts here. Every entry in `postUrls` becomes
// its own tile in the grid. A chapter with an empty `postUrls` array gets
// one "Follow" tile instead, so it still shows up somewhere in the grid.
const CHAPTER_INSTAGRAM = [
  {
    chapter: "Detroit, Michigan",
    handle: "@autoimmunevoices313",
    profileUrl: "https://www.instagram.com/autoimmunevoices313/",
    postUrls: ["https://www.instagram.com/p/DcO7uUxBgQ-/"],
  },
  {
    chapter: "Orland Park, Illinois",
    handle: "@crohnsandcolitisunited",
    profileUrl: "https://www.instagram.com/crohnsandcolitisunited/",
    postUrls: [],
  },
  {
    chapter: "Miami, Florida",
    handle: "@autoimmunevoices_miamifl",
    profileUrl: "https://www.instagram.com/autoimmunevoices_miamifl/",
    postUrls: [],
  },
  {
    chapter: "South Texas",
    handle: "@autoimmunevoicessouthtexas",
    profileUrl: "https://www.instagram.com/autoimmunevoicessouthtexas/",
    postUrls: [],
  },
  {
    chapter: "Prague, Czech Republic",
    handle: "@autoimmunevoices_cz",
    profileUrl: "https://www.instagram.com/autoimmunevoices_cz/",
    postUrls: [],
  },
  {
    chapter: "Virginia Beach, Virginia",
    handle: "@autoimmunevoices_vabeach",
    profileUrl: "https://www.instagram.com/autoimmunevoices_vabeach/",
    postUrls: [],
  },
  {
    chapter: "Ireland",
    handle: "@autoimmunevoicesie",
    profileUrl: "https://www.instagram.com/autoimmunevoicesie/",
    postUrls: [],
  },
  {
    chapter: "Pakistan",
    handle: "@autoimmunevoices.pk",
    profileUrl: "https://www.instagram.com/autoimmunevoices.pk/",
    postUrls: [],
  },
];

// Flatten into one tile per grid cell: real post tiles first, then one
// "Follow" tile for any chapter that has no post links yet.
function buildTiles() {
  const tiles = [];
  CHAPTER_INSTAGRAM.forEach((c) => {
    if (c.postUrls.length > 0) {
      c.postUrls.forEach((url) => tiles.push({ type: "post", chapter: c.chapter, handle: c.handle, url }));
    } else {
      tiles.push({ type: "follow", chapter: c.chapter, handle: c.handle, profileUrl: c.profileUrl });
    }
  });
  return tiles;
}

// Loads Instagram's official embed script once, then asks it to scan the
// page for any <blockquote class="instagram-media"> and render them. Runs
// again whenever the tile count changes, since React Router doesn't reload
// the page on client-side navigation, so a stale script tag alone wouldn't
// retrigger processing for newly-added posts.
function useInstagramEmbeds(dependency) {
  useEffect(() => {
    function process() {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
        return;
      }
      const existing = document.querySelector('script[src="https://www.instagram.com/embed.js"]');
      if (existing) {
        existing.addEventListener("load", () => window.instgrm?.Embeds.process());
        return;
      }
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = () => window.instgrm?.Embeds.process();
      document.body.appendChild(script);
    }
    process();
  }, [dependency]);
}

function PostTile({ url, chapter }) {
  return (
    <div>
      <p style={{ fontSize: 12, color: "#A87C2A", fontWeight: 600, textAlign: "center", marginBottom: 8 }}>{chapter}</p>
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ background: "#FFF", border: 0, borderRadius: 10, margin: 0, width: "100%", minWidth: "unset" }}
      />
    </div>
  );
}

function FollowTile({ chapter, handle, profileUrl }) {
  return (
    <a
      href={profileUrl}
      target="_blank"
      rel="noreferrer"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        height: "100%",
        minHeight: 260,
        background: "#FFFFFF",
        border: "1px solid #E4E0D6",
        borderRadius: 10,
        textDecoration: "none",
        padding: 24,
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: 12, color: "#A87C2A", fontWeight: 600, margin: 0 }}>{chapter}</p>
      <Instagram size={26} color="#1B2A4A" style={{ marginTop: 8 }} />
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 600, color: "#1B2A4A" }}>{handle}</span>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#8A8880" }}>Follow on Instagram</span>
    </a>
  );
}

export default function Gallery() {
  const tiles = buildTiles();
  useInstagramEmbeds(tiles.length);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: "#2B2A28", background: "#FAF8F3", minHeight: "100%" }}>
      <style>{FONT_IMPORT}</style>
      <Nav />

      <section style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 0", textAlign: "center" }}>
        <Link to="/events" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#8A8880", textDecoration: "none", marginBottom: 20 }}>
          <ArrowLeft size={13} /> Back to Events
        </Link>
        <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 500, fontSize: "clamp(38px, 7vw, 60px)", lineHeight: 1.05, color: "#1B2A4A", letterSpacing: "-0.01em" }}>
          Gallery
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: "#5A5952", maxWidth: 520, margin: "16px auto 0" }}>
          Moments from AV chapters around the world — follow along on Instagram.
        </p>
      </section>

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 24,
            alignItems: "start",
          }}
        >
          {tiles.map((t, i) =>
            t.type === "post" ? (
              <PostTile key={t.url} url={t.url} chapter={t.chapter} />
            ) : (
              <FollowTile key={`${t.handle}-${i}`} chapter={t.chapter} handle={t.handle} profileUrl={t.profileUrl} />
            )
          )}
        </div>
      </section>
    </div>
  );
}
