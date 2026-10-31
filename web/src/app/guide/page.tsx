import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/Page";
import Icon from "@/components/Icon";
import PageHead from "@/components/PageHead";
import { AREAS, FORUM_OPEN, type AreaId } from "@/config/areas";
import { GuideChapters, GuideContents, type Chapter } from "@/components/guide/GuideChapters";
import styles from "@/components/guide/Guide.module.css";
import { GuideSeen } from "@/components/guide/GuideChapters";
import { TRACKS } from "@/data/tracks";

export const metadata: Metadata = {
  title: "How to use the site",
  description: `The Guide: ${FORUM_OPEN ? "ten" : "nine"} short chapters on finding, reading and searching the Greek texts, looking up words, keeping notes${FORUM_OPEN ? ", learning Greek and joining in" : " and learning Greek"}, each with a "Show me" tour of the real page.`,
};

const place = (id: AreaId) => ({ name: AREAS[id].name, greek: AREAS[id].greek });

const ALL_CHAPTERS: Chapter[] = [
  {
    id: "learn", title: "Learn Greek", place: place("study"),
    text: [
      "Start with the first lesson, even if you know no Greek at all: the twenty-four letters, and six names you already know to sound out. In the next lesson you read your first real line, a saying carved at Delphi.",
      "Every lesson after it is one real line from the texts: its letters, its words, how it is built, and then you read it yourself, in the reader. A practice lesson comes after every three. The grammar course, the second track, teaches the grammar in order, each lesson with a short test.",
    ],
  },
  {
    id: "find", title: "Find a text", place: place("library"),
    text: [
      "The library holds the Greek texts, from Homer to the Byzantine scholars: more than 1,800 works, many with an English translation beside them.",
      "Search by author or title (titles in Greek too), narrow the shelves by kind of writing, period or dialect, or let the library suggest where to begin, from the easiest Greek to the hardest.",
    ],
  },
  {
    id: "read", title: "Read a text", place: place("reader"),
    // the quiet desk, the guide (the owner, 2026-10-31): a book opens on the Greek alone; one bar along the foot of the page; the phone's Back button closes what is open first
    text: [
      "A book opens on the Greek alone. Under each passage, Show the English opens its translation, or says that the translation leaves that passage out.",
      "One bar runs along the foot of the page. Library goes back to the library, the middle (it says where you are) goes to any line, Text sets the columns and the look of the page, and Study holds every other tool. On a phone, the Back button first closes whatever is open over the text, newest first, and then leaves the book.",
    ],
  },
  {
    id: "word", title: "Look up a word",
    // the quiet desk, the guide (the owner, 2026-10-31): the look-up's first view, then "More about it" (the whole LSJ entry and Go further)
    text: [
      "Click or tap any Greek word and the look-up opens: beside the text on a computer, as a sheet at the foot of the screen on a phone. It shows the word's dictionary form, what kind of word it is, its meaning, its job in this sentence and its form.",
      "More about it opens the whole entry from LSJ (Liddell–Scott–Jones), the great Greek–English dictionary. Go further, below it, leads on: where else the word comes in the book, how the sentence is built, a lesson on its form, and Word Study.",
    ],
  },
  {
    id: "aids", title: "Reading aids",
    // the quiet desk, the guide (the owner, 2026-10-31): every tool is a row of Study, in groups (Reading help, Go deeper, Edition and translation, More)
    text: [
      "When the Greek is hard, open Study, at the foot of the page, and look under Reading help. Transliteration puts Latin letters under the Greek, Colour by case underlines each word in the colour of its case (the ending that shows its job in the sentence), and Metre marks the long and short syllables of verse.",
      "Vocabulary for this page lists its words, and Find in this text searches the whole book. With the English beside the Greek, Try it first hides each translation until you tap it. Under Go deeper, Listen reads the English aloud, and Places on this page and How it was written show a map and a scribe's page.",
    ],
  },
  {
    id: "keep", title: "Keep what you find", place: place("treasury"),
    // the quiet desk, the guide (the owner, 2026-10-31): the passage strip, and Study's row for your notes and marks
    text: [
      "Click or tap a passage's number, or select some words (on a phone, press and hold one), and a strip of buttons opens: Bookmark, Favourite, Note, four highlight colours, and Notebook, which gathers passages, with their citations, into a research notebook.",
      "Your notes and marks, under Study, lists what you have kept in this book. All of it waits for you in the Treasury, where it can be downloaded, printed or kept safe.",
    ],
    also: { label: "Open the Treasury", href: AREAS.treasury.href, icon: "mine" },
  },
  {
    id: "explore", title: "Explore the Greek world", place: place("wiki"),
    text: [
      "The Painted Stoa has articles on people, ideas and everyday life, each with its sources and links into the texts.",
      "You will also find every author with their dates, the centuries of Greek, a map of the places the texts name, a count of who and what they mention most, and the Kerameikos, on what archaeology tells us.",
    ],
    also: { label: "Open the map", href: AREAS.map.href, icon: "map" },
  },
  {
    id: "search", title: "Search everything", place: place("search"),
    text: [
      "The Oracle searches every text at once: a Greek word as it is printed, a dictionary word in all its forms (narrowed by its grammar if you like), the English translations, or sentences by how they are built, such as the genitive absolute. Type in Greek letters, Latin letters or Beta Code.",
      "See the results by work, as a concordance (a list with every match lined up down the middle), or as statistics by author and by century. It searches your own notes and bookmarks too.",
    ],
  },
  {
    id: "talk", title: "Ask and argue", place: place("forum"),
    text: [
      "In the Agora you can ask about a passage, share what you are reading, or suggest an idea for the site. In the Pnyx members propose a motion, argue it and vote.",
      "Reading needs no account; to write, sign in or join for free.",
    ],
    also: { label: "Open the Pnyx", href: AREAS.debates.href, icon: "talk" },
  },
  {
    id: "settings", title: "Make it yours",
    text: [
      "Search from any page. In Settings choose the page (Paper, Night, or as your device is set), the size of the Greek and the spacing of the lines.",
      "Keep texts on your device to read without a connection, in the Scroll Case. An account is optional: it keeps your notes and progress in step across your devices.",
    ],
    also: { label: "The Scroll Case", href: AREAS.downloads.href, icon: "download" },
  },
];

// the Talk chapter waits while the forum is closed (FORUM_OPEN)
const CHAPTERS = ALL_CHAPTERS.filter((c) => FORUM_OPEN || c.id !== "talk");

export default function GuidePage() {
  return (
    <Page>
      <div className={`wrap ${styles.page}`}>
        <PageHead bare path={[{ label: "About" }, { label: "The guide" }]} title="How to use the site"
          purpose={<>{FORUM_OPEN ? "Ten" : "Nine"} short chapters, one for each thing you can do here. Each has <b>Show me</b>: it opens the real page and points
            at its controls one at a time, so you learn by trying them. A chapter takes a minute or two.</>}
          action={<div className={styles.fork}>
            {/* the two ways in, each said once: the chapters below show round (Learn Greek's first lesson is this first one) */}
            <Link className="btn" href={TRACKS.reading.first}><Icon name="letters" />Know no Greek yet? Start with the letters <span className="arr" aria-hidden="true">→</span></Link>
            <Link className="btn ghost" href={AREAS.library.href}><Icon name="library" />Read Greek already? Open the Mouseion <span className="arr" aria-hidden="true">→</span></Link>
          </div>}>
          <p className={styles.small}><i>Hodēgos</i>, «ὁδηγός», is the Greek for a guide, one who leads the way.</p>
        </PageHead>
        <GuideSeen />
        <GuideContents chapters={CHAPTERS} />
        <div className="meander" aria-hidden="true" />
        <GuideChapters chapters={CHAPTERS} />
      </div>
    </Page>
  );
}
