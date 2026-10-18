import type { Metadata } from "next";
import Page from "@/components/Page";
import ReadingPath from "@/components/academy/ReadingPath";
import { AREAS, trail } from "@/config/areas";
import PageHead from "@/components/PageHead";
import { PATH } from "@/data/reading-path";

export const metadata: Metadata = {
  title: `Learn by reading · ${AREAS.study.name}`,
  description: "Learn Ancient Greek by reading real lines, from the sayings at Delphi to the first sentence of Aristotle's Metaphysics.",
};

export default function ReadingPathPage() {
  return (
    <Page>
      <div className="wrap" style={{ paddingBlock: "0 clamp(32px, 5vw, 56px)", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 16, maxWidth: 980 }}>
        <PageHead bare path={trail("study", "Learn by reading")} title="Learn by reading" greek="ἀνάγνωσις"
          purpose={<>{PATH.length} real lines, from the sayings carved at Delphi to the first sentence of Aristotle&apos;s <i>Metaphysics</i>,
            with a practice lesson after every three. Each lesson builds on the ones before: the help you have outgrown drops away,
            and the passages grow longer. Try the Greek first; the English waits until you ask for it.</>} />
        <div className="meander" aria-hidden="true" style={{ marginBlock: 8 }} />
        <ReadingPath />
      </div>
    </Page>
  );
}
