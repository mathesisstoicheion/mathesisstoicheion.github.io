"use client";
/**
 * Where to begin (review fix list, slice 6: "the best guidance is buried"): the site's suggestions by how hard the Greek is,
 * and the reading paths, set as a printed note on how to use a catalogue: three columns under a rule, and the paths below
 * them. It stands above the library's search (the owner, 2026-10-25: "it should be above the search"), open on a first
 * visit; closed once, it stays closed on every later visit until it is opened again ("should remember your choice if you
 * collapse it"). It stays in place while a search is typed, so the search box never moves under the reader's fingers.
 */
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import styles from "./Library.module.css";

/** Where the choice is kept in this browser: "shut" once closed, "open" once opened again. */
export const BEGIN_KEY = "mathesis:lib-begin";

/**
 * Closes the note before the first paint when it was closed before, so a returning reader never sees it open and then
 * shut (and the search below it jump up). Run where the page is first drawn; after a move within the site the effect below
 * does the same.
 */
const SHUT_SCRIPT = `try{if(localStorage.getItem(${JSON.stringify(BEGIN_KEY)})==="shut"){var d=document.getElementById("lib-begin");if(d)d.open=false}}catch(e){}`;

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
  const ref = useRef<HTMLDetailsElement>(null);
  // closed if this reader closed it before (the script has done this already on a first load)
  useEffect(() => { try { if (ref.current && localStorage.getItem(BEGIN_KEY) === "shut") ref.current.open = false; } catch {} }, []);
  // only the reader's own opening and closing is kept: a toggle is remembered only after a click on its summary
  const touched = useRef(false);
  const remember = (open: boolean) => {
    if (!touched.current) return;
    touched.current = false;
    try { localStorage.setItem(BEGIN_KEY, open ? "open" : "shut"); } catch {}
  };
  return (
    <>
      <details id="lib-begin" ref={ref} open className={styles.begin} suppressHydrationWarning onToggle={(e) => remember((e.currentTarget as HTMLDetailsElement).open)}>
        <summary onClick={() => { touched.current = true; }}><span className={styles.beginQ}>Not sure where to begin?</span> <span className={styles.beginSub}>Our suggestions, by how hard the Greek is, and six reading paths</span></summary>
        <div className={styles.levels}>
          {START.map((x) => (
            <div key={x.level} className={styles.level}>
              <h3>{x.level}</h3>
              <p>{x.why}</p>
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
      <script dangerouslySetInnerHTML={{ __html: SHUT_SCRIPT }} />
    </>
  );
}
