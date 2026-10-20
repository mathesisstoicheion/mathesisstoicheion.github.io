"use client";
/**
 * A page's window onto art, for the pages design A did not draw (the owner, 2026-10-19, "A only": every other page keeps
 * its layout, in A's colours, type, buttons and engraved windows). It is A's window: a framed opening in the black page onto
 * the page's own object, engraved in gold lines on Pompeian red (lib/a/lamplight.js), which opens as a round iris and whose
 * lines bend away from the pointer or a finger. data/pieces.ts says which object belongs to which page; the credit is
 * beneath it.
 *
 * On a page inside an area it is instead the opening where the area's figure gathers into its face (the owner, 2026-10-20:
 * the figures grow into the background as you scroll, and come back into the face at the top): an empty frame the page's
 * figure stage draws into from behind (AreaStage.tsx, FigStage.tsx), and the page's own piece moves to its foot
 * (FootPiece.tsx, which asks for the red window with `red`). A page that names its own piece (`spec`) keeps it.
 *
 * At the head of a page it stands at the right of the title, the words flowing round it. A header holds it twice: before
 * the title for a computer (`className="piece-desk"`) and after the page's main action for a phone (`"piece-phone"`);
 * only the one shown is drawn (the engine skips a window that takes no room, and the figure uses the opening shown).
 */
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { addWindow } from "@/lib/a/lamplight";
import { PIECE_CREDITS, PIECE_SHAPES, pieceFor } from "@/data/pieces";
import { AREAS } from "@/config/areas";
import { figureFor } from "@/data/figures";

export default function PageWin({ spec: given, className, red = false }: { spec?: { piece: string; why?: string } | null; className?: string; red?: boolean }) {
  const path = (usePathname() ?? "/").replace(/\/+$/, "") || "/";
  const found = given === undefined && !red ? figureFor(path) : null;
  const fig = found && AREAS[found.area].href !== path ? found : null;
  const spec = fig ? null : given !== undefined ? given : pieceFor(path);
  const shape = spec ? PIECE_SHAPES[spec.piece] : undefined;
  const credit = spec ? PIECE_CREDITS[spec.piece] : undefined;
  const ref = useRef<HTMLDivElement>(null);
  const src = spec && shape && credit ? `/images/a/pieces/${spec.piece}.png` : "";
  useEffect(() => { const el = ref.current; if (!el || !src) return; return addWindow(el, { src, kind: "pic" }); }, [src]);
  if (fig) {
    const who = fig.who[0].toUpperCase() + fig.who.slice(1);
    return (
      <figure className={`piece piece-head face-gap${className ? ` ${className}` : ""}`}>
        <div className="face-frame" data-face-anchor="" role="img"
          aria-label={`${who}, spelled out letter by letter from the Greek of ${fig.from}; scroll on, and the letters become ${fig.object} behind the page. Press and hold to read`} />
        <figcaption>{who} · spelled out of {fig.from} · press and hold to read</figcaption>
      </figure>
    );
  }
  if (!spec || !shape || !credit) return null;
  // the window's shape: about the object's own, between a square and two wide by three high (A's tall window is 3 by 4)
  const ratio = Math.min(1.5, Math.max(1, shape.h / shape.w));
  return (
    <figure className={`piece piece-head awin${className ? ` ${className}` : ""}`} style={{ "--piece-ratio": ratio } as React.CSSProperties}>
      <div ref={ref} className="awin-frame">
        <canvas role="img" aria-label={`${credit.alt}, engraved in gold lines`} />
      </div>
      <figcaption>
        <b>{credit.title}</b>{credit.date && <>, {credit.date}</>}.{" "}
        {spec.why && <span className="piece-why">{spec.why} </span>}
        <a href={credit.source} rel="noopener">The Met</a>
      </figcaption>
    </figure>
  );
}
