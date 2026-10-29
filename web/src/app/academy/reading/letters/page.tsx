import type { Metadata } from "next";
import Page from "@/components/Page";
import LettersStepView from "@/components/academy/LettersStepView";
import { LETTERS_STEP, readingLesson } from "@/data/reading-path";
import { TRACKS } from "@/data/tracks";
import { AREAS, trail } from "@/config/areas";
import PageHead from "@/components/PageHead";

export const metadata: Metadata = {
  title: `${LETTERS_STEP.title} · ${AREAS.study.name}`,
  description: "The first lesson of learning Greek by reading: the 24 letters, and six names you already know to sound out.",
};

export default function LettersStepPage() {
  return (
    <Page>
      <div className="wrap" style={{ paddingBlock: "0 clamp(32px, 5vw, 56px)", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 16, maxWidth: 980 }}>
        <PageHead bare path={trail("study", { label: TRACKS.reading.name, href: TRACKS.reading.href }, readingLesson(LETTERS_STEP.id))}
          title={LETTERS_STEP.title} greek="τὰ γράμματα" purpose={LETTERS_STEP.who} />
        <div className="meander" aria-hidden="true" style={{ marginBlock: 8 }} />
        <LettersStepView />
      </div>
    </Page>
  );
}
