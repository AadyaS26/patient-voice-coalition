import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Legislation from "./pages/Legislation.jsx";
import Impact from "./pages/Impact.jsx";
import CreateChapter from './pages/CreateChapter';
import CurrentChapters from './pages/CurrentChapters';
import Events from "./pages/Events.jsx";
import ResourceLibrary from "./pages/ResourceLibrary";
import Brainstorm from "./pages/Brainstorm.jsx";
import BillsSupported from "./pages/BillsSupported.jsx";
import PatientStories from "./pages/PatientStories.jsx";
import Gallery from "./pages/Gallery.jsx";
import AdvocacyTraining from "./pages/AdvocacyTraining.jsx";
import AdvocacyTrainingDetail from "./pages/AdvocacyTrainingDetail.jsx";
import ChatWidget from "./components/ChatWidget.jsx";

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
        <Route path="/resource-library" element={<ResourceLibrary />} />
        <Route path="/legislation" element={<Legislation />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/events" element={<Events />} />
        <Route path="/brainstorm" element={<Brainstorm />} />
        <Route path="/create-chapter" element={<CreateChapter />} />
        <Route path="/current-chapters" element={<CurrentChapters />} />
        {/* Not in the top nav on purpose — reached via a link inside the
            Legislation page, so the nav bar doesn't get more crowded. */}
        <Route path="/bills-supported" element={<BillsSupported />} />
        {/* Also not in the top nav — reached via the "View Patient Stories"
            button in the Patient Stories section on the Impact page. */}
        <Route path="/patient-stories" element={<PatientStories />} />
        {/* Reached via the Events dropdown in the nav, not a standalone
            top-level nav item. */}
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/advocacy-training" element={<AdvocacyTraining />} />
        <Route path="/advocacy-training/:id" element={<AdvocacyTrainingDetail />} />
      </Routes>
      {/* Outside <Routes> on purpose — renders on every page instead of
          resetting when someone navigates between routes. */}
      <ChatWidget />
    </BrowserRouter>
  );
}
