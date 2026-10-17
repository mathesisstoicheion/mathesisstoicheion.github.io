"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { startTorch, setQuiet } from "@/lib/torch";
import { startCalmScroll, stopCalmScroll } from "@/lib/calm-scroll";
import { prefersReducedMotion, useSettings } from "@/lib/settings";

const POOLS = 6;   // the torch, and one for each of five fingers (a phone shows only the torch)

/**
 * The torch's pools of light on the wall, behind everything on the page (lib/torch.ts), and calm wheel scrolling
 * (lib/calm-scroll.ts); the still stone of the wall is a picture (globals.css, lib/stone.ts). In the reader the torch
 * rests: nothing moves while you read, and the page scrolls exactly as the browser scrolls it.
 */
export default function Torch() {
  const pathname = usePathname();
  const box = useRef<HTMLDivElement>(null);
  const reader = useRef(false);
  const inReader = pathname === "/read" || pathname.startsWith("/read/");

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const still = () => prefersReducedMotion(useSettings.getState().motion);
    const stopTorch = startTorch(Array.from(el.children) as HTMLElement[], still);
    const stopScroll = startCalmScroll(() => !reader.current && !still());
    return () => { stopTorch(); stopScroll(); };
  }, []);

  useEffect(() => { reader.current = inReader; setQuiet(inReader, 0); stopCalmScroll(); }, [inReader, pathname]);

  return (
    <div ref={box} className="torch" aria-hidden="true">
      {Array.from({ length: POOLS }, (_, i) => <div key={i} className="glow" />)}
    </div>
  );
}
