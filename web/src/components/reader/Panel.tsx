"use client";
/**
 * The reader's one panel shell (the quiet desk, ticket 01; docs/adr/0009-the-quiet-desk.md). Every panel, sheet and
 * dialog in the reader is built from these two, so the frame, the heading, the close button and Escape behave the same
 * everywhere (panels.test.ts fails on a reader file that draws its own).
 * - SidePanel: over the page but not holding it: at the side, in the margin or as a sheet from the foot.
 * - ModalDialog: holds the page until it is closed; the browser's own <dialog> keeps the keyboard inside it and gives it
 *   back to the button that opened it.
 */
import { forwardRef, useEffect, useImperativeHandle, useRef, type HTMLAttributes, type ReactNode } from "react";
import Icon from "@/components/Icon";
import styles from "./Reader.module.css";

/** The way back a panel can offer (see Head.back). */
export type Back = { to: ReactNode; onBack: () => void };

type Head = {
  /** the heading, set as the panel's title */
  title?: ReactNode;
  titleClass?: string;
  /** a head of its own in place of the title (the look-up's word and its arrows, Echoes' quotation) */
  head?: ReactNode;
  headClass?: string;
  headProps?: HTMLAttributes<HTMLDivElement>;
  /** what the × says to a screen reader */
  closeLabel?: string;
  closeClass?: string;
  /** a way back to what the reader came from, at the top-left of the head above the title (the back sign and "Back to μῆνις": the
   *  quiet desk, back routes, the owner, 2026-10-29; "Back to Study" for a panel opened from the Study menu, ticket 09, 2026-10-30);
   *  left out when the panel was opened some other way. Where it is given, Escape does what it does (the panel passes onEscape; the
   *  owner's rule, 2026-10-30), and × closes to the text. (The phone's back gesture does the same: Back from a panel opened from
   *  Study shows Study, from Echoes or the sentence shows the look-up, and the next Back closes that; useBackSteps.ts, ticket 11.) */
  back?: Back;
};

function PanelHead({ title, titleClass, titleId, head, headClass, headProps, closeLabel = "Close", closeClass, back, onClose }: Head & { titleId?: string; onClose: () => void }) {
  const main = head ?? <h2 id={titleId} className={titleClass}>{title}</h2>;
  return (
    <div {...headProps} className={headClass ?? styles.panelHead}>
      {back ? (
        <div className={styles.headMain}>
          <button type="button" className={`text-btn ${styles.headBack}`} onClick={back.onBack}><Icon name="back" />Back to {back.to}</button>
          {main}
        </div>
      ) : main}
      <button type="button" className={`icon-btn ${closeClass ?? styles.x}`} onClick={onClose} aria-label={closeLabel}><Icon name="close" /></button>
    </div>
  );
}

/**
 * A panel over the page. Escape or × closes it (onEscape gives Escape another job, as the look-up's second layer does: back to
 * the first layer, the quiet desk, ticket 06; × still closes it). With focusKey it takes the keyboard when it opens, and again whenever
 * focusKey changes (a new word looked up); without it the keyboard stays where it is (Find puts it in its box).
 */
export const SidePanel = forwardRef<HTMLElement, Head & Omit<HTMLAttributes<HTMLElement>, "title"> & {
  label: string; onClose: () => void; onEscape?: () => void; focusKey?: unknown; children?: ReactNode;
}>(function SidePanel({ label, onClose, onEscape, focusKey, className, children, title, titleClass, head, headClass, headProps, closeLabel, closeClass, back, onKeyDown, ...rest }, ref) {
  const own = useRef<HTMLElement>(null);
  useImperativeHandle(ref, () => own.current!, []);
  useEffect(() => { if (focusKey !== undefined && focusKey !== null && focusKey !== false) own.current?.focus({ preventScroll: true }); }, [focusKey]);
  return (
    <aside ref={own} {...rest} className={className ?? styles.panel} aria-label={label} tabIndex={-1}
      onKeyDown={(e) => { if (e.key === "Escape") { e.stopPropagation(); (onEscape ?? onClose)(); } onKeyDown?.(e); }}>
      <PanelHead {...{ title, titleClass, head, headClass, headProps, closeLabel, closeClass, back, onClose }} />
      {children}
    </aside>
  );
});

/**
 * A dialog that holds the page. It opens as it mounts; Escape, × or a click outside it closes it, and onClose follows
 * once it has closed.
 */
export function ModalDialog({ titleId, onClose, className, innerClass, children, ...head }: Head & {
  /** the id of the heading, which names the dialog */
  titleId: string; onClose: () => void; className?: string; innerClass?: string; children?: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { ref.current?.showModal(); }, []);
  const close = () => ref.current?.close();
  return (
    <dialog ref={ref} className={className ?? styles.share} aria-labelledby={titleId} onClose={onClose}
      onCancel={(e) => { if (head.back) { e.preventDefault(); head.back.onBack(); } }}
      onClick={(e) => { if (e.target === ref.current) close(); }}>
      <div className={innerClass ?? styles.shareIn}>
        <PanelHead {...head} titleId={titleId} onClose={close} />
        {children}
      </div>
    </dialog>
  );
}
