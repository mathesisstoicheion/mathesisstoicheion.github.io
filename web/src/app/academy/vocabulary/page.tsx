import type { Metadata } from "next";
import Page from "@/components/Page";
import PageHead from "@/components/PageHead";
import Vocabulary from "@/components/academy/Vocabulary";
import { AREAS, trail } from "@/config/areas";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";

export const metadata: Metadata = { title: `Vocabulary · ${AREAS.study.name}`, description: PAGE_DESCRIPTIONS.vocabulary };

export default function VocabularyPage() {
  return (
    <Page>
      <div className="wrap" style={{ paddingBlock: "0 clamp(32px, 5vw, 56px)", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 20 }}>
        <PageHead bare path={trail("study", "Vocabulary")} title="Vocabulary by frequency" greek="λέξεις"
          purpose="A few hundred words make up most of any Greek text. Learn the commonest first, and watch how much of a real text you can already recognise." />
        <Vocabulary />
      </div>
    </Page>
  );
}
