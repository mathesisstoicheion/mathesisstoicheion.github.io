"use client";

import { useEffect, useRef } from "react";
import type { Colour } from "@/lib/annotations";
import Icon from "@/components/Icon";
import { useQuickGloss, type WordContext } from "./WordPanel";
import styles from "./Reader.module.css";
import { scrollBehavior } from "@/lib/settings";
import { FORUM_OPEN } from "@/config/areas";

const PHONE = "(max-width: 760px)";

export interface Selection {
  start: { u: string; i: number };
  end: { u: string; i: number };
  quote: string;               // the Greek words selected
  rowKeys: string[];           // rows the selection touches
  rect: { left: number; top: number; bottom: number };
}

const COLOURS: [Colour, string][] = [["red", "Red"], ["ochre", "Ochre"], ["blue", "Blue"], ["green", "Green"]];

/**
 * Floating toolbar for a selected passage, on the page's paper (the quiet desk, the reader's tools, the owner, 2026-10-30: "paper, never a
 * black slip"). Each action is its sign and a short word, in the order of what you do with a place: keep it (Bookmark, Favourite, Note, the
 * four colours), then take it elsewhere (Notebook, Share, Echoes, Ask), and Close last, at the right end, on a computer and a phone alike.
 * On phones it docks along the bottom of the screen instead, where the foot bar stands (the phone's own Copy and Share menu sits by the
 * words), with finger-sized buttons in two rows; when one word is selected (press and hold it) it starts with the word's dictionary form
 * and one-line meaning, and "Look up" opens the look-up.
 */
export default function PassageToolbar({ sel, onAction, onClose, xref = null, word = null, onLookUp, ask = true }: {
  sel: Selection;
  onAction: (a: "bookmark" | "favourite" | "note" | "share" | "xref" | "xref-here" | "echoes" | "ask" | "notebook" | { highlight: Colour }) => void;
  onClose: () => void;
  xref?: "start" | "here" | null;   // side-by-side only: begin a cross-reference, or finish one here
  /** the one word selected, for its quick meaning (phones) */
  word?: { w: string; ctx: WordContext | null } | null;
  onLookUp?: () => void;
  /** "Ask in the Agora": left out for a book of the private collection, whose text is never to be posted */
  ask?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const quick = useQuickGloss(word?.w ?? null, word?.ctx ?? null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia(PHONE).matches && !el.parentElement?.closest("[data-float-window]")) {
      // placed along the bottom by the CSS: move the page if the words would be hidden behind it
      el.style.opacity = "1";
      const cover = el.getBoundingClientRect().top - 16;
      if (sel.rect.bottom > cover) scrollBy({ top: sel.rect.bottom - cover, behavior: scrollBehavior() });
      return;
    }
    const w = el.offsetWidth, h = el.offsetHeight;
    // inside the floating window, "fixed" is measured from the window, not the screen
    const box = el.parentElement?.closest("[data-float-window]")?.getBoundingClientRect();
    const ox = box?.left ?? 0, oy = box?.top ?? 0, width = box?.width ?? innerWidth, minTop = box ? 50 : 70;
    const left = Math.min(Math.max(12, sel.rect.left - ox), width - w - 12);
    const top = sel.rect.top - oy - h - 10 > minTop ? sel.rect.top - oy - h - 10 : sel.rect.bottom - oy + 10;
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
    el.style.opacity = "1";
  }, [sel]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div ref={ref} className={styles.toolbar} role="toolbar" aria-label="Passage actions" onMouseDown={(e) => e.preventDefault()}>
      {word && (
        <div className={styles.quickRow}>
          <p><b lang="grc">{quick.lemma ?? word.w}</b> {quick.done ? (quick.gloss || <span className={styles.quickNone}>no short definition</span>) : "…"}</p>
          {onLookUp && <button type="button" className="btn ghost small" onClick={onLookUp}><Icon name="dictionary" />Look up</button>}
        </div>
      )}
      {/* keep this place: a mark, a favourite, a note of your own, a colour */}
      <div className={`${styles.tbRow} ${styles.tbKeep}`}>
        <button type="button" className="btn quiet small" onClick={() => onAction("bookmark")} title="Bookmark this place"><Icon name="bookmark" />Bookmark</button>
        <button type="button" className="btn quiet small" onClick={() => onAction("favourite")} title="Add to your favourite passages"><Icon name="favourite" />Favourite</button>
        <button type="button" className="btn quiet small" onClick={() => onAction("note")} title="Write a note on this passage"><Icon name="note" />Note</button>
        <span className={styles.swatches} role="group" aria-label="Highlight">
          {COLOURS.map(([c, name]) => (
            <button key={c} type="button" className={`icon-btn ${styles.swatch} ${styles[`sw-${c}`]}`} onClick={() => onAction({ highlight: c })} title={`Highlight in ${name.toLowerCase()}`} aria-label={`Highlight in ${name.toLowerCase()}`} />
          ))}
        </span>
      </div>
      {/* take it elsewhere: a notebook, someone else, other texts, the Agora; then Close, last */}
      <div className={styles.tbRow}>
        <button type="button" className="btn quiet small" onClick={() => onAction("notebook")} title="Add this passage to a research notebook, with its citation"><Icon name="plus" />Notebook</button>
        <button type="button" className="btn quiet small" onClick={() => onAction("share")} title="Share this passage"><Icon name="share" />Share</button>
        {xref === "start" && <button type="button" className="btn quiet small" onClick={() => onAction("xref")} title="Link this passage to one in the other book"><Icon name="link" />Cross-reference</button>}
        {xref === "here" && <button type="button" className="btn small" onClick={() => onAction("xref-here")} title="Finish the cross-reference with this passage"><Icon name="link" />Link here</button>}
        <button type="button" className="btn quiet small" onClick={() => onAction("echoes")} title="Where these words recur, in this book and beyond"><Icon name="echoes" />Echoes</button>
        {ask && FORUM_OPEN && (
          <button type="button" className="btn quiet small" onClick={() => onAction("ask")} title="Ask the Agora about this passage"><Icon name="talk" />Ask in the Agora</button>
        )}
      </div>
      <button type="button" className={`icon-btn ${styles.tbClose}`} onClick={onClose} title="Close (Esc)"><Icon name="close" label="Close passage actions" /></button>
    </div>
  );
}
