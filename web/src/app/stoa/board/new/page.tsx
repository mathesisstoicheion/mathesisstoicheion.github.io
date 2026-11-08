import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import PageHead from "@/components/PageHead";
import NewItem from "@/components/board/NewItem";
import { AREAS, trail } from "@/config/areas";
import { NOINDEX } from "@/lib/seo";

export const metadata: Metadata = { title: `Put something up · ${AREAS.board.name}`, ...NOINDEX };

/** Putting something on the board (components/board/NewItem.tsx). */
export default function NewBoardItemPage() {
  return (
    <Page>
      <PageHead path={trail("board", "Put something up")} title="Put something up"
        purpose="A thought of your own, a pot you painted or a tune you played. The site's keeper looks at it before it goes on the board." />
      <div className="wrap">
        <Suspense><NewItem /></Suspense>
      </div>
    </Page>
  );
}
