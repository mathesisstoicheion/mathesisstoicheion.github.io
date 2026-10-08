"use client";
/**
 * "Continue where you left off": the tracker (in the root layout) remembers every page visited and
 * how far down it was scrolled; the home page's desk (components/home/Desk.tsx) offers the last place, the
 * books in progress and the other recent pages. Following a link back to a page restores its scroll.
 */
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import type { CatalogIndex } from "@/lib/catalog";
import { recordVisit, saveScroll, savedScroll, pageKey, type Visit } from "@/lib/resume";
import { getPosition } from "@/lib/position";
import { LESSONS } from "@/data/lessons";
import { AREAS } from "@/config/areas";

export const RESTORE = "mathesis:restore-scroll";

export function ResumeTracker() {
  const pathname = usePathname();
  const params = useSearchParams();
  const href = `${pathname}${params.size ? `?${params}` : ""}`;

  useEffect(() => {
    // record the visit once the page has settled (a quick redirect is not a visit)
    const t = setTimeout(() => recordVisit(href, document.title.replace(/ · Mathesis Stoicheion$/, "")), 800);
    // remember how far down the page is, as it scrolls
    let pending = 0;
    const onScroll = () => { cancelAnimationFrame(pending); pending = requestAnimationFrame(() => saveScroll(href, scrollY)); };
    addEventListener("scroll", onScroll, { passive: true });
    // arriving from "Continue where you left off": go back down to where the page was left
    let restore: ReturnType<typeof setInterval> | undefined;
    try {
      if (sessionStorage.getItem(RESTORE) === pageKey(href)) {
        sessionStorage.removeItem(RESTORE);
        const y = savedScroll(href);
        let tries = 0;
        // the page may still be growing (texts and lists load after it opens): try for a few seconds
        if (y) restore = setInterval(() => { if (document.documentElement.scrollHeight >= y + innerHeight || ++tries > 20) { scrollTo({ top: y }); clearInterval(restore); } }, 150);
      }
    } catch { /* storage unavailable */ }
    return () => { clearTimeout(t); removeEventListener("scroll", onScroll); cancelAnimationFrame(pending); clearInterval(restore); };
  }, [href]);
  return null;
}

/** A plain description of a remembered page. */
export function describe(v: Visit, idx: CatalogIndex | null): { what: string; where?: string } {
  const u = new URL(v.href, "http://x");
  const q = u.searchParams;
  if (u.pathname === "/read") {
    const name = (w: string | null) => { if (!w) return null; const a = idx?.authorOf.get(w), wk = idx?.work.get(w); return wk ? `${a ? `${a.name}, ` : ""}${wk.title}` : w; };
    const at = getPosition(q.get("w") ?? "")?.at ?? q.get("at");
    return { what: name(q.get("w")) ?? "The reader", where: [at ? `at ${at}` : null, q.get("w2") ? `with ${name(q.get("w2"))} beside it` : null].filter(Boolean).join(", ") || undefined };
  }
  const lesson = /^\/academy\/lesson\/(.+)$/.exec(u.pathname);
  if (lesson) { const i = LESSONS.findIndex((l) => l.id === lesson[1]); return { what: i >= 0 ? `Lesson ${i + 1}: ${LESSONS[i].title}` : "A lesson" }; }
  if (u.pathname === "/search" && q.get("q")) return { what: `${AREAS.search.name}: “${q.get("q")}”`, where: "your search, with its filters" };
  if (u.pathname === "/treasury/word" && q.get("l")) return { what: `Word Study: ${q.get("l")}` };
  if (u.pathname === "/library" && q.get("a")) return { what: idx?.author.get(q.get("a")!)?.name ?? "The Mouseion", where: AREAS.library.name };
  return { what: v.title || u.pathname };
}

/** Where to send the reader back to: the reader resumes at its own remembered passage. */
export function resumeHref(v: Visit): string {
  const u = new URL(v.href, "http://x");
  if (u.pathname === "/read") {
    const at = getPosition(u.searchParams.get("w") ?? "")?.at;
    if (at) u.searchParams.set("at", at);
    for (const k of ["hl", "find", "tu"]) u.searchParams.delete(k);
  }
  return u.pathname + u.search;
}

export const ago = (t: number) => {
  const m = Math.round((Date.now() - t) / 60000);
  if (m < 2) return "just now";
  if (m < 60) return `${m} minutes ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "yesterday" : `${d} days ago`;
};
