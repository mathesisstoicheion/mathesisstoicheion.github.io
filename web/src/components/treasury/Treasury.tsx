"use client";
/**
 * The Treasury (My Library): everything the reader has saved, in one place.
 * The overview is the home page's grid of rooms (the owner, 2026-10-20: "Every page must follow the design choices of the
 * homepage"; the Treasury "seems inconsistent and boring"): nine offerings in fine gold lines, each with a small red
 * window onto an ancient object, its count in tall gold numerals, its name and what it holds; one opens that section.
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
import Win from "@/components/a/Win";
import SettleText from "@/components/a/SettleText";
import a from "@/components/a/a.module.css";
import { PIECE_CREDITS } from "@/data/pieces";

export type SectionId = "recent" | "notes" | "anthology" | "bookmarks" | "highlights" | "xrefs" | "words" | "authors" | "places" | "notebooks";

/** each offering's small window: an ancient object from the Met's open collection (data/pieces.ts), chosen to suit it */
const PIECES: Record<Exclude<SectionId, "recent">, string> = {
  notes: "teacher-and-pupil", anthology: "muse-head", bookmarks: "hand-with-scroll", highlights: "nike-relief", xrefs: "bilingual-plaque",
  words: "decree-fragment", authors: "herodotos-bust", places: "tribute-list", notebooks: "chrysippos-head",
};

export default function Treasury() {
  const params = useSearchParams();
  const router = useRouter();
  const t = useTreasury();
  const { marks, deck, pageNotes } = t;
  const savedPlaces = Object.keys(useSavedPlaces((s) => s.saved)).length;
  const notebooks = Object.keys(useNotebooks((s) => s.books)).length;
  useEffect(() => { loadSavedPlaces(); }, []);
  const section = (params.get("s") ?? "recent") as SectionId;

  const counts = useMemo(() => {
    const k = (kind: string) => marks.filter((m) => m.kind === kind).length;
    return {
      notes: k("note"), anthology: k("favourite"), bookmarks: k("bookmark"), highlights: k("highlight"), xrefs: k("xref"),
      words: Object.values(deck).filter((c) => c.source === "saved").length,
      authors: Object.values(pageNotes).filter((n) => n.kind === "author").length,
    };
  }, [marks, deck, pageNotes]);

  const OFFERINGS: { id: Exclude<SectionId, "recent">; label: string; n: number | null; hint: string }[] = [
    { id: "notes", label: "Notes", n: counts.notes, hint: "on passages" },
    { id: "anthology", label: "Anthology", n: counts.anthology, hint: "favourite passages" },
    { id: "bookmarks", label: "Bookmarks", n: counts.bookmarks, hint: "and where you stopped" },
    { id: "highlights", label: "Highlights", n: counts.highlights, hint: "in four colours" },
    { id: "xrefs", label: "Cross-references", n: counts.xrefs, hint: "between passages" },
    { id: "words", label: "Words", n: counts.words, hint: "saved, with Word Study" },
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
  const empty = t.ready && !marks.length && !Object.keys(deck).length && !Object.keys(pageNotes).length && !savedPlaces && !notebooks;

  return (
    <div className={`wrap ${styles.treasury}`}>
      {/* a Treasury with nothing in it opens with what to do about that, and the nine sections wait, dimmed, without their zeros */}
      {empty && (
        <div className={styles.welcome}>
          <p>Your Treasury is empty so far. Open a text in <Link href="/library" transitionTypes={["page-turn"]}>the Mouseion</Link>, then
            select some Greek words, or click a passage number, to bookmark it, add it to your anthology, highlight it or write a note.
            Click any word to look it up, and press <b>Save word</b> to keep it here.</p>
          <Link className="btn" href={AREAS.library.href} transitionTypes={["page-turn"]}>Open the Mouseion</Link>
        </div>
      )}

      <nav className={styles.offerings} data-bare={empty ? "" : undefined} aria-label="Sections of the Treasury">
        <div className={a["sec-h"]}><SettleText className={a.mono} text="Nine kinds of offering" /><SettleText className={a.mono} text="What you have kept" /></div>
        <ol className={styles.ogrid}>
          {OFFERINGS.map((m, i) => {
            const piece = PIECE_CREDITS[PIECES[m.id]];
            return (
              <li key={m.id} style={{ "--i": i } as React.CSSProperties}>
                <button type="button" className={styles.offer} aria-current={section === m.id ? "page" : undefined} onClick={() => go(m.id)}
                  data-empty={m.n === 0 || m.n === null ? "" : undefined}>
                  <Win className={`${a.win} ${styles.owin}`} src={`/images/a/pieces/${PIECES[m.id]}.png`} label={`${piece.title}, engraved in gold lines`} capClass={a.wcap} decorative />
                  <span className={styles.count}>{m.n === null || empty ? "·" : t.ready ? m.n.toLocaleString("en-GB") : "…"}</span>
                  <span className={styles.offerLabel}>{m.label}</span>
                  <span className={styles.offerHint}>{m.hint}</span>
                </button>
              </li>
            );
          })}
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

      <KeepSafe t={t} compact={empty} summary={`${plural(marks.length, "mark")}, ${plural(Object.keys(pageNotes).length, "note")} on authors, words and the Painted Stoa, ${plural(Object.keys(deck).length, "word")} in your review deck, ${plural(savedPlaces, "saved place")}, ${plural(notebooks, "notebook")}`} />

      {/* the Mine door also keeps what you download for reading offline (Phase 11: Downloads moved here from the footer) */}
      <Link className={styles.offline} href={AREAS.downloads.href} transitionTypes={["page-turn"]}>
        <span className="label">{AREAS.downloads.name} · {AREAS.downloads.english}</span>
        <b>Read without a connection</b>
        <span>Download the Greek and English texts once, then read them on a train, a plane or anywhere without a signal.</span>
      </Link>

      {/* the nine small windows, credited as the door's red window is */}
      <p className={a.cap}>The small windows, from The Metropolitan Museum of Art, New York (open access, CC0): {OFFERINGS.map((m, i) => {
        const c = PIECE_CREDITS[PIECES[m.id]];
        return <span key={m.id}>{i ? "; " : ""}{m.label}, {c.title.charAt(0).toLowerCase() + c.title.slice(1)}, {c.date}</span>;
      })}.</p>
    </div>
  );
}
