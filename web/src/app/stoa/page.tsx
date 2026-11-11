import type { Metadata } from "next";
import Page from "@/components/Page";
import Door, { DoorBlock } from "@/components/a/Door";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import StoaIndex, { StoaFinder, type RefCard } from "@/components/stoa/StoaIndex";
import { cardOf } from "@/wiki/cards";
import { ENTRIES } from "@/wiki/index";
import Beyond, { ExploreCredit } from "@/components/stoa/ExploreLead";
import type { Catalog } from "@/lib/catalog";
import { areaTitle } from "@/config/areas";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";
import { CATEGORIES } from "@/wiki/types";

export const metadata: Metadata = { title: areaTitle("wiki"), description: PAGE_DESCRIPTIONS.stoa };

// The head holds the search, the subject chips and "Why Stoics are called Stoics" (from the home page; redesign SPEC.md
// 4.4); then the index of entries (the reference pages are its last card); then the six places beyond (ExploreLead), and the small print. Counts for the reference pages, taken from the catalogue when the
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
    <Page>
      {/* 2026-11-09, the owner: the wikis are the Stoa's main function, everything else secondary; a short introduction
          under the head and the page's contents at its top right. So: the head holds the introduction, the one search and
          the subjects as chips (the page's contents), with the fresco and the story of the name beside; then the entry of the
          day and one index, a card for each subject; then the six places beyond the entries. */}
      <Door id="wiki" intro={<>Here are {ENTRIES.length} entries on how the Greeks lived, ruled, believed and fought, each built on the texts in the library, with the map, the Census of names and the library&apos;s reference pages beside them.</>}
        action={<StoaFinder total={ENTRIES.length} subjects={subjects} />}>
        <DoorBlock><StoaIndex entries={ENTRIES.map(cardOf)} reference={REFERENCE} /></DoorBlock>
        <DoorBlock><Beyond /><ExploreCredit /></DoorBlock>
      </Door>
    </Page>
  );
}
