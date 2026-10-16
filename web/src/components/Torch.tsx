"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { startTorch, setQuiet } from "@/lib/torch";
import { startCalmScroll, stopCalmScroll } from "@/lib/calm-scroll";
import { layStone } from "@/lib/stone";
import { prefersReducedMotion, useSettings } from "@/lib/settings";

const POOLS = 6;   // the torch, and one for each of five fingers

/**
 * The torch's pools of light on the wall, behind everything on the page (lib/torch.ts), the still stone (lib/stone.ts)
 * and calm wheel scrolling (lib/calm-scroll.ts). In the reader the torch rests: nothing moves while you read, and the
 * page scrolls exactly as the browser scrolls it.
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
    layStone();
    return () => { stopTorch(); stopScroll(); };
  }, []);

  useEffect(() => { reader.current = inReader; setQuiet(inReader, 0); stopCalmScroll(); }, [inReader, pathname]);

  return (
    <div ref={box} className="torch" aria-hidden="true">
      {Array.from({ length: POOLS }, (_, i) => <div key={i} className="glow" />)}
    </div>
  );
}
