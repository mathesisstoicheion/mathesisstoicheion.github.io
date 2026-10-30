"use client";
/**
 * What a page shows if something on it fails unexpectedly: the header and footer stay, and the reader is offered a way on
 * instead of a blank screen, under the head every page opens with (no plate: the page's own may be what failed). Nothing
 * is sent anywhere (no trackers).
 */
import Link from "next/link";
import { useEffect } from "react";
import PageHead from "@/components/PageHead";
import Icon from "@/components/Icon";
import ReportBugLink from "@/components/ReportBugLink";
import { FORUM_OPEN } from "@/config/areas";

export default function PageError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div role="alert">
      <PageHead path={[{ label: "Something went wrong" }]} title="This page stumbled" greek="σφάλμα" piece={null}
        purpose={<>Part of this page failed while it was working. Your notes and marks are safe: they are kept in this
          browser. Try again, or go back to the home page.</>}
        action={<div className="btn-row">
          <button type="button" className="btn" onClick={reset}><Icon name="again" />Try again</button>
          <Link className="btn ghost" href="/"><Icon name="home" />The Propylaea (home)</Link>
          {FORUM_OPEN && <ReportBugLink className="btn ghost" err={error.message}>Tell us about it</ReportBugLink>}
        </div>}>
        <details className="muted" style={{ fontSize: "var(--step--1)" }}>
          <summary>What happened</summary>
          <p style={{ marginTop: 8, overflowWrap: "anywhere" }}>{error.message || "An unknown error."}</p>
        </details>
      </PageHead>
    </div>
  );
}
