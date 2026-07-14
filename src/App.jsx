import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Legislation from "./pages/Legislation.jsx";
import Impact from "./pages/Impact.jsx";
import Events from "./pages/Events.jsx";
import Brainstorm from "./pages/Brainstorm.jsx";

export default function App() {
  // Counts one real visit per actual page load/refresh — this runs exactly
  // once when the whole app mounts, NOT every time someone navigates between
  // pages inside the site (that would over-count, since React Router doesn't
  // reload the page when you click between Home/Legislation/Impact/etc).
  //
  // Uses the real shared /api/counter endpoint (backed by Redis) instead of
  // localStorage, so this counts across every visitor and every device, not
  // just the person currently looking at their own browser.
  useEffect(() => {
    // Only count once per browser session — sessionStorage persists across
    // refreshes and page navigation within this tab, but clears when the tab
    // or browser closes, so a new session (new tab, new day, etc.) still
    // counts as a fresh visit.
    if (sessionStorage.getItem("pvc-counted")) return;
    sessionStorage.setItem("pvc-counted", "1");

    fetch("/api/counter?key=people-impacted&action=increment").catch(() => {
      // storage unavailable; this visit just won't be counted
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/legislation" element={<Legislation />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/events" element={<Events />} />
        <Route path="/brainstorm" element={<Brainstorm />} />
      </Routes>
    </BrowserRouter>
  );
}
