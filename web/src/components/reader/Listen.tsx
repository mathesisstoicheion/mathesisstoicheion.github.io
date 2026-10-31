"use client";
/**
 * Listen: the page's English translation read aloud by the device's own voice, passage by passage, the
 * passage being read marked and the word being spoken lit, the page following along and going on to the
 * next page at the end. Only the English is read (the owner's decision, 2026-10-02: no voice speaks
 * Ancient Greek as it sounded, and a modern Greek voice would mislead). Free, and on most devices offline.
 * With the Greek alone (no English column) the passage being read opens its English under its Greek while it is read, and that is
 * what is read and marked; it closes again when Listen moves on, unless the reader had opened it (the quiet desk, the reader's tools,
 * the owner, 2026-10-30).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import type { Row } from "@/lib/tei/align";
import { englishVoices, pieces, speakable, wordAt, type Speakable } from "@/lib/listen";
import { prefersReducedMotion, useSettings } from "@/lib/settings";
import Icon from "@/components/Icon";
import styles from "./Listen.module.css";

const PREFS = "mathesis:listen";
const RATES = [0.8, 1, 1.2, 1.5];
const HL = "listen-word";

type Status = "idle" | "playing" | "paused";
interface Prefs { voice?: string; rate?: number }
const readPrefs = (): Prefs => { try { return JSON.parse(localStorage.getItem(PREFS) || "{}"); } catch { return {}; } };
const writePrefs = (p: Prefs) => { try { localStorage.setItem(PREFS, JSON.stringify({ ...readPrefs(), ...p })); } catch { /* not kept */ } };

type Highlights = { set: (n: string, h: unknown) => void; delete: (n: string) => void };
const registry = () => (typeof CSS !== "undefined" ? (CSS as unknown as { highlights?: Highlights }).highlights : undefined);
const HighlightCtor = () => (globalThis as unknown as { Highlight?: new (...r: Range[]) => unknown }).Highlight;

export default function Listen({ rows, root, startKey, title, onNextPage, onClose, alone = false, onShowEnglish }: {
  rows: Row[];
  /** the reader pane, to find each passage on the page */
  root: () => ParentNode;
  /** the passage at the top of the screen when Listen opens: reading starts there */
  startKey: string | null;
  title: string;
  /** go on to the next page at the end of this one (null on the last page) */
  onNextPage: (() => void) | null;
  onClose: () => void;
  /** the Greek stands alone: the English column is not on the page, so the passage being read opens its own English under its Greek */
  alone?: boolean;
  /** asks the reader to open the English of the passage with this key (null: Listen has none open now); the reader keeps what it opened itself */
  onShowEnglish?: (key: string | null) => void;
}) {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
  const [status, setStatus] = useState<Status>("idle");
  const [rowIdx, setRowIdx] = useState(() => Math.max(0, rows.findIndex((r) => r.key === startKey)));
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = useState<string | undefined>(() => readPrefs().voice);
  const [rate, setRate] = useState<number>(() => readPrefs().rate ?? 1);
  const motion = useSettings((s) => s.motion);

  // where reading is: the row, the piece of its text, and a counter that silences callbacks of speech we stopped
  const pos = useRef({ row: rowIdx, piece: 0 });
  const gen = useRef(0);
  const current = useRef<{ el: HTMLElement; sp: Speakable; ps: [number, number][] } | null>(null);
  const continuing = useRef(false);
  const wake = useRef<{ release: () => Promise<void> } | null>(null);
  const rowsRef = useRef(rows);
  useEffect(() => { rowsRef.current = rows; }, [rows]);
  const aloneRef = useRef(alone), showRef = useRef(onShowEnglish);
  useEffect(() => { aloneRef.current = alone; showRef.current = onShowEnglish; }, [alone, onShowEnglish]);

  // the device's English voices (they arrive a moment after the page loads)
  useEffect(() => {
    if (!supported) return;
    const load = () => setVoices(englishVoices(speechSynthesis.getVoices()));
    load();
    speechSynthesis.addEventListener("voiceschanged", load);
    return () => speechSynthesis.removeEventListener("voiceschanged", load);
  }, [supported]);
  const voice = voices.find((v) => v.name === voiceName) ?? voices[0];

  const rowEl = (i: number) => {
    const r = rowsRef.current[i];
    return r ? root().querySelector<HTMLElement>(`article [data-key="${CSS.escape(r.key)}"]`) : null;
  };
  const unmark = () => {
    registry()?.delete(HL);
    root().querySelectorAll("[data-listening]").forEach((e) => e.removeAttribute("data-listening"));
  };
  const markWord = (sp: Speakable, a: number, b: number) => {
    const reg = registry(), H = HighlightCtor();
    if (!reg || !H) return;
    const first = sp.at.slice(a, b).find(Boolean), last = [...sp.at.slice(a, b)].reverse().find(Boolean);
    if (!first || !last) return;
    const r = new Range();
    try { r.setStart(first.node, first.offset); r.setEnd(last.node, last.offset + 1); } catch { return; }
    reg.set(HL, new H(r));
  };

  const stopSpeech = () => { gen.current++; if (supported) speechSynthesis.cancel(); };

  /** Read from row `i`, piece `p`, on to the end of the page (and on to the next page). `waited` counts the frames spent waiting for a passage's English to open. */
  const speak = useCallback((i: number, p: number, waited = 0) => {
    const g = ++gen.current;
    speechSynthesis.cancel();
    const rs = rowsRef.current;
    // the next row that has a translation
    while (i < rs.length && !rs[i].trans.length) { i++; p = 0; }
    if (i >= rs.length) {
      unmark();
      showRef.current?.(null);
      if (onNextPage) { continuing.current = true; onNextPage(); }
      else { setStatus("idle"); pos.current = { row: 0, piece: 0 }; setRowIdx(0); }
      return;
    }
    const el = rowEl(i);
    // with the Greek alone the translation's column is not on the page: the passage opens its English under its Greek, and that is read and marked
    const alone = aloneRef.current;
    const tr = el?.querySelector<HTMLElement>(alone ? "[data-one]" : "[data-tr]") ?? null;
    if (el && alone && !tr && waited < 30) {
      showRef.current?.(rs[i].key);
      requestAnimationFrame(() => { if (g === gen.current) speak(i, p, waited + 1); });
      return;
    }
    if (!el || !tr) { speak(i + 1, 0); return; }
    // (the words kept for this passage may be those of an English the reader has since closed: they are taken again)
    const kept = current.current;
    if (!kept || kept.el !== el || !kept.sp.at.find(Boolean)?.node.isConnected) {
      const sp = speakable(tr);
      current.current = { el, sp, ps: pieces(sp.text) };
    }
    const { sp, ps } = current.current!;
    if (p >= ps.length) { speak(i + 1, 0); return; }
    pos.current = { row: i, piece: p };
    setRowIdx(i);
    unmark();
    el.setAttribute("data-listening", "");
    // keep the passage being read in view
    if (p === 0) {
      const r = el.getBoundingClientRect();
      if (r.top < 80 || r.top > innerHeight * 0.6) el.scrollIntoView({ block: "start", behavior: prefersReducedMotion(motion) ? "auto" : "smooth" });
    }
    const [a, b] = ps[p];
    const u = new SpeechSynthesisUtterance(sp.text.slice(a, b));
    if (voice) u.voice = voice;
    u.lang = voice?.lang ?? "en-GB";
    u.rate = rate;
    u.onboundary = (e) => { if (g === gen.current && e.name === "word") markWord(sp, ...wordAt(sp.text, a + e.charIndex)); };
    u.onend = () => { if (g === gen.current) speak(i, p + 1); };
    u.onerror = (e) => {
      if (g !== gen.current || e.error === "interrupted" || e.error === "canceled") return;
      setStatus("idle"); unmark();
    };
    speechSynthesis.speak(u);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voice, rate, motion, onNextPage]);

  // a new page (the next one at the end of this, or one the reader turned to): reading goes on from its first
  // passage once it is drawn if it was reading, else it starts there next time
  const statusRef = useRef(status);
  useEffect(() => { statusRef.current = status; }, [status]);
  const firstRows = useRef(rows);
  useEffect(() => {
    if (rows === firstRows.current) return;
    firstRows.current = rows;
    current.current = null;
    pos.current = { row: 0, piece: 0 };
    setRowIdx(0);
    if (!continuing.current && statusRef.current !== "playing") return;
    continuing.current = false;
    stopSpeech();
    const t = setTimeout(() => speak(0, 0), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  // keep the screen awake while reading aloud, where the browser allows it
  useEffect(() => {
    if (status !== "playing") return;
    const nav = navigator as Navigator & { wakeLock?: { request: (t: "screen") => Promise<{ release: () => Promise<void> }> } };
    nav.wakeLock?.request("screen").then((l) => { wake.current = l; }, () => undefined);
    return () => { wake.current?.release().catch(() => undefined); wake.current = null; };
  }, [status]);

  // stop when Listen closes or the reader goes away
  useEffect(() => () => { gen.current++; if ("speechSynthesis" in window) speechSynthesis.cancel(); registry()?.delete(HL); }, []);
  useEffect(() => () => { unmark(); showRef.current?.(null); }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  const play = () => { setStatus("playing"); speak(pos.current.row, pos.current.piece); };
  const pause = () => { stopSpeech(); setStatus("paused"); registry()?.delete(HL); };
  const step = (d: number) => {
    const n = Math.min(rows.length - 1, Math.max(0, pos.current.row + d));
    current.current = null;
    pos.current = { row: n, piece: 0 };
    setRowIdx(n);
    if (status === "playing") speak(n, 0);
    else { unmark(); showRef.current?.(null); const el = rowEl(n); el?.setAttribute("data-listening", ""); el?.scrollIntoView({ block: "start", behavior: prefersReducedMotion(motion) ? "auto" : "smooth" }); }
  };
  // a new voice or speed takes effect at once, from the start of the sentence being read
  useEffect(() => {
    if (status === "playing") speak(pos.current.row, pos.current.piece);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voice?.name, rate]);

  const close = () => { stopSpeech(); unmark(); showRef.current?.(null); onClose(); };
  const progress = rows.length > 1 ? rowIdx / (rows.length - 1) : 0;
  const ref = rows[rowIdx]?.key ?? "";

  return (
    <div className={styles.bar} role="region" aria-label="Listen to the translation" data-status={status}>
      <span className={styles.progress} style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      {!supported ? (
        <p className={styles.note}>This browser cannot read aloud.</p>
      ) : voices.length === 0 ? (
        <p className={styles.note}>Looking for an English voice on this device…</p>
      ) : (
        <>
          <div className={styles.transport}>
            <button type="button" className="icon-btn" onClick={() => step(-1)} disabled={rowIdx === 0} title="The passage before"><Icon name="chevron-left" label="Previous passage" /></button>
            <button type="button" className={`icon-btn framed ${styles.play}`} onClick={status === "playing" ? pause : play} title={status === "playing" ? "Pause" : "Read aloud"}>
              <Icon name={status === "playing" ? "pause" : "play"} label={status === "playing" ? "Pause" : status === "paused" ? "Resume reading" : "Read aloud"} />
            </button>
            <button type="button" className="icon-btn" onClick={() => step(1)} disabled={rowIdx >= rows.length - 1} title="The passage after"><Icon name="chevron-right" label="Next passage" /></button>
          </div>
          <p className={styles.where} aria-live="polite">
            <span className="label">{status === "playing" ? "Reading" : status === "paused" ? "Paused" : "Listen"}</span>
            <span className={styles.what}><span className={styles.whatTitle}>{title}</span> <b>{ref}</b></span>
          </p>
          {/* the speed is a figure alone (1×): Icon.tsx has no sign for it, so its name is said by its label */}
          <button type="button" className={`icon-btn ${styles.rate}`} onClick={() => { const r = RATES[(RATES.indexOf(rate) + 1) % RATES.length]; setRate(r); writePrefs({ rate: r }); }}
            aria-label={`Speed ${rate} times; change`} title="Speed">{rate}×</button>
          <select className={styles.voice} value={voice?.name} aria-label="English voice"
            onChange={(e) => { setVoiceName(e.target.value); writePrefs({ voice: e.target.value }); }}>
            {voices.map((v) => <option key={v.name} value={v.name}>{v.name.replace(/^Microsoft /, "").replace(/ Online \(Natural\).*$/, " (natural)")}</option>)}
          </select>
        </>
      )}
      <button type="button" className={`icon-btn ${styles.x}`} onClick={close} title="Stop and close"><Icon name="close" label="Stop and close" /></button>
      <p className={styles.fine}>The English translation, read by your device&apos;s voice{voice && !voice.localService ? " (an online voice: the passage is sent to your browser's maker to be spoken)" : ""}. The Greek is not read aloud: no voice speaks it as it sounded.</p>
    </div>
  );
}
