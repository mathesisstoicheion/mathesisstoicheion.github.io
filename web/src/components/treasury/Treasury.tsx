"use client";
/**
 * The Treasury: everything the reader has saved, in one place.
 * The overview is set as a book sets its contents, like the home page's (redesign SPEC.md 4.4: every page keeps what it
 * does, in the printed page's look): the nine kinds of thing kept, each with its Greek numeral, its name and what it
 * holds, a dotted leader and its count in red where a contents page has its page numbers (TreasuryKept.tsx, at the right of
 * the page's title, where a photograph stood until the owner's 2026-10-25 "No need for photos in the treasury"). One opens
 * that part here, below.
 */
import Link from "next/link";
import { AREAS } from "@/config/areas";
import Icon from "@/components/Icon";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useTreasury, plural } from "./data";
import { NotesSection, BookmarksSection, HighlightsSection, XrefsSection, RecentSection } from "./MarkSections";
import AnthologySection from "./AnthologySection";
import WordsSection from "./WordsSection";
import AuthorsSection from "./AuthorsSection";
import KeepSafe from "./KeepSafe";
import styles from "./Treasury.module.css";
import PlacesSection from "./PlacesSection";
import { loadSavedPlaces, useSavedPlaces } from "@/lib/map";
import NotebooksSection from "./NotebooksSection";
import PrivateShelf from "./PrivateShelf";
import { useNotebooks } from "@/lib/notebooks";

export type SectionId = "recent" | "notes" | "anthology" | "bookmarks" | "highlights" | "xrefs" | "words" | "authors" | "places" | "notebooks";

export default function Treasury() {
  const params = useSearchParams();
  const t = useTreasury();
  const { marks, pageNotes } = t;
  const savedPlaces = Object.keys(useSavedPlaces((s) => s.saved)).length;
  const notebooks = Object.keys(useNotebooks((s) => s.books)).length;
  useEffect(() => { loadSavedPlaces(); }, []);
  const section = (params.get("s") ?? "recent") as SectionId;

  const empty = t.ready && !marks.length && !Object.keys(pageNotes).length && !savedPlaces && !notebooks;

  return (
    <div className={styles.treasury}>
      {/* a Treasury with nothing in it opens with what to do about that, and the nine sections wait, dimmed, without their zeros */}
      {empty && (
        <div className={styles.welcome}>
          <p>Your Treasury is empty so far. Open a text in the Mouseion, then select some Greek words, or click a passage number, to bookmark it, add it to your anthology, highlight it or write a note.
            Click any word to look it up.</p>
          <Link className="btn" href={AREAS.library.href} transitionTypes={["page-turn"]}><Icon name="library" />Open the Mouseion</Link>
        </div>
      )}

      {/* the moderator's private translations: shown to the moderator alone */}
      <PrivateShelf />

      {t.error && <p className={styles.error} role="alert">{t.error}</p>}
      <section className={styles.section} key={section} aria-live="polite">
        {section === "recent" && <RecentSection t={t} />}
        {section === "notes" && <NotesSection t={t} />}
        {section === "anthology" && <AnthologySection t={t} />}
        {section === "bookmarks" && <BookmarksSection t={t} />}
        {section === "highlights" && <HighlightsSection t={t} />}
        {section === "xrefs" && <XrefsSection t={t} />}
        {section === "words" && <WordsSection t={t} />}
        {section === "authors" && <AuthorsSection t={t} />}
        {section === "places" && <PlacesSection />}
        {section === "notebooks" && <NotebooksSection />}
      </section>

      <KeepSafe t={t} compact={empty} summary={`${plural(marks.length, "mark")}, ${plural(Object.keys(pageNotes).length, "note")} on authors, words and the Painted Stoa, ${plural(savedPlaces, "saved place")}, ${plural(notebooks, "notebook")}`} />

      {/* the Mine door also keeps what you download for reading offline (Phase 11: Downloads moved here from the footer) */}
      <Link className={styles.offline} href={AREAS.downloads.href} transitionTypes={["page-turn"]}>
        <span className="label">{AREAS.downloads.name} · {AREAS.downloads.english}</span>
        <b>Read without a connection</b>
        <span>Download the Greek and English texts once, then read them on a train, a plane or anywhere without a signal.</span>
      </Link>
    </div>
  );
}
