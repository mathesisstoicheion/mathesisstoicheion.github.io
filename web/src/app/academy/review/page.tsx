import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/Page";
import Review from "@/components/academy/Review";
import { AREAS } from "@/config/areas";
import { NOINDEX } from "@/lib/seo";
import NameCarving from "@/components/art/NameCarving";
import PagePiece from "@/components/art/PagePiece";

export const metadata: Metadata = { title: `Daily review · ${AREAS.study.name}`, ...NOINDEX };

export default function ReviewPage() {
  return (
    <Page>
      <div className="wrap tool-page" style={{ paddingBlock: "clamp(32px, 5vw, 56px)" }}>
        <div className="tool-main">
        <div className="page-head">
          <nav className="label"><Link href={AREAS.study.href} transitionTypes={["page-turn"]}>{AREAS.study.name}</Link> › Daily review</nav>
          <PagePiece className="piece-phone" />
          <NameCarving greek="ἀνάμνησις" />
          <h1 className="page-title">Daily review <span lang="grc">ἀνάμνησις</span></h1>
        </div>
        <Review />
        </div>
        <PagePiece className="piece-desk" />
      </div>
    </Page>
  );
}
