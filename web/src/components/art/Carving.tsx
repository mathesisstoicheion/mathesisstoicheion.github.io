"use client";
/**
 * Letters cut into the stone and lit by the torch (lib/art/carve.ts), as Greek was carved: capitals in a strict grid,
 * with no accents, breathings or spaces. It is decoration; the same words are always written out on the page too, so
 * the canvas is hidden from screen readers.
 */
import { useRef } from "react";
import { carvedCaps } from "@/lib/art/common";
import { Carved, type CarvedOptions } from "@/lib/art/carve";
import { carvingFontReady, useTorchlit } from "@/lib/art/part";

type Kind = "room" | "line" | "title" | "cover" | "name" | "plinth" | "fragment";
/** rows as even as can be, with no more than `most` letters in any row */
const even = (n: number, most: number) => Math.ceil(n / Math.ceil(n / most));
/** How each kind of carving is sized and cut in (the settings tried in the design samples). */
const KINDS: Record<Kind, (text: string, cols?: number) => CarvedOptions> = {
  // a room's name on the home page, in a small block of three rows
  room: (text, cols) => ({ text, cols, cell: () => (innerWidth < 1000 ? 30 : 38), fixedW: true, boxRows: 3, reveal: 0.7, dur: 0.6, rad: 0.9 }),
  // a line of verse across the page, in two rows on a phone
  line: (text) => ({ text, cols: (w) => (w < 760 ? 8 : 16), cell: (w, c) => Math.min(78, Math.floor(w / c)), reveal: 2.2, dur: 0.8, rad: 0.8 }),
  // a page's name, large, on one row (smaller on a phone, so the page's first screen is not all name)
  title: (text) => ({ text, cols: text.length, cell: (w, c) => Math.min(innerWidth < 760 ? 56 : 118, Math.floor(w / c)), reveal: 1.2, dur: 0.9, rad: 1 }),
  // a book's Greek title on the reader's cover: one row if it is short, otherwise a block of rows as even as can be
  // (ΑΠΟΛΟΓΙΑΣ over ΩΚΡΑΤΟΥΣ, not fourteen letters over three)
  cover: (text) => ({ text, cols: (w) => even(text.length, w < 760 ? 9 : 14),
    cell: (w, c) => Math.min(w < 760 ? 40 : 64, Math.floor(w / c)), align: "start", reveal: 1.4, dur: 0.9, rad: 0.9 }),
  // the name of a page inside an area (a lesson, an entry, a table): smaller than an area's, at the start of the line
  name: (text) => ({ text, cols: (w) => even(text.length, w < 760 ? 11 : 18),
    cell: (w, c) => Math.min(innerWidth < 760 ? 30 : 54, Math.floor(w / c)), align: "start", reveal: 1, dur: 0.8, rad: 0.9 }),
  // a few large letters on a broken piece of stone (the page that has not survived)
  fragment: (text) => ({ text, cols: text.length, cell: (w, c) => Math.min(innerWidth < 760 ? 92 : 128, Math.floor((w * 0.8) / c)), reveal: 1.2, dur: 1, rad: 1.1 }),
  // the site's name along the foot of every page
  plinth: (text) => ({ text, cols: text.length, cell: (w, c) => Math.min(innerWidth < 760 ? 20 : 30, Math.floor(w / c)), align: "start", reveal: 0.9, dur: 0.7, rad: 1 }),
};

interface Props {
  text: string; kind: Kind; cols?: number; delay?: number; gain?: number; className?: string;
  /** cut in pale limestone and lit by daylight (the reader's Daylight page) */
  day?: boolean;
}

export default function Carving({ text, kind, cols, delay, gain, className, day }: Props) {
  const cv = useRef<HTMLCanvasElement>(null);
  const caps = carvedCaps(text);
  useTorchlit(cv, async (c) => { await carvingFontReady(); return new Carved(c, { ...KINDS[kind](caps, cols), pal: day ? "day" : "night" }); },
    { delay, gain, day: () => !!day }, caps + kind + (day ? "day" : ""));
  // no height until it is measured: an unmeasured canvas would hold a gap half as tall as it is wide
  return <canvas ref={cv} height={0} className={className ?? "carve"} aria-hidden="true" />;
}
