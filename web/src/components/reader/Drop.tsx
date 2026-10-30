"use client";
/**
 * A button that opens a small stone panel beside it: the reader's Aa, Study and Go to (the foot bar, ReaderBar.tsx, and the top bar
 * of each of two books side by side or of the floating window; the quiet desk, ticket 09, the owner, 2026-10-30). The panel fades in
 * as it rises a few pixels into place (the CSS); it closes on its button, on Escape, on a press anywhere outside it, on its own
 * close button (marked data-drop-close), and when something in it that opens a side panel or leaves the page is chosen (marked
 * data-closes-sheet, as in the phone's sheet). It is a disclosure: the panel follows its button, so Tab goes from the button into it.
 * When it closes from inside (Escape, its close button) the keyboard goes back to the button.
 */
import { useEffect, useRef, type ReactNode } from "react";
import Icon from "@/components/Icon";

interface Props {
  /** the panel's id, which the button names in aria-controls */
  id: string;
  open: boolean;
  onOpen: (open: boolean) => void;
  /** what the button shows; a chevron follows it unless `chevron` is false */
  label: ReactNode;
  chevron?: boolean;
  /** the button's name, when what it shows is only a sign, or says less than the button does */
  ariaLabel?: string;
  /** the id of what describes the button (the place the Go to button names, "line 25 of 611") */
  describedBy?: string;
  title?: string;
  className?: string;
  panelClass?: string;
  /** the panel's name, when it is a group of controls of its own */
  panelLabel?: string;
  children: ReactNode;
}

export default function Drop({ id, open, onOpen, label, chevron = true, ariaLabel, describedBy, title, className, panelClass, panelLabel, children }: Props) {
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
      <button ref={btn} type="button" className={className} aria-expanded={open} aria-controls={id} aria-label={ariaLabel} aria-describedby={describedBy} title={title}
        onClick={() => onOpen(!open)}>
        {label}
        {chevron && <Icon name="chevron-down" />}
      </button>
      <div ref={panel} id={id} className={panelClass} hidden={!open} data-overlay="" role={panelLabel ? "group" : undefined} aria-label={panelLabel}
        onClick={(e) => {
          const t = e.target as Element;
          if (t.closest?.("[data-drop-close]")) { onOpen(false); btn.current?.focus({ preventScroll: true }); }
          else if (t.closest?.("[data-closes-sheet]")) onOpen(false);
        }}>
        {children}
      </div>
    </>
  );
}
