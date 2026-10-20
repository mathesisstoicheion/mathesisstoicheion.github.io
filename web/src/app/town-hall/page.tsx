import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import Door, { DoorBlock } from "@/components/a/Door";
import { A_ART } from "@/components/a/pictures";
import TownHall from "@/components/community/TownHall";
import { areaTitle } from "@/config/areas";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";

export const metadata: Metadata = { title: areaTitle("forum"), description: PAGE_DESCRIPTIONS.townHall };

export default function TownHallPage() {
  return (
    <Page>
      <Door id="forum" art={A_ART.ostraka}>
        <DoorBlock>
          <Suspense>
            <TownHall />
          </Suspense>
        </DoorBlock>
      </Door>
    </Page>
  );
}
