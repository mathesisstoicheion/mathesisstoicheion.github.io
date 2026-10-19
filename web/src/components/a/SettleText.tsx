"use client";
/**
 * A heading whose letters settle as its section arrives (design A, "Settle"): each letter (or, with `words`, each word)
 * starts a little out of place and finds its place at the pace of the scroll, so a slow scroll plays it slowly. The words
 * are read out whole to a screen reader. The page sets the letters out itself, the same way every time; lib/a/lamplight.js
 * only moves them.
 */
import { createElement, useEffect, useRef } from "react";
import { track } from "@/lib/a/lamplight";
import s from "./a.module.css";

/** the same small offsets for the same words on every visit (design A drew them from one seeded sequence) */
function seeded(text: string) {
  let h = 11;
  for (const c of text) h = (h * 31 + c.charCodeAt(0)) % 2147483647;
  let seed = h || 11;
  return () => (seed = (seed * 16807) % 2147483647) / 2147483647;
}

export default function SettleText({ text, as = "span", words = false, className, id, lang }:
  { text: string; as?: string; words?: boolean; className?: string; id?: string; lang?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => { const el = ref.current; if (!el) return; return track(el); }, []);
  const rnd = seeded(text);
  const parts = text.split(/(\s+)/);
  const total = words ? parts.filter((w) => w && !/^\s+$/.test(w)).length : text.replace(/\s/g, "").length;
  let n = 0;
  const letter = (c: string, key: string) => {
    const i = n++ / Math.max(1, total - 1);
    const dx = ((rnd() - 0.5) * (words ? 0.5 : 0.9)).toFixed(2), dy = ((rnd() - 0.2) * (words ? 0.7 : 1.1)).toFixed(2), r = ((rnd() - 0.5) * (words ? 4 : 18)).toFixed(1);
    return <span key={key} className={s["st-l"]} style={{ "--i": i.toFixed(3), "--dx": `${dx}em`, "--dy": `${dy}em`, "--r": `${r}deg` } as React.CSSProperties}>{c}</span>;
  };
  const out = parts.map((w, k) => {
    if (!w) return null;
    if (/^\s+$/.test(w)) return w;
    if (words) return letter(w, `w${k}`);
    return <span key={`w${k}`} className={s["st-w"]}>{[...w].map((c, j) => letter(c, `${k}-${j}`))}</span>;
  });
  return createElement(as, { ref, className, id, lang },
    <span className={s["st-sr"]}>{text}</span>,
    <span aria-hidden="true">{out}</span>);
}
