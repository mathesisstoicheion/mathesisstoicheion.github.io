import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Page from "@/components/Page";
import PathStepView from "@/components/academy/PathStepView";
import PracticeView from "@/components/academy/PracticeView";
import { PATH, PRACTICE, partText, pathStep, practice, readingLesson } from "@/data/reading-path";
import { TRACKS } from "@/data/tracks";
import { AREAS, trail } from "@/config/areas";
import PageHead from "@/components/PageHead";

export function generateStaticParams() {
  return [...PATH, ...PRACTICE].map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: PageProps<"/academy/reading/[id]">): Promise<Metadata> {
  const { id } = await params;
  const p = practice(id);
  if (p) return { title: `${p.title} · ${AREAS.study.name}`, description: "Practise the words and grammar of three lessons in other real lines of Greek." };
  const s = pathStep(id);
  return { title: `${s?.title ?? "Learn by reading"} · ${AREAS.study.name}`, description: s ? `Learn to read ${s.label} in Greek, word by word: ${s.who}.` : undefined };
}

export default async function PathStepPage({ params }: PageProps<"/academy/reading/[id]">) {
  const { id } = await params;
  const p = practice(id);
  const step = pathStep(id);
  if (!step && !p) notFound();
  return (
    <Page>
      <div className="wrap" style={{ paddingBlock: "0 clamp(32px, 5vw, 56px)", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 16, maxWidth: 980 }}>
        <PageHead bare path={trail("study", { label: TRACKS.reading.name, href: TRACKS.reading.href }, step ? readingLesson(step.id) : "Practice")}
          title={step ? step.title : p!.title} greek={step ? step.parts.map(partText).join(" ") : "μελέτη"} purpose={step ? step.who : undefined} />
        <div className="meander" aria-hidden="true" style={{ marginBlock: 8 }} />
        {step ? <PathStepView step={step} /> : <PracticeView practice={p!} />}
      </div>
    </Page>
  );
}
