import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/Page";
import { AREAS, FORUM_OPEN } from "@/config/areas";
import { NOINDEX } from "@/lib/seo";

/**
 * While the forum is frozen (FORUM_OPEN in config/areas.ts), every page under /town-hall shows only this notice.
 * Nothing on the site links here; an old link or bookmark lands on it. The threads and debates stay in the database.
 */
export const metadata: Metadata = FORUM_OPEN ? {} : NOINDEX;

export default function TownHallLayout({ children }: { children: React.ReactNode }) {
  if (FORUM_OPEN) return children;
  return (
    <Page>
      <div className="wrap" style={{ maxWidth: "42rem", paddingBlock: "4rem" }}>
        <p className="label">{AREAS.forum.name} · {AREAS.debates.name}</p>
        <h1 className="page-title">Closed for now</h1>
        <p className="muted" style={{ fontSize: "1.1rem" }}>
          The Agora and the Pnyx are closed for the time being. Everything written there is kept.
        </p>
        <p style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Link className="btn" href={AREAS.library.href} transitionTypes={["page-turn"]}>Read a text</Link>
          <Link className="btn ghost" href="/" transitionTypes={["page-turn"]}>The Propylaea (home)</Link>
        </p>
      </div>
    </Page>
  );
}
