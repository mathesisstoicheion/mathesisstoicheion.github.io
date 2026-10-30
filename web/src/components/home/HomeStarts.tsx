"use client";
/**
 * "Where are you starting?", a first visit's question, set as three numbered paragraphs (the sample's .starts): each says
 * where to begin and is the way there. Following one sets the reading aids to suit and remembers the answer
 * (lib/visitor.ts), so the next visit finds the visitor's desk here instead (HomeDesk); nothing changes until then, and all
 * of it can be changed later in Settings. (The Guide is in the foot of every page, so it has no second link here: the
 * owner, 2026-10-30, one way to each place.)
 */
import Link from "next/link";
import { useEffect } from "react";
import { useSettings, type Settings } from "@/lib/settings";
import { markVisitor, saveStart, type StartChoice } from "@/lib/visitor";
import { TRACKS } from "@/data/tracks";
import h from "./Home.module.css";

const PATHS: { id: StartChoice; n: string; head: string; text: string; href: string; go: string; settings: Partial<Settings> }[] = [
  { id: "none", n: "I", head: "I know no Greek.", text: "Begin with the letters, sounding out names you already know. In lesson 2 you read your first real line, a saying carved at Delphi.", href: TRACKS.reading.first, go: "Start the first lesson",
    settings: { translit: true } },
  { id: "some", n: "II", head: "I know a little.", text: "Pick up the lessons where you are, and read real texts with help one tap away.", href: "/academy", go: "Open the Academy",
    settings: { translit: false } },
  { id: "read", n: "III", head: "I just want to read.", text: "Greek and English side by side. Read the English, glance at the Greek, dig in when you like.", href: "/library", go: "Open the library",
    settings: { translit: false, columns: "both" } },
];

export default function HomeStarts() {
  const set = useSettings((st) => st.set);
  // coming back to the home page without a reload: bring the first-visit or returning mark up to date
  useEffect(() => { markVisitor(); }, []);
  const begin = (p: (typeof PATHS)[number]) => { useSettings.persist.rehydrate(); set(p.settings); saveStart(p.id); };
  return (
    <>
      <div className={h.starts}>
        {PATHS.map((p, i) => (
          <Link key={p.id} className={`${h.start} rv`} style={{ animationDelay: `${0.15 * (i + 1)}s` }} href={p.href} transitionTypes={["page-turn"]} onClick={() => begin(p)}>
            <span className={h.rn} aria-hidden="true">{p.n}</span>
            <h3>{p.head}</h3>
            <p>{p.text}</p>
            <span className={h.go}>{p.go} →</span>
          </Link>
        ))}
      </div>
    </>
  );
}
