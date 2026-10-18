"use client";
/**
 * The home page's wall (DESIGN.md, Screens: Home): the opening of Plato's Apology cut into the stone behind the opening
 * words, in capitals with no spaces or accents, as Greek was carved in Plato's time (data/apology-wall.ts). The letters
 * are cut in diagonally across the wall when the page opens, and catch the torch as it passes. Near the words over the
 * wall (anything inside the hero marked data-quiet) the letters stay dim, so the words stay easy to read.
 */
import { useEffect, useRef } from "react";
import { carvedCaps } from "@/lib/art/common";
import { Carved } from "@/lib/art/carve";
import { carvingFontReady, relayoutArt, useTorchlit } from "@/lib/art/part";
import { APOLOGY_OPENING } from "@/data/apology-wall";
import { useLight } from "@/lib/settings";

const TEXT = carvedCaps(APOLOGY_OPENING);

export default function Wall({ className }: { className?: string }) {
  const cv = useRef<HTMLCanvasElement>(null);
  const quiet = () => Array.from(cv.current?.parentElement?.querySelectorAll<HTMLElement>("[data-quiet]") ?? []).filter((el) => el.offsetParent !== null);

  const day = useLight();
  useTorchlit(cv, async (c) => {
    await carvingFontReady();
    return new Carved(c, {
      pal: day ? "day" : "night",
      text: TEXT, fill: true, cell: (w) => (w < 760 ? 29 : w < 1100 ? 38 : 44), order: "diag", reveal: 2.6, dur: 1.4, rad: 0.66,
      quiet: (base) => quiet().map((el) => { const r = el.getBoundingClientRect(); return { left: r.left - base.left, right: r.right - base.left, top: r.top - base.top, bottom: r.bottom - base.top }; }),
    });
  }, { delay: 0.15, day: () => day }, day ? "day" : "");

  // when the words over the wall change size (a choice opens, the desk fills in), the quiet places move with them
  useEffect(() => {
    const c = cv.current;
    if (!c || typeof ResizeObserver === "undefined") return;
    let t = 0;
    const ro = new ResizeObserver(() => { clearTimeout(t); t = window.setTimeout(() => relayoutArt(c), 120); });
    ro.observe(c);
    for (const el of quiet()) ro.observe(el);
    return () => { ro.disconnect(); clearTimeout(t); };
  }, []);

  return <canvas ref={cv} className={className} aria-hidden="true" />;
}
