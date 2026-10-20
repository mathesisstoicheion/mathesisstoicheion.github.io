import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import Pnyx from "@/components/community/Pnyx";
import { areaTitle } from "@/config/areas";
import { ENTRIES } from "@/wiki/index";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";

export const metadata: Metadata = { title: areaTitle("debates"), description: PAGE_DESCRIPTIONS.pnyx };

// titles of the Painted Stoa's entries, for motions proposed from one (read at build time)
const entryTitles = Object.fromEntries(ENTRIES.map((e) => [e.slug, e.title]));

export default function TownHallPnyxPage() {
  return (
    <Page>
      <AreaHeader id="debates" />
      <Suspense>
        <Pnyx entryTitles={entryTitles} />
      </Suspense>
    </Page>
  );
}
