import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import Kerameikos, { KERAMEIKOS_PLATES } from "@/components/stoa/Kerameikos";
import { PlateList } from "@/components/plate/Plate";
import { AREAS, areaTitle } from "@/config/areas";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";

export const metadata: Metadata = { title: areaTitle("archaeology"), description: PAGE_DESCRIPTIONS.kerameikos };

export default function StoaKerameikosPage() {
  return (
    <Page>
      <AreaHeader id="archaeology" />
      <Kerameikos />
      {/* the potters' quarter: the vase to turn and paint has a page of its own (/stoa/pot); this is the way there */}
      <section className="wrap" aria-labelledby="paint-title" style={{ paddingBlock: "var(--space-7)" }}>
        <div className="part-top">
          <span className="label">The potters&apos; quarter</span>
          <h2 id="paint-title"><Link href={AREAS.pot.href} transitionTypes={["page-turn"]}>{AREAS.pot.name} <span aria-hidden="true">→</span></Link></h2>
          <p>{AREAS.pot.fit}</p>
        </div>
      </section>
      {/* the finds' photographs and their credits, as a book lists its plates at the end */}
      <div className="wrap" style={{ paddingBottom: "var(--space-7)" }}><PlateList ids={KERAMEIKOS_PLATES} label="Photographs of the finds" /></div>
    </Page>
  );
}
