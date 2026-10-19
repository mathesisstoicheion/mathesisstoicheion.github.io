"use client";
/**
 * One of design A's windows onto art: a framed opening in the black page, with a real object engraved in gold lines on
 * Pompeian red inside it (lib/a/lamplight.js draws it). On the home page and the other pages it opens as a round iris as
 * you reach it, first onto the middle of its picture alone, then onto the whole window, and its caption comes up last.
 * The lines bend away from the pointer, or from every finger on a phone.
 */
import { useEffect, useRef } from "react";
import { addWindow } from "@/lib/a/lamplight";

export default function Win({ className, src, kind = "pic", label, caption, capClass, children }:
  { className: string; src: string; kind?: "coin" | "pic"; label: string; caption?: React.ReactNode; capClass: string; children?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { const el = ref.current; if (!el) return; return addWindow(el, { src, kind }); }, [src, kind]);
  return (
    <div ref={ref} className={className}>
      <canvas role="img" aria-label={label} />
      {caption && <span className={capClass} data-wcap="">{caption}</span>}
      {children}
    </div>
  );
}
