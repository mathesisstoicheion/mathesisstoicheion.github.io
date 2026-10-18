"use client";
/**
 * The private collection as a page of its own (/library/private; owner's request, 2026-10-14): the moderator's books,
 * each opening in the reader, and "Import a text" (?tab=import), the same as the reader's window
 * (components/reader/MineDialog.tsx). Signed out, it offers to sign in; signed in as anyone else, it says "This page is
 * private." and nothing more. The part that asks the database (with supabase-js) is loaded only for the moderator.
 */
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PRIVATE_COLLECTION } from "@/config/admin";
import { isModerator, useAccount } from "@/lib/community/account";
import { mineHref } from "@/lib/mine";
import type { Tab } from "@/components/reader/MineDialog";
import styles from "@/components/reader/Mine.module.css";
import { PieceHold } from "@/components/art/PagePiece";
import PageHead from "@/components/PageHead";
import { trail } from "@/config/areas";

const Collection = dynamic(() => import("@/components/reader/MineDialog").then((m) => m.Collection), {
  ssr: false, loading: () => <p className={styles.quiet}><span className={styles.spinner} aria-hidden="true" /> Taking the books down…</p>,
});

const LOCK = <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" /></svg>;

export default function PrivateCollection() {
  const start = useAccount((s) => s.start);
  useEffect(() => { start(); }, [start]);
  const { ready, session, profile } = useAccount();
  const router = useRouter();
  const tab: Tab = useSearchParams().get("tab") === "import" ? "import" : "shelf";
  const href = (t: Tab) => `${PRIVATE_COLLECTION}${t === "import" ? "?tab=import" : ""}`;

  if (!ready || (session && !profile)) return <><PieceHold /><Waiting /></>;
  if (!session) {
    return (
      <div className={`wrap ${styles.pageStatus}`}>
        <h1 className="visually-hidden">Private collection</h1>
        <p className="notice"><Link href={`/account?next=${encodeURIComponent(href(tab))}`}>Sign in</Link> to open this page.</p>
      </div>
    );
  }
  if (!isModerator(profile)) return <div className="wrap"><div className="notice"><h1 className={styles.privateLine}>This page is private.</h1></div></div>;
  return (
    <div className={`wrap ${styles.page}`}>
      <PageHead bare path={trail("library", "Private collection")} title="Private collection"
        purpose="Your own translations and the texts you have imported. Each opens in the reader, with all its reading aids.">
        <span className={styles.seal}>{LOCK} Private · only you can see this</span>
      </PageHead>
      <Collection current={null} tab={tab} onTab={(t) => router.replace(href(t), { scroll: false })} onOpen={(id) => router.push(mineHref(id))} />
    </div>
  );
}

/** While the account is read; after a while, a word on why it may be taking long. */
function Waiting() {
  const [slow, setSlow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setSlow(true), 8000); return () => clearTimeout(t); }, []);
  return (
    <div className={`wrap ${styles.pageStatus}`} aria-busy="true">
      <h1 className="visually-hidden">Private collection</h1>
      <span className={styles.spinner} aria-hidden="true" /> One moment…
      {slow && <p className={styles.quiet}>Still waiting for the site&apos;s database. Check the connection light at the top of the page.</p>}
    </div>
  );
}
