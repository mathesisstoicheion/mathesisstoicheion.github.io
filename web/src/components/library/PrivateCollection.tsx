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
import { useEffect } from "react";
import { PRIVATE_COLLECTION } from "@/config/admin";
import { isModerator, useAccount } from "@/lib/community/account";
import { mineHref } from "@/lib/mine";
import type { Tab } from "@/components/reader/MineDialog";
import styles from "@/components/reader/Mine.module.css";
import { PrivateHead, ShelfWait } from "@/components/admin/Cards";
import cards from "@/components/admin/Cards.module.css";
import { trail } from "@/config/areas";

const Collection = dynamic(() => import("@/components/reader/MineDialog").then((m) => m.Collection), {
  ssr: false, loading: () => <p className={styles.quiet}><span className={styles.spinner} aria-hidden="true" /> Taking the books down…</p>,
});

const PURPOSE = "Your own translations and the texts you have imported.";

export default function PrivateCollection() {
  const start = useAccount((s) => s.start);
  useEffect(() => { start(); }, [start]);
  const { ready, session, profile } = useAccount();
  const router = useRouter();
  const tab: Tab = useSearchParams().get("tab") === "import" ? "import" : "shelf";
  const href = (t: Tab) => `${PRIVATE_COLLECTION}${t === "import" ? "?tab=import" : ""}`;

  if (!ready || (session && !profile)) return (
    <div className={`wrap ${styles.page}`}>
      <PrivateHead path={trail("library", "Private collection")} title="Private collection" purpose={PURPOSE} />
      <ShelfWait />
    </div>
  );
  if (!session) {
    return (
      <div className={`wrap ${styles.page}`}>
        <PrivateHead sealed={false} path={trail("library", "Private collection")} title="Private collection"
          purpose={<><Link href={`/account?next=${encodeURIComponent(href(tab))}`}>Sign in</Link> to open this page.</>} />
      </div>
    );
  }
  if (!isModerator(profile)) return <div className="wrap"><div className="notice"><h1 className={styles.privateLine}>This page is private.</h1></div></div>;
  return (
    <div className={`wrap ${styles.page}`}>
      <PrivateHead path={trail("library", "Private collection")} title="Private collection" purpose={PURPOSE} />
      <section className={cards.shelfSec}>
        <Collection page current={null} tab={tab} onTab={(t) => router.replace(href(t), { scroll: false })} onOpen={(id) => router.push(mineHref(id))} />
      </section>
    </div>
  );
}
