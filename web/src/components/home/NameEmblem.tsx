"use client";
/**
 * The name's emblem on the home page (DESIGN.md, The name): a wax tablet with Euclid's first proposition, a stylus
 * standing in the wax like a sundial's pointer, and a compass, drawn slowly when it comes into view; then every light
 * casts its own shadows across it (lib/art/emblem.js, loaded only in the browser).
 */
import { useEffect, useRef } from "react";
import { torchStill } from "@/lib/torch";

export default function NameEmblem({ className }: { className?: string }) {
  const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = cv.current;
    if (!c) return;
    let stop: (() => void) | null = null, gone = false;
    import("@/lib/art/emblem.js").then((m) => { if (!gone) stop = m.mountEmblem(c, { still: torchStill() }); });
    return () => { gone = true; stop?.(); };
  }, []);
  return (
    <canvas ref={cv} className={className} role="img"
      aria-label="A wax tablet with Euclid’s first proposition scratched in it, a stylus standing in the wax like a sundial’s pointer, and a compass" />
  );
}
