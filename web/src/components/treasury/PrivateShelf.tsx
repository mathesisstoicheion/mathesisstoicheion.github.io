"use client";
/**
 * The moderator's private translations, in Mine (owner's request, 2026-10-14): a way in, under the offerings, shown to
 * the moderator alone, with how many translations are on the shelf. As for keeping the Treasury in step, Supabase is
 * contacted only when this browser is already signed in, and the private table only once the account is known to be
 * the moderator's. Anyone else sees nothing here, and the database would hand them nothing anyway.
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import { PRIVATE_TRANSLATIONS } from "@/config/admin";
import { hasSavedSession, isModerator, useAccount } from "@/lib/community/account";
import styles from "./Treasury.module.css";

export default function PrivateShelf() {
  const { profile, start } = useAccount();
  useEffect(() => { if (hasSavedSession()) start(); }, [start]);
  const mod = isModerator(profile);
  const [n, setN] = useState<number | "?" | null>(null);
  useEffect(() => {
    if (!mod) return;
    let live = true;
    // loaded only for the moderator: the database library stays out of everyone else's Treasury
    import("@/lib/private-translations-db").then((db) => db.listTranslations())
      .then((rows) => { if (live) setN(rows.length); }, () => { if (live) setN("?"); });
    return () => { live = false; };
  }, [mod]);
  if (!mod) return null;
  return (
    <Link className={styles.private} href={PRIVATE_TRANSLATIONS} transitionTypes={["page-turn"]}>
      <span className={styles.privateSeal}>
        <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" /></svg>
        Private · only you can see this
      </span>
      <b className={styles.privateTitle}>Our own translations</b>
      <span className={styles.privateText}>Our English side by side with the Greek, with the notes, and where we part from the published English.</span>
      {n !== "?" && (
        <span className={styles.privateCount}>
          <span className={styles.count}>{n ?? "…"}</span>{" "}
          <span className={styles.offerHint}>{n === 1 ? "translation" : "translations"}</span>
        </span>
      )}
      <span className={styles.privateGo} aria-hidden="true">Open the shelf →</span>
    </Link>
  );
}
