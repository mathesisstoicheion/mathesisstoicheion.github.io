"use client";
/**
 * The melody as modern sheet music (lib/lyre/abc.ts writes it; abcjs engraves it, loaded only when the score is first
 * shown). The note now sounding is lit; the score keeps it in view by scrolling inside its own panel, never the page.
 * Clicking a note plucks its string.
 */
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import type { Melody, MelodyNote } from "@/data/melodies/types";
import { toAbc } from "@/lib/lyre/abc";
import styles from "./Lyre.module.css";

export interface SheetHandle { light: (i: number) => void }

const Sheet = forwardRef<SheetHandle, { melody: Melody; notes: MelodyNote[]; bpm: number; onNote: (i: number) => void; height: number }>(
  function Sheet({ melody, notes, bpm, onNote, height }, ref) {
    const box = useRef<HTMLDivElement>(null);
    const paper = useRef<HTMLDivElement>(null);
    const els = useRef<Element[]>([]);
    const lit = useRef<Element[]>([]);
    const [failed, setFailed] = useState(false);
    const score = useMemo(() => toAbc(notes, { id: melody.id, sung: melody.sung, bpm }), [notes, melody, bpm]);
    const inverse = useMemo(() => { const inv: number[] = []; score.map.forEach((ks, i) => ks.forEach((k) => { inv[k] = i; })); return inv; }, [score]);
    const onNoteRef = useRef(onNote);
    useEffect(() => { onNoteRef.current = onNote; }, [onNote]);

    useEffect(() => {
      let gone = false;
      const el = paper.current!;
      import("abcjs").then((abcjs) => {
        if (gone) return;
        const ink = getComputedStyle(document.documentElement).getPropertyValue("--ivory-1").trim() || "#efe5d2";
        abcjs.renderAbc(el, score.abc, {
          responsive: "resize", add_classes: true, foregroundColor: ink, paddingtop: 8, paddingbottom: 8, paddingleft: 4, paddingright: 4,
          format: { gchordfont: "serif 12", annotationfont: "Georgia 11 italic", vocalfont: "GFS Didot, serif 15" },
          clickListener: (_abcElem, _tuneNumber, _classes, analysis) => {
            void analysis;
            const t = (_abcElem as unknown as { abselem?: { elemset?: Element[] } }).abselem?.elemset?.[0];
            const k = t ? els.current.indexOf(t.closest(".abcjs-note") ?? t) : -1;
            if (k >= 0 && inverse[k] !== undefined) onNoteRef.current(inverse[k]);
          },
        });
        els.current = [...el.querySelectorAll(".abcjs-note")];
      }).catch(() => setFailed(true));
      return () => { gone = true; el.innerHTML = ""; els.current = []; lit.current = []; };
    }, [score, inverse]);

    useImperativeHandle(ref, () => ({
      light(i: number) {
        for (const e of lit.current) e.classList.remove(styles.noteNow);
        lit.current = i >= 0 ? (score.map[i] ?? []).map((k) => els.current[k]).filter(Boolean) : [];
        for (const e of lit.current) e.classList.add(styles.noteNow);
        const first = lit.current[0], b = box.current;
        if (first && b) {
          const r = first.getBoundingClientRect(), br = b.getBoundingClientRect();
          // keep the lit note in the upper middle of the panel, scrolling the panel gently
          if (r.top < br.top + 24 || r.bottom > br.bottom - 24) b.scrollTo({ top: b.scrollTop + (r.top - br.top) - br.height * 0.3, behavior: "smooth" });
        }
      },
    }), [score]);

    return (
      <div ref={box} className={styles.sheet} style={{ height }} tabIndex={0} role="region" aria-label={`Sheet music: ${melody.title}`}>
        {failed ? <p className="muted">The sheet music could not be drawn here.</p> : <div ref={paper} className={styles.paper} />}
        <p className={styles.sheetNote}>
          One beat of Greek rhythm is written as an eighth note. Notes are shown at their nearest modern pitch
          {score.abc.includes("^/") ? ", with a quarter-tone sharp (a sharp with one stroke) for the steps between" : ""}; the lyre plays them in the ancient tuning.
        </p>
      </div>
    );
  });

export default Sheet;
