"use client";
/**
 * The numbered sources of an author's article, folded away until wanted ("Sources (22)"). A footnote number in the article is a
 * link to its source (#src-4); following it opens the fold and brings that source into view, as does an address that ends
 * in one. (Browsers differ in whether they open a closed fold for a link into it, so this does not wait for them.)
 */
import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion, useSettings } from "@/lib/settings";
import { scrollBelowHeader } from "@/lib/header";
import styles from "./AuthorArticle.module.css";

export default function SourcesFold({ count, children }: { count: number; children: ReactNode }) {
  const fold = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    /** Open the fold if `hash` names one of its sources; give that source if the fold was shut until now (else the browser has taken the link). */
    const reveal = (hash: string) => {
      const box = fold.current;
      const src = box && /^#src-\d+$/.test(hash) ? document.getElementById(hash.slice(1)) : null;
      if (!box || !src || !box.contains(src) || box.open) return null;
      box.open = true;
      return src;
    };
    // a footnote followed: open the fold before the browser takes the link, so the link has a place to go
    const onClick = (e: MouseEvent) => {
      const a = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>('a[href^="#src-"]') : null;
      if (a) reveal(a.getAttribute("href") ?? "");
    };
    // an address that ends in a source (opened, or reached by Back) while the fold was shut: the browser could not scroll to it
    const arrive = () => {
      const src = reveal(location.hash);
      if (src) requestAnimationFrame(() => scrollBelowHeader(src, 16, !prefersReducedMotion(useSettings.getState().motion)));
    };
    arrive();
    document.addEventListener("click", onClick);
    addEventListener("hashchange", arrive);
    return () => { document.removeEventListener("click", onClick); removeEventListener("hashchange", arrive); };
  }, []);
  return (
    <details ref={fold} className={styles.sourcesFold}>
      <summary>Sources ({count})</summary>
      {children}
    </details>
  );
}
