import type { Metadata } from "next";
import Page from "@/components/Page";
import PagePiece from "@/components/art/PagePiece";
import PageHead from "@/components/PageHead";
import Review from "@/components/academy/Review";
import { AREAS, trail } from "@/config/areas";
import { NOINDEX } from "@/lib/seo";

export const metadata: Metadata = { title: `Daily review · ${AREAS.study.name}`, ...NOINDEX };

export default function ReviewPage() {
  return (
    <Page>
      <div className="wrap tool-page" style={{ paddingBlock: "0 clamp(32px, 5vw, 56px)" }}>
        <div className="tool-main">
        <PageHead bare desk={false} path={trail("study", "Daily review")} title="Daily review" greek="ἀνάμνησις" />
        <Review />
        </div>
        <PagePiece className="piece-desk" />
      </div>
    </Page>
  );
}
