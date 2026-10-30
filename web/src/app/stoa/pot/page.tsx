import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/Page";
import RefHead from "@/components/stoa/RefHead";
import Amphora from "@/components/Amphora";
import { AREAS } from "@/config/areas";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";

export const metadata: Metadata = { title: `${AREAS.pot.name} · ${AREAS.wiki.name}`, description: PAGE_DESCRIPTIONS.pot };

/**
 * Paint a pot: the neck-amphora to turn and paint (components/Amphora.tsx), on a page of its own in the Painted Stoa, so
 * it can be found, come back to and shared (it stood at the foot of the Kerameikos until 2026-10-30). A shared pot opens
 * here from its link (/stoa/pot#v=…).
 */
export default function PotPage() {
  return (
    <Page>
      <RefHead title={AREAS.pot.name} greek={AREAS.pot.greek}>
        Turn a neck-amphora and paint it as the painters of Athens did: black gloss on the red clay, lines scratched through
        it, touches of added red and white. Your vase is kept in this browser, and Share makes a link that opens it for anyone.
      </RefHead>
      <div className="wrap" style={{ paddingBottom: "clamp(32px, 5vw, 56px)" }}>
        <Amphora />
        <p className="muted" style={{ marginTop: "var(--space-5)" }}>
          How the real ones were made: <Link href="/stoa/black-and-red-figure" transitionTypes={["page-turn"]}>Black-figure and red-figure</Link>.
        </p>
      </div>
    </Page>
  );
}
