"use client";
/**
 * The Treasury: everything the reader has saved, in one place.
 * The overview is set as a book sets its contents, like the home page's (redesign SPEC.md 4.4: every page keeps what it
 * does, in the printed page's look): the nine kinds of thing kept, each with its Greek numeral, its name and what it
 * holds, a dotted leader and its count in red where a contents page has its page numbers. One opens that part below.
 */
import Link from "next/link";
import { AREAS } from "@/config/areas";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
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

/** the Greek numerals a contents page counts its parts with: 1 to 9 */
const NUM = ["α´", "β´", "γ´", "δ´", "ε´", "ϛ´", "ζ´", "η´", "θ´"];

export default function Treasury() {
  const params = useSearchParams();
  const router = useRouter();
  const t = useTreasury();
  const { marks, pageNotes } = t;
  const savedPlaces = Object.keys(useSavedPlaces((s) => s.saved)).length;
  const notebooks = Object.keys(useNotebooks((s) => s.books)).length;
  useEffect(() => { loadSavedPlaces(); }, []);
  const section = (params.get("s") ?? "recent") as SectionId;

  const counts = useMemo(() => {
    const k = (kind: string) => marks.filter((m) => m.kind === kind).length;
    return {
      notes: k("note"), anthology: k("favourite"), bookmarks: k("bookmark"), highlights: k("highlight"), xrefs: k("xref"),
      words: Object.values(pageNotes).filter((n) => n.kind === "word").length,
      authors: Object.values(pageNotes).filter((n) => n.kind === "author").length,
    };
  }, [marks, pageNotes]);

  const OFFERINGS: { id: Exclude<SectionId, "recent">; label: string; n: number | null; hint: string }[] = [
    { id: "notes", label: "Notes", n: counts.notes, hint: "on passages" },
    { id: "anthology", label: "Anthology", n: counts.anthology, hint: "favourite passages" },
    { id: "bookmarks", label: "Bookmarks", n: counts.bookmarks, hint: "and where you stopped" },
    { id: "highlights", label: "Highlights", n: counts.highlights, hint: "in four colours" },
    { id: "xrefs", label: "Cross-references", n: counts.xrefs, hint: "between passages" },
    { id: "words", label: "Words", n: counts.words, hint: "your notes, with Word Study" },
    { id: "authors", label: "Authors", n: counts.authors, hint: "your notes on them" },
    { id: "places", label: "Places", n: savedPlaces, hint: "on your own map" },
    { id: "notebooks", label: "Notebooks", n: notebooks, hint: "for research, cited" },
  ];
  const go = (id: SectionId) => {
    const q = new URLSearchParams(params.toString());
    if (id === "recent" || id === section) q.delete("s"); else q.set("s", id);
    for (const k of ["tag", "c", "a", "nb"]) q.delete(k);
    router.replace(`/treasury${q.size ? `?${q}` : ""}`, { scroll: false });
  };
  const empty = t.ready && !marks.length && !Object.keys(pageNotes).length && !savedPlaces && !notebooks;

  return (
    <div className={styles.treasury}>
      {/* a Treasury with nothing in it opens with what to do about that, and the nine sections wait, dimmed, without their zeros */}
      {empty && (
        <div className={styles.welcome}>
          <p>Your Treasury is empty so far. Open a text in <Link href="/library" transitionTypes={["page-turn"]}>the Mouseion</Link>, then
            select some Greek words, or click a passage number, to bookmark it, add it to your anthology, highlight it or write a note.
            Click any word to look it up.</p>
          <Link className="btn" href={AREAS.library.href} transitionTypes={["page-turn"]}>Open the Mouseion</Link>
        </div>
      )}

      <nav className={styles.offerings} data-bare={empty ? "" : undefined} aria-label="Sections of the Treasury">
        <div className="sh rv"><h2>What you have kept</h2><span className="fill" /><span className="src">in nine kinds</span></div>
        <ol className={`${styles.ogrid} rv`}>
          {OFFERINGS.map((m, i) => (
            <li key={m.id}>
              <button type="button" className={styles.offer} aria-current={section === m.id ? "page" : undefined} onClick={() => go(m.id)}
                data-empty={m.n === 0 || m.n === null ? "" : undefined}>
                <span className={styles.gn} aria-hidden="true">{NUM[i]}</span>
                <span className={styles.offerLabel}>{m.label} <i className={styles.offerHint}>{m.hint}</i></span>
                <span className={styles.lead} aria-hidden="true" />
                <span className={styles.count}>{m.n === null || empty ? "·" : t.ready ? m.n.toLocaleString("en-GB") : "…"}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

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
