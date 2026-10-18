"use client";
/**
 * "In his words" on an author's page (the owner, 2026-10-18): the opening of the author's best-known work, read live from
 * its source file with the translation beside it, and where it comes from. Nothing is chosen or rewritten by hand.
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import { describe } from "@/lib/catalog";
import { loadOpening, type Opening } from "@/lib/passage";
import { ArtWindow } from "@/components/art/PageArt";
import styles from "./AuthorProfile.module.css";

export default function InTheirWords({ work, title, heading }: { work: string; title: string; heading: string }) {
  const [o, setO] = useState<{ work: string; o: Opening | null } | null>(null);
  useEffect(() => {
    let live = true;
    loadOpening(work).then((x) => live && setO({ work, o: x }), () => live && setO({ work, o: null }));
    return () => { live = false; };
  }, [work]);
  const got = o?.work === work ? o.o : undefined;
  if (got === null) return null;   // the text could not be read (offline): the page goes on without it
  return (
    <section aria-labelledby="words-h">
      <h2 id="words-h" className={styles.wordsH}>{heading}</h2>
      <ArtWindow className={styles.words} tall>
        {!got ? <p className="muted">Unrolling the opening of {title}…</p> : (
          <>
            <p className="label art-label">The opening of {title}</p>
            <p lang="grc">{got.greek}{got.cut ? " …" : ""}</p>
            {got.english && <p className={styles.wordsEn}>“{got.english}{got.cut ? " …" : ""}”</p>}
            <small>
              {title} {got.ref} · Greek: {describe(got.grc)}{got.tr ? <> · English: {describe(got.tr)}</> : null} ·{" "}
              <Link href={`/read?w=${work}`} transitionTypes={["page-turn"]}>Read on</Link>
            </small>
          </>
        )}
      </ArtWindow>
    </section>
  );
}
