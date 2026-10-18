"use client";
/**
 * The page's own piece of ancient sculpture, standing in a niche cut into the wall and lit by the torch (data/pieces.ts
 * says which piece belongs to which page; lib/art/piece.ts draws it). On a computer the torch follows the mouse; on a
 * phone it stands in the middle of the screen, so the piece lights as scrolling brings it there and its shadow swings
 * round as it passes. Clicking it (tapping it, on a phone) sets a steady lamp before it so it can be seen clearly;
 * clicking again gives it back to the torch (the owner, 2026-10-16).
 *
 * `place="head"` stands it in a big window at the right of a page's title, the words flowing round it. A header holds it
 * twice: before the title for a computer (`className="piece-desk"`) and at the very top of the page for a phone
 * (`"piece-phone"`), where it has a window of its own across the screen; only the one shown is ever loaded and drawn. Pages with no title on show (a
 * form, a private page) get theirs from the layout instead, at the foot of the page (`place="foot"`): it appears only
 * when no piece has been placed at the head.
 */
import LampHint from "./LampHint";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { preload } from "react-dom";
import { Piece, loadPiece, type PieceLook } from "@/lib/art/piece";
import { redrawArt, useTorchlit } from "@/lib/art/part";
import { PHONE } from "@/lib/art/common";
import { PIECE_CREDITS, PIECE_SHAPES, pieceFor, type PieceShape } from "@/data/pieces";

// how many pieces stand at the head of the page now (the one at the foot waits for none)
let heads = 0;
const subs = new Set<() => void>();
const bump = (d: number) => { heads += d; subs.forEach((f) => f()); };
const useHeads = () => useSyncExternalStore((f) => { subs.add(f); return () => { subs.delete(f); }; }, () => heads, () => 0);
const never = () => () => {};
/** false while the page is built and first shown, true once it runs in the browser */
const useMounted = () => useSyncExternalStore(never, () => true, () => false);

/**
 * The niche's shape and how the piece stands in it, from the piece's own proportions. Every niche is round-headed
 * (PAGE-RULES.md, rule 1, the owner's choice, 2026-10-18); a broad slab or block gets a wider window, a little taller than
 * it is wide, and stands on its sill.
 */
function lookOf(s: PieceShape): { look: PieceLook; ratio: number; wide: boolean } {
  const a = s.h / s.w;
  const flat = s.form === "slab" || s.form === "relief";
  if (a < 0.82 || (flat && a < 1.05)) {
    return { look: { niche: "arch", margin: [0.2, 0.08, 0.035, 0.08], material: s.material, detail: 1.15 }, ratio: Math.min(1.25, Math.max(1.05, a + 0.45)), wide: true };
  }
  return { look: { niche: "arch", material: s.material, ...(flat ? { detail: 1.15 } : {}) }, ratio: Math.min(1.95, Math.max(1.18, a * 0.99 + 0.08)), wide: false };
}

/** Where the still picture stands: the margins round the piece in its niche (lib/art/piece.ts, figBox; its default there). */
const stillBox = ([t, r, b, l] = [0.2, 0.12, 0.035, 0.12]) =>
  ({ "--mt": `${t * 100}%`, "--mr": `${r * 100}%`, "--mb": `${b * 100}%`, "--ml": `${l * 100}%` }) as React.CSSProperties;

/** Resolves once the element is near the screen, so a piece far down the page fetches nothing until it is wanted. */
function near(el: Element) {
  return new Promise<void>((res) => {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); res(); } }, { rootMargin: "60% 0%" });
    io.observe(el);
  });
}

/**
 * Holds the place of a piece that will stand at the head of the page once the page has opened (shown while it is still
 * loading), so that the piece at the foot does not appear meanwhile, only to vanish when the page arrives.
 */
export function PieceHold() {
  useEffect(() => { bump(1); return () => bump(-1); }, []);
  return null;
}

/**
 * `steady`: on a phone, the piece keeps one still light rather than the torch in the middle of the screen, so it is not
 * redrawn as the page scrolls (the home page's, which stands in the carved wall: the wall and the piece both re-lit on
 * every frame of scrolling halved its speed in the speed test, 2026-10-17).
 */
export default function PagePiece({ place = "head", spec: given, className, steady }: { place?: "head" | "foot"; spec?: { piece: string; why?: string } | null; className?: string; steady?: boolean }) {
  const path = usePathname() ?? "/";
  const spec = given !== undefined ? given : pieceFor(path);
  const shape = spec ? PIECE_SHAPES[spec.piece] : undefined;
  const credit = spec ? PIECE_CREDITS[spec.piece] : undefined;
  const cv = useRef<HTMLCanvasElement>(null);
  const art = useRef<Piece | null>(null);
  // the lamp belongs to the piece it was set before: another page's piece starts in the torchlight
  const [litFor, setLitFor] = useState<string | null>(null);
  const lit = !!spec && litFor === spec.piece;
  const mounted = useMounted();
  const others = useHeads();

  useEffect(() => { if (place !== "head" || !spec) return; bump(1); return () => bump(-1); }, [place, spec]);

  const shown = !!(spec && shape && credit) && (place === "head" || (mounted && others === 0));
  const L = shape ? lookOf(shape) : null;

  useTorchlit(cv, async (c) => {
    if (!spec || !L) return null;
    // until the piece has come, its niche is already cut in the wall (globals.css, .piece-niche::before); it gives
    // way to the drawn niche as the light comes up on the piece
    c.parentElement?.removeAttribute("data-ready");
    await near(c);
    const f = await loadPiece(spec.piece);
    if (!f) return null;
    const p = new Piece(c, f.alb, f.map, L.look);
    art.current = p;
    requestAnimationFrame(() => c.parentElement?.setAttribute("data-ready", ""));
    return p;
  }, { still: (w, h) => ({ x: -w * 0.3, y: -h * 0.2 }), steady: steady ? PHONE : undefined }, shown ? spec!.piece : "");

  if (!shown || !L) return null;
  // the piece at the head of the page is the first thing seen, so it is the first thing fetched: the page asks for its two
  // pictures at once, ahead of everything else, before the page's scripts have even run (the same requests loadPiece
  // makes, so the browser hands it these)
  if (place === "head") {
    for (const u of [`/images/pieces/lit/${spec!.piece}.jpg`, `/images/pieces/lit/${spec!.piece}-m.png`]) preload(u, { as: "fetch", crossOrigin: "anonymous", fetchPriority: "high" });
  }
  // (the canvas is keyed by its piece: a piece's light is put out when it goes, and a canvas whose light has been put out
  // cannot be lit again, so the layout's piece at the foot of the page gets a fresh canvas when the page, and its piece, change)
  const toggle = () => {
    const p = art.current, c = cv.current;
    const on = !lit;
    setLitFor(on ? spec!.piece : null);
    if (p && c) { p.lampTo = on ? 1 : 0; redrawArt(c); }
  };
  return (
    <figure className={`piece piece-${place}${L.wide ? " piece-wide" : ""}${className ? ` ${className}` : ""}`} data-niche={L.look.niche} style={{ "--piece-ratio": L.ratio } as React.CSSProperties}>
      <button type="button" className="piece-niche" aria-pressed={lit} onClick={toggle}
        aria-label={lit ? "Take the lamp away, back to your torch" : "Set a lamp before the sculpture"}>
        {/* a faint still picture of the piece, there from the first moment, standing where the lit piece will stand; it
            fades as the light comes up on the piece (PAGE-RULES.md, rule 7) */}
        {/* eslint-disable-next-line @next/next/no-img-element -- a small self-hosted picture; no image service */}
        <img className="piece-still" src={`/images/pieces/lit/${spec!.piece}-s.webp`} alt="" aria-hidden="true" loading="lazy" decoding="async"
          fetchPriority={place === "head" ? "high" : "auto"} style={stillBox(L.look.margin)} />
        <canvas key={spec!.piece} ref={cv} role="img" aria-label={credit!.alt} />
        <LampHint lit={lit} />
      </button>
      <figcaption>
        <b>{credit!.title}</b>{credit!.date && <>, {credit!.date}</>}.{" "}
        {spec!.why && <span className="piece-why">{spec!.why} </span>}
        <a href={credit!.source} rel="noopener">The Met</a>
      </figcaption>
    </figure>
  );
}
