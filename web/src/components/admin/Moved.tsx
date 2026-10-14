"use client";
/**
 * /admin/translations, the private translations' first address (13–14 October 2026). They now live in Mine, the
 * Treasury (owner's request, 2026-10-14): this sends an old link or bookmark there at once, with its ?id= if it had one.
 */
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { PRIVATE_TRANSLATIONS } from "@/config/admin";
import styles from "./PrivateTranslations.module.css";

export default function Moved() {
  const router = useRouter();
  const q = useSearchParams().toString();
  const to = `${PRIVATE_TRANSLATIONS}${q ? `?${q}` : ""}`;
  useEffect(() => { router.replace(to); }, [router, to]);
  return (
    <div className={`wrap ${styles.status}`}>
      <h1 className="visually-hidden">Private translations</h1>
      <p>This page has moved to Mine. <Link href={to}>Go there →</Link></p>
    </div>
  );
}
