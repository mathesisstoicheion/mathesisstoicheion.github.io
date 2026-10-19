import type { Metadata } from "next";
import Page from "@/components/Page";
import LettersStepView from "@/components/academy/LettersStepView";
import { LETTERS_STEP, PATH } from "@/data/reading-path";
import { AREAS, trail } from "@/config/areas";
import PageHead from "@/components/PageHead";

export const metadata: Metadata = {
  title: `${LETTERS_STEP.title} · ${AREAS.study.name}`,
  description: "Step 0 of learning Greek by reading: the 24 letters, and six names you already know to sound out.",
};

export default function LettersStepPage() {
  return (
    <Page>
      <div className="wrap" style={{ paddingBlock: "0 clamp(32px, 5vw, 56px)", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 16, maxWidth: 980 }}>
        <PageHead bare path={trail("study", { label: "Learn by reading", href: "/academy/reading" }, `Step 0 of ${PATH.length}`)}
          inscription={LETTERS_STEP.carve} title={LETTERS_STEP.title} greek={null} purpose={LETTERS_STEP.who} />
        <div className="meander" aria-hidden="true" style={{ marginBlock: 8 }} />
        <LettersStepView />
      </div>
    </Page>
  );
}
