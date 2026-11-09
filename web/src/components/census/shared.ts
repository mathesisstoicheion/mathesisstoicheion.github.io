"use client";
import { useEffect, useRef } from "react";

export interface EntryLink { slug: string; title: string }
/** Painted Stoa entries: by dictionary word (canonLemma), and by Pleiades place id. */
export interface Links { byName: Record<string, EntryLink[]>; byPlace: Record<string, EntryLink[]> }

/** A row as shown: the word, its count, and a line under it (meaning, English name or transliteration). */
export interface Shown {
  key: string; text: string; n: number; auto: boolean; sub: string | null;
  id?: number;              // its place in the register, for words
  note?: string;            // a figure for the order: "×3.4" more often, "only here"
  rates?: number[];         // per 10,000 words in each period, for the little line of its use over time
}

export const fmt = (n: number) => n.toLocaleString("en-GB");

export { useLoad, type Load } from "@/lib/use-load";

/**
 * For an svg map whose places are tapped: keeps the CSS variable --hit on the svg at 22 screen pixels, in the map's own units
 * (the .hit circles, which only a touch screen draws, are that big, so a finger can land on a small place). `vbw` and `vbh` are the
 * viewBox's width and height; `ready` is true once the svg is on the page.
 */
export function useHitRadius(vbw: number | undefined, vbh: number | undefined, ready: boolean) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg || !vbw || !vbh) return;
    const set = () => {
      const b = svg.getBoundingClientRect();
      const scale = Math.min(b.width / vbw, b.height / vbh);   // the viewBox is fitted whole ("meet")
      if (scale > 0) svg.style.setProperty("--hit", String(22 / scale));
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(svg);
    return () => ro.disconnect();
  }, [vbw, vbh, ready]);
  return ref;
}
