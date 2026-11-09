"use client";
/**
 * Catchphrases: one signature phrase for each kind of writing, chosen by hand from the most repeated phrases there, with
 * its English and its count worked out live from the Census's own lists. Each opens that kind of writing's phrase list.
 */
import { useEffect, useState } from "react";
import { EMPTY_SCOPE, loadGroup, scopeParams, type CensusMeta } from "@/lib/census";
import { transliterate } from "@/lib/translit";
import { fmt } from "./shared";
import styles from "./Census.module.css";

/** [kind of writing (index of its group f<i>), phrase exactly as the Census lists it, English] */
const PICKS: [number, string, string][] = [
  [0, "ἔπεα πτερόεντα προσηύδα", "spoke winged words"],
  [1, "ἄρχετε βουκολικᾶς Μοῖσαι", "Muses, begin the herdsmen's song"],
  [2, "φέρʼ ἴδω", "come, let me see"],
  [3, "δεξιόν κέρας", "the right wing (of an army)"],
  [4, "ἀληθῆ λέγεις", "you speak the truth"],
  [5, "ὦ ἄνδρες Ἀθηναῖοι", "men of Athens"],
  [6, "Ἰησοῦ Χριστοῦ", "of Jesus Christ"],
  [7, "ὅλον τό σῶμα", "the whole body"],
  [8, "ὅπερ ἔδει δεῖξαι", "which was to be shown"],
  [9, "μεγάλου βασιλέως", "of the Great King"],
  [10, "τάδε λέγει κύριος", "thus says the Lord"],
  [11, "μέρος λόγου", "part of speech"],
];

export default function Catchphrases({ meta, onOpen }: { meta: CensusMeta; onOpen: (changes: [string, string | null][], label: string) => void }) {
  const [counts, setCounts] = useState<(number | null)[] | null>(null);
  useEffect(() => {
    let live = true;
    Promise.all(PICKS.map(async ([f, ph]) => (await loadGroup(`f${f}`).catch(() => null))?.phrase?.find(([p]) => p === ph)?.[1] ?? null))
      .then((c) => { if (live) setCounts(c); });
    return () => { live = false; };
  }, []);
  if (!counts) return null;
  return (
    <section className={styles.catch} aria-labelledby="catch-h">
      <h2 id="catch-h">Catchphrases</h2>
      <p className={styles.blurb}>Every kind of writing has words it cannot stop saying. One for each, from its most repeated phrases.</p>
      <ul>
        {PICKS.map(([f, ph, en], i) => counts[i] !== null && (
          <li key={ph} style={{ "--i": i } as React.CSSProperties}>
            <button type="button" onClick={() => onOpen([["c", "phrase"], ...scopeParams({ ...EMPTY_SCOPE, f }), ["o", null], ["h", null], ["u", null], ["q", null], ["i", ph]], "Catchphrases")}>
              <span className="label">{meta.groups[`f${f}`]?.[0]}</span>
              <b lang="grc">{ph}</b>
              <i>{transliterate(ph)}</i>
              <span className={styles.catchEn}>“{en}”</span>
              <small>{fmt(counts[i]!)} times</small>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
