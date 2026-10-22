"use client";
/**
 * Phones only: the doors of the site along the bottom of the screen (Search in the middle), in reach of the thumb. Brought
 * back by the owner, 2026-10-22. Settings > Bottom bar says how it behaves (lib/settings.ts, BarMode):
 * - "scroll": it tucks away with the header while you read on, and comes back on any scroll up (Header.tsx, data-hdr);
 * - "button": it stays until its own small button puts it away, and a tab in the corner brings it back;
 * - "always": it stays.
 * In the reader it never stays: there it always tucks away while you read on, whatever the setting.
 * While it shows, it sets data-tabbar="up" on <html>, so what floats at the foot of the screen (Back to top, the toast,
 * Listen) stands above it.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { AREAS, TABS, type AreaId } from "@/config/areas";
import { useSettings } from "@/lib/settings";
import { useUI } from "@/lib/ui";
import styles from "./TabBar.module.css";

const ICONS: Partial<Record<AreaId, ReactNode>> = {
  // a papyrus roll, open between its two rollers
  library: <><rect x="3.5" y="4" width="3.6" height="16" rx="1.8" /><rect x="16.9" y="4" width="3.6" height="16" rx="1.8" /><path d="M7.1 6.5h9.8v11H7.1z" /><path d="M9.6 10h4.8M9.6 13.5h4.8" /></>,
  // the letter alpha
  study: <path d="M18.6 7.2c-.8 3.6-2 6.9-3.6 8.9-1.2 1.4-2.6 2.2-4.2 2.2-2.6 0-4.4-2.1-4.4-5.1 0-3.3 2.2-6 5-6 2.3 0 3.6 1.8 4.3 4.5.7 2.6 1.3 6.6 3.3 6.6" />,
  // a colonnade under its roof
  wiki: <><path d="M3 8.2 12 4l9 4.2z" /><path d="M5.5 10.5v7M10 10.5v7M14 10.5v7M18.5 10.5v7M3.5 20h17M4 10.3h16" /></>,
  // a lens
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.3 15.3 5.2 5.2" /><path d="M7.6 10.5a2.9 2.9 0 0 1 2.9-2.9" /></>,
  // two voices
  forum: <><path d="M4.5 4.5h10a1.5 1.5 0 0 1 1.5 1.5v5.5a1.5 1.5 0 0 1-1.5 1.5H9.5L6 16v-3H4.5A1.5 1.5 0 0 1 3 11.5V6a1.5 1.5 0 0 1 1.5-1.5z" /><path d="M18.5 9h1a1.5 1.5 0 0 1 1.5 1.5V16a1.5 1.5 0 0 1-1.5 1.5H19v3l-3.5-3h-4a1.5 1.5 0 0 1-1.5-1.5V15" /></>,
  // a ribbon marking your place
  treasury: <path d="M7 3.5h10a.5.5 0 0 1 .5.5v16.2l-5.5-4.3-5.5 4.3V4a.5.5 0 0 1 .5-.5z" />,
};

const under = (pathname: string, href: string) => pathname === href || pathname.startsWith(href + "/");
/** the door's short word, as on the header (Read, Learn, Explore…) */
const word = (id: AreaId) => AREAS[id].door ?? AREAS[id].english ?? AREAS[id].name;

export default function TabBar() {
  const pathname = usePathname() ?? "/";
  const current = TABS.findIndex((t) => [AREAS[t.id].href, ...(t.also ?? [])].some((h) => under(pathname, h)));
  const searchOpen = useUI((s) => s.searchOpen);
  const setSearchOpen = useUI((s) => s.setSearchOpen);
  const mode = useSettings((s) => s.bar);
  const reading = under(pathname, AREAS.reader.href);
  // "button": put away by its own button until the tab in the corner brings it back
  const [putAway, setPutAway] = useState(false);
  // the header's state: tucked away while you read on (Header.tsx)
  const [tucked, setTucked] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setTucked(root.dataset.hdr === "hidden");
    read();
    const mo = new MutationObserver(read);
    mo.observe(root, { attributes: true, attributeFilter: ["data-hdr"] });
    return () => mo.disconnect();
  }, []);

  // never kept showing in the reader: there every setting tucks it away while you read on
  const followsScroll = mode === "scroll" || reading;
  const away = (followsScroll && tucked) || (mode === "button" && putAway);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.tabbar = away ? "down" : "up";
    return () => { delete root.dataset.tabbar; };
  }, [away]);

  return (
    <>
      <nav className={styles.bar} aria-label="Areas of the site" data-away={away || undefined} style={{ viewTransitionName: "site-tabbar" }}>
        <div className={styles.tabs} style={{ "--i": Math.max(current, 0), "--n": TABS.length } as CSSProperties} data-none={current < 0 || undefined}>
          <span className={styles.ind} aria-hidden="true" />
          {TABS.map((t, i) => {
            const a = AREAS[t.id];
            // Search opens the universal search from wherever you are
            if (t.id === "search") return (
              <button key={t.id} type="button" className={`${styles.tab} ${styles.searchTab}`} onClick={() => setSearchOpen(true)}
                aria-haspopup="dialog" aria-expanded={searchOpen} aria-current={i === current ? "page" : undefined}>
                <span className={styles.lens}><svg viewBox="0 0 24 24" aria-hidden="true">{ICONS.search}</svg></span>
                <span className={styles.label}>Search<span className="visually-hidden">, {a.name}</span></span>
              </button>
            );
            return (
              <Link key={t.id} className={styles.tab} href={a.href} transitionTypes={["page-turn"]} aria-current={i === current ? "page" : undefined}>
                <svg viewBox="0 0 24 24" aria-hidden="true">{ICONS[t.id]}</svg>
                <span className={styles.label}>{word(t.id)}<span className="visually-hidden">, {a.name}</span></span>
              </Link>
            );
          })}
        </div>
        {mode === "button" && (
          <button type="button" className={styles.putAway} onClick={() => setPutAway(true)} aria-label="Hide the bottom bar" title="Hide the bottom bar">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6.5 8 10l4-3.5" /></svg>
          </button>
        )}
      </nav>
      {mode === "button" && putAway && (
        <button type="button" className={styles.bringBack} onClick={() => setPutAway(false)} aria-label="Show the bottom bar" title="Show the bottom bar">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 9.5 8 6l4 3.5" /></svg>
        </button>
      )}
    </>
  );
}
