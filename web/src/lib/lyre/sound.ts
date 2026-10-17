/**
 * The lyre's voice: plucked gut strings (string.ts) sounding through a tortoise-shell body into a stone hall.
 *
 *   each pluck ─ its tone ─ its loudness ─ its place left to right ─ the sound box ─┬─ dry ────────────┬─ limiter ─ out
 *                                                                                    └─ the hall's echo ─┘
 *
 * A pluck's strength (a MIDI keyboard's velocity, the speed of a swipe, Shift on the computer keyboard) sets its
 * loudness and its tone: a harder pluck is brighter, clicks a little at the plectrum and starts a touch sharp. Each pitch
 * is rendered once for each of six strengths and kept; between the six, the exact strength sets the loudness and a
 * gentle tone filter. Repeated notes vary a little, as a hand does.
 *
 * On the page the strings are rendered in a worker as soon as a song is chosen, before any sound is allowed, so the
 * first pluck is instant and the page never stutters (`bank`). A note with no string ready (a black key on a MIDI
 * keyboard, say) is played at first from the nearest string, a little faster or slower, while its own is rendered.
 * The same player also runs in an OfflineAudioContext to
 * record a whole piece (record.ts). This is an instrument, not a recording of anyone's voice, so it does not go against
 * the rule in lib/audio.ts that nothing spoken is synthesised.
 */
import { bodyResponse, renderPluck, roomResponse } from "./string";
import { encodeWav } from "./wav";

export const midiToHz = (m: number) => 440 * 2 ** ((m - 69) / 12);

export const LAYERS = [0.18, 0.34, 0.5, 0.66, 0.82, 0.97];
export const layerOf = (s: number) => LAYERS.reduce((b, v, i) => (Math.abs(v - s) < Math.abs(LAYERS[b] - s) ? i : b), 0);
const cents = (midi: number) => Math.round(midi * 100);
const keyOf = (midi: number, layer: number, sr: number) => `${sr}:${cents(midi)}:${layer}`;
const seedOf = (layer: number) => (layer % 3) + 1;

// ── the strings, rendered ahead of time ───────────────────────────────────────────────────────────────────────────
/** The page's strings are rendered at 48 kHz; a device running at another rate resamples them as they play. */
export const BANK_SR = 48000;

/** A rendered string: a buffer the browser can play (made without an audio context, so one copy serves every player),
 *  or plain samples where the browser cannot make one that way. */
type Buf = AudioBuffer | Float32Array;
interface Job { key: string; midi: number; hz: number; strength: number; sr: number; seed: number }

/** The sound box and the hall, as impulse responses (string.ts). */
interface Hall { body: Float32Array; L: Float32Array; R: Float32Array }
const makeHall = (sr: number): Hall => { const [L, R] = roomResponse(sr); return { body: bodyResponse(sr), L, R }; };

function playable(y: Float32Array, sr: number): Buf {
  try { const b = new AudioBuffer({ length: y.length, sampleRate: sr, numberOfChannels: 1 }); b.copyToChannel(y as Float32Array<ArrayBuffer>, 0); return b; }
  catch { return y; }
}

class Bank {
  private store = new Map<string, Buf>();
  /** for each sample rate, the pitches (in cents) with at least one strength rendered */
  private pitches = new Map<number, Set<number>>();
  private pending = new Set<string>();
  private jobs = new Map<string, Job>();
  private waits: { keys: string[]; done: () => void }[] = [];
  private kept: number[][] = [];
  private encodes = new Map<number, (b: ArrayBuffer) => void>();
  private halls = new Map<number, Hall>();
  private hallWaits = new Map<number, (() => void)[]>();
  private nextEncode = 1;
  private w: Worker | null | undefined;

  get(midi: number, layer: number, sr = BANK_SR) { return this.store.get(keyOf(midi, layer, sr)); }

  /** A stand-in while a string is not ready: the same pitch at the nearest strength, else the nearest pitch within a
   *  fourth (played faster or slower to sound at the right pitch), else the nearest of all (so nothing is made while a
   *  key waits). */
  closest(midi: number, layer: number, sr = BANK_SR): { y: Buf; midi: number } | undefined {
    const c = cents(midi);
    const all = [...(this.pitches.get(sr) ?? [])].sort((a, b) => Math.abs(a - c) - Math.abs(b - c));
    const within = all.filter((p) => Math.abs(p - c) <= 500);
    const near = within.length ? within : all.filter((p) => Math.abs(p - c) <= 2400).slice(0, 1);
    for (const p of near) for (const d of [0, 1, -1, 2, -2, 3, -3, 4, -4, 5, -5]) {
      const y = this.store.get(`${sr}:${p}:${layer + d}`);
      if (y) return { y, midi: p / 100 };
    }
    return undefined;
  }

  /** Render now, here (only when nothing near is ready). */
  now(midi: number, layer: number, sr = BANK_SR): Buf {
    const k = keyOf(midi, layer, sr);
    const have = this.store.get(k);
    if (have) return have;
    this.put(k, midi, sr, renderPluck({ hz: midiToHz(midi), strength: LAYERS[layer], sr, seed: seedOf(layer) }));
    return this.store.get(k)!;
  }

  private put(key: string, midi: number, sr: number, y: Float32Array) {
    this.store.set(key, playable(y, sr));
    let ps = this.pitches.get(sr);
    if (!ps) this.pitches.set(sr, (ps = new Set()));
    ps.add(cents(midi));
    if (this.waits.length) this.waits = this.waits.filter((w) => (w.keys.every((k) => this.store.has(k)) ? (w.done(), false) : true));
  }

  private keys(midis: number[], sr: number) { return [...new Set(midis)].flatMap((m) => LAYERS.map((_, l) => keyOf(m, l, sr))); }
  /** True when every strength of these pitches is ready. */
  ready(midis: number[], sr = BANK_SR) { return this.keys(midis, sr).every((k) => this.store.has(k)); }
  /** Render these pitches if they are not ready, and say when they are. */
  whenReady(midis: number[], sr = BANK_SR): Promise<void> {
    this.prepare(midis, sr);
    const keys = this.keys(midis, sr);
    if (keys.every((k) => this.store.has(k))) return Promise.resolve();
    return new Promise((done) => this.waits.push({ keys, done }));
  }

  /** Render these pitches in the worker, the middle strengths first (a keyboard and a calm touch use those), or only
   *  the strengths given. */
  prepare(midis: number[], sr = BANK_SR, layers = [3, 2, 4, 1, 5, 0]) {
    const jobs: Job[] = [];
    for (const l of layers) for (const m of new Set(midis)) {
      const key = keyOf(m, l, sr);
      if (!this.store.has(key) && !this.pending.has(key)) jobs.push({ key, midi: m, hz: midiToHz(m), strength: LAYERS[l], sr, seed: seedOf(l) });
    }
    if (!jobs.length) return;
    for (const j of jobs) { this.pending.add(j.key); this.jobs.set(j.key, j); }
    const w = this.worker();
    if (w) w.postMessage({ jobs }); else this.here(jobs);
  }

  /** Let go of the strings no song on the page needs now: all but these and the set before them. */
  keep(midis: number[], sr = BANK_SR) {
    this.kept = [midis, ...this.kept].slice(0, 2);
    const want = new Set(this.kept.flat().map(cents));
    this.forget((s, c) => s === sr && !want.has(c));
  }
  /** Let go of everything rendered at this rate (the strings made for a recording). */
  drop(sr: number) { this.forget((s) => s === sr); }
  private forget(gone: (sr: number, c: number) => boolean) {
    for (const k of [...this.store.keys()]) {
      const [s, c] = k.split(":").map(Number);
      if (gone(s, c)) { this.store.delete(k); this.pitches.get(s)?.delete(c); }
    }
  }

  /** The sound box and the hall at this sample rate, if made (they take a moment, so the worker makes them early). */
  hall(sr: number) { return this.halls.get(sr); }
  /** Have the worker make the sound box and the hall for these rates, and say when the first is ready. */
  prepareHall(...rates: number[]): Promise<void> {
    const w = this.worker();
    return Promise.all(rates.map((sr) => {
      if (this.halls.has(sr)) return Promise.resolve();
      if (!w) { this.halls.set(sr, makeHall(sr)); return Promise.resolve(); }
      let q = this.hallWaits.get(sr);
      if (!q) { this.hallWaits.set(sr, (q = [])); w.postMessage({ hall: sr }); }
      return new Promise<void>((done) => q!.push(done));
    })).then(() => undefined);
  }

  /** A recording as a WAV file, written in the worker so the page does not stop while it is made. */
  encode(L: Float32Array, R: Float32Array, sr: number): Promise<ArrayBuffer> {
    const w = this.worker();
    if (!w) return Promise.resolve(encodeWav(L, R, sr));
    const id = this.nextEncode++;
    return new Promise((done) => {
      this.encodes.set(id, done);
      // hand the samples over without copying them where the browser allows it
      try { w.postMessage({ wav: { id, L, R, sr } }, [L.buffer, R.buffer]); }
      catch { const l = new Float32Array(L), r = new Float32Array(R); w.postMessage({ wav: { id, L: l, R: r, sr } }, [l.buffer, r.buffer]); }
    });
  }

  /** No worker (or it failed): render a few at a time between frames. */
  private here(jobs: Job[]) {
    const step = () => {
      const t0 = performance.now();
      while (jobs.length && performance.now() - t0 < 6) {
        const j = jobs.shift()!;
        this.pending.delete(j.key); this.jobs.delete(j.key);
        if (!this.store.has(j.key)) this.put(j.key, j.midi, j.sr, renderPluck(j));
      }
      if (jobs.length) setTimeout(step, 20);
    };
    setTimeout(step, 0);
  }

  private worker(): Worker | null {
    if (this.w !== undefined) return this.w;
    if (typeof Worker === "undefined") return (this.w = null);
    try {
      const w = new Worker(new URL("./render.worker.ts", import.meta.url), { type: "module" });
      w.onmessage = (e: MessageEvent<{ key: string; y: Float32Array } | { wav: number; data: ArrayBuffer } | ({ hall: number } & Hall)>) => {
        const d = e.data;
        if ("wav" in d) { this.encodes.get(d.wav)?.(d.data); this.encodes.delete(d.wav); return; }
        if ("hall" in d) {
          this.halls.set(d.hall, { body: d.body, L: d.L, R: d.R });
          for (const f of this.hallWaits.get(d.hall) ?? []) f();
          this.hallWaits.delete(d.hall);
          return;
        }
        const j = this.jobs.get(d.key);
        this.pending.delete(d.key); this.jobs.delete(d.key);
        if (j) this.put(d.key, j.midi, j.sr, d.y);
      };
      w.onerror = (e) => {
        e.preventDefault();
        this.w = null;
        for (const [sr, q] of this.hallWaits) { this.halls.set(sr, makeHall(sr)); for (const f of q) f(); }
        this.hallWaits.clear();
        const lost = [...this.jobs.values()];
        this.here(lost);
      };
      return (this.w = w);
    } catch { return (this.w = null); }
  }
}
export const bank = new Bank();

// ── the player ───────────────────────────────────────────────────────────────────────────────────────────────────
interface Ringing { src: AudioBufferSourceNode; gain: GainNode; tone: BiquadFilterNode; end: number }

export class LyrePlayer {
  readonly ctx: BaseAudioContext;
  private input: GainNode;
  private master: GainNode;
  private wet: GainNode;
  private hallNode: ConvolverNode;
  private hallBuf: AudioBuffer;
  /** strings rendered here, at the context's own rate (a player that does not use the bank) */
  private buffers = new Map<string, AudioBuffer>();
  /** the bank's plain samples, made playable for this context (only where the browser could not do it once for all) */
  private made = new WeakMap<Float32Array, AudioBuffer>();
  private ringing = new Map<number, Ringing[]>();
  /** the bank rate this player takes its strings from; 0: it renders its own */
  private fromBank: number;
  private jitter = 12345;
  private strings: number[] = [];

  /**
   * `bank`: take the strings from the bank, as rendered at this rate (the page's player, and a recording made on the
   * page); without it every string is rendered here when first plucked (the recording script).
   * `limit`: a safety limiter before the speakers (a recording is levelled afterwards instead).
   * `hallLater`: the browser takes a moment to take in the hall's echo, so the hall can be added just after (attachHall),
   * and the first pluck is not kept waiting.
   */
  constructor(ctx: BaseAudioContext, { room = 0.5, bank: fromBank = 0, limit = true, hallLater = false }: { room?: number; bank?: number; limit?: boolean; hallLater?: boolean } = {}) {
    this.ctx = ctx;
    this.fromBank = fromBank;
    const sr = ctx.sampleRate;
    this.input = ctx.createGain();
    const hall0 = bank.hall(sr) ?? makeHall(sr);
    const body = ctx.createConvolver();
    body.normalize = false;
    const b = hall0.body, bb = ctx.createBuffer(2, b.length, sr);
    bb.getChannelData(0).set(b); bb.getChannelData(1).set(b);
    body.buffer = bb;
    // a small sound box gives little below about 100 Hz, and a hide front is soft at the very top
    const low = ctx.createBiquadFilter(); low.type = "highpass"; low.frequency.value = 80; low.Q.value = 0.6;
    const air = ctx.createBiquadFilter(); air.type = "highshelf"; air.frequency.value = 6500; air.gain.value = -4;
    const dry = ctx.createGain(); dry.gain.value = 0.7;
    const hall = ctx.createConvolver();
    hall.normalize = false;
    const rl = hall0.L, rr = hall0.R, rb = ctx.createBuffer(2, rl.length, sr);
    rb.getChannelData(0).set(rl); rb.getChannelData(1).set(rr);
    this.hallNode = hall; this.hallBuf = rb;
    if (!hallLater) hall.buffer = rb;
    this.wet = ctx.createGain();
    this.setRoom(room);
    // a safety limiter only (a recording is levelled afterwards instead): it should almost never act
    const sum = ctx.createGain();
    this.master = ctx.createGain(); this.master.gain.value = 0.6;
    this.input.connect(body).connect(low).connect(air);
    air.connect(dry).connect(sum);
    air.connect(hall).connect(this.wet).connect(sum);
    if (limit) {
      const lim = ctx.createDynamicsCompressor();
      lim.threshold.value = -3; lim.knee.value = 0; lim.ratio.value = 12; lim.attack.value = 0.002; lim.release.value = 0.12;
      sum.connect(this.master).connect(lim).connect(ctx.destination);
    } else sum.connect(this.master).connect(ctx.destination);
  }

  /** Add the hall's echo, if it was left for later. */
  attachHall() { if (!this.hallNode.buffer) this.hallNode.buffer = this.hallBuf; }

  /** The whole instrument's loudness, 0 to 1. */
  setVolume(v: number) { this.master.gain.value = Math.max(0, Math.min(1, v)) * 0.75; }
  /** How much of the hall is heard, 0 (close) to 1. */
  setRoom(v: number) { this.wet.gain.value = Math.max(0, Math.min(1, v)) * 0.42; }

  private playable(y: AudioBuffer | Float32Array, sr: number): AudioBuffer {
    if (!(y instanceof Float32Array)) return y;
    let b = this.made.get(y);
    if (!b) { b = this.ctx.createBuffer(1, y.length, sr); b.getChannelData(0).set(y); this.made.set(y, b); }
    return b;
  }

  /** The sound of this string at this strength, and the speed to play it at (1, unless it is a stand-in). */
  private source(midi: number, layer: number): { b: AudioBuffer; rate: number } {
    const sr = this.fromBank;
    if (sr) {
      const y = bank.get(midi, layer, sr);
      if (y) return { b: this.playable(y, sr), rate: 1 };
      bank.prepare([midi], sr);                         // ready next time; meanwhile the nearest string stands in
      const near = bank.closest(midi, layer, sr);
      if (near) return { b: this.playable(near.y, sr), rate: 2 ** ((midi - near.midi) / 12) };
      return { b: this.playable(bank.now(midi, layer, sr), sr), rate: 1 };
    }
    const key = `${cents(midi)}:${layer}`;
    let b = this.buffers.get(key);
    if (!b) {
      const y = renderPluck({ hz: midiToHz(midi), strength: LAYERS[layer], sr: this.ctx.sampleRate, seed: seedOf(layer) });
      b = this.ctx.createBuffer(1, y.length, this.ctx.sampleRate);
      b.getChannelData(0).set(y);
      this.buffers.set(key, b);
    }
    return { b, rate: 1 };
  }

  /**
   * The lyre's open strings. A string that is not being played still answers, very quietly, when another is plucked an
   * octave, a fifth or a fourth away (its own harmonics are struck by the other's): the faint bloom around every note
   * of a real lyre or harp.
   */
  setStrings(midis: number[]) { this.strings = [...new Set(midis)]; }

  private sympathy(midi: number, s: number, t: number) {
    let n = 0;
    for (const o of this.strings) {
      const d = Math.abs(o - midi);
      const k = [[12, 0.05], [24, 0.03], [7, 0.03], [19, 0.022], [5, 0.018]].find(([iv]) => Math.abs(d - iv) < 0.3);
      if (!k || d < 0.3 || n >= 3) continue;
      n++;
      const src = this.ctx.createBufferSource();
      const { b, rate } = this.source(o, 0);
      src.buffer = b;
      if (rate !== 1) src.playbackRate.value = rate;
      const tone = this.ctx.createBiquadFilter();
      tone.type = "lowpass"; tone.Q.value = 0.4; tone.frequency.value = Math.min(12000, midiToHz(o) * 5);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(k[1] * (0.3 + 0.7 * s), t + 0.18);   // it gathers slowly, as resonance does
      src.connect(tone).connect(gain).connect(this.input);
      src.start(t);
      const r: Ringing = { src, gain, tone, end: t + b.duration / rate };
      const list = this.ringing.get(o) ?? [];
      list.push(r); this.ringing.set(o, list);
      src.onended = () => { const l = this.ringing.get(o); if (l) { const i = l.indexOf(r); if (i >= 0) l.splice(i, 1); } };
    }
  }

  /** A small, repeatable variation for each pluck, -1 to 1. */
  private wobble() { this.jitter = (this.jitter * 1103515245 + 12345) >>> 0; return (this.jitter / 4294967296) * 2 - 1; }

  /**
   * Pluck a string. `strength` is 0 to 1 (a MIDI velocity divided by 127), `pan` from -1 (left) to 1 (right), `when` on
   * the context's clock (0 is now). A string plucked again while it rings is stopped first, as the plectrum does.
   */
  pluck(midi: number, strength = 0.6, { when = 0, pan = 0 }: { when?: number; pan?: number } = {}) {
    const ctx = this.ctx;
    const s = Math.max(0.02, Math.min(1, strength));
    const t = Math.max(when || 0, ctx.currentTime);
    this.damp(midi, 0.012, t);
    const { b: buf, rate } = this.source(midi, layerOf(s));
    const src = ctx.createBufferSource();
    src.buffer = buf;
    if (rate !== 1) src.playbackRate.value = rate;
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass"; tone.Q.value = 0.4;
    tone.frequency.value = Math.min(18000, midiToHz(midi) * (6 + 40 * s) * (1 + 0.08 * this.wobble()));
    const gain = ctx.createGain();
    // loudness grows faster than the touch, as on a real string; and no two plucks are quite the same
    gain.gain.value = (0.05 + 0.95 * Math.pow(s, 1.7)) * (1 + 0.06 * this.wobble());
    const p = ctx.createStereoPanner();
    p.pan.value = Math.max(-1, Math.min(1, pan));
    src.connect(tone).connect(gain).connect(p).connect(this.input);
    src.start(t);
    const r: Ringing = { src, gain, tone, end: t + buf.duration / rate };
    const list = this.ringing.get(midi) ?? [];
    list.push(r);
    this.ringing.set(midi, list);
    src.onended = () => { const l = this.ringing.get(midi); if (l) { const k = l.indexOf(r); if (k >= 0) l.splice(k, 1); } };
    this.sympathy(midi, s, t);
  }

  /** Lay a finger on a string: its highs go first, then the rest, over about `over` seconds. */
  damp(midi: number, over = 0.25, when = 0) {
    const t = Math.max(when || 0, this.ctx.currentTime);
    for (const r of this.ringing.get(midi) ?? []) {
      if (r.end <= t) continue;
      r.gain.gain.cancelScheduledValues(t);
      r.gain.gain.setTargetAtTime(0, t, over / 4);
      r.tone.frequency.cancelScheduledValues(t);
      r.tone.frequency.setTargetAtTime(Math.min(r.tone.frequency.value, 700), t, over / 8);
      r.end = t + over * 1.5;
      try { r.src.stop(t + over * 1.5); } catch { /* already stopped */ }
    }
  }

  dampAll(over = 0.15) { for (const m of [...this.ringing.keys()]) this.damp(m, over); }
}

// ── the live lyre on the page ─────────────────────────────────────────────────────────────────────────────────────
let live: LyrePlayer | null = null;

/**
 * The page's player. It may be made before anyone has pressed anything (it then waits, silent, as browsers ask, and is
 * woken by the first press or tap), because making one takes a moment that would otherwise delay the first note.
 */
export function player(): LyrePlayer {
  if (!live) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const lp = (live = new LyrePlayer(new AC({ latencyHint: "interactive" }), { bank: BANK_SR, hallLater: true }));
    setTimeout(() => lp.attachHall(), 60);
  }
  const ctx = live.ctx as AudioContext;
  const pressed = (navigator as Navigator & { userActivation?: { isActive: boolean } }).userActivation?.isActive ?? true;
  if (ctx.state === "suspended" && pressed) void ctx.resume();
  return live;
}
/** The player, only if it already exists (nothing is made, no sound is asked for). */
export const playerIfMade = () => live;
