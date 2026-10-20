import type { Metadata } from "next";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import Kerameikos from "@/components/stoa/Kerameikos";
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
        <span className="label">The potters&apos; quarter</span>
        <h2 id="paint-title">Paint a pot</h2>
        <Amphora />
      </section>
    </Page>
  );
}
