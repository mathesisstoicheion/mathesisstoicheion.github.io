"use client";
/**
 * A button that opens a small stone panel beneath it: the reader's Aids, Your marks and More (⋯) in its bar, and
 * Change beside the edition's name under the title. The panel fades in as it rises a few pixels into place (the CSS);
 * it closes on its button, on Escape, on a press anywhere outside it, and when something in it that opens a side panel
 * or leaves the page is chosen (marked data-closes-sheet, as in the phone's aids sheet). It is a disclosure: the panel
 * follows its button, so Tab goes from the button into it.
 */
import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  /** the panel's id, which the button names in aria-controls */
  id: string;
  open: boolean;
  onOpen: (open: boolean) => void;
  /** what the button shows; a chevron follows it unless `chevron` is false */
  label: ReactNode;
  chevron?: boolean;
  /** the button's name, when what it shows is only a sign (⋯) */
  ariaLabel?: string;
  title?: string;
  className?: string;
  panelClass?: string;
  /** the panel's name, when it is a group of controls of its own */
  panelLabel?: string;
  children: ReactNode;
}

export default function Drop({ id, open, onOpen, label, chevron = true, ariaLabel, title, className, panelClass, panelLabel, children }: Props) {
  const btn = useRef<HTMLButtonElement>(null), panel = useRef<HTMLDivElement>(null);
  const set = useRef(onOpen);
  useEffect(() => { set.current = onOpen; });
  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => {
      const t = e.target as Node;
      // a Guide tour's card stands outside the panel while pointing inside it: pressing Next leaves the panel open
      if ((t as Element).closest?.("[data-tour-card]")) return;
      if (!panel.current?.contains(t) && !btn.current?.contains(t)) set.current(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // back to its button, if the keyboard was in the panel
      const inside = panel.current?.contains(document.activeElement);
      set.current(false);
      if (inside) btn.current?.focus({ preventScroll: true });
    };
    addEventListener("pointerdown", outside, true);
    addEventListener("keydown", key);
    return () => { removeEventListener("pointerdown", outside, true); removeEventListener("keydown", key); };
  }, [open]);
  return (
    <>
      <button ref={btn} type="button" className={className} aria-expanded={open} aria-controls={id} aria-label={ariaLabel} title={title}
        onClick={() => onOpen(!open)}>
        {label}
        {chevron && <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>}
      </button>
      <div ref={panel} id={id} className={panelClass} hidden={!open} data-overlay="" role={panelLabel ? "group" : undefined} aria-label={panelLabel}
        onClick={(e) => { if ((e.target as Element).closest?.("[data-closes-sheet]")) onOpen(false); }}>
        {children}
      </div>
    </>
  );
}
