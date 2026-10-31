import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Page from "@/components/Page";
import PageHead from "@/components/PageHead";
import Icon from "@/components/Icon";
import Board, { HowItWorks } from "@/components/board/Board";
import { AREAS, areaTitle, trail } from "@/config/areas";
import { NEW_ITEM } from "@/lib/board";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";
import styles from "@/components/board/Board.module.css";

export const metadata: Metadata = { title: `${areaTitle("board")} · ${AREAS.wiki.name}`, description: PAGE_DESCRIPTIONS.board };

/**
 * The board (components/board/Board.tsx): what readers put up, approved by the site's keeper first. The page is built
 * with its head and its rules; what is on the board is asked of the database once the page is open.
 */
export default function BoardPage() {
  return (
    <Page>
      <PageHead path={trail("board")} title={AREAS.board.name} greek={AREAS.board.greek}
        purpose="What readers have thought and made, put up for everyone: thoughts, painted pots and tunes played on the lyre. The site's keeper looks at each one before it goes up."
        action={<p className="btn-row"><Link className="btn" href={NEW_ITEM}><Icon name="board" />Put something on the board</Link></p>} />
      <div className={`wrap ${styles.page}`}>
        <Suspense><Board /></Suspense>
        <HowItWorks />
      </div>
    </Page>
  );
}
