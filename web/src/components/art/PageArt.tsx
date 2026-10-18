"use client";
/**
 * The art behind the page (lib/art/stage.ts says how it moves). This file holds:
 * - `PageArt`, in the layout: the engraving behind the whole page, under the page's slightly see-through panels;
 * - `ArtView`, one view of the engraving: its hatched red ground, its gold lines and the lamp's pool of light;
 * - `ArtWindow`, a framed window in the page that looks through to the engraving, always with something real in it
 *   (a line of Greek and its source, a note on the picture), never empty (the owner, 2026-10-18);
 * - the page's choice of engraving (`usePageArt`) and whether it is lit fully (`useArtLit`).
 *
 * The reader has none: it is for reading, with its own still lamplit cover.
 */
import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { pieceFor } from "@/data/pieces";
import engraved from "@/data/engraved.json";
import { stage } from "@/lib/art/stage";

const ENGRAVED = engraved as Record<string, { w: number; h: number }>;

// ------------------------------------------------------------------ the page's engraving, and whether it is lit
type Spec = { piece: string; why?: string } | null;
let chosen: { spec: Spec; n: number } | null = null;   // what the page's head asked for (null: nothing asked)
let lit = false;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
const sub = (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; };

/** A page head says which engraving it shows (undefined: it says nothing; null: none). */
export function usePageArt(spec: Spec | undefined) {
  const key = spec === undefined ? "" : spec ? spec.piece : "none";
  useEffect(() => {
    if (spec === undefined) return;
    if (chosen && (chosen.spec?.piece ?? "none") === key) chosen.n++;
    else chosen = { spec, n: 1 };
    emit();
    return () => {
      if (chosen && (chosen.spec?.piece ?? "none") === key && --chosen.n <= 0) chosen = null;
      emit();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed by the piece
  }, [key]);
}
const useChosen = () => useSyncExternalStore(sub, () => chosen, () => null);

export function setArtLit(on: boolean) {
  lit = on;
  document.documentElement.toggleAttribute("data-art-lit", on);
  emit();
}
export const useArtLit = () => useSyncExternalStore(sub, () => lit, () => false);

// ------------------------------------------------------------------ views
/** One view of the engraving. `base`: the one behind the whole page. */
export function ArtView({ piece, base }: { piece: string; base?: boolean }) {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => (el.current ? stage.addView(el.current, !!base) : undefined), [base, piece]);
  return (
    <div ref={el} className={`eng-view${base ? " eng-base" : ""}`} aria-hidden="true">
      <div className="eng-ground" />
      <div className="eng-lines" style={{ maskImage: `url(/images/pieces/engraved/${piece}.webp)`, WebkitMaskImage: `url(/images/pieces/engraved/${piece}.webp)` }} />
      <div className="eng-lamp" />
    </div>
  );
}

/** The page's engraving: the one its head chose, else the one for its address; none in the reader. */
function usePiece(): string | null {
  const path = usePathname() ?? "/";
  const c = useChosen();
  if (path.startsWith("/read")) return null;
  const spec = c ? c.spec : pieceFor(path);
  return spec && ENGRAVED[spec.piece] ? spec.piece : null;
}

/** In the layout: the engraving behind the page. */
export default function PageArt() {
  const piece = usePiece();
  useEffect(() => { stage.start(); }, []);
  useEffect(() => {
    stage.setMeta(piece ? ENGRAVED[piece] : null);
    document.documentElement.toggleAttribute("data-art", !!piece);
    if (lit) setArtLit(false);   // a new page's engraving starts in the lamplight
  }, [piece]);
  if (!piece) return null;
  return <ArtView key={piece} piece={piece} base />;
}

/** A framed window in the page onto the engraving behind it, with its words on a dark plate. */
export function ArtWindow({ label, children, className, tall }: { label?: string; children?: ReactNode; className?: string; tall?: boolean }) {
  const piece = usePiece();
  return (
    <aside className={`art-window art-pane${tall ? " art-tall" : ""}${className ? ` ${className}` : ""}`}>
      {piece && <ArtView key={piece} piece={piece} />}
      {(label || children) && (
        <div className="art-plate">
          {label && <p className="label art-label">{label}</p>}
          {children}
        </div>
      )}
    </aside>
  );
}
