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
  useEffect(() => {
    (async () => {
      try {
        const existing = await window.storage.get("people-impacted", true);
        const current = existing ? parseInt(existing.value, 10) || 0 : 0;
        await window.storage.set("people-impacted", String(current + 1), true);
      } catch {
        // storage unavailable; this visit just won't be counted
      }
    })();
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
