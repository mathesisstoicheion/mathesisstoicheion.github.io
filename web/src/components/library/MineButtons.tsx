"use client";
/**
 * The private collection in the library (owner's requests, 2026-10-14: "The private collection button should be listed
 * in the library as its own distinct button, as well as an import button", "And it should be its own page"): two
 * small buttons in the corner beside the page's name, shown to the moderator alone, leading to the private collection's own page
 * (/library/private, components/library/PrivateCollection.tsx), on its shelf or on "Import a text". As in the reader,
 * Supabase is contacted only when this browser is already signed in.
 */
import Link from "next/link";
import { PRIVATE_COLLECTION } from "@/config/admin";
import { useIsModerator } from "@/lib/mine-load";
import styles from "./Library.module.css";

const LOCK = <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" /></svg>;

export default function MineButtons() {
  const moderator = useIsModerator();
  if (!moderator) return null;
  // a small stone plaque in the corner beside the page's name, so the top of the page is left to its sculpture
  // (the owner, 2026-10-17, marking the empty corner beside "Read · Library" on a phone)
  return (
    <nav className={styles.mine} aria-label="Your private collection" title="Only you can see these">
      <span className={styles.mineSeal}>{LOCK}<span className="visually-hidden">Only you can see these</span></span>
      <Link href={PRIVATE_COLLECTION} className={styles.mineBtn} aria-label="Private collection: your own translations and texts" title="Private collection: your own translations and texts">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h4v16H4zM10 4h4v16h-4zM16.5 5l3.6-1 3 15.4-3.6 1z" /></svg>
        <span aria-hidden="true">Private</span>
      </Link>
      <Link href={`${PRIVATE_COLLECTION}?tab=import`} className={styles.mineBtn} aria-label="Import a text: a TEI file, a plain text, or pasted Greek" title="Import a text: a TEI file, a plain text, or pasted Greek">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M4 17v3h16v-3" /></svg>
        <span aria-hidden="true">Import</span>
      </Link>
    </nav>
  );
}
