/**
 * Short meanings for words in lesson workouts: the DCC core list's definition where the word is one of the
 * commonest, else LSJ's first summary, cut to its first sense so it fits on a button.
 */
import { coreEntry } from "@/lib/lookup/core";
import { lsjEntries } from "@/lib/lookup/lsj";

/** A dictionary definition cut to what fits on a button: the first sense, without grammar notes in brackets. */
export function shortGloss(def: string): string {
  const first = def.split(";")[0].replace(/\([^)]*\)/g, "").replace(/\s+/g, " ").replace(/\s+,/g, ",").trim();
  const parts = first.split(/,\s*/).filter(Boolean);
  return parts.slice(0, 3).join(", ").replace(/[,.:\s]+$/, "");
}

export async function glossesFor(words: string[]): Promise<Record<string, string>> {
  const pairs = await Promise.all(words.map(async (w) => {
    const def = (await coreEntry(w))?.def ?? (await lsjEntries(w).catch(() => null))?.entries[0]?.s ?? "";
    return [w, def ? shortGloss(def) : ""] as const;
  }));
  return Object.fromEntries(pairs);
}
