import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/Page";
import LettersStepView from "@/components/academy/LettersStepView";
import { LETTERS_STEP, PATH } from "@/data/reading-path";
import { AREAS } from "@/config/areas";
import NameCarving from "@/components/art/NameCarving";
import PagePiece from "@/components/art/PagePiece";

export const metadata: Metadata = {
  title: `${LETTERS_STEP.title} · ${AREAS.study.name}`,
  description: "Step 0 of learning Greek by reading: the 24 letters, and six names you already know to sound out.",
};

export default function LettersStepPage() {
  return (
    <Page>
      <div className="wrap" style={{ paddingBlock: "clamp(32px, 5vw, 56px)", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 16, maxWidth: 980 }}>
        <div className="page-head">
          <nav className="label">
            <Link href={AREAS.study.href} transitionTypes={["page-turn"]}>{AREAS.study.name}</Link> › <Link href="/academy/reading" transitionTypes={["page-turn"]}>Learn by reading</Link> › Step 0 of {PATH.length}
          </nav>
          <NameCarving greek={LETTERS_STEP.carve} />
          <PagePiece className="piece-desk" />
          <h1 className="page-title">{LETTERS_STEP.title}</h1>
          <PagePiece className="piece-phone" />
          <p className="muted" style={{ fontSize: "1.1rem" }}>{LETTERS_STEP.who}</p>
        </div>
        <div className="meander" aria-hidden="true" style={{ marginBlock: 8 }} />
        <LettersStepView />
      </div>
    </Page>
  );
}
