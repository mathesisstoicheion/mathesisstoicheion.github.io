import type { Metadata } from "next";
import Page from "@/components/Page";
import DailySession from "@/components/academy/DailySession";
import { AREAS } from "@/config/areas";
import { NOINDEX } from "@/lib/seo";
import PagePiece from "@/components/art/PagePiece";

export const metadata: Metadata = { title: `Today's session · ${AREAS.study.name}`, ...NOINDEX };

export default function TodayPage() {
  return (
    <Page>
      <div className="wrap tool-page" style={{ paddingBlock: "clamp(24px, 4vw, 48px)" }}>
        <div className="tool-main">
          <DailySession />
          {/* on a phone the session has the screen to itself, and its piece stands after it */}
          <PagePiece className="piece-phone" />
        </div>
        <PagePiece className="piece-desk" />
      </div>
    </Page>
  );
}
