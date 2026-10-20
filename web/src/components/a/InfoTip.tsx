"use client";
/**
 * A small ⓘ that opens a note under it (review fix list, slice 6: picture credits and long captions wait behind it rather than
 * standing in small print). A button, so it works by touch and keyboard alike; Escape or a click elsewhere closes it.
 */
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import s from "./InfoTip.module.css";

export default function InfoTip({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  const id = useId(), box = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); box.current?.querySelector("button")?.focus(); } };
    const away = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    addEventListener("keydown", key); addEventListener("pointerdown", away);
    return () => { removeEventListener("keydown", key); removeEventListener("pointerdown", away); };
  }, [open]);
  return (
    <span ref={box} className={`${s.info} ${className}`} data-open={open ? "" : undefined}>
      <button type="button" className={s.infoBtn} aria-expanded={open} aria-controls={id} aria-label={label} title={label} onClick={() => setOpen(!open)}>
        <span aria-hidden="true">i</span>
      </button>
      <span id={id} className={s.infoNote} hidden={!open}>{children}</span>
    </span>
  );
}
