"use client";
/**
 * The site's header, as design A drew it: on a computer, Learn and Read, the ΣΤΟΙΧΕΙΑ mark in the middle, Explore and Talk,
 * each door's word with its Greek name beneath and a line of lamplight drawn under the one you are in; at the far right,
 * small square buttons for Search, Mine, your account and Settings. On a phone, the mark at the left and two buttons at
 * the right, Search and the menu. It stands on the black frame at the top of the page and scrolls away with it, as in A.
 * While you read on, what floats over the page (Back to top) steps aside, and any scroll up brings it back (lib/header.ts).
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AREAS, FORUM_OPEN, TABS, doorWord, shown, type AreaId } from "@/config/areas";
import { useUI } from "@/lib/ui";
import { status, useConnection } from "@/lib/connection";
import { barsHeld } from "@/lib/header";
import { guardOverlayWheel, useScrollLock } from "@/lib/overlay";
import Mark from "@/components/a/Mark";
import ConnectionLight from "./ConnectionLight";
import AccountButton from "./AccountButton";
import styles from "./Header.module.css";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}
/** a door is also current in the places that belong to it (the reader, work and author pages belong to Read) */
const current = (pathname: string, id: AreaId) => [AREAS[id].href, ...(TABS.find((t) => t.id === id)?.also ?? [])].some((h) => isActive(pathname, h));

const LEFT: AreaId[] = ["study", "library"];
// while the forum is closed (FORUM_OPEN), Mine takes Talk's place, so two doors still stand either side of the mark
const RIGHT: AreaId[] = FORUM_OPEN ? ["wiki", "forum"] : ["wiki", "treasury"];
const MENU_DOORS: AreaId[] = (["study", "library", "wiki", "forum", "treasury", "search"] as AreaId[]).filter(shown);

const SearchIcon = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5 14 14" /></svg>;

export default function Header() {
  const pathname = usePathname() ?? "/";
  const openSettings = useUI((s) => s.openSettings);
  const setSearchOpen = useUI((s) => s.setSearchOpen);
  const ref = useRef<HTMLElement>(null);
  const showRef = useRef<() => void>(null);
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
  // the menu closes on Escape or a click outside it
  useEffect(() => {
    if (!menu) return;
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setMenu(false); };
    const click = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setMenu(false); };
    addEventListener("keydown", key);
    addEventListener("click", click);
    return () => { removeEventListener("keydown", key); removeEventListener("click", click); };
  }, [menu]);

  const door = (id: AreaId) => {
    const a = AREAS[id];
    return (
      <Link key={id} className={styles.navI} href={a.href} transitionTypes={["page-turn"]} aria-current={current(pathname, id) ? "page" : undefined}>
        <span className={styles.mono}>{doorWord(id)}</span>
        {a.greek && <span lang="grc">{a.greek}</span>}
        <span className="visually-hidden">: {a.name}</span>
      </Link>
    );
  };

  return (
    <header ref={ref} className={styles.site} data-site-header="" style={{ viewTransitionName: "site-header" }}>
      <div className={styles.wrap}>
        {LEFT.map(door)}
        <Mark className={styles.mark} />
        {RIGHT.map(door)}
        <div className={styles.phoneMenu}>
          <button className={styles.ic} type="button" onClick={() => setSearchOpen(true)} aria-haspopup="dialog" aria-label="Search">
            <SearchIcon />
          </button>
          <button className={styles.ic} type="button" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="site-menu" aria-label="Menu">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">{menu ? <path d="M3 3l10 10M13 3 3 13" /> : <path d="M2 5h12M2 11h12" />}</svg>
          </button>
        </div>
      </div>
      {/* narrower screens keep the connection light in the menu: while offline, a line under the header says so */}
      <OfflineSign />
      <div className={styles.utils}>
        <ConnectionLight />
        <button className={styles.tbtn} type="button" onClick={() => setSearchOpen(true)} aria-haspopup="dialog" aria-label="Search" title="Search (or press / on any page)">
          <SearchIcon />
        </button>
        {/* while the forum is closed Mine is a door beside the mark, so its small button stands down */}
        {FORUM_OPEN && (
          <Link className={styles.tbtn} href={AREAS.treasury.href} transitionTypes={["page-turn"]} aria-label="Mine: bookmarks and notes" title="Mine: bookmarks and notes"
            aria-current={current(pathname, "treasury") ? "page" : undefined}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M4 2h8v12l-4-3-4 3z" /></svg>
          </Link>
        )}
        <AccountButton />
        <button className={styles.tbtn} type="button" onClick={openSettings} aria-label="Settings" title="Settings">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M2.5 5h7M12.5 5h1M2.5 11h2.5M8 11h5.5" /><circle cx="11" cy="5" r="1.5" /><circle cx="6.5" cy="11" r="1.5" /></svg>
        </button>
      </div>
      {menu && (
        <nav id="site-menu" className={styles.menu} aria-label="Menu" data-overlay="">
          <ul className={styles.menuDoors}>
            {MENU_DOORS.map((id) => (
              <li key={id}>
                <Link href={AREAS[id].href} transitionTypes={["page-turn"]} aria-current={current(pathname, id) ? "page" : undefined}>
                  <span className={styles.mono}>{doorWord(id)}</span>
                  <span className={styles.menuName}>{AREAS[id].name}{AREAS[id].greek && <> · <span lang="grc">{AREAS[id].greek}</span></>}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.menuTools}>
            <AccountButton />
            <button className={styles.tbtn} type="button" onClick={() => { setMenu(false); openSettings(); }} aria-label="Settings">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M2.5 5h7M12.5 5h1M2.5 11h2.5M8 11h5.5" /><circle cx="11" cy="5" r="1.5" /><circle cx="6.5" cy="11" r="1.5" /></svg>
              <span className={styles.txt}>Settings</span>
            </button>
            <ConnectionLight />
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
