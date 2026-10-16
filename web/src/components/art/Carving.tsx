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

type Kind = "room" | "line" | "title" | "cover";
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
  cover: (text) => ({ text, cols: (w) => { const most = w < 760 ? 9 : 14; return Math.ceil(text.length / Math.ceil(text.length / most)); },
    cell: (w, c) => Math.min(w < 760 ? 40 : 64, Math.floor(w / c)), align: "start", reveal: 1.4, dur: 0.9, rad: 0.9 }),
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
  return <canvas ref={cv} className={className ?? "carve"} aria-hidden="true" />;
}
