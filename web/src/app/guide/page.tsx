import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/Page";
import { AREAS, type AreaId } from "@/config/areas";
import { GuideChapters, GuideContents, type Chapter } from "@/components/guide/GuideChapters";
import styles from "@/components/guide/Guide.module.css";
import { GuideSeen } from "@/components/guide/GuideChapters";

export const metadata: Metadata = {
  title: "How to use the site",
  description: "The Guide: ten short chapters on finding, reading and searching the Greek texts, looking up words, keeping notes, learning Greek and joining in, each with a \"Show me\" tour of the real page.",
};

const place = (id: AreaId) => ({ name: AREAS[id].name, greek: AREAS[id].greek, english: AREAS[id].english });

const CHAPTERS: Chapter[] = [
  {
    id: "learn", title: "Learn Greek", place: place("study"),
    text: [
      "Start with the alphabet, even if you know no Greek at all: twenty-four letters, each with its name and its sound.",
      "Then short lessons, each built on real sentences from the texts, and a few minutes' practice a day that brings back the words you are learning just as you would start to forget them.",
    ],
    also: { label: "The alphabet", href: "/academy/alphabet" },
  },
  {
    id: "find", title: "Find a text", place: place("library"),
    text: [
      "The library holds the Greek texts, from Homer to the Byzantine scholars: more than 1,800 works, many with an English translation beside them.",
      "Search by author or title (titles in Greek too), narrow the shelves by kind of writing, period or dialect, or let the library suggest where to begin, from the easiest Greek to the hardest.",
    ],
  },
  {
    id: "read", title: "Read in the Scroll", place: place("reader"),
    text: [
      "A work opens in the Scroll with the Greek on one side and the English on the other, passage by passage. You can read one column alone, choose another edition or translation, and go straight to any passage by its reference.",
      "If a translation leaves a passage out, the Scroll says so: it is not a fault in the site.",
    ],
  },
  {
    id: "word", title: "Look up a word",
    text: [
      "Click or tap any Greek word to see what it is: its dictionary form, its grammar here, and its meaning from LSJ (Liddell–Scott–Jones), the great Greek–English dictionary.",
      "From there you can see how the sentence is built, or find the word everywhere else it appears.",
    ],
  },
  {
    id: "aids", title: "Reading aids",
    text: [
      "When the Greek is hard, switch on some help: Latin letters under the Greek, words coloured by their case (the ending that shows a word's job in the sentence), the page's vocabulary, or the English read aloud.",
      "Try it first hides the English until you ask for it, so you read the Greek yourself. The Find button searches the whole book; Places and Manuscript show the page on a map and as it was once written by hand.",
    ],
  },
  {
    id: "keep", title: "Keep what you find", place: place("treasury"),
    text: [
      "Bookmark a passage, highlight it, write a note on it, or gather passages into a research notebook with their citations.",
      "All of it waits for you in the Treasury, where it can be downloaded, printed or kept safe.",
    ],
    also: { label: "Open the Treasury", href: AREAS.treasury.href },
  },
  {
    id: "explore", title: "Explore the Greek world", place: place("wiki"),
    text: [
      "The Painted Stoa has articles on people, ideas and everyday life, each with its sources and links into the texts.",
      "You will also find every author with their dates, the centuries of Greek, a map of the places the texts name, a count of who and what they mention most, and the Kerameikos, on what archaeology tells us.",
    ],
    also: { label: "Open the map", href: AREAS.map.href },
  },
  {
    id: "search", title: "Search everything", place: place("search"),
    text: [
      "The Oracle searches every text at once: an exact Greek form, a dictionary word in all its forms, or the English translations.",
      "See the results by work, as a concordance (a list with every match lined up down the middle), or as statistics by author and by century.",
    ],
  },
  {
    id: "talk", title: "Ask and argue", place: place("forum"),
    text: [
      "In the Town Hall you can ask about a passage, share what you are reading, or suggest an idea for the site. In the Pnyx members propose a motion, argue it and vote.",
      "Reading needs no account; to write, sign in or join for free.",
    ],
    also: { label: "Open the Pnyx", href: AREAS.debates.href },
  },
  {
    id: "settings", title: "Make it yours",
    text: [
      "Search from any page. In Settings choose light or dark, the typefaces, the size of the Greek and the spacing of the lines, or less animation.",
      "Keep texts on your device to read without a connection, in the Scroll Case. An account is optional: it keeps your notes and progress in step across your devices.",
    ],
    also: { label: "The Scroll Case", href: AREAS.downloads.href },
  },
];

export default function GuidePage() {
  return (
    <Page>
      <div className={`wrap ${styles.page}`}>
        <header className={styles.top}>
          <span className="label">The Guide <span lang="grc">ὁδηγός</span></span>
          <h1 className="page-title">How to use the site</h1>
          <p className={styles.lead}>
            Ten short chapters, one for each thing you can do here. Each has <b>Show me</b>: it opens the real page and points
            at its controls one at a time, so you learn by trying them. A chapter takes a minute or two.
          </p>
          <div className={styles.fork}>
            <Link className="btn" href="/academy?tour=learn">Know no Greek yet? Start with the letters <span className="arr" aria-hidden="true">→</span></Link>
            <Link className="btn ghost" href="/library?tour=find">Want to read straight away? <span className="arr" aria-hidden="true">→</span></Link>
          </div>
          <p className={styles.small}><i>Hodēgos</i>, «ὁδηγός», is the Greek for a guide, one who leads the way.</p>
        </header>
        <GuideSeen />
        <GuideContents chapters={CHAPTERS} />
        <div className="meander" aria-hidden="true" />
        <GuideChapters chapters={CHAPTERS} />
      </div>
    </Page>
  );
}
