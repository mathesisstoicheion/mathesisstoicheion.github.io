import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/Page";
import Tables from "@/components/academy/Tables";
import { AREAS } from "@/config/areas";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";
import NameCarving from "@/components/art/NameCarving";
import PagePiece from "@/components/art/PagePiece";

export const metadata: Metadata = { title: `Tables of forms · ${AREAS.study.name}`, description: PAGE_DESCRIPTIONS.tables };

export default function TablesPage() {
  return (
    <Page>
      <div className="wrap" style={{ paddingBlock: "clamp(32px, 5vw, 56px)", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 20 }}>
        <div className="page-head">
          <nav className="label"><Link href={AREAS.study.href} transitionTypes={["page-turn"]}>{AREAS.study.name}</Link> › Tables of forms</nav>
          <NameCarving greek="παραδείγματα" />
          <PagePiece className="piece-desk" />
          <h1 className="page-title">Tables of forms <span lang="grc">παραδείγματα</span></h1>
          <PagePiece className="piece-phone" />
          <p className="muted" style={{ maxWidth: "62ch", fontSize: "1.1rem" }}>
            The standard patterns of Attic Greek. Learn the endings, not every word: thousands of words follow these same tables.
          </p>
        </div>
        <Tables />
      </div>
    </Page>
  );
}
