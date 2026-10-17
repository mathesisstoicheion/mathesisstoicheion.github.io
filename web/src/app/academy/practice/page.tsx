import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/Page";
import PracticeClient from "@/components/academy/PracticeClient";
import { AREAS } from "@/config/areas";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";
import NameCarving from "@/components/art/NameCarving";
import PagePiece from "@/components/art/PagePiece";

export const metadata: Metadata = { title: `Practice · ${AREAS.study.name}`, description: PAGE_DESCRIPTIONS.practice };

export default function PracticePage() {
  return (
    <Page>
      <div className="wrap tool-page" style={{ paddingBlock: "clamp(32px, 5vw, 56px)" }}>
        <div className="tool-main">
        <div className="page-head">
          <nav className="label"><Link href={AREAS.study.href} transitionTypes={["page-turn"]}>{AREAS.study.name}</Link> › Practice</nav>
          <PagePiece className="piece-phone" />
          <NameCarving greek="ἄσκησις" />
          <h1 className="page-title">Practice <span lang="grc">ἄσκησις</span></h1>
          <p className="muted" style={{ maxWidth: "62ch", fontSize: "1.1rem" }}>Short drills. Endings come from the checked tables; the sentences are real, and their answers come from hand-checked analyses.</p>
        </div>
        <PracticeClient />
        </div>
        <PagePiece className="piece-desk" />
      </div>
    </Page>
  );
}
