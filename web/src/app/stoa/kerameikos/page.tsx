import type { Metadata } from "next";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import Kerameikos, { KERAMEIKOS_PLATES } from "@/components/stoa/Kerameikos";
import { PlateList } from "@/components/plate/Plate";
import Amphora from "@/components/Amphora";
import { areaTitle } from "@/config/areas";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";

export const metadata: Metadata = { title: areaTitle("archaeology"), description: PAGE_DESCRIPTIONS.kerameikos };

export default function StoaKerameikosPage() {
  return (
    <Page>
      <AreaHeader id="archaeology" />
      <Kerameikos />
      {/* the potters' quarter: a neck-amphora to turn and paint yourself (it stood on the home page before design B) */}
      <section className="wrap" aria-labelledby="paint-title" style={{ paddingBlock: "var(--space-7)" }}>
        <div className="part-top">
          <span className="label">The potters&apos; quarter</span>
          <h2 id="paint-title">Paint a pot</h2>
          <Amphora />
        </div>
      </section>
      {/* the finds' photographs and their credits, as a book lists its plates at the end */}
      <div className="wrap" style={{ paddingBottom: "var(--space-7)" }}><PlateList ids={KERAMEIKOS_PLATES} label="Photographs of the finds" /></div>
    </Page>
  );
}
