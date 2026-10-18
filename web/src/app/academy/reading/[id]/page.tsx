import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Page from "@/components/Page";
import PathStepView from "@/components/academy/PathStepView";
import { PATH, pathStep } from "@/data/reading-path";
import { AREAS } from "@/config/areas";
import NameCarving from "@/components/art/NameCarving";
import PagePiece from "@/components/art/PagePiece";

export function generateStaticParams() {
  return PATH.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: PageProps<"/academy/reading/[id]">): Promise<Metadata> {
  const { id } = await params;
  const s = pathStep(id);
  return { title: `${s?.title ?? "Learn by reading"} · ${AREAS.study.name}`, description: s ? `Learn to read ${s.label} in Greek, word by word: ${s.who}.` : undefined };
}

export default async function PathStepPage({ params }: PageProps<"/academy/reading/[id]">) {
  const { id } = await params;
  const step = pathStep(id);
  if (!step) notFound();
  const n = PATH.indexOf(step) + 1;
  return (
    <Page>
      <div className="wrap" style={{ paddingBlock: "clamp(32px, 5vw, 56px)", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 16, maxWidth: 980 }}>
        <div className="page-head">
          <nav className="label">
            <Link href={AREAS.study.href} transitionTypes={["page-turn"]}>{AREAS.study.name}</Link> › <Link href="/academy/reading" transitionTypes={["page-turn"]}>Learn by reading</Link> › Step {n} of {PATH.length}
          </nav>
          <NameCarving greek={step.carve} />
          <PagePiece className="piece-desk" />
          <h1 className="page-title">{step.title}</h1>
          <PagePiece className="piece-phone" />
          <p className="muted" style={{ fontSize: "1.1rem" }}>{step.who}</p>
        </div>
        <div className="meander" aria-hidden="true" style={{ marginBlock: 8 }} />
        <PathStepView step={step} />
      </div>
    </Page>
  );
}
