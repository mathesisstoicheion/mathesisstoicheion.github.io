"use client";
/**
 * The melody as modern sheet music (lib/lyre/abc.ts writes it; abcjs engraves it, loaded only when the score is first
 * shown). Every piece is engraved at the same size, the one chosen (small, medium or large), its lines wrapped to the
 * width of the panel. A bead of light under the note now sounding, with a soft column of light behind it, shows where
 * the melody is; the score keeps that line in view by scrolling inside its own panel, never the page. Clicking a note
 * plucks its string.
 */
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import type { Melody, MelodyNote } from "@/data/melodies/types";
import { toAbc } from "@/lib/lyre/abc";
import styles from "./Lyre.module.css";

export interface SheetHandle { light: (i: number) => void }
export type SheetSize = "small" | "medium" | "large";
export const SHEET_SIZES: [SheetSize, string][] = [["small", "Small"], ["medium", "Medium"], ["large", "Large"]];

/** How large the notes are drawn, on a computer and on a phone. */
const SCALE: Record<SheetSize, [number, number]> = { small: [0.95, 0.72], medium: [1.2, 0.88], large: [1.5, 1.08] };

interface Line { top: number; bottom: number }

const Sheet = forwardRef<SheetHandle, { melody: Melody; notes: MelodyNote[]; bpm: number; onNote: (i: number) => void; height: number; size: SheetSize }>(
  function Sheet({ melody, notes, bpm, onNote, height, size }, ref) {
    const box = useRef<HTMLDivElement>(null);
    const paper = useRef<HTMLDivElement>(null);
    const mark = useRef<HTMLDivElement>(null);
    const els = useRef<Element[]>([]);
    const lines = useRef<Line[]>([]);
    const lit = useRef<Element[]>([]);
    const now = useRef({ i: -1, line: -1 });
    const [failed, setFailed] = useState(false);
    const [width, setWidth] = useState(0);
    const score = useMemo(() => toAbc(notes, { id: melody.id, sung: melody.sung, bpm }), [notes, melody, bpm]);
    const inverse = useMemo(() => { const inv: number[] = []; score.map.forEach((ks, i) => ks.forEach((k) => { inv[k] = i; })); return inv; }, [score]);
    const onNoteRef = useRef(onNote);
    useEffect(() => { onNoteRef.current = onNote; }, [onNote]);

    // the lines are wrapped to the panel's width, so a new width engraves the score again
    useEffect(() => {
      const el = paper.current!;
      const ro = new ResizeObserver(() => setWidth((w) => { const v = el.clientWidth; return Math.abs(v - w) >= 8 ? v : w; }));
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    /** The marker to note `i` (none for -1): a red mark below its line. */
    const place = (i: number) => {
      const m = mark.current, p = paper.current;
      if (!m || !p) return;
      const first = i >= 0 ? (score.map[i] ?? []).map((k) => els.current[k]).find(Boolean) : undefined;
      if (!first) { m.classList.remove(styles.markOn); now.current = { i: -1, line: -1 }; return; }
      const pr = p.getBoundingClientRect(), r = first.getBoundingClientRect();
      const line = +(first.getAttribute("class")?.match(/abcjs-l(\d+)/)?.[1] ?? 0);
      const L = lines.current[line] ?? { top: r.top - pr.top, bottom: r.bottom - pr.top };
      const head = first.querySelector(".abcjs-notehead")?.getBoundingClientRect() ?? r;
      const x = head.left + head.width / 2 - pr.left;
      const jump = now.current.line !== line || !m.classList.contains(styles.markOn);
      if (jump) m.style.transition = "opacity var(--dur) ease";
      m.style.transform = `translate(${x}px, ${L.top - 6}px)`;
      m.style.height = `${L.bottom - L.top + 20}px`;
      if (jump) { void m.offsetWidth; m.style.transition = ""; }
      m.classList.add(styles.markOn);
      // keep the line in view, near the top of the panel, with what comes next below it
      const b = box.current;
      if (b && now.current.line !== line) {
        const br = b.getBoundingClientRect(), top = pr.top + L.top - br.top, bottom = pr.top + L.bottom - br.top;
        if (top < 8 || bottom > br.height - 8) b.scrollTo({ top: b.scrollTop + top - 14, behavior: "smooth" });
      }
      now.current = { i, line };
    };

    useEffect(() => {
      if (!width) return;
      let gone = false;
      const el = paper.current!;
      const narrow = width < 560, scale = SCALE[size][narrow ? 1 : 0];
      import("abcjs").then((abcjs) => {
        if (gone) return;
        // engraved in the page's own ink (the score's colour, so Paper and Night both read without engraving it again)
        abcjs.renderAbc(el, score.abc, {
          add_classes: true, foregroundColor: "currentColor", scale, staffwidth: Math.max(220, width - 14),
          wrap: { minSpacing: 1.7, maxSpacing: 2.4, preferredMeasuresPerLine: 12 },
          paddingtop: 8, paddingbottom: 22, paddingleft: 4, paddingright: 4,
          format: { gchordfont: "serif 12", annotationfont: "Georgia 11 italic", vocalfont: "GFS Didot, serif 15" },
          clickListener: (abcElem) => {
            const t = (abcElem as unknown as { abselem?: { elemset?: Element[] } }).abselem?.elemset?.[0];
            const k = t ? els.current.indexOf(t.closest(".abcjs-note") ?? t) : -1;
            if (k >= 0 && inverse[k] !== undefined) onNoteRef.current(inverse[k]);
          },
        });
        els.current = [...el.querySelectorAll(".abcjs-note")];
        // where each engraved line is: from the top of its staff to the foot of its lowest note or word
        const pr = el.getBoundingClientRect(), ls: Line[] = [];
        for (const s of el.querySelectorAll(".abcjs-staff")) {
          const n = +(s.getAttribute("class")?.match(/abcjs-l(\d+)/)?.[1] ?? -1), r = s.getBoundingClientRect();
          if (n < 0) continue;
          const L = ls[n] ?? (ls[n] = { top: Infinity, bottom: -Infinity });
          L.top = Math.min(L.top, r.top - pr.top); L.bottom = Math.max(L.bottom, r.bottom - pr.top + 6);
        }
        for (const e of els.current) {
          const n = +(e.getAttribute("class")?.match(/abcjs-l(\d+)/)?.[1] ?? -1);
          if (ls[n]) ls[n].bottom = Math.max(ls[n].bottom, e.getBoundingClientRect().bottom - pr.top);
        }
        lines.current = ls;
        // light again whatever was lit before the score was engraved anew
        const i = now.current.i;
        now.current = { i: -1, line: -1 };
        lit.current = [];
        if (i >= 0) light(i);
      }).catch(() => setFailed(true));
      return () => { gone = true; el.innerHTML = ""; els.current = []; lit.current = []; lines.current = []; };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [score, inverse, size, width]);

    function light(i: number) {
      for (const e of lit.current) e.classList.remove(styles.noteNow);
      lit.current = i >= 0 ? (score.map[i] ?? []).map((k) => els.current[k]).filter(Boolean) : [];
      for (const e of lit.current) e.classList.add(styles.noteNow);
      if (!els.current.length) { now.current.i = i; return; }
      place(i);
    }
    useImperativeHandle(ref, () => ({ light }));

    return (
      <div ref={box} className={styles.sheet} style={{ height }} tabIndex={0} role="region" aria-label={`Sheet music: ${melody.title}`}>
        {failed ? <p className="muted">The sheet music could not be drawn here.</p> : (
          <div className={styles.score}>
            <div ref={mark} className={styles.mark} aria-hidden="true" />
            <div ref={paper} className={styles.paper} />
          </div>
        )}
        <p className={styles.sheetNote}>
          One beat of Greek rhythm is written as an eighth note. Notes are shown at their nearest modern pitch
          {score.abc.includes("^/") ? ", with a quarter-tone sharp (a sharp with one stroke) for the steps between" : ""}; the lyre plays them in the ancient tuning.
        </p>
      </div>
    );
  });

export default Sheet;
