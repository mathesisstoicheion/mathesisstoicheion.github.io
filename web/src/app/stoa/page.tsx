import type { Metadata } from "next";
import Page from "@/components/Page";
import Door, { DoorBlock } from "@/components/a/Door";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import StoaEntries, { EntriesJump, type RefCard } from "@/components/stoa/StoaIndex";
import { cardOf } from "@/wiki/cards";
import { ENTRIES } from "@/wiki/index";
import Beyond, { ExploreCredit } from "@/components/stoa/ExploreLead";
import { WhyStoics } from "@/components/stoa/StoaPlates";
import type { Catalog } from "@/lib/catalog";
import { areaTitle } from "@/config/areas";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";
import { CATEGORIES } from "@/wiki/types";

export const metadata: Metadata = { title: areaTitle("wiki"), description: PAGE_DESCRIPTIONS.stoa };

// The six places made here and the reference pages first (ExploreLead), then the entries in a part that opens and closes
// (StoaIndex: the search, the subject chips, the entry of the day, the subject cards, the reference pages as their last card),
// then "Why Stoics are called Stoics" and the small print. Counts for the reference pages, taken from the catalogue when the
// site is built.
const CATALOG = JSON.parse(readFileSync(join(process.cwd(), "public/data/catalog.json"), "utf8")) as Catalog;
const TEXTS = CATALOG.authors.flatMap((a) => a.works.flatMap((w) => w.texts)).length;
const n = (x: number) => x.toLocaleString("en-GB");
const REFERENCE: RefCard[] = [
  { href: "/stoa/authors", title: "Authors", greek: "Συγγραφεῖς", blurb: `${n(CATALOG.authors.length)} authors, by period and by kind of writing.` },
  { href: "/stoa/eras", title: "Eras of Greek", greek: "Χρόνοι", blurb: "Greek through the centuries: what the library holds from each period." },
  // παράδοσις "handing down, transmission"; γραφή "MS. reading" (LSJ, παράδοσις A, γραφή II.2.d)
  { href: "/stoa/manuscripts", title: "Manuscripts & transmission", greek: "Παράδοσις", blurb: "How each author's words reached us, from papyrus to print, with the roads of the texts side by side." },
  { href: "/stoa/variants", title: "Textual variants", greek: "Γραφαί", blurb: "Where the copies disagree about the words, and how editors choose." },
  { href: "/stoa/editions", title: "Editions & translations", greek: "Ἐκδόσεις", blurb: `The printed source behind each of the ${n(TEXTS)} texts, grouped by publisher.` },
];

export default function StoaPage() {
  const count = (c: string) => ENTRIES.filter((e) => e.category === c).length;
  const subjects = [
    ...CATEGORIES.filter((c) => count(c.id)).map((c) => ({ id: c.id, title: c.title, count: count(c.id) })),
    { id: "reference", title: "Reference", count: REFERENCE.length },
  ];
  return (
    <Page top>
      {/* 2026-11-11, the owner: the things we made come first, with direct links to them; then an option to open the
          entries and choose one to read, each entry a clear place to tap. So: the head with its introduction and, at its
          right (under it on a phone), the six places made here and the reference pages; then the entries, in one part that opens and closes; then the story of
          the name and the small print. (2026-11-09: a short introduction under the head.) */}
      <Door id="wiki" computerOnlyIntro intro={<>The map, the Census and the other things made here, and {ENTRIES.length} entries on how the Greeks lived, ruled, believed and fought, each built on the texts in the library.</>}
        action={<EntriesJump total={ENTRIES.length} />} side={<Beyond reference={REFERENCE} />}>
        <DoorBlock><StoaEntries entries={ENTRIES.map(cardOf)} reference={REFERENCE} subjects={subjects} /></DoorBlock>
        <DoorBlock><WhyStoics /><ExploreCredit /></DoorBlock>
      </Door>
    </Page>
  );
}
