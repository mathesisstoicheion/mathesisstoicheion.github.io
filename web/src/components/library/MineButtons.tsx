"use client";
/**
 * The private collection in the library (owner's requests, 2026-10-14: "The private collection button should be listed
 * in the library as its own distinct button, as well as an import button", "And it should be its own page"): two
 * links under the search, shown to the moderator alone, leading to the private collection's own page
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
  return (
    <nav className={styles.mine} aria-label="Your private collection" title="Only you can see these">
      <span className={styles.mineSeal}>{LOCK}<span className="label">Only you</span></span>
      <Link href={PRIVATE_COLLECTION} className={styles.mineBtn}>Private collection</Link>
      <Link href={`${PRIVATE_COLLECTION}?tab=import`} className={styles.mineBtn}>Import a text</Link>
    </nav>
  );
}
