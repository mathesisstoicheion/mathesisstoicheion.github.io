"use client";
/**
 * The connection light in the header: online, offline or syncing, always visible. Clicking it
 * opens a small panel that says what works offline and has the Reconnect button; its × (or Escape, or a click
 * outside it) closes it. In the menu (`row`) it is a row with a line on what it is for. It also
 * registers the offline helper (public/sw.js) in the built site.
 */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { status, useConnection } from "@/lib/connection";
import { useOffline } from "@/lib/offline";
import { AREAS } from "@/config/areas";
import Icon from "./Icon";
import styles from "./Header.module.css";

const LABEL = { online: "Online", offline: "Offline", syncing: "Syncing" } as const;
/** the word beside the light (in the menu): what it is for, offline reading, rather than a bare "Online" (review fixes, slice 10) */
const WORD = { online: "Offline reading", offline: "Offline", syncing: "Syncing" } as const;
/** the row's line in the menu: where you are, and what the panel is for */
const HINT = { online: "Online · keep texts to read without a connection", offline: "You are offline · see what still works", syncing: "Keeping a copy of the site…" } as const;

function useRegister() {
  useEffect(() => {
    const { setOnline, setCopy, check } = useConnection.getState();
    const on = () => { setOnline(true); check(); };
    const off = () => setOnline(false);
    addEventListener("online", on);
    addEventListener("offline", off);
    if (!navigator.onLine) setOnline(false);

    if (!("serviceWorker" in navigator)) setCopy("unsupported");
    else if (process.env.NODE_ENV === "production") {
      // once the page has loaded and the browser is idle, so that keeping the offline copy (every page of the site) never
      // competes with the page being opened
      const later = () => (typeof requestIdleCallback === "function" ? requestIdleCallback(register, { timeout: 5000 }) : setTimeout(register, 1500));
      if (document.readyState === "complete") later(); else addEventListener("load", later, { once: true });
    }
    function register() {
      navigator.serviceWorker.register(`/sw.js?build=${process.env.NEXT_PUBLIC_BUILD}`).then((reg) => {
        const watch = (w: ServiceWorker | null) => {
          if (!w) return;
          setCopy("keeping");
          w.addEventListener("statechange", () => { if (w.state === "activated") setCopy("kept"); if (w.state === "redundant") setCopy("none"); });
        };
        if (reg.installing) watch(reg.installing);
        else if (reg.active) setCopy("kept");
        reg.addEventListener("updatefound", () => watch(reg.installing));
      }).catch(() => setCopy("none"));
    }
    return () => { removeEventListener("online", on); removeEventListener("offline", off); };
  }, []);
}

export default function ConnectionLight({ row = false }: { row?: boolean }) {
  useRegister();
  const s = useConnection();
  const st = status(s);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const offline = useOffline();

  useEffect(() => {
    if (!open) return;
    if (!offline.ready) offline.refresh().catch(() => undefined);
    const close = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    addEventListener("pointerdown", close);
    addEventListener("keydown", key);
    return () => { removeEventListener("pointerdown", close); removeEventListener("keydown", key); };
  }, [open, offline]);

  const texts = offline.browser.reduce((n, b) => n + b.files, 0) + Object.values(offline.zipImported).reduce((n, x) => n + x, 0);
  const copyText = s.copy === "kept" ? "Every page of the site is kept in this browser, so it opens without a connection."
    : s.copy === "keeping" ? "Keeping a copy of every page of the site in this browser…"
    : s.copy === "unsupported" ? "This browser cannot keep an offline copy of the site."
    : "The offline copy of the site is made on your first visit to the built site.";

  return (
    <div className={styles.conn} ref={box}>
      <button type="button" className={`${styles.tbtn} ${styles.light}${row ? ` ${styles.row}` : ""}`} data-status={st} aria-expanded={open} aria-haspopup="dialog"
        onClick={() => setOpen(!open)} title={row ? undefined : `${LABEL[st]}: click for details and Reconnect`} aria-label={`Connection: ${LABEL[st]}`}>
        <span className={styles.dotBox} aria-hidden="true"><span className={styles.dot} /></span>
        {row
          ? <span className={styles.rowText}><span className={styles.txt}>{WORD[st]}</span><small>{HINT[st]}</small></span>
          : <span className={styles.txt}>{WORD[st]}</span>}
      </button>
      {open && (
        <div className={styles.connPanel} role="dialog" aria-label="Connection and offline reading">
          <div className={styles.connHead} data-status={st}>
            <span className={styles.dot} aria-hidden="true" />
            <b>{s.busy ?? (st === "online" ? "You are online" : st === "offline" ? "You are offline" : "Syncing…")}</b>
            <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label="Close" title="Close (Esc)"><Icon name="close" /></button>
          </div>
          <ul className={styles.connList}>
            <li>{copyText}</li>
            <li>{texts ? `${texts.toLocaleString("en-GB")} text files are downloaded` : "No texts are downloaded yet"}{offline.folders.length ? `, and ${offline.folders.length} folder${offline.folders.length === 1 ? " is" : "s are"} connected` : ""}.
              {offline.lookups.words || offline.lookups.lsj ? " Word look-ups are downloaded too." : ""}</li>
            <li>Your notes and marks live in this browser and work offline.</li>
          </ul>
          <div className={styles.connActs}>
            <button type="button" className="btn small" onClick={() => s.reconnect()} disabled={!!s.busy}><Icon name="again" />{s.busy ? "Working…" : "Reconnect"}</button>
            <Link className="btn small ghost" href={AREAS.downloads.href} transitionTypes={["page-turn"]} onClick={() => setOpen(false)}><Icon name="download" />Download texts</Link>
          </div>
          {s.report && (
            <div className={styles.connReport} role="status" data-ok={s.report.ok}>
              {s.report.lines.map((l, i) => <p key={i}>{l}</p>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
