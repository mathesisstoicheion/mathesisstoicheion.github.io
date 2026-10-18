import type { Metadata } from "next";
import Page from "@/components/Page";
import PagePiece from "@/components/art/PagePiece";
import PageHead from "@/components/PageHead";
import PracticeClient from "@/components/academy/PracticeClient";
import { AREAS, trail } from "@/config/areas";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";

export const metadata: Metadata = { title: `Practice · ${AREAS.study.name}`, description: PAGE_DESCRIPTIONS.practice };

export default function PracticePage() {
  return (
    <Page>
      <div className="wrap tool-page" style={{ paddingBlock: "0 clamp(32px, 5vw, 56px)" }}>
        <div className="tool-main">
        <PageHead bare desk={false} path={trail("study", "Practice")} title="Practice" greek="ἄσκησις"
          purpose="Short drills. Endings come from the checked tables; the sentences are real, and their answers come from hand-checked analyses." />
        <PracticeClient />
        </div>
        <PagePiece className="piece-desk" />
      </div>
    </Page>
  );
}
