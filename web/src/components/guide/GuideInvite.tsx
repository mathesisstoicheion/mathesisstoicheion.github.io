"use client";
/**
 * A first visit's gentle invitation to the Guide: a small card in a corner of the home page, a few seconds in or
 * at the first scroll, offering to show the visitor round. It appears once in a browser: either answer, or a
 * visit to the Guide, and it never comes back (remembered in this browser only; with storage blocked, it does not
 * appear at all). Never during a "Show me" tour.
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./Guide.module.css";

const KEY = "mathesis:guide-invite";
export const inviteSeen = () => { try { localStorage.setItem(KEY, "seen"); } catch { /* blocked */ } };

export default function GuideInvite() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let seen = true;
    try { seen = localStorage.getItem(KEY) !== null; } catch { /* blocked: never */ }
    const q = new URLSearchParams(location.search);
    // not during a tour; and not in an automated test browser unless the test asks for it (?invite)
    if (seen || q.has("tour") || (navigator.webdriver && !q.has("invite"))) return;
    let timer = 0;
    const open = () => { clearTimeout(timer); removeEventListener("scroll", open); setShow(true); };
    timer = window.setTimeout(open, 4500);
    addEventListener("scroll", open, { passive: true, once: true });
    return () => { clearTimeout(timer); removeEventListener("scroll", open); };
  }, []);
  if (!show) return null;
  const close = () => { inviteSeen(); setShow(false); };
  return (
    <aside className={styles.invite} aria-label="New here?">
      <p><b>New here?</b> A short guide shows you round the site, one thing at a time.</p>
      <div>
        <Link className="btn small" href="/guide" onClick={inviteSeen} transitionTypes={["page-turn"]}>Show me round <span className="arr" aria-hidden="true">→</span></Link>
        <button type="button" className="btn small ghost" onClick={close}>No thanks</button>
      </div>
    </aside>
  );
}
