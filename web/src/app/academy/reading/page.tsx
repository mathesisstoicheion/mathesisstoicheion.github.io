import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/Page";
import ReadingPath from "@/components/academy/ReadingPath";
import { AREAS } from "@/config/areas";
import NameCarving from "@/components/art/NameCarving";
import PagePiece from "@/components/art/PagePiece";
import { PATH } from "@/data/reading-path";

export const metadata: Metadata = {
  title: `Learn by reading · ${AREAS.study.name}`,
  description: "Learn Ancient Greek by reading real lines, from the sayings at Delphi to the first sentence of Aristotle's Metaphysics.",
};

export default function ReadingPathPage() {
  return (
    <Page>
      <div className="wrap" style={{ paddingBlock: "clamp(32px, 5vw, 56px)", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 16, maxWidth: 980 }}>
        <div className="page-head">
          <nav className="label"><Link href={AREAS.study.href} transitionTypes={["page-turn"]}>{AREAS.study.name}</Link> › Learn by reading</nav>
          <NameCarving greek="ἀνάγνωσις" />
          <PagePiece className="piece-desk" />
          <h1 className="page-title">Learn by reading <span lang="grc" style={{ display: "block", fontSize: "0.5em", marginTop: 8 }}>ἀνάγνωσις</span></h1>
          <PagePiece className="piece-phone" />
          <p className="muted" style={{ fontSize: "1.1rem", maxWidth: "64ch" }}>
            {PATH.length} real lines, from the sayings carved at Delphi to the first sentence of Aristotle&apos;s <i>Metaphysics</i>,
            with a practice lesson after every three. Each lesson builds on the ones before: the help you have outgrown drops away,
            and the passages grow longer. Try the Greek first; the English waits until you ask for it.
          </p>
        </div>
        <div className="meander" aria-hidden="true" style={{ marginBlock: 8 }} />
        <ReadingPath />
      </div>
    </Page>
  );
}
