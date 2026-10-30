import type { Metadata } from "next";
import Page from "@/components/Page";
import RefHead from "@/components/stoa/RefHead";
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
      <RefHead title={AREAS.lyre.name} greek={AREAS.lyre.greek}>
        Play the lyre with your keyboard, your fingers or a MIDI keyboard, and play along with the melodies that survive
        from ancient Greece, written in the Greeks&apos; own musical notation.
      </RefHead>
      <div className="wrap" style={{ paddingBottom: "var(--page-foot)" }}>
        <Lyre melodies={MELODIES} first={seikilos as MelodyNotes} />
      </div>
    </Page>
  );
}
