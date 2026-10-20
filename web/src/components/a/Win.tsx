"use client";
/**
 * One of design A's windows onto art: a framed opening in the black page, with a real object engraved in gold lines on
 * Pompeian red inside it (lib/a/lamplight.js draws it). On the home page and the other pages it opens by itself as a round
 * iris once it comes into view, first onto the middle of its picture alone, then onto the whole window, and its caption
 * comes up last; then it stays open.
 * The lines bend away from the pointer, or from every finger on a phone. Its credit waits behind a small ⓘ at the end of its
 * caption (review fix list, slice 7), not in a paragraph of credits.
 */
import { useEffect, useRef } from "react";
import { addWindow } from "@/lib/a/lamplight";
import InfoTip from "./InfoTip";

export default function Win({ className, src, kind = "pic", label, caption, credit, capClass, decorative, children }:
  { className: string; src: string; kind?: "coin" | "pic"; label: string; caption?: React.ReactNode; credit?: React.ReactNode; capClass: string;
    /** an ornament inside a button or a link whose own words say what it is: hidden from screen readers */
    decorative?: boolean; children?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { const el = ref.current; if (!el) return; return addWindow(el, { src, kind }); }, [src, kind]);
  return (
    <div ref={ref} className={className} aria-hidden={decorative || undefined}>
      <canvas role={decorative ? undefined : "img"} aria-label={decorative ? undefined : label} />
      {caption && <span className={capClass} data-wcap="">{caption}{credit && <> <InfoTip small label={`About the picture: ${label}`}>{credit}</InfoTip></>}</span>}
      {children}
    </div>
  );
}
