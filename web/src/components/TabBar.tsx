"use client";
/**
 * Phones only: the rooms along the foot of the screen, in reach of the thumb (redesign decisions 9 and 10, 2026-10-22),
 * designed new for the printed page (the owner: "Don't keep the old template. It looks cheap and clunky."). It reads like
 * the foot of a printed page: the paper, a thin rule of ink above, the four rooms in Garamond with their Greek names in
 * small italic beneath, the room you are in, in red. No pills, no shadows, no icons in boxes.
 * It slips away as you scroll down and comes back when you scroll up (it follows the header's data-hdr, Header.tsx);
 * there is no setting for this. It never shows in the reader. While it shows it sets data-tabbar="up" on <html>, so what
 * floats at the foot of the screen (Back to top, the toast, Listen) stands above it.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AREAS, TABS } from "@/config/areas";
import styles from "./TabBar.module.css";

const under = (pathname: string, href: string) => pathname === href || pathname.startsWith(href + "/");

export default function TabBar() {
  const pathname = usePathname() ?? "/";
  const current = TABS.findIndex((t) => [AREAS[t.id].href, ...(t.also ?? [])].some((h) => under(pathname, h)));
  const reading = under(pathname, AREAS.reader.href);
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

  const away = reading || tucked;
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.tabbar = away ? "down" : "up";
    return () => { delete root.dataset.tabbar; };
  }, [away]);

  if (reading) return null;
  return (
    <nav className={styles.bar} aria-label="The rooms of the site" data-away={away || undefined} style={{ viewTransitionName: "site-tabbar" }}>
      <ul className={styles.tabs} style={{ gridTemplateColumns: `repeat(${TABS.length}, minmax(0, 1fr))` }}>
        {TABS.map((t, i) => {
          const a = AREAS[t.id];
          return (
            <li key={t.id}>
              <Link className={styles.tab} href={a.href} transitionTypes={["page-turn"]} aria-current={i === current ? "page" : undefined}>
                <span className={styles.word}>{a.door ?? a.name}<span className="visually-hidden">, {a.name}</span></span>
                {a.greek && <i lang="grc" aria-hidden="true">{a.greek}</i>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
