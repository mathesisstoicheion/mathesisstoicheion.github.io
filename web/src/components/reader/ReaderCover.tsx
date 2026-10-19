"use client";
/**
 * The reader's cover, as design A drew it: the book opens in lamplight, with dust drifting in a shaft of light and the
 * great letters of its title far back in the dark (lib/a/lamplight.js, Cover); for a book that has a picture
 * (data/medallions.ts), its emblem gathers out of letters above the title (Socrates is spelled out of the Apology itself).
 * Then the author, in Greek and English, the Greek title, the English one, the collection's own (Latin) title where it has
 * one, and the editions. Scroll into the text and the
 * room goes still, so you can read. On the Daylight page there is no lamp and no dust.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cover, emblem } from "@/lib/a/lamplight";
import { medallionOf } from "@/data/medallions";
import { loadAuthorNames } from "@/lib/authors-meta";
import styles from "./Reader.module.css";

/** what the cover's caption says of Socrates' emblem (design A's own words) */
const SOCRATES = "Socrates, Roman marble portrait, Louvre. Public domain. Spelled out of the Apology as Greek was written in Plato’s time: in capitals, with no spaces or accents.";

export default function ReaderCover({ workId, title, greek, author, authorId, day, orig, editions }: {
  workId: string; title: string; greek?: string | null; author?: string; authorId?: string; day: boolean; orig?: ReactNode; editions: ReactNode;
}) {
  const host = useRef<HTMLElement>(null), atm = useRef<HTMLCanvasElement>(null), em = useRef<HTMLCanvasElement>(null);
  const med = medallionOf(workId);
  const isSoc = med?.pic === "socrates-louvre";
  const [authorGr, setAuthorGr] = useState<string | null>(null);
  useEffect(() => { if (authorId) loadAuthorNames().then((n) => setAuthorGr(n[authorId]?.grc ?? null)); }, [authorId]);
  // a Greek title the cover can set large: one written in Greek letters
  const big = greek && /[Ͱ-Ͽἀ-῿]/.test(greek) ? greek : null;

  // the lamp and the dust (they fade as the cover scrolls away, and stop once it has gone)
  const dayRef = useRef(day);
  useEffect(() => { dayRef.current = day; }, [day]);
  useEffect(() => {
    const h = host.current, cv = atm.current;
    if (!h || !cv) return;
    const c = cover(cv, h, big ?? title, () => dayRef.current);
    return () => c.stop();
  }, [big, title]);

  // the emblem gathers out of letters, in the page's ink (redrawn when the page turns to Daylight or back)
  const art = useRef<{ stop(): void; redraw(): void } | null>(null);
  useEffect(() => {
    const cv = em.current;
    if (!cv || !med) return;
    let gone = false;
    emblem(cv, `/images/a/em-${med.pic}.png`, { mode: "gather", cols: 50, text: isSoc, width: () => (innerWidth < 640 ? 140 : 200), tokenEl: host.current })
      .then((r) => { if (gone) r?.stop(); else art.current = r; });
    return () => { gone = true; art.current?.stop(); art.current = null; };
  }, [med, isSoc]);
  useEffect(() => { art.current?.redraw(); }, [day]);

  return (
    <header ref={host} className={styles.rcover}>
      <canvas ref={atm} className={styles.atm} aria-hidden="true" />
      <div className={styles.inner}>
        {med && (
          <figure className={styles.emblem}>
            <canvas ref={em} role="img" aria-label={isSoc ? "Socrates, drawn in Greek letters from the Apology" : med.alt} />
            <figcaption className={styles.emCap}>{isSoc ? SOCRATES : med.why}</figcaption>
          </figure>
        )}
        {author && <span className={`label ${styles.kick}`}>{authorGr && <><span lang="grc">{authorGr}</span> · </>}{author}</span>}
        {/* the Greek title, large; the heading also carries the English one for screen readers and search engines, shown under it */}
        <h1 className={styles.coverTitle}>{big ? <span lang="grc">{big}</span> : title}{big && big !== title && <span className="visually-hidden">: {title}</span>}</h1>
        {big && big !== title && <p className={styles.enT} aria-hidden="true">{title}</p>}
        {orig && <p className={styles.origT}>{orig}</p>}
        <div className={styles.eds}>{editions}</div>
      </div>
      <span className={styles.begin} aria-hidden="true">Scroll to begin reading</span>
    </header>
  );
}
