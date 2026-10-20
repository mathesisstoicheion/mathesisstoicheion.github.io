"use client";
/**
 * Where to begin (review fix list, slice 6: "the best guidance is buried"): the site's suggestions by how hard the Greek is,
 * and the reading paths, right under the library's name. Open for a first visit; after that it stays as the reader left
 * it. While a search is on it stands aside, with the famous books, so the answers come up under the search.
 */
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { useLibQuery } from "./libQuery";
import A from "@/components/a/a.module.css";
import styles from "./Library.module.css";

/**
 * The site's own guidance, following the brief; the reasons are the ones teachers usually give. Difficulty is about the
 * Greek, not the ideas.
 */
const START = [
  { level: "Gentle", why: "Short sentences and everyday words.", works: [["tlg0031.tlg004", "The Gospel of John"], ["tlg0096.tlg002", "Aesop's fables"]] },
  { level: "Steady", why: "Clear Classical Attic prose, the usual first authors after a textbook.", works: [["tlg0032.tlg006", "Xenophon, Anabasis"], ["tlg0540.tlg001", "Lysias, On the Murder of Eratosthenes"]] },
  { level: "Demanding", why: "Dense, unusual constructions and rare words, hard even for experienced readers.", works: [["tlg0003.tlg001", "Thucydides, History"], ["tlg0033.tlg001", "Pindar, Olympian Odes"]] },
];

export default function BeginHere({ paths }: { paths?: ReactNode }) {
  const aside = useLibQuery((x) => !!x.q.trim());
  const ref = useRef<HTMLDetailsElement>(null);
  // open unless this reader has closed it before
  useEffect(() => { try { if (ref.current && localStorage.getItem("mathesis:lib-begin") === "shut") ref.current.open = false; } catch {} }, [aside]);
  const remember = (open: boolean) => { try { localStorage.setItem("mathesis:lib-begin", open ? "open" : "shut"); } catch {} };
  if (aside) return null;
  return (
    <div className={A.wrap}><div className={A.blk}>
      <details ref={ref} open className={styles.begin} onToggle={(e) => remember((e.currentTarget as HTMLDetailsElement).open)}>
        <summary><span className={styles.beginIcon} aria-hidden="true">✦</span> Not sure where to begin? <span className="muted">Our suggestions, by how hard the Greek is, and six reading paths</span></summary>
        <div className={styles.levels}>
          {START.map((x) => (
            <div key={x.level} className={styles.level}>
              <h3>{x.level}</h3>
              <p className="muted">{x.why}</p>
              <ul>
                {x.works.map(([id, label]) => (
                  <li key={id}><Link href={`/read?w=${id}`} transitionTypes={["page-turn"]}>{label} <span aria-hidden="true">→</span></Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* the reading paths (data/paths.ts), short routes through the library in a sensible order */}
        {paths && <><h3 className={`label ${styles.pathsH}`}>Where to read next: six paths, each in a sensible order</h3>{paths}</>}
      </details>
    </div></div>
  );
}
