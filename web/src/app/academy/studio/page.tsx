import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Page from "@/components/Page";
import Studio from "@/components/academy/Studio";
import { AREAS } from "@/config/areas";

export const metadata: Metadata = { title: `Recording studio · ${AREAS.study.name}`, robots: { index: false } };

// Only useful on the project computer (it saves files into the project); not linked from the site.
// On the live site there is nothing to show, so the page is not there at all.
const LOCAL = process.env.NODE_ENV === "development";

export default function StudioPage() {
  if (!LOCAL) notFound();
  return (
    <Page>
      <div className="wrap" style={{ paddingBlock: "clamp(32px, 5vw, 56px)", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 20 }}>
        <nav className="label"><Link href={AREAS.study.href} transitionTypes={["page-turn"]}>{AREAS.study.name}</Link> › Recording studio</nav>
        <h1 className="page-title">Recording studio</h1>
        <Studio />
      </div>
    </Page>
  );
}
