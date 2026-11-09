"use client";

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
