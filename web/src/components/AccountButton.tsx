"use client";
/**
 * The account link in the header: "Sign in", or the member's name once signed in. It contacts
 * Supabase only when this browser already holds a session; otherwise it is a plain link.
 * In the menu (`row`) it is a row with a line on what an account is for.
 */
import Link from "next/link";
import { useEffect } from "react";
import { hasSavedSession, useAccount } from "@/lib/community/account";
import Icon from "./Icon";
import styles from "./Header.module.css";

export default function AccountButton({ row = false }: { row?: boolean }) {
  const start = useAccount((s) => s.start);
  const name = useAccount((s) => s.profile?.display_name ?? null);
  useEffect(() => { if (hasSavedSession()) start(); }, [start]);
  const word = name ?? "Sign in";
  return (
    <Link className={`${styles.tbtn}${row ? ` ${styles.row}` : ""}`} href="/account" transitionTypes={["page-turn"]}
      aria-label={name ? `Your account: ${name}` : "Sign in or join"} title={row ? undefined : name ?? "Sign in or join"}>
      <Icon name={name ? "account" : "sign-in"} />
      {row
        ? <span className={styles.rowText}><span className={styles.txt}>{word}</span><small>{name ? "Your account" : "Keep your notes and progress on every device"}</small></span>
        : <span className={styles.txt}>{word}</span>}
    </Link>
  );
}
