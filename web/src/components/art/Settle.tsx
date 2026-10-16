"use client";
/**
 * A heading whose letters settle into line as it rises into the upper part of the screen (DESIGN.md: Motion). Each
 * letter starts a little out of place (a fraction of an em up or down, a degree or two of tilt, a third as bright)
 * and eases into line; scrolling back lets them drift out again. Screen readers read the heading as one piece of text.
 * The letters' places are worked out from the text alone, so the page is the same on the server and in the browser.
 * With motion turned off the letters simply stand in line.
 */
import { useEffect, useRef, type ElementType, type HTMLAttributes } from "react";
import { onFrame, torchStill } from "@/lib/torch";

const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const frac = (v: number) => v - Math.floor(v);

interface Item { el: HTMLElement; sp: number; w: number | null }
const items = new Set<Item>();
let stop: (() => void) | null = null;

const moved: Item[] = [];
const write = () => { for (const h of moved) h.el.style.setProperty("--sp", h.w!.toFixed(3)); moved.length = 0; };

/** Measures every heading, then (once all are measured: lib/torch.ts) moves the letters of those that changed. */
function tick(_now: number, dt: number) {
  const H = innerHeight, still = torchStill(), k = 1 - Math.exp(-dt * 2.6);
  for (const h of items) {
    let sp = 1;
    if (!still) {
      const r = h.el.getBoundingClientRect();
      if (!r.height) continue;
      const raw = 1 - smooth((r.top - H * 0.68) / (H * 0.3));
      sp = h.sp < 0 ? raw : h.sp + (raw - h.sp) * k;
      if (Math.abs(raw - sp) < 0.002) sp = raw;
    }
    h.sp = sp;
    if (h.w === null || Math.abs(sp - h.w) > 0.003 || (sp !== h.w && (sp === 1 || sp === 0))) { h.w = sp; moved.push(h); }
  }
  return moved.length ? write : undefined;
}

type Props = HTMLAttributes<HTMLElement> & { text: string; as?: ElementType };

export default function Settle({ text, as: Tag = "span", className, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const h: Item = { el, sp: -1, w: null };
    items.add(h);
    if (!stop) stop = onFrame(tick);
    return () => { items.delete(h); if (!items.size && stop) { stop(); stop = null; } };
  }, []);

  // a letter is its base character with any accents and breathings that sit on it
  const words = text.split(" ").map((w) => w.match(/\P{M}\p{M}*/gu) ?? []);
  const n = words.reduce((a, w) => a + w.length, 0);
  let i = 0;
  return (
    <Tag ref={ref} className={className ? `sk ${className}` : "sk"} {...rest}>
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true">
        {words.map((w, wi) => (
          <span key={wi}>
            {wi > 0 && " "}
            <span className="sw">
              {w.map((ch) => {
                const f = frac(Math.sin((i + 1) * 12.9898 + n * 78.233) * 43758.5453), f2 = frac(Math.sin((i + 3) * 39.346 + n * 11.135) * 24634.6345);
                const style = { "--d": ((0.22 * i) / Math.max(1, n - 1) + f * 0.08).toFixed(3), "--dy": `${((f2 < 0.5 ? -1 : 1) * (0.08 + f * 0.16)).toFixed(3)}em`, "--rz": `${((f2 - 0.5) * 5).toFixed(1)}deg` } as React.CSSProperties;
                i++;
                return <span key={i} className="k" style={style}>{ch}</span>;
              })}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
