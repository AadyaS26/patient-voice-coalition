// src/pages/Gallery.jsx
//
// Gallery organized by chapter, with multiple Instagram posts embeddable
// under each chapter name. Reached via the Events dropdown in the nav
// (not a standalone top-level nav item).
//
// Each post uses Instagram's official public embed widget (embed.js) —
// the same sanctioned mechanism sites use to embed a tweet or YouTube
// video. It pulls the post live from Instagram's own servers, so nothing
// is copied or hosted here.
//
// Instagram's public embed widget only works for individual POST
// permalinks (instagram.com/p/POST_ID/), not whole profile feeds —
// embedding a live feed requires Meta's Graph API with a registered
// business app and access token, which is a much bigger integration. So:
// add specific post links to `postUrls` for a chapter to feature them;
// a chapter with an empty `postUrls` array falls back to a "Follow on
// Instagram" card linking to the profile instead.

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import { ArrowLeft, Instagram } from "lucide-react";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');`;

// Add new chapters or new posts here. `postUrls` can hold as many
// instagram.com/p/... links as you want to feature for that chapter —
// they'll all render, side by side, under the chapter's name.
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

// Loads Instagram's official embed script once, then asks it to scan the
// page for any <blockquote class="instagram-media"> and render them. Runs
// again on every mount so posts render correctly on client-side navigation
// too (React Router doesn't reload the page, so a fresh <script> tag alone
// wouldn't retrigger Instagram's processing). Also reruns whenever the set
// of posts on the page changes, since new blockquotes need processing too.
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

function InstagramEmbed({ url }) {
  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{ background: "#FFF", border: 0, borderRadius: 10, margin: 0, maxWidth: 400, width: "100%" }}
    />
  );
}

function FollowCard({ handle, profileUrl }) {
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
        maxWidth: 400,
        width: "100%",
        margin: "0 auto",
        aspectRatio: "4 / 5",
        background: "#FFFFFF",
        border: "1px solid #E4E0D6",
        borderRadius: 10,
        textDecoration: "none",
        padding: 24,
        textAlign: "center",
      }}
    >
      <Instagram size={30} color="#A87C2A" />
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14.5, fontWeight: 600, color: "#1B2A4A" }}>
        {handle}
      </span>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#8A8880" }}>
        Follow on Instagram
      </span>
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

      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
        {CHAPTER_INSTAGRAM.map((c) => (
          <div key={c.handle} style={{ marginBottom: 56 }}>
            <h2
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: 22,
                fontWeight: 500,
                color: "#1B2A4A",
                textAlign: "center",
                marginBottom: 4,
              }}
            >
              {c.chapter}
            </h2>
            <p style={{ fontSize: 13, color: "#8A8880", textAlign: "center", marginBottom: 18 }}>
              {c.handle}
            </p>

            {c.postUrls.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: 20,
                }}
              >
                {c.postUrls.map((url) => (
                  <InstagramEmbed key={url} url={url} />
                ))}
              </div>
            ) : (
              <FollowCard handle={c.handle} profileUrl={c.profileUrl} />
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
