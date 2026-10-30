"use client";
/**
 * The site's header, as the printed page sets it (redesign SPEC.md 3.5 and 3.6): the printer's device and the name at the
 * left; on a computer the rooms, Learn, Read, Explore, Lyre and Mine, each with its sign, and its Greek name in small
 * italic underneath, the current one in red; Search, your account, Settings and the connection light at the right, each
 * with its sign, and its word where the screen has room. A double rule closes it, as on a title page. On a phone and a
 * narrow computer screen the rooms are along the foot of the screen (TabBar.tsx) or stay in the header, Search keeps its
 * own button, and a Menu button opens the rest: your account, Settings and offline reading, each with a line on what it is
 * for. Nothing is in two places at once (the owner, 2026-10-30: "Nothing should have multiple buttons that lead to the
 * same place"). It stands at the top of the page and scrolls away with it; any scroll up brings back what floats at the
 * foot of the screen (lib/header.ts, data-hdr).
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AREAS, FORUM_OPEN, NAV, doorWord, roomOf, type AreaId } from "@/config/areas";
import { startSearch, useUI } from "@/lib/ui";
import { status, useConnection } from "@/lib/connection";
import { barsHeld } from "@/lib/header";
import { guardOverlayWheel, useScrollLock } from "@/lib/overlay";
import Mark from "@/components/a/Mark";
import Icon from "@/components/Icon";
import ConnectionLight from "./ConnectionLight";
import AccountButton from "./AccountButton";
import styles from "./Header.module.css";

const under = (pathname: string, href: string) => pathname === href || pathname.startsWith(href + "/");

export default function Header() {
  const pathname = usePathname() ?? "/";
  const room = roomOf(pathname);
  // the reader hides the bar of rooms along the foot of a phone (TabBar.tsx): there the menu holds them
  const reading = under(pathname, AREAS.reader.href);
  const openSettings = useUI((s) => s.openSettings);
  const ref = useRef<HTMLElement>(null);
  const showRef = useRef<() => void>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const [menu, setMenu] = useState(false);
  useScrollLock(menu);
  useEffect(guardOverlayWheel, []);

  // Reading on tucks the phone bars away, any scroll up brings them back (see lib/header.ts).
  useEffect(() => {
    const el = ref.current, root = document.documentElement;
    if (!el) return;
    let h = el.offsetHeight, lastY = scrollY, hidden = false, frame = 0;
    // only data-hdr changes (lib/header.ts): the bars follow it by themselves
    const set = (hide: boolean) => {
      if (hide === hidden) return;
      hidden = hide;
      root.dataset.hdr = hide ? "hidden" : "shown";
    };
    const ro = new ResizeObserver(() => {
      if (el.offsetHeight === h && root.style.getPropertyValue("--hdr-h")) return;
      h = el.offsetHeight;
      root.style.setProperty("--hdr-h", `${h}px`);
    });
    ro.observe(el);
    const check = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = scrollY, dy = y - lastY;
        root.toggleAttribute("data-scrolled", y > 4);
        if (y <= h) set(false);                                      // near the top: always showing
        else if (y + innerHeight >= root.scrollHeight - 2) set(false); // at the very end, too: nothing more to read on to
        else if (dy > 6 && !el.matches(":focus-within") && !barsHeld()) set(true);  // reading on: tuck it away
        else if (dy < -6) set(false);                                // any scroll back up: bring it back
        else return;                                                 // small jitters keep the reference point
        lastY = y;
      });
    };
    // keyboard users tabbing into the header always see it
    const show = () => { set(false); lastY = scrollY; };
    showRef.current = show;
    // a tap on the reader's page asks for a clean page, or for the bars back (setBars in lib/header.ts)
    const onBars = (e: Event) => { const want = (e as CustomEvent<boolean | undefined>).detail; set(want ?? !hidden); lastY = scrollY; };
    check();
    addEventListener("scroll", check, { passive: true });
    addEventListener("mathesis:bars", onBars);
    el.addEventListener("focusin", show);
    return () => { ro.disconnect(); cancelAnimationFrame(frame); removeEventListener("scroll", check); removeEventListener("mathesis:bars", onBars); el.removeEventListener("focusin", show); };
  }, []);

  // a new page starts with the header showing, and the menu closed
  const [menuAt, setMenuAt] = useState(pathname);
  if (menuAt !== pathname) { setMenuAt(pathname); setMenu(false); }
  useEffect(() => { showRef.current?.(); }, [pathname]);
  // the menu closes on Escape or a click outside it; not on a click on the Guide's tour card, whose steps may be pointing
  // into the menu (pressing its Next closed the menu its next step was about to show: scripts/check-tours.mts)
  useEffect(() => {
    if (!menu) return;
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setMenu(false); };
    const click = (e: MouseEvent) => {
      const at = e.target as Element;
      if (!ref.current?.contains(at) && !at.closest?.("[data-tour-card]")) setMenu(false);
    };
    addEventListener("keydown", key);
    addEventListener("click", click);
    return () => { removeEventListener("keydown", key); removeEventListener("click", click); };
  }, [menu]);

  const door = (id: AreaId, cls: string) => {
    const a = AREAS[id];
    return (
      <Link key={id} className={cls} href={a.href} transitionTypes={["page-turn"]} aria-current={room === id ? "page" : undefined}>
        {a.icon && <Icon name={a.icon} />}
        <span className={styles.word}>{a.door ?? doorWord(id)}</span>
        {a.greek && <i lang="grc">{a.greek}</i>}
      </Link>
    );
  };

  return (
    <header ref={ref} className={styles.site} data-site-header="" style={{ viewTransitionName: "site-header" }}>
      <div className={styles.mast}>
        <Mark className={styles.mark} words />
        <nav className={styles.nav} aria-label="The rooms of the site">{NAV.map((id) => door(id, styles.navI))}</nav>
        <div className={styles.utils}>
          <button className={`${styles.tbtn} ${styles.find}`} type="button" onClick={startSearch} aria-haspopup="dialog" aria-label="Search" title="Search (or press / on any page)">
            <Icon name="search" /><span className={styles.txt}>Search</span>
          </button>
          {/* while the forum is closed Mine is a room in the menu, so its small button stands down */}
          {FORUM_OPEN && (
            <Link className={styles.tbtn} href={AREAS.treasury.href} transitionTypes={["page-turn"]} aria-label="The Treasury: bookmarks and notes" title="The Treasury: bookmarks and notes"
              aria-current={room === "treasury" ? "page" : undefined}>
              <Icon name="bookmark" />
            </Link>
          )}
          <AccountButton />
          <button className={styles.tbtn} type="button" onClick={openSettings} aria-label="Settings" title="Settings">
            <Icon name="settings" /><span className={styles.txt}>Settings</span>
          </button>
          <ConnectionLight />
        </div>
        <button ref={menuBtn} className={styles.menuBtn} type="button" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="site-menu" aria-label="Menu">
          <Icon name={menu ? "close" : "menu"} /><span className={styles.menuWord}>{menu ? "Close" : "Menu"}</span>
        </button>
      </div>
      <div className={styles.rule2} aria-hidden="true" />
      {/* narrower screens keep the connection light in the menu: while offline, a line under the header says so */}
      <OfflineSign />
      {menu && (
        <nav id="site-menu" className={styles.menu} aria-label="Menu" data-overlay="">
          {/* the rooms only where nothing else shows them: the reader on a phone, which hides the bar along the foot */}
          {reading && <ul className={styles.menuDoors}>{NAV.map((id) => <li key={id}>{door(id, "")}</li>)}</ul>}
          <div className={styles.menuTools}>
            <AccountButton row />
            <button className={`${styles.tbtn} ${styles.row}`} type="button" onClick={() => { setMenu(false); openSettings(); }} aria-label="Settings" aria-describedby="menu-settings-hint">
              <Icon name="settings" />
              <span className={styles.rowText}><span className={styles.txt}>Settings</span><small id="menu-settings-hint">Paper or night, the size of the Greek and the line spacing</small></span>
            </button>
            <ConnectionLight row />
          </div>
        </nav>
      )}
    </header>
  );
}

/** While offline, on screens where the connection light waits in the menu, a line under the header says what still works. */
function OfflineSign() {
  const offline = status(useConnection()) === "offline";
  return offline ? <p className={styles.offline} role="status">Offline · your downloaded texts, library and study still work</p> : null;
}
