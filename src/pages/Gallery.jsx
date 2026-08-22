// src/pages/Gallery.jsx
//
// Reached via the Events dropdown in the nav (not a standalone top-level
// nav item). Grouped by chapter — a centered chapter name/handle, then a
// small grid of that chapter's own posts underneath.
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
// API without a full Meta Graph API app + access token setup. A chapter
// with no post links yet falls back to a single "Follow on Instagram" tile
// instead.

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import { ArrowLeft, Instagram } from "lucide-react";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');

.av-gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 320px);
  gap: 20px;
  justify-content: center;
}
@media (max-width: 1050px) {
  .av-gallery-grid { grid-template-columns: repeat(2, 320px); }
}
@media (max-width: 700px) {
  .av-gallery-grid { grid-template-columns: 1fr; justify-items: center; }
}
`;

// Add new chapters or new posts here. Every entry in `postUrls` becomes
// its own tile in that chapter's grid.
const CHAPTER_INSTAGRAM = [
  {
    chapter: "Detroit, Michigan",
    handle: "@autoimmunevoices313",
    profileUrl: "https://www.instagram.com/autoimmunevoices313/",
    postUrls: [
      "https://www.instagram.com/p/DcJgC1tFLPO/",
      "https://www.instagram.com/p/DcO7uUxBgQ-/",
      "https://www.instagram.com/p/DcGgzhPjnBd/",
      "https://www.instagram.com/p/DcUQ2KwBNys/",
      "https://www.instagram.com/p/DcOtUbVBztE/",
    ],
  },
  {
    chapter: "Orland Park, Illinois",
    handle: "@crohnsandcolitisunited",
    profileUrl: "https://www.instagram.com/crohnsandcolitisunited/",
    postUrls: [
      "https://www.instagram.com/p/DcFWC9ksCRX/",
      "https://www.instagram.com/p/DUgIDQmjb2K/",
      "https://www.instagram.com/p/DQ9sKIdDXCr/",
      "https://www.instagram.com/p/DP6WTTyDT4e/",
      "https://www.instagram.com/p/DM73V2usE7c/",
      "https://www.instagram.com/p/DMf6Iazspub/",
    ],
  },
  {
    chapter: "Miami, Florida",
    handle: "@autoimmunevoices_miamifl",
    profileUrl: "https://www.instagram.com/autoimmunevoices_miamifl/",
    postUrls: ["https://www.instagram.com/p/DcG3sAhxnDS/"],
  },
  {
    chapter: "South Texas",
    handle: "@autoimmunevoicessouthtexas",
    profileUrl: "https://www.instagram.com/autoimmunevoicessouthtexas/",
    postUrls: [
      "https://www.instagram.com/p/DcJlJ-XEQNZ/",
      "https://www.instagram.com/p/DcJIWp9EcA6/",
    ],
  },
  {
    chapter: "Prague, Czech Republic",
    handle: "@autoimmunevoices_cz",
    profileUrl: "https://www.instagram.com/autoimmunevoices_cz/",
    postUrls: [
      "https://www.instagram.com/p/DcHAw-eNe99/",
      "https://www.instagram.com/p/DcO2cQONbRr/",
    ],
  },
  {
    chapter: "Virginia Beach, Virginia",
    handle: "@autoimmunevoices_vabeach",
    profileUrl: "https://www.instagram.com/autoimmunevoices_vabeach/",
    postUrls: ["https://www.instagram.com/p/DcOz8CRJpw2/"],
  },
  {
    chapter: "Ireland",
    handle: "@autoimmunevoicesie",
    profileUrl: "https://www.instagram.com/autoimmunevoicesie/",
    postUrls: ["https://www.instagram.com/p/DcFBA8-PmVA/"],
  },
  {
    chapter: "Pakistan",
    handle: "@autoimmunevoices.pk",
    profileUrl: "https://www.instagram.com/autoimmunevoices.pk/",
    postUrls: [
      "https://www.instagram.com/p/DcEtxcyq3oS/",
      "https://www.instagram.com/p/DcEt_n5KiCu/",
      "https://www.instagram.com/p/DcEuP3PqsWO/",
    ],
  },
];

// Loads Instagram's official embed script once, then asks it to scan the
// page for any <blockquote class="instagram-media"> and render them. Runs
// again whenever the total post count changes, since React Router doesn't
// reload the page on client-side navigation, so a stale script tag alone
// wouldn't retrigger processing for newly-added posts.
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

function PostTile({ url }) {
  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{ background: "#FFF", border: 0, borderRadius: 10, margin: 0, width: "100%", minWidth: "unset" }}
    />
  );
}

function FollowTile({ handle, profileUrl }) {
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
        gap: 10,
        maxWidth: 340,
        width: "100%",
        margin: "0 auto",
        minHeight: 260,
        background: "#FFFFFF",
        border: "1px solid #E4E0D6",
        borderRadius: 10,
        textDecoration: "none",
        padding: 24,
        textAlign: "center",
      }}
    >
      <Instagram size={28} color="#A87C2A" />
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14.5, fontWeight: 600, color: "#1B2A4A" }}>{handle}</span>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#8A8880" }}>Follow on Instagram</span>
    </a>
  );
}

export default function Gallery() {
  const totalPosts = CHAPTER_INSTAGRAM.reduce((sum, c) => sum + c.postUrls.length, 0);
  useInstagramEmbeds(totalPosts);

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

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px" }}>
        {CHAPTER_INSTAGRAM.map((c) => (
          <div key={c.handle} style={{ marginBottom: 64 }}>
            <h2
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: 24,
                fontWeight: 500,
                color: "#1B2A4A",
                textAlign: "center",
                marginBottom: 4,
              }}
            >
              {c.chapter}
            </h2>
            <p style={{ fontSize: 13, color: "#8A8880", textAlign: "center", marginBottom: 20 }}>{c.handle}</p>

            {c.postUrls.length > 0 ? (
              <div className="av-gallery-grid">
                {c.postUrls.map((url) => (
                  <PostTile key={url} url={url} />
                ))}
              </div>
            ) : (
              <FollowTile handle={c.handle} profileUrl={c.profileUrl} />
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
