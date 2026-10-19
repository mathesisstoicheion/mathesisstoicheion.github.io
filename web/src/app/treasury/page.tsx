import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import Door, { DoorBlock } from "@/components/a/Door";
import { A_ART } from "@/components/a/pictures";
import Treasury from "@/components/treasury/Treasury";
import { AREAS } from "@/config/areas";
import { NOINDEX } from "@/lib/seo";

export const metadata: Metadata = { title: `${AREAS.treasury.name} · ${AREAS.treasury.english}`, ...NOINDEX };

export default function TreasuryPage() {
  return (
    <Page>
      <Door id="treasury" fig="mine" art={A_ART.mask}>
        <DoorBlock>
          <Suspense fallback={null}>
            <Treasury />
          </Suspense>
        </DoorBlock>
      </Door>
    </Page>
  );
}
