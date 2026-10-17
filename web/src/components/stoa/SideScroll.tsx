"use client";
/**
 * A box that scrolls sideways when its contents are wider than the screen (a phone). While there is more to see on its
 * right, the box carries `data-more`, and its stylesheet fades the right edge as the cue (as the Academy's tables do).
 * `label` makes it a named, keyboard-focusable region, for contents with nothing focusable in them.
 */
import { useEffect, useRef } from "react";

export default function SideScroll({ className, label, children }: { className?: string; label?: string; children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const look = () => el.toggleAttribute("data-more", el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    look();
    el.addEventListener("scroll", look, { passive: true });
    const watch = new ResizeObserver(look);
    watch.observe(el);
    if (el.firstElementChild) watch.observe(el.firstElementChild);
    return () => { el.removeEventListener("scroll", look); watch.disconnect(); };
  }, []);
  return (
    <div ref={box} className={className} {...(label ? { role: "group", "aria-label": label, tabIndex: 0 } : {})}>
      {children}
    </div>
  );
}
