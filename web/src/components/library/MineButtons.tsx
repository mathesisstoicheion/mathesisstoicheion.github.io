"use client";
/**
 * The private collection in the library (owner's request, 2026-10-14: "The private collection button should be listed in
 * the library as its own distinct button, as well as an import button"): two buttons above the search, shown to the
 * moderator alone, that open the private collection's window (components/reader/MineDialog.tsx) on its shelf or on
 * "Import a text". A book chosen or saved there opens in the reader. As in the reader, Supabase is contacted only when
 * this browser is already signed in, and the window (with the database's library) is loaded only when opened.
 */
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { mineHref } from "@/lib/mine";
import { useIsModerator } from "@/lib/mine-load";
import type { Tab } from "@/components/reader/MineDialog";
import styles from "./Library.module.css";

const MineDialog = dynamic(() => import("@/components/reader/MineDialog"), { ssr: false });

const LOCK = <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" /></svg>;

export default function MineButtons() {
  const moderator = useIsModerator();
  const router = useRouter();
  const [open, setOpen] = useState<Tab | null>(null);
  if (!moderator) return null;
  return (
    <div className={styles.mine} role="group" aria-label="Your private collection">
      <span className={styles.mineSeal}>{LOCK} Only you can see these</span>
      <div className={styles.mineBtns}>
        <button type="button" className={styles.mineBtn} onClick={() => setOpen("shelf")}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h4v16H4zM10 4h4v16h-4zM16.5 5l3.6-1 3 15.4-3.6 1z" /></svg>
          <span><b>Private collection</b><small>Your own translations and texts</small></span>
        </button>
        <button type="button" className={styles.mineBtn} onClick={() => setOpen("import")}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M4 17v3h16v-3" /></svg>
          <span><b>Import a text</b><small>A TEI file, a plain text, or pasted Greek</small></span>
        </button>
      </div>
      {open && <MineDialog key={open} start={open} current={null} onOpen={(id) => { setOpen(null); router.push(mineHref(id)); }} onClose={() => setOpen(null)} />}
    </div>
  );
}
