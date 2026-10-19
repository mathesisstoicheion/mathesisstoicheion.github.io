"use client";
/**
 * The art behind the page (lib/art/stage.ts says how it moves). This file holds:
 * - `PageArt`, in the layout: the engraving behind the whole page, under the page's slightly see-through panels;
 * - `ArtView`, one view of the engraving: its hatched red ground, its gold lines and the lamp's pool of light;
 * - `ArtWindow`, a framed window in the page that looks through to the engraving, always with something real in it
 *   (a line of Greek and its source, a note on the picture), never empty (the owner, 2026-10-18);
 * - the page's choice of engraving (`usePageArt`).
 *
 * The reader has none: it is for reading, with its own still lamplit cover.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { pieceFor } from "@/data/pieces";
import engraved from "@/data/engraved.json";
import { stage } from "@/lib/art/stage";

const ENGRAVED = engraved as Record<string, { w: number; h: number }>;

// ------------------------------------------------------------------ the page's engraving, and 
type Spec = { piece: string; why?: string } | null;
let chosen: { spec: Spec; n: number } | null = null;   // what the page's head asked for (null: nothing asked)
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


// ------------------------------------------------------------------ views
/** One view of the engraving. `base`: the one behind the whole page. */
export function ArtView({ piece, base }: { piece: string; base?: boolean }) {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => (el.current ? stage.addView(el.current, !!base) : undefined), [base, piece]);
  return (
    <div ref={el} className={`eng-view${base ? " eng-base" : ""}`} aria-hidden="true">
      <div className="eng-ground" />
      <div className="eng-flare" />
      <div className="eng-lines" style={{ maskImage: `url(/images/pieces/engraved/${piece}.webp)`, WebkitMaskImage: `url(/images/pieces/engraved/${piece}.webp)` }} />
      <canvas className="eng-bend" />
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

/**
 * A room of a door page, or a kind of book on a list page, as a gilded window onto the engraving (the owner, 2026-10-18:
 * "the rooms as gilded windows"; one window style for the whole site). Its name, Greek name and a line on what is in it
 * stand on the window's plate, with anything else (a few entries, a count) under them.
 */
export function Room({ href, title, greek, blurb, children, className }: { href?: string; title: string; greek?: string; blurb?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <ArtWindow className={`room${className ? ` ${className}` : ""}`}>
      {greek && <p className="room-gr" lang="grc">{greek}</p>}
      <h2 className="room-t">{href ? <Link href={href} transitionTypes={["page-turn"]}>{title}</Link> : title}</h2>
      {blurb && <p className="room-b">{blurb}</p>}
      {children}
    </ArtWindow>
  );
}
