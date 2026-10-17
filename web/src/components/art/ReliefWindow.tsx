"use client";
/**
 * A window cut into the wall with a real relief in it, lit by the torch. The home page's reliefs are drawn like every
 * page's own piece (lib/art/piece.ts: the photograph in colour, with its carving's shadows cast by the torch); clicking
 * one (tapping it, on a phone) sets a steady lamp before it, and clicking again gives it back to the torch (the owner,
 * 2026-10-16). The medallions (`kind="medallion"`) are re-lit greyscale copies (lib/art/relief.ts,
 * pipeline/relit_images.py, web/public/images/relit/). Each credit is the caption, given by the page. Until the picture
 * has loaded, and if the browser cannot draw it, the window is dark stone and the caption still names what it shows.
 */
import { useRef, useState, type ReactNode } from "react";
import { loadImage } from "@/lib/art/common";
import { Relief, type ReliefOptions } from "@/lib/art/relief";
import { Piece, loadPiece, type PieceLook } from "@/lib/art/piece";
import { redrawArt, useTorchlit } from "@/lib/art/part";
import { PIECE_SHAPES } from "@/data/pieces";

/** How each re-lit medallion is cut and lit (the settings tried in the design samples). */
const KINDS: Record<string, ReliefOptions> = {
  medallion: { round: true, depth: 2.4, area: 26000, lowW: 170, amb: 0.1, spec: 0.22 },
};
/** How each relief stands in its window: a relief fills it; the grave stele stands free in a round-headed niche. */
const LOOKS: Record<string, PieceLook> = {
  "great-eleusinian-relief": { fit: "cover", fy: 0.42 },
  "parthenon-frieze-cast": { fit: "cover", fx: 0.52, fy: 0.4 },
  "stele-woman-and-servant": { niche: "arch", margin: [0.1, 0.1, 0.03, 0.1], detail: 1.15 },
};

interface Props {
  /** the piece's name (data/piece-shapes.json), or a medallion's picture in web/public/images/relit/ */
  pic: string;
  /** what the picture shows, for screen readers */
  alt: string;
  caption?: ReactNode;
  className?: string;
  frameClassName?: string;
  /** "medallion": a round medallion sunk in the stone; otherwise the piece's own look */
  kind?: string;
  delay?: number;
  /** lit by daylight (the reader's Daylight page): one still, even light */
  day?: boolean;
}

export default function ReliefWindow({ pic, alt, caption, className, frameClassName, kind, delay, day }: Props) {
  const cv = useRef<HTMLCanvasElement>(null);
  const art = useRef<Piece | null>(null);
  const [lit, setLit] = useState(false);
  const shape = kind ? undefined : PIECE_SHAPES[pic];
  // a fresh canvas for each picture and light (a canvas whose WebGL light has been put out cannot be lit again)
  const id = pic + (kind ?? "") + (day ? "day" : "");
  useTorchlit(cv, async (c) => {
    if (shape) {
      const f = await loadPiece(pic);
      if (!f) return null;
      const p = new Piece(c, f.alb, f.map, { material: shape.material, ...(LOOKS[pic] ?? { fit: "cover" }) });
      p.setDay(!!day);
      art.current = p;
      return p;
    }
    const img = await loadImage(`/images/relit/${pic}.jpg`);
    if (!img) return null;
    const r = new Relief(c, img, KINDS[kind ?? pic] ?? {});
    r.day = !!day;
    return r;
  }, { delay, day: () => !!day, still: (w, h) => ({ x: -w * 0.4, y: -h * 0.6 }) }, id);
  const toggle = () => {
    const p = art.current, c = cv.current;
    const on = !lit;
    setLit(on);
    if (p && c) { p.lampTo = on ? 1 : 0; redrawArt(c); }
  };
  const frame = (
    <div className={frameClassName ?? "frame"}>
      {shape ? (
        <button type="button" className="piece-niche" aria-pressed={lit} onClick={toggle}
          title={lit ? "Click to give it back to your torch" : "Click to light it"}
          aria-label={lit ? "Take the lamp away, back to your torch" : "Set a lamp before the relief"}>
          <canvas key={id} ref={cv} role="img" aria-label={alt} />
        </button>
      ) : <canvas key={id} ref={cv} role="img" aria-label={`${alt} It is lit by your torch.`} />}
    </div>
  );
  if (!caption) return frame;
  return (
    <figure className={className ? `win ${className}` : "win"}>
      {frame}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
