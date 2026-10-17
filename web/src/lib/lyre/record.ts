/**
 * Record a melody played on the lyre, as a player would: the same strings and sound box as the page (sound.ts), rendered
 * faster than real time in an OfflineAudioContext and saved as a CD-quality WAV file (44.1 kHz, 16-bit, stereo).
 *
 * The notes are the transcription's; only the playing is ours. A phrase swells towards its middle and settles at its
 * end; higher and longer notes are given a little more weight; the last notes of a phrase take a little more time, the
 * end of the piece more still; and no two plucks are quite alike. A string rings on after its note, as on a real lyre,
 * until the hand stops it: at once if the next note is a step away (the two would clash), else after a while.
 */
import type { MelodyNote } from "@/data/melodies/types";
import { bank, LyrePlayer } from "./sound";
import { encodeWav } from "./wav";

export interface Performed { at: number; midi: number; strength: number; pan: number; until: number; damp: number }

export interface PlayStyle {
  /** 1 is the transcription's speed */
  tempo?: number;
  /** beats per minute at speed 1 */
  bpm: number;
  /** loudest touch, 0 to 1 */
  loud?: number;
  /** softest touch */
  soft?: number;
  seed?: number;
}

function rng(seed: number) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1; }

/** Where phrases end: before a rest, after a long note, and at the end. */
function phraseEnds(notes: MelodyNote[]) {
  const ends = new Set<number>();
  notes.forEach((n, i) => {
    const next = notes[i + 1];
    if (!next || next.t - (n.t + n.d) > 0.75 || n.d >= 3) ends.add(i);
  });
  return ends;
}

/** How a player might play these notes: when each is plucked (seconds), how hard, where it sits left to right. */
export function perform(notes: MelodyNote[], style: PlayStyle): Performed[] {
  const { tempo = 1, bpm, loud = 0.86, soft = 0.34, seed = 5 } = style;
  const r = rng(seed);
  const beat = 60 / (bpm * tempo);
  const ends = phraseEnds(notes);
  const pitches = [...new Set(notes.map((n) => n.m))].sort((a, b) => a - b);
  const lo = pitches[0], hi = pitches[pitches.length - 1], span = Math.max(1, hi - lo);
  const out: Performed[] = [];
  let start = 0, delay = 0;
  const total = notes.length;
  for (let i = 0; i < total; i++) {
    const n = notes[i];
    // this note's place in its phrase
    if (i === 0 || ends.has(i - 1)) start = i;
    let end = i; while (end < total - 1 && !ends.has(end)) end++;
    const len = end - start + 1, pos = len > 1 ? (i - start) / (len - 1) : 0.5;
    const arch = Math.sin(Math.PI * Math.pow(pos, 0.85));             // swells to a little past the middle
    const whole = 0.85 + 0.15 * Math.sin(Math.PI * Math.min(1, (i / total) * 1.15));  // the piece grows, then settles
    const height = (n.m - lo) / span;                                  // higher notes carry a little more
    const weight = Math.min(1, n.d / 3);                               // so do long ones
    let s = soft + (loud - soft) * (0.25 + 0.45 * arch + 0.18 * height + 0.12 * weight) * whole;
    if (i === start) s += 0.05;                                        // a phrase begins clearly
    if (ends.has(i) && len > 2) s -= 0.06;                             // and closes gently
    s = Math.max(0.12, Math.min(1, s + 0.035 * r()));
    // time: the end of a phrase broadens a little, the end of the piece more; a hand is never quite on the beat
    const toEnd = end - i;
    const broaden = ends.has(end) && toEnd < 2 ? 0.05 * (2 - toEnd) : 0;
    const finalRit = total - i <= 5 ? 0.06 * (6 - (total - i)) : 0;
    const at = n.t * beat + delay + 0.006 * r();
    delay += n.d * beat * (broaden + finalRit);
    const k = pitches.indexOf(n.m);
    const pan = pitches.length > 1 ? (k / (pitches.length - 1) - 0.5) * 0.7 : 0;
    out.push({ at: Math.max(0, at), midi: n.m, strength: s, pan, until: 0, damp: 0.5 });
  }
  // how long each string rings: stopped at the next note if that note is a step or less away, else left to ring
  for (let i = 0; i < out.length; i++) {
    const a = out[i], b = out[i + 1];
    const natural = a.at + notes[i].d * beat * 1.15 + 1.6;
    if (b && Math.abs(b.midi - a.midi) < 2.4 && b.midi !== a.midi) { a.until = b.at + 0.03; a.damp = 0.09; }
    else a.until = natural;
  }
  return out;
}

/**
 * Render a performance in an OfflineAudioContext. Returns the two channels. The notes are handed to the renderer a few
 * seconds at a time as it goes (it pauses for each batch), so a long piece never holds up the page while it is set up.
 * `fromBank`: take the strings from the bank, rendered in the worker (on the page); else render them here.
 */
export async function render(perf: Performed[], { sr = 44100, room = 0.5, tail = 3.2, fromBank = false } = {}) {
  const len = Math.ceil(((perf.at(-1)?.at ?? 0) + tail + 0.5) * sr);
  const midis = perf.map((p) => p.midi);
  if (fromBank) await Promise.all([bank.whenReady(midis, sr), bank.prepareHall(sr)]);
  const ctx = new OfflineAudioContext(2, len, sr);
  const lyre = new LyrePlayer(ctx, { room, limit: false, bank: fromBank ? sr : 0, hallLater: fromBank });
  if (fromBank) { await frame(); lyre.attachHall(); await frame(); }     // on the page, a step at a time
  lyre.setVolume(0.8);
  lyre.setStrings(midis);
  const lead = 0.35;                                                   // a breath of silence before the first note
  const STEP = 6;                                                      // seconds of music set up at a time
  let k = 0;
  const upTo = (t: number) => {
    for (; k < perf.length && lead + perf[k].at < t; k++) {
      const p = perf[k];
      lyre.pluck(p.midi, p.strength, { when: lead + p.at, pan: p.pan });
      lyre.damp(p.midi, p.damp, lead + p.until);
    }
  };
  upTo(STEP);
  let paused = true;
  try {
    for (let t = STEP - 1; t < len / sr; t += STEP - 1) {
      const at = t;
      ctx.suspend(at).then(() => { upTo(at + STEP); void ctx.resume(); }, () => upTo(Infinity));
    }
  } catch { paused = false; }
  if (!paused) upTo(Infinity);                                         // a browser that cannot pause a render
  const buf = await ctx.startRendering();
  return [buf.getChannelData(0), buf.getChannelData(1)] as const;
}

const frame = () => new Promise<void>((done) => (typeof requestAnimationFrame === "function" ? requestAnimationFrame(() => done()) : setTimeout(done, 0)));

/** Two channels as a CD-quality WAV file (wav.ts). */
export function wav([L, R]: readonly [Float32Array, Float32Array], sr = 44100, peakDb = -1): Blob {
  return new Blob([encodeWav(L, R, sr, peakDb)], { type: "audio/wav" });
}

/** Play the notes as a player would and save the result as a WAV file. */
export async function recordWav(notes: MelodyNote[], style: PlayStyle & { room?: number }) {
  const perf = perform(notes, style);
  const ch = await render(perf, { room: style.room ?? 0.5 });
  return wav(ch);
}

/** The same, on the page: the strings are rendered and the file written in the worker, so nothing stutters. */
export async function recordOnPage(notes: MelodyNote[], style: PlayStyle & { room?: number }) {
  const sr = 44100;
  const perf = perform(notes, style);
  try {
    const [L, R] = await render(perf, { sr, room: style.room ?? 0.5, fromBank: true });
    return new Blob([await bank.encode(L, R, sr)], { type: "audio/wav" });
  } finally {
    bank.drop(sr);
  }
}
