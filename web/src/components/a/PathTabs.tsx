"use client";
/** Design A's "Where are you starting?": three tabs, each with a line on where to begin (and the way there). */
import Link from "next/link";
import { useState } from "react";
import s from "./a.module.css";

const PATHS: { tab: string; head: string; text: string; href: string; go: string }[] = [
  { tab: "No Greek", head: "I know no Greek.", text: "Begin with the letters and their sounds. A real line of Homer by the end of the first lesson.", href: "/academy/alphabet", go: "Meet the alphabet" },
  { tab: "A little", head: "I know a little.", text: "Pick up the lessons where you are, and read real texts with help one tap away.", href: "/academy", go: "Open the Academy" },
  { tab: "Just reading", head: "I just want to read.", text: "Greek and English side by side. Read the English, glance at the Greek, dig in when you like.", href: "/library", go: "Open the library" },
];

export default function PathTabs() {
  const [i, setI] = useState(0);
  const p = PATHS[i];
  return (
    <div className={s.paths}>
      <div className={`${s["paths-label"]} ${s.mono}`} id="paths-label">Where are you starting?</div>
      <div className={s.ptabs} role="tablist" aria-labelledby="paths-label">
        {PATHS.map((t, k) => (
          <button key={t.tab} type="button" className={s.ptab} role="tab" id={`ptab-${k}`} aria-selected={k === i} aria-controls="ppanel" tabIndex={k === i ? 0 : -1}
            onClick={() => setI(k)} onKeyDown={(e) => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { const n = (k + (e.key === "ArrowRight" ? 1 : PATHS.length - 1)) % PATHS.length; setI(n); document.getElementById(`ptab-${n}`)?.focus(); } }}>
            {t.tab}
          </button>
        ))}
      </div>
      <div className={s.ppanel} role="tabpanel" id="ppanel" aria-labelledby={`ptab-${i}`}>
        <b>{p.head}</b> {p.text} <Link href={p.href} transitionTypes={["page-turn"]}>{p.go} →</Link>
      </div>
    </div>
  );
}
