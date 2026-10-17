import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import Link from "next/link";
import Pnyx from "@/components/community/Pnyx";
import styles from "@/components/community/Community.module.css";
import { AREAS } from "@/config/areas";
import { ENTRIES } from "@/wiki/index";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";

export const metadata: Metadata = { title: `${AREAS.debates.name} · ${AREAS.debates.english}`, description: PAGE_DESCRIPTIONS.pnyx };

// titles of the Painted Stoa's entries, for motions proposed from one (read at build time)
const entryTitles = Object.fromEntries(ENTRIES.map((e) => [e.slug, e.title]));

export default function TownHallPnyxPage() {
  return (
    <Page>
      <AreaHeader id="debates" crumb={<p className={styles.crumbs}><Link href={AREAS.forum.href} transitionTypes={["page-turn"]}>{AREAS.forum.name}</Link> › {AREAS.debates.name}</p>} />
      <Suspense>
        <Pnyx entryTitles={entryTitles} />
      </Suspense>
    </Page>
  );
}
