"use client";
/**
 * A heading whose letters settle into line as it rises into the upper part of the screen (DESIGN.md: Motion). Each
 * letter starts a little out of place (a fraction of an em up or down, a degree or two of tilt, a third as bright)
 * and eases into line; scrolling back lets them drift out again. Screen readers read the heading as one piece of text.
 * The letters' places are worked out from the text alone, so the page is the same on the server and in the browser.
 * With motion turned off the letters simply stand in line.
 *
 * Each frame measures every heading, and then (once every piece of the page has measured: lib/torch.ts) moves only
 * the letters whose place changed, each by a flat transform of its own: no letter is a layer of its own for the
 * graphics, and nothing else on the page is restyled.
 */
import { useEffect, useRef, type ElementType, type HTMLAttributes } from "react";
import { onFrame, torchStill } from "@/lib/torch";

const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const frac = (v: number) => v - Math.floor(v);

/** A letter: when it starts to settle (0 to 0.3 of the way), and how far out of place it starts (em, degrees). */
interface Letter { el: HTMLElement; d: number; dy: number; rz: number; p: number }
interface Item { el: HTMLElement; sp: number; w: number | null; ks: Letter[] }
const items = new Set<Item>();
let stop: (() => void) | null = null;

const moved: Item[] = [];
function write() {
  for (const h of moved) {
    const sp = Math.round(h.w! * 1000) / 1000;
    for (const k of h.ks) {
      const p = Math.min(1, Math.max(0, (sp - k.d) / 0.7));
      if (p === k.p) continue;
      k.p = p;
      const q = 1 - p;
      k.el.style.transform = q ? `translate(0, ${(q * k.dy).toFixed(3)}em) rotate(${(q * k.rz).toFixed(2)}deg)` : "";
      k.el.style.opacity = q ? (0.34 + 0.66 * p).toFixed(3) : "";
    }
  }
  moved.length = 0;
}

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
    const ks = Array.from(el.querySelectorAll<HTMLElement>(".k"), (k) => {
      const v = (n: string) => parseFloat(k.style.getPropertyValue(n)) || 0;
      return { el: k, d: v("--d"), dy: v("--dy"), rz: v("--rz"), p: 1 };
    });
    const h: Item = { el, sp: -1, w: null, ks };
    items.add(h);
    if (!stop) stop = onFrame(tick);
    return () => { items.delete(h); if (!items.size && stop) { stop(); stop = null; } };
    // its letters are found again if its text changes
  }, [text]);

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
