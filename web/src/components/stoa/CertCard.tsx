"use client";
/**
 * A certainty label in an entry (Well established, Debated, Legend) that you can press: it opens a small card of paper under
 * it with the label's one-line meaning (the same words as CERTAINTY[c].about). It works by touch, mouse and keyboard, and
 * closes with Esc, a press outside it, or a second press on the label.
 */
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { CERTAINTY, type Certainty } from "@/wiki/types";
import styles from "./Stoa.module.css";

export default function CertCard({ c }: { c: Certainty }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLSpanElement>(null);
  const card = useRef<HTMLSpanElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const away = (e: Event) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); wrap.current?.querySelector("button")?.focus(); } };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("pointerdown", away); document.removeEventListener("keydown", key); };
  }, [open]);
  // the card opens under the label; a label near the right edge slides it back in
  useLayoutEffect(() => {
    const el = card.current;
    if (!open || !el) return;
    el.style.translate = "0";
    const over = el.getBoundingClientRect().right - (document.documentElement.clientWidth - parseFloat(getComputedStyle(el).getPropertyValue("--edge")));
    if (over > 0) el.style.translate = `${-over}px`;
  }, [open]);
  return (
    <span className={styles.certWrap} ref={wrap}>
      <button type="button" className={`tag ${CERTAINTY[c].cls} ${styles.certBtn}`} aria-expanded={open} aria-controls={open ? id : undefined} onClick={() => setOpen((o) => !o)}>{CERTAINTY[c].label}</button>
      {open && <span className={styles.certCard} id={id} role="note" ref={card}>{CERTAINTY[c].about}</span>}
    </span>
  );
}
