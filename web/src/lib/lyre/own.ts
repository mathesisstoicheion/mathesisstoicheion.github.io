/**
 * "Record what you play" on the lyre, as one state rather than four flags (taking, tune, tuneBad, replaying):
 *
 *   empty ──Record──▶ recording ──Stop──▶ kept (yours)      (or empty again, if nothing was played)
 *     ▲                                    │  Play it back ⇄ Stop (replaying)
 *     └──────────── a tune opened from a link ──▶ kept (from the link)   a damaged link, with nothing kept ▶ empty (bad link)
 *
 * The plucks themselves are gathered outside React (Lyre.tsx keeps them in a ref, a pluck at a time); this is only what the
 * row under the lyre shows and which of its buttons it has.
 */
import type { Tune } from "./tune-link";

export type Own =
  | { state: "empty"; badLink: boolean }
  | { state: "recording" }
  | { state: "kept"; tune: Tune; from: "mine" | "link"; replaying: boolean };

export const EMPTY: Own = { state: "empty", badLink: false };

/** Record (or Record again): whatever was kept goes. */
export const record = (): Own => ({ state: "recording" });

/** Stop recording: what was played is kept, if anything was. */
export const stopRecording = (now: Own, played: Tune | null): Own =>
  now.state !== "recording" ? now : played && played.plucks.length ? { state: "kept", tune: played, from: "mine", replaying: false } : EMPTY;

/** A tune opened from a link (#tune=…): it is set out, ready to play, in place of anything else; a damaged one is said so,
 *  unless something is already kept or being recorded. */
export const openedLink = (now: Own, t: Tune | null): Own =>
  t ? { state: "kept", tune: t, from: "link", replaying: false } : now.state === "empty" ? { state: "empty", badLink: true } : now;

/** Playing the kept tune back, or not. */
export const replaying = (now: Own, on: boolean): Own => (now.state === "kept" && now.replaying !== on ? { ...now, replaying: on } : now);
