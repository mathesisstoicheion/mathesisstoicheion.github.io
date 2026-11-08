import { describe, expect, it } from "vitest";
import { EMPTY, openedLink, record, replaying, stopRecording, type Own } from "./own";
import type { Tune } from "./tune-link";

const tune = (n: number): Tune => ({ song: null, tuning: "ancient", plucks: Array.from({ length: n }, (_, i) => ({ t: i * 100, m: 60, s: 0.5 })) });

// "Record what you play" on the lyre is one state (own.ts), not four flags
describe("your own playing on the lyre", () => {
  it("keeps what was played once recording stops", () => {
    const kept = stopRecording(record(), tune(3));
    expect(kept).toMatchObject({ state: "kept", from: "mine", replaying: false });
  });

  it("keeps nothing if nothing was played", () => {
    expect(stopRecording(record(), tune(0))).toEqual(EMPTY);
    expect(stopRecording(record(), null)).toEqual(EMPTY);
  });

  it("does nothing on Stop unless it is recording", () => {
    const kept: Own = { state: "kept", tune: tune(2), from: "link", replaying: false };
    expect(stopRecording(kept, tune(5))).toBe(kept);
  });

  it("sets out a tune opened from a link in place of anything else", () => {
    expect(openedLink(record(), tune(2))).toMatchObject({ state: "kept", from: "link" });
    expect(openedLink(stopRecording(record(), tune(1)), tune(2))).toMatchObject({ state: "kept", from: "link" });
  });

  it("says a link is damaged only when nothing else is in front of you", () => {
    expect(openedLink(EMPTY, null)).toEqual({ state: "empty", badLink: true });
    const kept = stopRecording(record(), tune(1));
    expect(openedLink(kept, null)).toBe(kept);
    expect(openedLink(record(), null)).toEqual(record());
  });

  it("plays back only a kept tune, and a new recording clears the damaged-link note", () => {
    const kept = stopRecording(record(), tune(1));
    expect(replaying(kept, true)).toMatchObject({ replaying: true });
    expect(replaying(EMPTY, true)).toBe(EMPTY);
    expect(record()).toEqual({ state: "recording" });
  });
});
