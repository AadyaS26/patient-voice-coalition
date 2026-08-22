// src/pages/CurrentChapters.jsx
//
// Deliberately thin. This page used to keep its own copy of the chapter
// list, which drifted out of sync with src/pages/CreateChapter.jsx every
// time a chapter's bio/photo got added there — that's why Shari, Melanie,
// and Dyllan's updates weren't showing up here even though the code for
// them was correct. Importing the component instead of duplicating the
// data means there is now exactly one place chapter info lives, and both
// pages always show the same thing.

import Nav from "../components/Nav";
import { ChapterDirectory } from "./CreateChapter";

export default function CurrentChapters() {
  return (
    <>
      <Nav />
      <ChapterDirectory />
    </>
  );
}
