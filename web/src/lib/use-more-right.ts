"use client";
/**
 * A box that scrolls sideways when its contents are wider than the screen (a phone): while there is more to see on its
 * right, it carries `data-more`, and its stylesheet fades the right edge as the cue. Used by the Academy's tables and
 * the row of filters above them (the Explore room's SideScroll does the same for its drawings).
 */
import { useEffect, type RefObject } from "react";

export function useMoreRight(box: RefObject<HTMLElement | null>) {
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
  }, [box]);
}
