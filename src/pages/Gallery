// src/pages/Gallery.jsx
//
// Photo gallery, reached via the Events dropdown in the nav (not a
// standalone top-level nav item).
//
// To add a photo: upload the image file to public/gallery-photos/ on
// GitHub, then add one line to GALLERY_PHOTOS below with the filename and
// a caption. No upload form/backend — same manual pattern already used for
// partner logos and chapter directory photos.

import React, { useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import { ArrowLeft, X } from "lucide-react";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');`;

// Add new entries here. `src` should point at a file you've uploaded to
// public/gallery-photos/. `caption` is optional — leave it "" if you don't
// want text under the photo.
const GALLERY_PHOTOS = [
  // { src: "/gallery-photos/hill-day-2026.jpg", caption: "AV advocates on Capitol Hill, June 2026" },
];

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState(null);

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
          Moments from AV chapters, events, and advocacy days.
        </p>
      </section>

      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 80px" }}>
        {GALLERY_PHOTOS.length === 0 ? (
          <p style={{ color: "#8A8880", textAlign: "center" }}>No photos yet — check back soon.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {GALLERY_PHOTOS.map((photo, i) => (
              <button
                key={photo.src}
                onClick={() => setLightboxIndex(i)}
                style={{
                  border: "1px solid #E4E0D6",
                  borderRadius: 10,
                  overflow: "hidden",
                  padding: 0,
                  cursor: "pointer",
                  background: "#FFFFFF",
                  textAlign: "left",
                }}
              >
                <img
                  src={photo.src}
                  alt={photo.caption || "AutoimmuneVoices gallery photo"}
                  style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
                />
                {photo.caption && (
                  <p style={{ fontSize: 12.5, color: "#5A5952", padding: "8px 10px", margin: 0 }}>{photo.caption}</p>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      {lightboxIndex !== null && GALLERY_PHOTOS[lightboxIndex] && (
        <div
          onClick={() => setLightboxIndex(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(27, 42, 74, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 24,
          }}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "none",
              border: "none",
              color: "#FAF8F3",
              cursor: "pointer",
            }}
          >
            <X size={28} />
          </button>
          <img
            src={GALLERY_PHOTOS[lightboxIndex].src}
            alt={GALLERY_PHOTOS[lightboxIndex].caption || "AutoimmuneVoices gallery photo"}
            style={{ maxWidth: "90vw", maxHeight: "85vh", borderRadius: 8 }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
