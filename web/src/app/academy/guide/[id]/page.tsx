import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Page from "@/components/Page";
import PageHead from "@/components/PageHead";
import GuideView from "@/components/academy/GuideView";
import { GUIDES, guideById } from "@/data/guides";
import { AREAS, trail } from "@/config/areas";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ id: g.id }));
}

export async function generateMetadata({ params }: PageProps<"/academy/guide/[id]">): Promise<Metadata> {
  const { id } = await params;
  const g = guideById(id);
  return { title: `${g?.title ?? "Guide"} · ${AREAS.study.name}`, description: g?.summary };
}

export default async function GuidePage({ params }: PageProps<"/academy/guide/[id]">) {
  const { id } = await params;
  const guide = guideById(id);
  if (!guide) notFound();
  const n = GUIDES.indexOf(guide) + 1;
  return (
    <Page>
      <div className="wrap" style={{ paddingBlock: "0 clamp(32px, 5vw, 56px)", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 16, maxWidth: 980 }}>
        <PageHead bare path={trail("study", `Guide ${n} of ${GUIDES.length}`)} title={guide.title} greek={guide.greek}
          purpose={<>{guide.summary} · about {guide.minutes} minutes</>} />
        <div className="meander" aria-hidden="true" style={{ marginBlock: 8 }} />
        <GuideView guide={guide} />
      </div>
    </Page>
  );
}
