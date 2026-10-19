"use client";
/**
 * Design A's "Where are you starting?", a first visit's question: three tabs, each with a line on where to begin and
 * the way there. Following that way sets the reading aids to suit and remembers the answer (lib/visitor.ts), so the
 * next visit finds the visitor's desk here instead (HomeDesk); nothing changes until then, and all of it can be
 * changed later in Settings.
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSettings, type Settings } from "@/lib/settings";
import { markVisitor, saveStart, type StartChoice } from "@/lib/visitor";
import s from "./a.module.css";

const PATHS: { id: StartChoice; tab: string; head: string; text: string; href: string; go: string; settings: Partial<Settings> }[] = [
  { id: "none", tab: "No Greek", head: "I know no Greek.", text: "Begin with the letters and their sounds. A real line of Homer by the end of the first lesson.", href: "/academy/alphabet", go: "Meet the alphabet",
    settings: { translit: true } },
  { id: "some", tab: "A little", head: "I know a little.", text: "Pick up the lessons where you are, and read real texts with help one tap away.", href: "/academy", go: "Open the Academy",
    settings: { translit: false } },
  { id: "read", tab: "Just reading", head: "I just want to read.", text: "Greek and English side by side. Read the English, glance at the Greek, dig in when you like.", href: "/library", go: "Open the library",
    settings: { translit: false, columns: "both" } },
];

export default function PathTabs() {
  const [i, setI] = useState(0);
  const set = useSettings((st) => st.set);
  // coming back to the home page without a reload: bring the first-visit or returning mark up to date
  useEffect(() => { markVisitor(); }, []);
  const p = PATHS[i];
  const begin = () => { useSettings.persist.rehydrate(); set(p.settings); saveStart(p.id); };
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
        <b>{p.head}</b> {p.text} <Link href={p.href} transitionTypes={["page-turn"]} onClick={begin}>{p.go} →</Link>
      </div>
    </div>
  );
}
