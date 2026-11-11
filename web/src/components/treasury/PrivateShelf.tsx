"use client";
/**
 * The moderator's two private rows, in Mine (owner's request, 2026-10-14; set as ledger rows under the contents, 2026-11-10):
 * "Our own translations" with how many are on the shelf, and "Private collection". Shown to the moderator alone. As for keeping the Treasury in step, Supabase is
 * contacted only when this browser is already signed in, and the private table only once the account is known to be
 * the moderator's. Anyone else sees nothing here, and the database would hand them nothing anyway.
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { PRIVATE_COLLECTION, PRIVATE_TRANSLATIONS } from "@/config/admin";
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
    <ul className={styles.privateRows} aria-label="Private, only you can see these">
      <li>
        <Link className={styles.offer} href={PRIVATE_TRANSLATIONS} transitionTypes={["page-turn"]}>
          <span className={styles.gn} aria-hidden="true"><Icon name="lock" /></span>
          <span className={styles.offerLabel}>Our own translations</span>
          <span className={styles.lead} aria-hidden="true" />
          <span className={styles.count} data-empty={n === 0 ? "" : undefined}>{n === "?" ? "·" : n === null ? "…" : n.toLocaleString("en-GB")}</span>
        </Link>
      </li>
      <li>
        <Link className={styles.offer} href={PRIVATE_COLLECTION} transitionTypes={["page-turn"]}>
          <span className={styles.gn} aria-hidden="true"><Icon name="lock" /></span>
          <span className={styles.offerLabel}>Private collection</span>
          <span className={styles.lead} aria-hidden="true" />
          <span aria-hidden="true" />
        </Link>
      </li>
    </ul>
  );
}
