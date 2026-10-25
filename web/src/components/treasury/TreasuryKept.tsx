"use client";
/**
 * What you have kept: the Treasury's nine kinds, set as a book sets its contents (each with its Greek numeral, its name and
 * what it holds, a dotted leader and its count in red where a contents page has its page numbers). It stands at the right
 * of the page's title, where a photograph stood (the owner, 2026-10-25: "'what you have kept' in the treasury should
 * replace the random photo that loads on the top right of the page"). Choosing a kind opens it below (Treasury.tsx), by
 * the address's ?s=.
 *
 * It reads the same stores as the rest of the Treasury (lib/annotations, lib/map, lib/notebooks), which Treasury.tsx loads.
 */
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useMarks, usePageNotes } from "@/lib/annotations";
import { useSavedPlaces } from "@/lib/map";
import { useNotebooks } from "@/lib/notebooks";
import type { SectionId } from "./Treasury";
import styles from "./Treasury.module.css";

/** the Greek numerals a contents page counts its parts with: 1 to 9 */
const NUM = ["α´", "β´", "γ´", "δ´", "ε´", "ϛ´", "ζ´", "η´", "θ´"];

export default function TreasuryKept() {
  const params = useSearchParams();
  const router = useRouter();
  const section = (params.get("s") ?? "recent") as SectionId;
  const go = (id: SectionId) => {
    const q = new URLSearchParams(params.toString());
    if (id === "recent" || id === section) q.delete("s"); else q.set("s", id);
    for (const k of ["tag", "c", "a", "nb"]) q.delete(k);
    router.replace(`/treasury${q.size ? `?${q}` : ""}`, { scroll: false });
  };
  return <Kept section={section} go={go} />;
}

/**
 * The list itself. The page as it is built has no address to read, so it shows the list with no kind chosen (`go` absent)
 * until the browser has the address: the head is its full height from the first paint (scripts/check-heads.mjs).
 */
export function Kept({ section = "recent", go }: { section?: SectionId; go?: (id: SectionId) => void }) {
  const byWork = useMarks((s) => s.byWork);
  const pageNotes = usePageNotes((s) => s.notes);
  const marksLoaded = useMarks((s) => s.allLoaded), notesLoaded = usePageNotes((s) => s.loaded);
  const ready = marksLoaded && notesLoaded;
  const savedPlaces = Object.keys(useSavedPlaces((s) => s.saved)).length;
  const notebooks = Object.keys(useNotebooks((s) => s.books)).length;
  const marks = useMemo(() => Object.values(byWork).flat(), [byWork]);

  const counts = useMemo(() => {
    const k = (kind: string) => marks.filter((m) => m.kind === kind).length;
    return {
      notes: k("note"), anthology: k("favourite"), bookmarks: k("bookmark"), highlights: k("highlight"), xrefs: k("xref"),
      words: Object.values(pageNotes).filter((n) => n.kind === "word").length,
      authors: Object.values(pageNotes).filter((n) => n.kind === "author").length,
    };
  }, [marks, pageNotes]);
  const empty = ready && !marks.length && !Object.keys(pageNotes).length && !savedPlaces && !notebooks;

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
  return (
    <nav className={`${styles.offerings} ${styles.kept}`} data-bare={empty ? "" : undefined} aria-label="Sections of the Treasury">
      <h2 className={`label ${styles.keptH}`}>What you have kept</h2>
      <ol className={styles.ogrid}>
        {OFFERINGS.map((m, i) => (
          <li key={m.id}>
            <button type="button" className={styles.offer} aria-current={section === m.id ? "page" : undefined} onClick={() => go?.(m.id)}
              data-empty={m.n === 0 || m.n === null ? "" : undefined}>
              <span className={styles.gn} aria-hidden="true">{NUM[i]}</span>
              <span className={styles.offerLabel}>{m.label} <i className={styles.offerHint}>{m.hint}</i></span>
              <span className={styles.lead} aria-hidden="true" />
              <span className={styles.count}>{m.n === null || empty ? "·" : ready ? m.n.toLocaleString("en-GB") : "…"}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
