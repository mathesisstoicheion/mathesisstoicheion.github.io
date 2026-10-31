"use client";
/**
 * The lyre (/stoa/lyre): a Greek lyre, a different one for each song (instruments.ts), to play with the mouse, a finger,
 * the computer keyboard (a key for each string, in order) or a MIDI keyboard (velocity sets how hard each string is
 * plucked), under a roll on which the notes of a surviving ancient melody come down to their strings, each with the
 * syllable sung to it.
 * Instead of the roll the melody can be read as modern sheet music (Sheet.tsx), the note now sounding in red with a red
 * mark beneath it; another marks the syllable in the words below.
 *
 * "Listen" plays the melody as a player might (record.ts: phrasing, a little rubato, no two plucks alike), handed to
 * the audio clock a moment ahead, so its rhythm stays even whatever the page is doing; the roll follows what is heard.
 * "Play along" lets you play it, and with "Wait for me" the roll waits at each note until you play it. What you play
 * rises from the strings as a fading trail of red ink, as on a MIDI visualiser. "Save a recording" writes the melody, played
 * the same way, as a CD-quality WAV file. "Record what you play" keeps your own playing, every pluck as you made it, to play
 * back and to share as a link (lib/lyre/tune-link.ts) that plays it on the same lyre for anyone who opens it.
 *
 * Nothing here waits on React while you play: the strings are rendered in a worker before the first touch (sound.ts),
 * every frame reads one mutable record, and the words, the caption and the score are lit by touching the elements
 * themselves. The instrument is painted once, in its own colours and evenly, as a coloured plate prints an object, and
 * everything else is drawn in the page's own inks, so it reads on Paper and at Night (draw.ts).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Melody, MelodyNote, MelodyNotes } from "@/data/melodies/types";
import { bank, player, playerIfMade, type LyrePlayer } from "@/lib/lyre/sound";
import { perform, recordOnPage, type Performed } from "@/lib/lyre/record";
import { listenMidi, midiSupported } from "@/lib/lyre/midi-in";
import {
  freeStrings, keyLetters, keysOf, LAYOUTS, noteName, stringKeys, stringsFor, type KeyLetters,
  type LyreString, type Tuning,
} from "@/lib/lyre/tuning";
import { prefersReducedMotion, useSettings } from "@/lib/settings";
import { geometry, inkBody, paintRoll, paintStrings, plate, readInks, stringX, type Geom, type NoteLook, type Plate, type Trail } from "./draw";
import { designFor, type Design } from "./instruments";
import Sheet, { SHEET_SIZES, type SheetHandle, type SheetSize } from "./Sheet";
import Icon from "@/components/Icon";
import ShareButton from "@/components/ShareButton";
import PutOnBoard from "@/components/board/PutOnBoard";
import { MAX_PLUCKS, decodeTune, encodeTune, type Pluck, type Tune } from "@/lib/lyre/tune-link";
import styles from "./Lyre.module.css";

type Mode = "listen" | "along";
type View = "roll" | "sheet";
type MidiState = "off" | "asking" | "on" | "denied" | "none";

const KEY_TOUCH = 0.62, KEY_TOUCH_SHIFT = 0.95, TAP_TOUCH = 0.6;
const NO_LABELS: Record<string, string> = {};
const LEAD_BEATS = 6;            // the roll starts this far before the first note, so the notes come down from the top
const HIT_WINDOW = 0.6;          // playing along, a note played this many beats either side of its time counts
const LOOKAHEAD = 0.25;          // seconds of a song handed to the audio clock ahead of time, so no slow frame makes it late

const loaded = new Map<string, Promise<MelodyNotes>>();
function loadNotes(id: string): Promise<MelodyNotes> {
  let p = loaded.get(id);
  if (!p) {
    p = fetch(`/data/melodies/${id}.json`).then((r) => { if (!r.ok) throw new Error(`${r.status}`); return r.json() as Promise<MelodyNotes>; });
    loaded.set(id, p);
    p.catch(() => loaded.delete(id));
  }
  return p;
}

/** The moment now leaving the speakers, on the audio clock. */
function heard(ctx: AudioContext) {
  const ts = ctx.getOutputTimestamp?.();
  if (ts?.contextTime && ts.performanceTime) return ts.contextTime + (performance.now() - ts.performanceTime) / 1000;
  return ctx.currentTime - (ctx.outputLatency || 0) - (ctx.baseLatency || 0);
}

/** Listening: the second of the performance at which a beat of the score falls, and the reverse (the player's rubato
 *  stretches some beats). */
function secondOf(notes: MelodyNote[], perf: Performed[], bps: number, beat: number) {
  const n = notes.length;
  if (!n) return 0;
  if (beat <= notes[0].t) return perf[0].at - (notes[0].t - beat) / bps;
  for (let i = 0; i < n - 1; i++) {
    const a = notes[i], b = notes[i + 1];
    if (beat < b.t) return perf[i].at + ((beat - a.t) / (b.t - a.t)) * (perf[i + 1].at - perf[i].at);
  }
  return perf[n - 1].at + (beat - notes[n - 1].t) / bps;
}
function beatOf(notes: MelodyNote[], perf: Performed[], bps: number, sec: number) {
  const n = notes.length;
  if (!n) return 0;
  if (sec <= perf[0].at) return notes[0].t - (perf[0].at - sec) * bps;
  let lo = 0, hi = n - 1;
  if (sec >= perf[hi].at) return notes[hi].t + (sec - perf[hi].at) * bps;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (perf[m].at <= sec) lo = m; else hi = m; }
  const span = perf[hi].at - perf[lo].at;
  return notes[lo].t + (span > 0 ? (sec - perf[lo].at) / span : 0) * (notes[hi].t - notes[lo].t);
}

interface Live {
  strings: LyreString[]; notes: MelodyNote[] | null; gaps: [number, number][]; bpm: number;
  mode: Mode; playing: boolean; tempo: number; wait: boolean; damping: boolean; view: View; room: number; vol: number;
  beat: number;
  /** listening: the performance, where its second 0 falls on the audio clock, and the next note to hand over */
  perf: Performed[]; t0: number; sched: number;
  /** playing along: the next note due, whether the roll is waiting for it, and what was played */
  next: number; waiting: boolean; hits: Set<number>; missed: Set<number>;
  /** the last note that has sounded (listening) or reached the strings (playing along) */
  shown: number; sylPos: number;
  vib: Map<number, { a: number; t: number }>;
  trails: Trail[];
  held: Map<string, { m: number; trail: Trail }>;
  pedal: boolean; pedalled: Set<number>;
  /** the key of a MIDI keyboard each string answers to, and the key of the computer's keyboard that plays each */
  places: number[]; keys: string[];
  /** the instrument, where it is on the canvas, and its painted layers */
  design: Design; G: Geom | null; plate: Plate | null; laidOut: Design | null; RH: number;
  dirty: boolean; visible: boolean;
}

export default function Lyre({ melodies, first }: { melodies: Melody[]; first: MelodyNotes }) {
  const [song, setSong] = useState<{ meta: Melody; data: MelodyNotes } | null>(() => {
    if (!loaded.has(first.id)) loaded.set(first.id, Promise.resolve(first));
    const meta = melodies.find((m) => m.id === first.id);
    return meta ? { meta, data: first } : null;
  });
  const [picking, setPicking] = useState<string | null>(null);
  const [loadFailed, setLoadFailed] = useState<string | null>(null);
  const [tuning, setTuning] = useState<Tuning>("ancient");
  const notes = song?.data.notes ?? null;
  const strings = useMemo<LyreString[]>(() => (notes ? stringsFor(notes.map((n) => n.m)) : freeStrings(tuning)), [notes, tuning]);
  // the computer's keys play the strings in order from A (tuning.ts); a MIDI keyboard's keys play the strings nearest them
  const keys = useMemo(() => stringKeys(strings.length), [strings.length]);
  const places = useMemo(() => keysOf(strings), [strings]);
  // each song has an instrument of its own, and each tuning of the scale
  const design = useMemo(() => designFor(song?.meta.id ?? `free-${tuning}`, strings.length), [song, tuning, strings.length]);
  const [view, setView] = useState<View>("roll");
  // how large the sheet music is drawn: medium, easy to read, unless the visitor chose otherwise here before (read at
  // once: nothing that depends on it is drawn until the score is asked for)
  const [sheetSize, setSheetSize] = useState<SheetSize>(() => {
    try { const v = localStorage.getItem("lyre-sheet-size"); return v === "small" || v === "large" ? v : "medium"; } catch { return "medium"; }
  });
  const chooseSize = (v: SheetSize) => { setSheetSize(v); try { localStorage.setItem("lyre-sheet-size", v); } catch { /* no storage */ } };
  const [mode, setMode] = useState<Mode>("listen");
  const [playing, setPlaying] = useState(false);
  const [tempo, setTempo] = useState(1);
  const [wait, setWait] = useState(true);
  const [damping, setDamping] = useState(false);
  const [letters, setLetters] = useState<KeyLetters | null>(null);
  const labels = letters?.labels ?? NO_LABELS;
  const [touchOnly, setTouchOnly] = useState(false);
  const [midi, setMidi] = useState<MidiState>("off");
  const [devices, setDevices] = useState<string[]>([]);
  const [result, setResult] = useState<{ hit: number; of: number } | null>(null);
  const [vol, setVol] = useState(0.8);
  const [room, setRoom] = useState(0.5);
  const [rec, setRec] = useState<"idle" | "working" | "failed">("idle");
  // your own playing: being kept now (taking), the last thing kept or a tune opened from a link, and its playing back
  const [taking, setTaking] = useState(false);
  const take = useRef<{ t0: number; plucks: Pluck[] } | null>(null);
  const [tune, setTune] = useState<{ t: Tune; from: "mine" | "link" } | null>(null);
  const [tuneBad, setTuneBad] = useState(false);
  const [replaying, setReplaying] = useState(false);
  const replay = useRef<number[]>([]);
  const [rollH, setRollH] = useState(300);

  const stageRef = useRef<HTMLDivElement>(null);
  const rollRef = useRef<HTMLCanvasElement>(null);
  const lyreRef = useRef<HTMLCanvasElement>(null);
  const sheetRef = useRef<SheetHandle>(null);
  const capHint = useRef<HTMLSpanElement>(null);
  const capGreek = useRef<HTMLSpanElement>(null);
  const capName = useRef<HTMLSpanElement>(null);
  const capNote = useRef<HTMLSpanElement>(null);
  const sylEls = useRef<(HTMLSpanElement | null)[]>([]);
  const bead = useRef<HTMLElement>(null);
  const wanted = useRef<string | null>(first.id);
  const labelsFor = useRef<(string | undefined)[] | null>(null);

  // everything a frame reads lives here, so a frame never waits on React
  const S = useRef<Live>({
    strings, notes, gaps: song?.data.gaps ?? [], bpm: song?.data.bpm ?? 120,
    mode, playing: false, tempo, wait, damping, view, room, vol,
    beat: -LEAD_BEATS, perf: [], t0: 0, sched: 0,
    next: 0, waiting: false, hits: new Set(), missed: new Set(), shown: -1, sylPos: -1,
    vib: new Map(), trails: [], held: new Map(), pedal: false, pedalled: new Set(),
    places, keys,
    design, G: null, plate: null, laidOut: null, RH: 300, dirty: true, visible: true,
  });
  useEffect(() => {
    const st = S.current;
    st.strings = strings; st.notes = notes; st.gaps = song?.data.gaps ?? []; st.bpm = song?.data.bpm ?? 120; st.design = design; st.dirty = true;
  }, [strings, notes, song, design]);
  useEffect(() => { S.current.places = places; S.current.keys = keys; S.current.dirty = true; }, [places, keys]);
  useEffect(() => { S.current.wait = wait; }, [wait]);
  useEffect(() => { S.current.damping = damping; }, [damping]);
  useEffect(() => { S.current.view = view; S.current.dirty = true; }, [view]);

  // ── sound ────────────────────────────────────────────────────────────────────────────────────────────────────────
  /** The page's player (made on the first press, as browsers ask), set as the controls are. */
  const sound = useCallback((): LyrePlayer => {
    const had = playerIfMade(), lp = player(), st = S.current;
    if (!had) { lp.setVolume(st.vol); lp.setRoom(st.room); lp.setStrings(st.strings.map((s) => s.midi)); }
    return lp;
  }, []);
  // Browsers allow sound only after a press, a key or a tap; a tap counts only when the finger lifts, so the first touch
  // of a string may be held until then. The player is made while the page is quiet, so the first note is not delayed
  // by it, and woken at the first of these anywhere on the page (often a click on a song, before any string is played).
  useEffect(() => {
    const wake = () => {
      const ctx = (playerIfMade() ?? sound()).ctx as AudioContext;
      if (ctx.state !== "running" && ctx.state !== "closed") void ctx.resume();
    };
    const evs = ["pointerup", "touchend", "click", "keydown"] as const;
    for (const e of evs) addEventListener(e, wake, { capture: true, passive: true });
    const early = () => { if (!playerIfMade()) sound(); };
    const idle = typeof requestIdleCallback === "function" ? requestIdleCallback(early, { timeout: 4000 }) : setTimeout(early, 1500);
    return () => {
      for (const e of evs) removeEventListener(e, wake, { capture: true });
      if (typeof cancelIdleCallback === "function") cancelIdleCallback(idle as number); else clearTimeout(idle);
    };
  }, [sound]);
  useEffect(() => { S.current.vol = vol; playerIfMade()?.setVolume(vol); }, [vol]);
  useEffect(() => { S.current.room = room; playerIfMade()?.setRoom(room); }, [room]);
  // render the strings in the worker as soon as they are known, before anyone touches them
  useEffect(() => {
    const ms = strings.map((s) => s.midi);
    void bank.prepareHall(48000, 44100);         // the rates nearly every device runs at
    bank.prepare(ms);
    bank.keep(ms);
    playerIfMade()?.setStrings(ms);
  }, [strings]);

  /** The x of a pitch on the roll: its string's lane, or between two strings for a note the lyre has no string for. */
  const laneOf = useCallback((m: number) => {
    const { G, strings: ss } = S.current;
    if (!G || !ss.length) return 0;
    const k = ss.findIndex((s) => s.midi === m);
    if (k >= 0) return G.top[k];
    const sp = ss.length > 1 ? G.top[1] - G.top[0] : 30;
    if (m <= ss[0].midi) return G.top[0] - Math.min(1.5, ss[0].midi - m) * sp * 0.5;
    if (m >= ss[ss.length - 1].midi) return G.top[ss.length - 1] + Math.min(1.5, m - ss[ss.length - 1].midi) * sp * 0.5;
    const j = ss.findIndex((s) => s.midi > m);
    return G.top[j - 1] + ((m - ss[j - 1].midi) / (ss[j].midi - ss[j - 1].midi)) * (G.top[j] - G.top[j - 1]);
  }, []);

  const caption = useCallback((i: number, m: number) => {
    const s = i >= 0 ? S.current.strings[i] : null;
    if (capHint.current) capHint.current.hidden = true;
    if (capGreek.current) capGreek.current.textContent = s?.greek ?? "";
    if (capName.current) capName.current.textContent = s?.name ? `${s?.greek ? " · " : ""}${s.name}` : "";
    if (capNote.current) capNote.current.textContent = `${s?.name || s?.greek ? " · " : ""}${noteName(m)}`;
  }, []);

  /** The words: the syllable now sung is lit, those before it dimmed (straight on the elements, not through React). */
  const sylTo = useCallback((noteIdx: number) => {
    const st = S.current, els = sylEls.current, ns = st.notes;
    if (!ns) return;
    let p = -1;
    for (let k = 0, q = -1; k <= noteIdx && k < ns.length; k++) if (ns[k].syl) { q++; p = q; }
    if (p === st.sylPos) return;
    if (p < st.sylPos) { for (const e of els) e?.classList.remove(styles.sylNow, styles.sylPast); st.sylPos = -1; }
    for (let q = Math.max(0, st.sylPos); q < p; q++) { els[q]?.classList.remove(styles.sylNow); els[q]?.classList.add(styles.sylPast); }
    if (p >= 0) els[p]?.classList.add(styles.sylNow);
    // the red mark goes to the syllable now sung
    const b = bead.current, e = p >= 0 ? els[p] : null;
    if (b) {
      if (!e) b.classList.remove(styles.beadOn);
      else {
        const x = e.offsetLeft + e.offsetWidth / 2 - (/-$/.test(ns.filter((n) => n.syl)[p]?.syl ?? "") ? 0 : 2), y = e.offsetTop + e.offsetHeight - 4;
        const jump = !b.classList.contains(styles.beadOn) || Math.abs(y - (+b.dataset.y! || 0)) > 4;
        if (jump) b.style.transition = "opacity var(--dur) ease";
        b.style.transform = `translate(${x}px, ${y}px)`;
        b.dataset.y = String(y);
        if (jump) { void b.offsetWidth; b.style.transition = ""; }
        b.classList.add(styles.beadOn);
      }
    }
    st.sylPos = p;
  }, []);

  /** A note of the song has sounded (listening) or reached the strings (playing along). */
  const reached = useCallback((i: number) => {
    const st = S.current, n = st.notes?.[i];
    if (!n) return;
    sheetRef.current?.light(i);
    sylTo(i);
    if (st.mode === "listen") {
      const k = st.strings.findIndex((s) => s.midi === n.m);
      const p = st.perf[i];
      if (k >= 0) st.vib.set(k, { a: 0.3 + 0.7 * (p?.strength ?? 0.6), t: performance.now() });
      caption(k, n.m);
    }
  }, [caption, sylTo]);

  /** Playing along: does a string just played match a note that is due? */
  const check = useCallback((m: number) => {
    const st = S.current, ns = st.notes;
    if (!ns) return;
    for (let i = Math.max(0, st.next - 4); i < ns.length; i++) {
      const n = ns[i];
      if (n.t > st.beat + HIT_WINDOW) break;
      if (st.hits.has(i) || st.missed.has(i) || n.m !== m) continue;
      if (Math.abs(n.t - st.beat) <= HIT_WINDOW || (st.waiting && i === st.next)) {
        st.hits.add(i);
        if (st.waiting && i === st.next) st.waiting = false;
        break;
      }
    }
  }, []);

  /** A string plucked by a person: its sound, its sway, a rising trail, and the play-along check. `i` is the string
   *  (-1 for a MIDI key the lyre has no string for); `holder` is what holds it down (a key, a finger), if anything. */
  const pluck = useCallback((i: number, m: number, s: number, holder: string | null) => {
    const st = S.current, n = st.strings.length;
    sound().pluck(m, s, { pan: i >= 0 && n > 1 ? (i / (n - 1) - 0.5) * 0.5 : 0 });
    const now = performance.now();
    const k = take.current;
    if (k && k.plucks.length < MAX_PLUCKS) { if (!k.plucks.length) k.t0 = now; k.plucks.push({ t: Math.round(now - k.t0), m, s: Math.round(s * 100) / 100 }); }
    if (i >= 0) st.vib.set(i, { a: 0.35 + 0.65 * s, t: now });
    const trail: Trail = { x: i >= 0 && st.G ? st.G.top[i] : laneOf(m), start: now, end: holder ? null : now + 140, s };
    st.trails.push(trail);
    if (st.trails.length > 160) st.trails.splice(0, st.trails.length - 160);
    if (holder) {
      const old = st.held.get(holder);
      if (old && old.trail.end === null) old.trail.end = now;
      st.held.set(holder, { m, trail });
    }
    st.dirty = true;
    caption(i, m);
    if (st.mode === "along" && st.playing) check(m);
  }, [caption, check, laneOf, sound]);

  const release = useCallback((holder: string) => {
    const st = S.current, h = st.held.get(holder);
    if (!h) return;
    st.held.delete(holder);
    if (h.trail.end === null) h.trail.end = performance.now();
    if (st.damping) { if (st.pedal) st.pedalled.add(h.m); else playerIfMade()?.damp(h.m, 0.3); }
    st.dirty = true;
  }, []);

  // the computer keyboard
  useEffect(() => {
    let saved = "auto";
    try { saved = localStorage.getItem("lyre-keyboard") ?? "auto"; } catch { /* no storage */ }
    void keyLetters(saved).then(setLetters);
    const mq = matchMedia("(hover: none) and (pointer: coarse)");
    const touch = () => setTouchOnly(mq.matches);
    touch();
    mq.addEventListener("change", touch);
    const typing = (t: EventTarget | null) => {
      const e = t as HTMLElement | null;
      return !!e && (/^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName) || e.isContentEditable);
    };
    const down = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || typing(e.target)) return;
      const st = S.current, i = st.keys.indexOf(e.code);
      if (i < 0) return;
      e.preventDefault();
      pluck(i, st.strings[i].midi, e.shiftKey ? KEY_TOUCH_SHIFT : KEY_TOUCH, e.code);
    };
    const up = (e: KeyboardEvent) => { if (S.current.held.has(e.code)) release(e.code); };
    addEventListener("keydown", down);
    addEventListener("keyup", up);
    return () => { removeEventListener("keydown", down); removeEventListener("keyup", up); mq.removeEventListener("change", touch); };
  }, [pluck, release]);

  // a MIDI keyboard, once the visitor asks for it: each key plays its string (as on the computer keyboard), or its own
  // pitch where the lyre has no string for it
  const stopMidi = useRef<(() => void) | null>(null);
  const connectMidi = useCallback(async () => {
    if (!midiSupported()) { setMidi("none"); return; }
    sound();
    setMidi("asking");
    try {
      stopMidi.current = await listenMidi({
        on: (note, v) => {
          const st = S.current, i = st.places.indexOf(note);
          pluck(i, i >= 0 ? st.strings[i].midi : note, Math.max(0.04, v / 127), `midi${note}`);
        },
        off: (note) => release(`midi${note}`),
        pedal: (d) => {
          const st = S.current;
          st.pedal = d;
          if (!d) {
            const held = new Set([...st.held.values()].map((h) => h.m));
            for (const m of st.pedalled) if (!held.has(m)) playerIfMade()?.damp(m, 0.3);
            st.pedalled.clear();
          }
        },
        devices: setDevices,
      });
      setMidi("on");
    } catch { setMidi("denied"); }
  }, [pluck, release, sound]);
  useEffect(() => () => { stopMidi.current?.(); playerIfMade()?.dampAll(); }, []);

  // ── the song ────────────────────────────────────────────────────────────────────────────────────────────────────
  const halt = useCallback(() => {
    const st = S.current;
    if (st.playing && st.mode === "listen") playerIfMade()?.dampAll(0.35);
    st.playing = false; st.waiting = false; st.dirty = true;
    setPlaying(false);
  }, []);

  const reset = useCallback(() => {
    halt();
    const st = S.current;
    st.beat = -LEAD_BEATS; st.next = 0; st.hits = new Set(); st.missed = new Set(); st.shown = -1;
    sheetRef.current?.light(-1);
    for (const e of sylEls.current) e?.classList.remove(styles.sylNow, styles.sylPast);
    bead.current?.classList.remove(styles.beadOn);
    st.sylPos = -1;
    setResult(null);
  }, [halt]);
  useEffect(() => () => { S.current.playing = false; }, []);

  const choose = (id: string | null) => {
    wanted.current = id;
    setLoadFailed(null);
    if (!id) { reset(); setPicking(null); setSong(null); return; }
    const meta = melodies.find((m) => m.id === id);
    if (!meta || meta.id === song?.meta.id) return;
    setPicking(id);
    loadNotes(id).then(
      (data) => { if (wanted.current !== id) return; reset(); setPicking(null); setSong({ meta, data }); },
      () => { if (wanted.current !== id) return; setPicking(null); setLoadFailed(id); },
    );
  };

  /** Listening: perform the notes from the current beat, the performance's clock set so the roll does not jump. */
  const perform0 = useCallback(() => {
    const st = S.current, ns = st.notes;
    if (!ns) return;
    const ctx = sound().ctx as AudioContext;
    const bps = (st.bpm / 60) * st.tempo;
    st.perf = perform(ns, { tempo: st.tempo, bpm: st.bpm });
    st.t0 = heard(ctx) - secondOf(ns, st.perf, bps, st.beat);
  }, [sound]);

  const start = (m: Mode) => {
    const st = S.current;
    if (!st.notes) return;
    if (st.playing && st.mode === m) { halt(); return; }
    if (st.playing) halt();
    sound();
    const ended = st.beat > (st.notes.at(-1)?.t ?? 0) + (st.notes.at(-1)?.d ?? 0);
    if (ended || st.mode !== m) reset();
    st.mode = m; setMode(m);
    setResult(null);
    if (m === "listen") {
      perform0();
      const k = st.notes.findIndex((n) => n.t >= st.beat - 1e-6);
      st.sched = k < 0 ? st.notes.length : k;
    }
    st.playing = true; st.dirty = true;
    setPlaying(true);
  };

  // a new speed while listening: the notes not yet handed over follow it, from where the roll is
  useEffect(() => {
    const st = S.current;
    st.tempo = tempo;
    if (st.playing && st.mode === "listen") perform0();
  }, [tempo, perform0]);

  // a hidden tab stops listening (the browser stops the frames that hand over the notes)
  useEffect(() => {
    const vis = () => { if (document.hidden && S.current.playing) halt(); };
    document.addEventListener("visibilitychange", vis);
    return () => document.removeEventListener("visibilitychange", vis);
  }, [halt]);

  // ── the frames ──────────────────────────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const roll = rollRef.current!, lyre = lyreRef.current!, stage = stageRef.current!;
    const st = S.current;
    const body = document.createElement("canvas"), bodyG = body.getContext("2d")!;
    const face = getComputedStyle(document.documentElement).getPropertyValue("--f-greek").trim() || "serif";
    let inked = false, W = 0, LH = 0, dpr = 1;
    // the page's inks, read again whenever Paper or Night changes (chosen in Settings, or by the device)
    let inks = readInks();
    const reink = () => { inks = readInks(); st.dirty = true; };
    const themed = new MutationObserver(reink);
    themed.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const dark = matchMedia("(prefers-color-scheme: dark)");
    dark.addEventListener("change", reink);

    const layout = () => {
      if (!W) return;
      st.G = geometry(W, LH, st.design);
      st.plate = plate(st.G, dpr);
      st.laidOut = st.design;
      bodyG.clearRect(0, 0, W, LH);
      inked = false;
      st.vib.clear();
      st.dirty = true;
    };
    const measure = () => {
      W = stage.clientWidth;
      // the instrument is drawn at its own proportions, as large as this height allows
      const narrow = W < 560;
      const RH = narrow ? 220 : Math.round(Math.max(230, Math.min(320, W * 0.3)));
      LH = narrow ? Math.round(Math.min(W * 0.98, 360)) : Math.round(Math.max(340, Math.min(420, W * 0.4)));
      dpr = Math.min(2, devicePixelRatio || 1);
      for (const [cv, h] of [[roll, RH], [lyre, LH], [body, LH]] as const) {
        cv.width = Math.round(W * dpr); cv.height = Math.round(h * dpr);
        if (cv !== body) cv.style.height = `${h}px`;
        cv.getContext("2d")!.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      st.RH = RH;
      setRollH(RH);
      layout();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    const io = new IntersectionObserver(([e]) => { st.visible = e.isIntersecting; st.dirty = true; });
    io.observe(stage);

    const finish = () => {
      const ns = st.notes!;
      st.playing = false; st.waiting = false;
      setPlaying(false);
      if (st.mode === "along") setResult({ hit: st.hits.size, of: ns.length });
    };

    /** The song's clock. */
    const advance = (dt: number) => {
      const ns = st.notes;
      if (!ns?.length) return;
      const bps = (st.bpm / 60) * st.tempo;
      const last = ns[ns.length - 1];
      if (st.mode === "listen") {
        const lp = playerIfMade();
        if (!lp) return;
        const ctx = lp.ctx as AudioContext;
        // hand the next notes to the audio clock
        const horizon = ctx.currentTime + LOOKAHEAD;
        while (st.sched < st.perf.length && st.t0 + st.perf[st.sched].at < horizon) {
          const p = st.perf[st.sched++];
          lp.pluck(p.midi, p.strength, { when: st.t0 + p.at, pan: p.pan });
          lp.damp(p.midi, p.damp, st.t0 + p.until);
        }
        // and follow what is heard
        const sec = heard(ctx) - st.t0;
        st.beat = beatOf(ns, st.perf, bps, sec);
        while (st.shown + 1 < ns.length && st.perf[st.shown + 1].at <= sec) reached(++st.shown);
        if (sec > st.perf[ns.length - 1].at + last.d / bps + 1.4) finish();
      } else {
        let nb = st.beat + dt * bps;
        while (st.next < ns.length && (st.hits.has(st.next) || st.missed.has(st.next))) st.next++;
        if (st.wait && st.next < ns.length && nb >= ns[st.next].t) { nb = ns[st.next].t; st.waiting = true; }
        if (!st.wait) for (let i = st.next; i < ns.length && ns[i].t < nb - HIT_WINDOW; i++) if (!st.hits.has(i)) st.missed.add(i);
        st.beat = nb;
        while (st.shown + 1 < ns.length && ns[st.shown + 1].t <= nb + 1e-6) reached(++st.shown);
        if (nb > last.t + last.d + 2) finish();
      }
    };

    const look = (i: number): NoteLook => {
      const ns = st.notes!, n = ns[i];
      if (n.t + n.d < st.beat - 1) return "past";
      if (st.mode === "along") {
        if (st.hits.has(i)) return "hit";
        if (st.missed.has(i)) return "missed";
        if (st.waiting && i === st.next) return "due";
        return "coming";
      }
      return i <= st.shown && st.playing ? "sounding" : "coming";
    };

    let raf = 0, prev = performance.now();
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const now = performance.now(), dt = Math.min(0.1, (now - prev) / 1000);
      prev = now;
      if (st.playing) advance(dt);
      if (st.laidOut !== st.design) layout();
      const G = st.G;
      if (!st.visible || !G) return;
      // the instrument, copied once for each new layout
      const fresh = !inked && !!st.plate;
      if (fresh) { inkBody(bodyG, st.plate!); inked = true; }
      // let go of what has faded
      st.trails = st.trails.filter((t) => t.end === null || now - t.end < ((st.RH + 40) / 64) * 1000);
      const moving = st.playing || st.vib.size > 0 || st.trails.length > 0;
      if (!moving && !st.dirty && !fresh) return;
      st.dirty = false;
      const still = prefersReducedMotion(useSettings.getState().motion);
      const vib = (i: number) => {
        const v = st.vib.get(i);
        if (!v) return { amp: 0, glow: 0 };
        const age = (now - v.t) / 1000, env = v.a * Math.exp(-age / 0.85);
        if (env < 0.02) { st.vib.delete(i); return { amp: 0, glow: 0 }; }
        return { amp: still ? 0 : env * 3 * Math.sin(age * Math.PI * 2 * 6.5), glow: env };
      };
      if (st.view === "roll" || !st.notes) {
        const g = roll.getContext("2d")!;
        paintRoll(g, {
          W: G.W, H: st.RH, lanes: G.top, laneGlow: (i) => vib(i).glow, notes: st.notes, gaps: st.gaps, beat: st.beat,
          laneOf, look, trails: st.trails, now, face, inks,
          hint: st.notes ? null : "Play a string: what you play rises here.",
        });
      }
      const g = lyre.getContext("2d")!;
      g.clearRect(0, 0, G.W, G.H);
      g.drawImage(body, 0, 0, G.W, G.H);
      paintStrings(g, G, vib, labelsFor.current, face, inks);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); themed.disconnect(); dark.removeEventListener("change", reink);
    };
  }, [laneOf, reached]);

  // the key labels drawn above the strings (none on a touch screen)
  useEffect(() => {
    labelsFor.current = touchOnly ? null : keys.map((c) => labels[c]);
    S.current.dirty = true;
  }, [labels, keys, touchOnly]);

  // ── fingers and the mouse on the lyre ────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const cv = lyreRef.current!;
    const st = S.current;
    const ptrs = new Map<number, { x: number; y: number; t: number }>();
    const local = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const stringAt = (x: number, y: number) => {
      const G = st.G;
      if (!G || y > G.yTail + 14) return -1;
      let best = -1, bd = 1e9;
      for (let i = 0; i < G.n; i++) { const d = Math.abs(stringX(G, i, y) - x); if (d < bd) { bd = d; best = i; } }
      const sp = G.n > 1 ? Math.abs(stringX(G, 1, y) - stringX(G, 0, y)) : 40;
      return bd <= Math.max(10, sp * 0.5 + 0.5) ? best : -1;      // no gap between strings that plucks nothing
    };
    const down = (e: PointerEvent) => {
      const p = local(e), i = stringAt(p.x, p.y);
      ptrs.set(e.pointerId, { ...p, t: performance.now() });
      if (i >= 0) pluck(i, st.strings[i].midi, TAP_TOUCH, `p${e.pointerId}`);
      else sound();
    };
    const move = (e: PointerEvent) => {
      const q = ptrs.get(e.pointerId), G = st.G;
      if (!q || !G) return;
      const p = local(e), t = performance.now();
      // a sweep plucks every string it crosses, harder the faster it goes
      const speed = Math.abs(p.x - q.x) / Math.max(1, t - q.t);       // px per ms
      const s = Math.max(0.28, Math.min(1, 0.22 + speed * 0.5));
      const y = (q.y + p.y) / 2;
      for (let i = 0; i < G.n; i++) {
        const sx = stringX(G, i, y);
        if ((q.x < sx && p.x >= sx) || (q.x > sx && p.x <= sx)) pluck(i, st.strings[i].midi, s, null);
      }
      q.x = p.x; q.y = p.y; q.t = t;
    };
    const up = (e: PointerEvent) => { ptrs.delete(e.pointerId); release(`p${e.pointerId}`); };
    cv.addEventListener("pointerdown", down);
    cv.addEventListener("pointermove", move);
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", up);
    cv.addEventListener("pointerleave", up);
    return () => {
      cv.removeEventListener("pointerdown", down); cv.removeEventListener("pointermove", move);
      cv.removeEventListener("pointerup", up); cv.removeEventListener("pointercancel", up); cv.removeEventListener("pointerleave", up);
    };
  }, [pluck, release, sound]);

  // ── a recording ─────────────────────────────────────────────────────────────────────────────────────────────────
  const save = async () => {
    if (!song || rec === "working") return;
    setRec("working");
    try {
      const blob = await recordOnPage(song.data.notes, { tempo, bpm: song.data.bpm, room });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${song.meta.id}-lyre.wav`;
      document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      setRec("idle");
    } catch { setRec("failed"); }
  };

  // ── your own playing ────────────────────────────────────────────────────────────────────────────────────────────
  const stopReplay = () => { for (const h of replay.current) clearTimeout(h); replay.current = []; setReplaying(false); };
  useEffect(() => () => { for (const h of replay.current) clearTimeout(h); }, []);
  const startTake = () => { stopReplay(); take.current = { t0: 0, plucks: [] }; setTaking(true); setTune(null); setTuneBad(false); };
  const stopTake = () => {
    const k = take.current;
    take.current = null; setTaking(false);
    if (k?.plucks.length) setTune({ t: { song: song?.meta.id ?? null, tuning, plucks: k.plucks }, from: "mine" });
  };
  /** the tune played back on the strings it was played on, each pluck at its time and as hard as it was made */
  const playTune = () => {
    if (!tune) return;
    if (replaying) { stopReplay(); return; }
    sound();
    const ps = tune.t.plucks;
    replay.current = ps.map((p) => window.setTimeout(() => pluck(S.current.strings.findIndex((x) => x.midi === p.m), p.m, p.s, null), 300 + p.t));
    replay.current.push(window.setTimeout(stopReplay, 300 + (ps.at(-1)?.t ?? 0) + 1200));
    setReplaying(true);
  };
  const shareTune = async () => {
    if (!tune) return null;
    const on = tune.t.song ? melodies.find((m) => m.id === tune.t.song)?.title : null;
    return { title: on ? `A tune I played on the lyre of ${on}` : "A tune I played on the lyre", url: `${location.origin}/stoa/lyre#tune=${await encodeTune(tune.t)}` };
  };
  // the tune put on the Painted Stoa's board (components/board/PutOnBoard.tsx), as its link; the melody's name suggests a title
  const boardTune = async () => {
    if (!tune) return null;
    const on = tune.t.song ? melodies.find((m) => m.id === tune.t.song)?.title : null;
    return { kind: "tune" as const, title: on ? `On the lyre of ${on}` : "", link: `/stoa/lyre#tune=${await encodeTune(tune.t)}` };
  };
  // a tune opened from a link: the lyre it was played on is set out, ready to play it
  useEffect(() => {
    const read = () => {
      if (!location.hash.startsWith("#tune=")) return;
      void decodeTune(location.hash.slice(6)).then((t) => {
        if (!t) { setTuneBad(true); return; }
        setTuneBad(false);
        if (t.song && melodies.some((m) => m.id === t.song)) choose(t.song);
        else { choose(null); setTuning(t.tuning); }
        setTune({ t, from: "link" });
      });
    };
    read();
    addEventListener("hashchange", read);
    return () => removeEventListener("hashchange", read);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- read once, and again only when the address's # changes
  }, []);

  const onSheetNote = useCallback((i: number) => {
    const st = S.current, n = st.notes?.[i];
    if (!n) return;
    pluck(st.strings.findIndex((s) => s.midi === n.m), n.m, TAP_TOUCH, null);
  }, [pluck]);

  // ── the page ────────────────────────────────────────────────────────────────────────────────────────────────────
  const syllables = useMemo(() => (notes ? notes.map((n, i) => ({ n, i })).filter((x) => x.n.syl) : []), [notes]);
  const key = (c: string) => labels[c] ?? c.replace("Key", "");
  const chooseKeyboard = (v: string) => {
    try { if (v === "auto") localStorage.removeItem("lyre-keyboard"); else localStorage.setItem("lyre-keyboard", v); } catch { /* no storage */ }
    void keyLetters(v).then(setLetters);
  };
  const keyHint = touchOnly
    ? "Touch a string, or sweep a finger across them."
    : `Your keyboard plays the strings in order: ${key(keys[0])} is the lowest, then ${keys.slice(1, 4).map(key).join(" ")} and so on`
      + (keys.length > 11 ? `; the higher strings go on to the row above, from ${key(keys[Math.ceil(keys.length / 2)])}` : "")
      + `. The letter for each string is above it (Shift plucks harder). Or click the strings, or sweep across them with the mouse held down.`;
  const showing = picking ?? song?.meta.id ?? null;

  return (
    <div className={styles.lyre}>
      <div className={styles.songs} role="radiogroup" aria-label="What to play">
        <button type="button" role="radio" aria-checked={showing === null} className={styles.song} onClick={() => choose(null)}>
          <span className="label">Free play</span>
          <span className={styles.songTitle}>The two-octave scale</span>
          <span className={styles.songGreek} lang="grc">σύστημα τέλειον μεῖζον</span>
        </button>
        {melodies.map((m) => (
          <button key={m.id} type="button" role="radio" aria-checked={showing === m.id} aria-busy={picking === m.id || undefined}
            className={styles.song} onClick={() => choose(m.id)}>
            <span className="label">{m.date}</span>
            <span className={styles.songTitle}>{m.title}</span>
            {m.greek && <span className={styles.songGreek} lang="grc">{m.greek}</span>}
          </button>
        ))}
      </div>
      {loadFailed && <p className="muted" role="status">That melody could not be loaded. Check the connection and try again.</p>}

      <div className={styles.controls}>
        {song ? (
          <>
            <button type="button" className={`btn small${playing && mode === "listen" ? "" : " ghost"}`} onClick={() => start("listen")}>
              <Icon name={playing && mode === "listen" ? "pause" : "play"} />{playing && mode === "listen" ? "Pause" : "Listen"}
            </button>
            <button type="button" className={`btn small${playing && mode === "along" ? "" : " ghost"}`} onClick={() => start("along")}>
              <Icon name={playing && mode === "along" ? "pause" : "music"} />{playing && mode === "along" ? "Pause" : "Play along"}
            </button>
            <button type="button" className="btn small ghost" onClick={reset}><Icon name="again" />From the start</button>
            <div className="segmented" role="radiogroup" aria-label="Speed">
              {[0.5, 0.75, 1].map((t) => (
                <button key={t} type="button" role="radio" aria-checked={tempo === t} onClick={() => setTempo(t)}>{t === 1 ? "As written" : `${t * 100}%`}</button>
              ))}
            </div>
            {mode === "along" && (
              <button type="button" className="chip" aria-pressed={wait} onClick={() => setWait(!wait)}><span className="dot" />Wait for me</button>
            )}
            {view === "sheet" && (
              <div className={`segmented ${styles.viewSwitch}`} role="radiogroup" aria-label="Size of the sheet music">
                {SHEET_SIZES.map(([v, label]) => (
                  <button key={v} type="button" role="radio" aria-checked={sheetSize === v} onClick={() => chooseSize(v)}>{label}</button>
                ))}
              </div>
            )}
            <div className={`segmented${view === "sheet" ? "" : ` ${styles.viewSwitch}`}`} role="radiogroup" aria-label="Show the melody as">
              <button type="button" role="radio" aria-checked={view === "roll"} onClick={() => setView("roll")}>Play-along roll</button>
              <button type="button" role="radio" aria-checked={view === "sheet"} onClick={() => setView("sheet")}>Sheet music</button>
            </div>
          </>
        ) : (
          <>
            <div className="segmented" role="radiogroup" aria-label="Tuning">
              <button type="button" role="radio" aria-checked={tuning === "ancient"} onClick={() => setTuning("ancient")}>Ancient tuning</button>
              <button type="button" role="radio" aria-checked={tuning === "modern"} onClick={() => setTuning("modern")}>Modern tuning</button>
            </div>
            <span className="faint">
              {tuning === "ancient"
                ? "Pythagorean: whole tones of 9 to 8, and small semitones."
                : "Equal temperament, as on a piano."}
            </span>
          </>
        )}
      </div>

      <div ref={stageRef} className={styles.stage}>
        <canvas ref={rollRef} className={song && view === "sheet" ? styles.away : styles.roll} aria-hidden="true" />
        {song && view === "sheet" && (
          <Sheet ref={sheetRef} melody={song.meta} notes={song.data.notes} bpm={song.data.bpm} onNote={onSheetNote} height={rollH} size={sheetSize} />
        )}
        <canvas ref={lyreRef} className={styles.instrument} role="img"
          aria-label={`A lyre with ${strings.length} strings (a ${design.name}). ${keyHint} A MIDI keyboard can play it too.`} />
      </div>

      <p className={styles.now}>
        <span ref={capHint} className="faint">{keyHint}</span>
        <span ref={capGreek} lang="grc" className={styles.nowGreek} />
        <span ref={capName} />
        <span ref={capNote} className="faint" />
      </p>

      {/* your own playing: record it, play it back, share it (a tune from a link waits here to be played) */}
      <div className={styles.save}>
        {taking ? (
          <>
            <button type="button" className="btn small" onClick={stopTake}><Icon name="stop" />Stop</button>
            <span className="faint" role="status">Recording what you play. Press Stop when you have finished.</span>
          </>
        ) : tune ? (
          <>
            <button type="button" className={`btn small${tune.from === "link" && !replaying ? "" : " ghost"}`} onClick={playTune}>
              <Icon name={replaying ? "stop" : "play"} />{replaying ? "Stop" : tune.from === "link" ? "Play it" : "Play it back"}
            </button>
            {tune.from === "mine" && <ShareButton what={shareTune} />}
            {tune.from === "mine" && <PutOnBoard what={boardTune} />}
            <button type="button" className="btn small ghost" onClick={startTake}><Icon name="record" />{tune.from === "link" ? "Record your own" : "Record again"}</button>
            <span className="faint">
              {tune.from === "link"
                ? "A tune someone played on this lyre and shared with you."
                : `Your tune: ${tune.t.plucks.length} ${tune.t.plucks.length === 1 ? "note" : "notes"}, ${Math.max(1, Math.round((tune.t.plucks.at(-1)?.t ?? 0) / 1000))} s. It is not kept: share it or put it on the board, or it goes when you leave.`}
            </span>
          </>
        ) : (
          <>
            <button type="button" className="btn small ghost" onClick={startTake}><Icon name="record" />Record what you play</button>
            <span className="faint">{tuneBad ? "That link to a tune is damaged or cut short." : "Then play it back, or share it as a link that plays it for anyone."}</span>
          </>
        )}
      </div>

      <p className={styles.instrumentNote}>
        The instrument: a {design.name} (<span lang="grc" className={styles.nowGreek}>{design.greek}</span>), {design.about}
      </p>

      {result && (
        <p className={styles.result} role="status">
          You played {result.hit} of the {result.of} notes{result.hit === result.of ? ", every one." : "."}
        </p>
      )}

      {song && syllables.length > 0 && (
        <p className={styles.sung} lang="grc" aria-label="The words, as sung">
          {syllables.map(({ n, i }, k) => (
            <span key={i} ref={(el) => { sylEls.current[k] = el; }}>
              {n.syl!.replace(/-$/, "")}{/-$/.test(n.syl!) || k === syllables.length - 1 ? "" : " "}
            </span>
          ))}
          <i ref={bead} className={styles.bead} aria-hidden="true" />
        </p>
      )}

      <div className={styles.settings}>
        <div className={styles.midi}>
          {midi === "on" ? (
            <p className="muted">{devices.length ? `MIDI keyboard: ${devices.join(", ")}. Play harder for a louder, brighter string.` : "Listening for a MIDI keyboard: plug one in and it is found at once."}</p>
          ) : midi === "none" ? (
            <p className="muted">This browser cannot hear a MIDI keyboard. Chrome, Edge, Opera and Firefox can.</p>
          ) : midi === "denied" ? (
            <p className="muted">The browser was not allowed to use MIDI. You can allow it in the site settings beside the address bar, then try again.</p>
          ) : (
            <button type="button" className="btn small ghost" onClick={connectMidi} disabled={midi === "asking"}><Icon name="keyboard" />Use a MIDI keyboard</button>
          )}
          <button type="button" className="chip" aria-pressed={damping} onClick={() => setDamping(!damping)}
            title="Off: strings ring on after you let go, as on a real lyre. On: letting go of a key stops its string (the sustain pedal holds it).">
            <span className="dot" />Stop strings when a key is let go
          </button>
        </div>
        <div className={styles.sliders}>
          <label className={styles.vol}>
            <span className="label">Loudness</span>
            <input type="range" min={0} max={1} step={0.05} value={vol} onChange={(e) => setVol(+e.target.value)} />
          </label>
          <label className={styles.vol}>
            <span className="label">Hall</span>
            <input type="range" min={0} max={1} step={0.05} value={room} onChange={(e) => setRoom(+e.target.value)} />
          </label>
          {!touchOnly && (
            <label className={styles.vol}>
              <span className="label">Keyboard</span>
              <select className={styles.layout} aria-label="Keyboard layout" value={letters?.from === "choice" ? letters.layout.id : "auto"}
                onChange={(e) => chooseKeyboard(e.target.value)}
                title={letters?.from === "keyboard" ? "The letters are read from your keyboard."
                  : letters?.from === "language" ? "The letters are those of your browser's language. Choose another layout if your keys show different ones." : undefined}>
                <option value="auto">
                  {letters?.from === "keyboard" ? "Automatic: as on your keyboard"
                    : letters?.from === "language" ? `Automatic: ${letters.layout.name}` : "Automatic"}
                </option>
                {LAYOUTS.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </label>
          )}
        </div>
      </div>

      {song && (
        <div className={styles.save}>
          <button type="button" className="btn small ghost" onClick={save} disabled={rec === "working"}>
            <Icon name="download" />{rec === "working" ? "Recording…" : "Save a recording"}
          </button>
          <span className="faint">
            {rec === "failed"
              ? "The recording could not be made in this browser."
              : "The melody as the lyre plays it, at the speed chosen above, as a CD-quality WAV file."}
          </span>
        </div>
      )}

      {song && <SongNotes song={song.meta} />}
    </div>
  );
}

function SongNotes({ song }: { song: Melody }) {
  return (
    <section className={styles.about} aria-labelledby="song-about">
      <div className={styles.aboutText}>
        <h2 id="song-about">{song.title}</h2>
        <p className="label">{song.document} · {song.date}</p>
        {song.about.map((p, i) => <p key={i}>{p}</p>)}
      </div>
      {song.words && (
        <div className={styles.words}>
          {song.words.map((w, i) => (
            <p key={i}><span lang="grc" className={styles.wordsGrc}>{w.grc}</span><span className={styles.wordsEn}>{w.en}</span></p>
          ))}
          {song.translation && <p className="faint">{song.translation}</p>}
        </div>
      )}
      <p className="faint">{song.credit}</p>
    </section>
  );
}
