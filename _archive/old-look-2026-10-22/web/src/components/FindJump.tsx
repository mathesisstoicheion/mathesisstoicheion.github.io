"use client";
/**
 * A page's search, offered in its head as the page's main action (PAGE-RULES.md, rule 2), when the search itself stands
 * on the list it searches further down (the owner, 2026-10-17: a search must sit with its list). It looks like the
 * search box it opens: a tap brings that box and its list into view and puts the cursor in it, so there is still only
 * one search on the page.
 */
import { scrollBelowHeader } from "@/lib/header";
import { scrollBehavior } from "@/lib/settings";

export default function FindJump({ target, label, children }: { target: string; label: string; children: React.ReactNode }) {
  const go = () => {
    const el = document.getElementById(target) as HTMLInputElement | null;
    if (!el) return;
    // the box comes to the top of the screen, clear of the header (gliding, as the A to Z does), and takes the cursor
    scrollBelowHeader((el.closest("section") ?? el.parentElement ?? el) as HTMLElement, 12, scrollBehavior() === "smooth" ? "glide" : false);
    el.focus({ preventScroll: true });
  };
  return (
    <button type="button" className="find-jump" onClick={go} aria-label={label}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg>
      <span>{children}</span>
    </button>
  );
}
