import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Page from "@/components/Page";
import PathStepView from "@/components/academy/PathStepView";
import PracticeView from "@/components/academy/PracticeView";
import { PATH, PRACTICE, pathStep, practice } from "@/data/reading-path";
import { AREAS } from "@/config/areas";
import NameCarving from "@/components/art/NameCarving";
import PagePiece from "@/components/art/PagePiece";

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
  const n = step ? PATH.indexOf(step) + 1 : 0;
  return (
    <Page>
      <div className="wrap" style={{ paddingBlock: "clamp(32px, 5vw, 56px)", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 16, maxWidth: 980 }}>
        <div className="page-head">
          <nav className="label">
            <Link href={AREAS.study.href} transitionTypes={["page-turn"]}>{AREAS.study.name}</Link> › <Link href="/academy/reading" transitionTypes={["page-turn"]}>Learn by reading</Link> › {step ? `Step ${n} of ${PATH.length}` : "Practice"}
          </nav>
          <NameCarving greek={step ? step.carve : "ΜΕΛΕΤΗ"} />
          <PagePiece className="piece-desk" />
          <h1 className="page-title">{step ? step.title : p!.title}{!step && <span lang="grc" style={{ display: "block", fontSize: "0.5em", marginTop: 8 }}>μελέτη</span>}</h1>
          <PagePiece className="piece-phone" />
          {step && <p className="muted" style={{ fontSize: "1.1rem" }}>{step.who}</p>}
        </div>
        <div className="meander" aria-hidden="true" style={{ marginBlock: 8 }} />
        {step ? <PathStepView step={step} /> : <PracticeView practice={p!} />}
      </div>
    </Page>
  );
}
