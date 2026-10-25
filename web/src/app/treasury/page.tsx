import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import Door, { DoorBlock } from "@/components/a/Door";
import Treasury from "@/components/treasury/Treasury";
import TreasuryKept from "@/components/treasury/TreasuryKept";
import { areaTitle } from "@/config/areas";
import { NOINDEX } from "@/lib/seo";

export const metadata: Metadata = { title: areaTitle("treasury"), ...NOINDEX };

export default function TreasuryPage() {
  return (
    <Page>
      <Door id="treasury" side={<Suspense fallback={null}><TreasuryKept /></Suspense>}>
        <DoorBlock>
          <Suspense fallback={null}>
            <Treasury />
          </Suspense>
        </DoorBlock>
      </Door>
    </Page>
  );
}
