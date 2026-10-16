import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/Page";
import NameCarving from "@/components/art/NameCarving";
import Lyre from "@/components/lyre/Lyre";
import { AREAS } from "@/config/areas";
import { MELODIES } from "@/data/melodies";
import type { MelodyNotes } from "@/data/melodies/types";
import seikilos from "../../../../public/data/melodies/seikilos.json";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";

export const metadata: Metadata = { title: `The lyre · ${AREAS.wiki.name}`, description: PAGE_DESCRIPTIONS.lyre };

export default function LyrePage() {
  return (
    <Page>
      <div className="wrap" style={{ paddingBlock: "clamp(32px, 5vw, 56px)", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 20 }}>
        <nav className="label"><Link href={AREAS.wiki.href} transitionTypes={["page-turn"]}>{AREAS.wiki.name}</Link> › The lyre</nav>
        <NameCarving greek="λύρα" />
        <h1 className="page-title">The lyre <span lang="grc">λύρα</span></h1>
        <p className="muted" style={{ maxWidth: "62ch", fontSize: "1.1rem" }}>
          Play the lyre with your keyboard, your fingers or a MIDI keyboard, and play along with the melodies that survive
          from ancient Greece, written in the Greeks&apos; own musical notation.
        </p>
        <Lyre melodies={MELODIES} first={seikilos as MelodyNotes} />
      </div>
    </Page>
  );
}
