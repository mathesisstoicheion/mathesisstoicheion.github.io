import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/Page";
import PageHead from "@/components/PageHead";
import { AREAS, FORUM_OPEN } from "@/config/areas";
import { NOINDEX } from "@/lib/seo";

/**
 * While the forum is frozen (FORUM_OPEN in config/areas.ts), every page under /town-hall shows only this notice, set as
 * every page opens: the page head with its plate (data/pieces.ts), and the ways on. Nothing on the site links here; an old
 * link or bookmark lands on it. The threads and debates stay in the database.
 */
export const metadata: Metadata = FORUM_OPEN ? {} : NOINDEX;

export default function TownHallLayout({ children }: { children: React.ReactNode }) {
  if (FORUM_OPEN) return children;
  return (
    <Page>
      <PageHead path={[{ label: AREAS.forum.name }, { label: AREAS.debates.name }]} title="Closed for now"
        purpose="The Agora and the Pnyx are closed for the time being. Everything written there is kept."
        action={<p className="btn-row">
          <Link className="btn" href={AREAS.library.href} transitionTypes={["page-turn"]}>Read a text</Link>
          <Link className="btn ghost" href="/" transitionTypes={["page-turn"]}>The Propylaea (home)</Link>
        </p>} />
    </Page>
  );
}
