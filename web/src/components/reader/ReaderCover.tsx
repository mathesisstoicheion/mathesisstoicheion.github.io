"use client";
/**
 * The book's title page, as a printed two-language edition sets it (redesign SPEC.md 4.3; the sample printed-photos.html,
 * its .r-title): the author in spaced capitals in red, the Greek title large, the English title in italic under it, a
 * fleuron between two red rules, and the editions in small print. A book that has its own picture (data/library-plates.ts:
 * the work's, or its author's) opens with it as a plate, its frontispiece, with its credit (decision 6: "each book's
 * picture"). Everything inks in once, then nothing moves.
 */
import { useEffect, useState, type ReactNode } from "react";
import { loadAuthorNames } from "@/lib/authors-meta";
import { AUTHOR_PLATES, WORK_PLATES } from "@/data/library-plates";
import Plate from "@/components/plate/Plate";
import styles from "./Reader.module.css";

/** A Greek name as a title page sets it: capitals, without accents or breathings ("Πλάτων" → "ΠΛΑΤΩΝ"). */
export const titleCaps = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLocaleUpperCase("el").normalize("NFC");

export default function ReaderCover({ workId, title, greek, author, authorId, orig, seal, editions }: {
  workId: string; title: string; greek?: string | null; author?: string; authorId?: string; orig?: ReactNode;
  /** a mark under the title: a private book's "Only you can see this" */
  seal?: ReactNode;
  editions: ReactNode;
}) {
  const [authorGr, setAuthorGr] = useState<string | null>(null);
  useEffect(() => { if (authorId) loadAuthorNames().then((n) => setAuthorGr(n[authorId]?.grc ?? null)); }, [authorId]);
  // a Greek title the page can set large: one written in Greek letters
  const big = greek && /[Ͱ-Ͽἀ-῿]/.test(greek) ? greek : null;
  const pic = WORK_PLATES[workId] ?? (authorId ? AUTHOR_PLATES[authorId] : undefined);

  return (
    <header className={`${styles.tp} enter`}>
      {pic && <Plate id={pic.pic} n={1} why={pic.why} className={styles.tpPlate} sizes="(max-width: 760px) 160px, 220px" priority />}
      {author && (
        <p className={styles.tpAu}>
          {authorGr ? <><span lang="grc" aria-hidden="true">{titleCaps(authorGr)}</span><span className="visually-hidden">{author}</span></> : author}
        </p>
      )}
      {/* the Greek title, large; the heading also carries the English one for screen readers and search engines, shown under it */}
      <h1 className={styles.tpTitle}>{big ? <span lang="grc">{big}</span> : title}{big && big !== title && <span className="visually-hidden">: {title}</span>}</h1>
      {big && big !== title && <p className={styles.tpEn} aria-hidden="true">{title}</p>}
      {orig && <p className={styles.tpOrig}>{orig}</p>}
      {seal && <p className={styles.tpSeal}>{seal}</p>}
      <p className={styles.orn} aria-hidden="true">❦</p>
      <div className={styles.tpEd}>{editions}</div>
    </header>
  );
}
