"use client";
/**
 * The page's own art (design A, Gold and lamplight; the owner's choices of 2026-10-18): a real object engraved in gold lines
 * on Pompeian red (pipeline/engrave.py), seen through a window at the right of the page's title on a computer, after the
 * title on a phone. As the page scrolls it grows into the whole background behind the page and turns slowly
 * (lib/art/stage.ts); windows further down the page look through to it (ArtWindow.tsx). Clicking (tapping) it lights it
 * fully; again, and it goes back to the lamp.
 *
 * `data/pieces.ts` says which object belongs to which page (the same pieces the stone sculptures were made from, all from
 * The Met's Open Access collection). A page head holds the window twice, for a computer (`piece-desk`) and for a phone
 * (`piece-phone`); the stage uses whichever is shown. Pages with no title on show get the art behind them from the start
 * (`place="foot"` draws nothing of its own).
 */
import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { PIECE_CREDITS, pieceFor } from "@/data/pieces";
import engraved from "@/data/engraved.json";
import { stage } from "@/lib/art/stage";
import { ArtView, setArtLit, useArtLit, usePageArt } from "./PageArt";

const ENGRAVED = engraved as Record<string, { w: number; h: number }>;

/** The window's shape for an object of this size: round for one about as wide as it is tall, else an upright or broad pane. */
export function windowOf(id: string): { round: boolean; ratio: number } {
  const m = ENGRAVED[id];
  if (!m) return { round: false, ratio: 1 };
  const a = m.h / m.w;
  if (a > 0.84 && a < 1.2) return { round: true, ratio: 1 };
  return { round: false, ratio: Math.min(1.42, Math.max(0.72, a * 0.86)) };
}

/** Kept for the pages that wait for their content: nothing needs holding now. */
export function PieceHold() {
  return null;
}

const never = () => () => {};
const useMounted = () => useSyncExternalStore(never, () => true, () => false);

export default function PagePiece({ place = "head", spec: given, className, after }: { place?: "head" | "foot"; spec?: { piece: string; why?: string } | null; className?: string; steady?: boolean; after?: React.ReactNode }) {
  const path = usePathname() ?? "/";
  const spec = given !== undefined ? given : pieceFor(path);
  const id = spec && ENGRAVED[spec.piece] ? spec.piece : null;
  const credit = id ? PIECE_CREDITS[id] : undefined;
  const win = useRef<HTMLButtonElement>(null);
  const lit = useArtLit();
  const mounted = useMounted();
  usePageArt(place === "head" ? (id ? { piece: id, why: spec?.why } : null) : undefined);

  useEffect(() => {
    if (place !== "head" || !id || !win.current) return;
    return stage.addSlot(win.current);
  }, [place, id]);

  if (place !== "head" || !id || !credit) return null;
  const w = windowOf(id);
  return (
    <figure className={`piece piece-head art-slot${w.ratio < 0.95 ? " piece-wide" : ""}${className ? ` ${className}` : ""}`}
      style={{ "--piece-ratio": w.ratio } as React.CSSProperties}>
      <button ref={win} type="button" className={`piece-niche art-window${w.round ? " art-round" : ""}`} aria-pressed={lit}
        onClick={() => setArtLit(!lit)} aria-label={lit ? "Give the engraving back to the lamp" : "Light the engraving fully"}>
        {mounted && <ArtView piece={id} />}
      </button>
      <p className="lamp-note" aria-hidden="true">
        <span className="lamp-click">{lit ? "Click to dim it" : "Click to light it"}</span>
        <span className="lamp-tap">{lit ? "Tap to dim it" : "Tap to light it"}</span>
      </p>
      <figcaption>
        <b>{credit.title}</b>{credit.date && <>, {credit.date}</>}.{" "}
        {spec?.why && <span className="piece-why">{spec.why} </span>}
        <a href={credit.source} rel="noopener">The Met</a>
      </figcaption>
      {after && <div className="piece-after">{after}</div>}
    </figure>
  );
}
