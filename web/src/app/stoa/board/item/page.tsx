import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import ItemView from "@/components/board/ItemView";
import { AREAS } from "@/config/areas";
import { NOINDEX } from "@/lib/seo";

export const metadata: Metadata = { title: `${AREAS.board.name} · ${AREAS.wiki.name}`, description: "Something a reader put up on the Painted Stoa's board.", ...NOINDEX };

/** One item of the board, to look at and share (components/board/ItemView.tsx): /stoa/board/item?id=… */
export default function BoardItemPage() {
  return (
    <Page>
      <Suspense><ItemView /></Suspense>
    </Page>
  );
}
