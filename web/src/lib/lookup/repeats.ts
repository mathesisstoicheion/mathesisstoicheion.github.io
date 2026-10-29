/**
 * Saying a meaning once (the quiet desk, ticket 06). The look-up's first layer gives one meaning line; the second layer must
 * not give it again, in LSJ's short definition or in Wiktionary's senses.
 */
import type { WiktSense } from "./wiktionary";

/** A meaning as a plain run of words, for comparing: no capitals, no punctuation, one space between words. */
export const sameText = (x: string) => x.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();

const parts = (x: string) => x.split(/[;,]/).map(sameText).filter(Boolean);

/** True when every piece of the line ("wrath", "wrath, anger") is already a piece of the meaning ("wrath, revengeful temper"). */
export function repeatsMeaning(line: string, meaning: string): boolean {
  const have = new Set(parts(meaning));
  const mine = parts(line);
  return mine.length > 0 && mine.every((p) => have.has(p));
}

/**
 * Wiktionary's senses without any line that only says the meaning already on the card. A sense left with no lines goes, and
 * so does the list when nothing is left. No meaning shown (the card says there is none) leaves the senses whole.
 */
export function withoutMeaning(senses: WiktSense[] | null | undefined, meaning: string | null | undefined): WiktSense[] {
  if (!senses) return [];
  if (!meaning) return senses;
  return senses
    .map((s) => ({ ...s, lines: s.lines.filter((l) => !repeatsMeaning(l, meaning)) }))
    .filter((s) => s.lines.length > 0);
}
