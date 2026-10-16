"use client";
/**
 * A window cut into the wall with a real relief in it, re-lit by the torch (lib/art/relief.ts). The picture is a
 * greyscale copy of a licensed photograph (pipeline/relit_images.py, web/public/images/relit/); its credit is the
 * caption, given by the page. Until the picture has loaded, and if the browser cannot draw it, the window is dark
 * stone and the caption still names what it shows.
 */
import { useRef, type ReactNode } from "react";
import { loadImage } from "@/lib/art/common";
import { Relief, type ReliefOptions } from "@/lib/art/relief";
import { useTorchlit } from "@/lib/art/part";

/** How each relief is cut and lit (the settings tried in the design samples). */
const KINDS: Record<string, ReliefOptions> = {
  "great-eleusinian-relief": { depth: 2.4, fy: 0.42, amb: 0.09 },
  "parthenon-frieze-cast": { depth: 2.3, fx: 0.52, fy: 0.4, area: 62000, lowW: 440, amb: 0.09, kd: 1.25 },
  "stele-woman-and-servant": { depth: 2.2, cut: true, rim: false, area: 48000, amb: 0.08 },
  medallion: { round: true, depth: 2.4, area: 26000, lowW: 170, amb: 0.1, spec: 0.22 },
};

interface Props {
  /** the picture's name in web/public/images/relit/ (and in data/images.json) */
  pic: string;
  /** what the picture shows, for screen readers */
  alt: string;
  caption?: ReactNode;
  className?: string;
  frameClassName?: string;
  /** "medallion": a round medallion sunk in the stone; otherwise the picture's own settings */
  kind?: string;
  delay?: number;
  /** lit by daylight (the reader's Daylight page): one still, even light */
  day?: boolean;
}

export default function ReliefWindow({ pic, alt, caption, className, frameClassName, kind, delay, day }: Props) {
  const cv = useRef<HTMLCanvasElement>(null);
  useTorchlit(cv, async (c) => {
    const img = await loadImage(`/images/relit/${pic}.jpg`);
    if (!img) return null;
    const r = new Relief(c, img, KINDS[kind ?? pic] ?? {});
    r.day = !!day;
    return r;
  }, { delay, day: () => !!day, still: (w, h) => ({ x: -w * 0.4, y: -h * 0.6 }) }, pic + (kind ?? "") + (day ? "day" : ""));
  const frame = <div className={frameClassName ?? "frame"}><canvas ref={cv} role="img" aria-label={`${alt} It is lit by your torch.`} /></div>;
  if (!caption) return frame;
  return (
    <figure className={className ? `win ${className}` : "win"}>
      {frame}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
