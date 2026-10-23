"use client";
/**
 * A small ⓘ that opens a note beside it (review fix list, slices 6 and 7: picture credits and long captions wait behind it
 * rather than standing in small print). A button, so it works by touch and keyboard alike. The note is a popover, drawn
 * above the whole page, so a window that clips its picture does not clip it; Escape, a click elsewhere or a scroll closes it.
 */
import { useEffect, useId, useRef, type ReactNode } from "react";
import s from "./InfoTip.module.css";

export default function InfoTip({ label, children, className = "", small = false }: { label: string; children: ReactNode; className?: string; small?: boolean }) {
  const id = useId().replace(/:/g, "");
  const btn = useRef<HTMLButtonElement>(null), note = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const n = note.current, b = btn.current;
    if (!n || !b) return;
    const shut = () => { try { n.hidePopover(); } catch { /* already shut */ } };
    // the note opens under the ⓘ, or over it when there is no room below, and never past the screen's edges
    const place = (e: Event) => {
      if ((e as ToggleEvent).newState !== "open") { removeEventListener("scroll", shut); return; }
      const r = b.getBoundingClientRect(), w = n.offsetWidth, h = n.offsetHeight;
      const left = Math.min(Math.max(16, r.right - w), innerWidth - w - 16);
      const top = r.bottom + 8 + h > innerHeight - 8 ? Math.max(8, r.top - 8 - h) : r.bottom + 8;
      n.style.left = `${left}px`; n.style.top = `${top}px`;
      addEventListener("scroll", shut, { passive: true, once: true });
    };
    n.addEventListener("toggle", place);
    return () => { n.removeEventListener("toggle", place); removeEventListener("scroll", shut); };
  }, []);
  return (
    <span className={`${s.info} ${small ? s.small : ""} ${className}`}>
      <button ref={btn} type="button" className={s.infoBtn} popoverTarget={id} aria-label={label} title={label}>
        <span aria-hidden="true">i</span>
      </button>
      <span ref={note} id={id} popover="auto" className={s.infoNote}>{children}</span>
    </span>
  );
}
