import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/Page";
import Door, { DoorBlock } from "@/components/a/Door";
import { A_ART } from "@/components/a/pictures";
import AcademyProgress from "@/components/academy/AcademyProgress";
import LessonPath from "@/components/academy/LessonPath";
import ReadingPath from "@/components/academy/ReadingPath";
import { AREAS } from "@/config/areas";
import { GUIDES } from "@/data/guides";
import styles from "@/components/academy/Academy.module.css";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";

export const metadata: Metadata = { title: `${AREAS.study.name} · ${AREAS.study.english}`, description: PAGE_DESCRIPTIONS.academy };

const TOOLS = [
  { href: "/academy/today", title: "Today's session", gr: "ἡμέρα", text: "A few minutes a day: your flashcards, one ending, one real sentence." },
  { href: "/academy/alphabet", title: "The alphabet", gr: "τὰ γράμματα", text: "Every letter: how to write it, its name, and how it sounded." },
  { href: "/academy/practice", title: "Practice", gr: "ἄσκησις", text: "Quick drills on endings, and parsing real words in real sentences." },
  { href: "/academy/tables", title: "Tables of forms", gr: "παραδείγματα", text: "Every standard declension and conjugation, searchable and checked against real texts." },
  { href: "/academy/vocabulary", title: "Vocabulary by frequency", gr: "λέξεις", text: "The commonest words first, and how much of a text you can already read." },
];

export default function AcademyPage() {
  return (
    <Page>
      {/* the next step (the day's session, or the next lesson) is the door's main action, under its name */}
      <Door id="study" art={A_ART.douris} action={<AcademyProgress />}>
        <DoorBlock>
          <section style={{ display: "grid", gap: 18 }} aria-labelledby="reading-title">
            <div>
              <span className="label">Start here</span>
              <h2 id="reading-title" style={{ marginTop: 8 }}><Link href="/academy/reading" transitionTypes={["page-turn"]}>Learn by reading</Link></h2>
              <p className="muted" style={{ marginTop: 8, maxWidth: "64ch" }}>
                Real lines, from the sayings carved at Delphi to the first sentence of Aristotle&apos;s <i>Metaphysics</i>. Each lesson
                builds on the ones before, with a practice lesson after every three; the English waits until you have tried the Greek.
              </p>
            </div>
            <ReadingPath />
          </section>
        </DoorBlock>

        <DoorBlock>
          <section style={{ display: "grid", gap: 18 }} aria-labelledby="tools-title">
            <h2 id="tools-title">Practice and reference</h2>
            <div className={styles.tools}>
              {TOOLS.map((t) => (
                <Link key={t.href} href={t.href} transitionTypes={["page-turn"]} className={`slab-card ${styles.card}`}>
                  <span className={styles.cardGr} lang="grc">{t.gr}</span>
                  <h3>{t.title}</h3>
                  <p className="muted">{t.text}</p>
                </Link>
              ))}
            </div>
          </section>
        </DoorBlock>

        <DoorBlock>
          <section style={{ display: "grid", gap: 18 }} aria-labelledby="lessons-title">
            <div>
              <span className="label">For review, alongside the reading</span>
              <h2 id="lessons-title" style={{ marginTop: 8 }}>Lessons</h2>
              <p className="muted" style={{ marginTop: 8, maxWidth: "64ch" }}>
                The grammar in full, from the alphabet to Homer, for when you want more than the reading path gives. Read each lesson, practise it, then pass its short test. A passed lesson comes back for a quick refresh
                after three days, a week, then a month, so what you learn stays with you.
              </p>
            </div>
            <LessonPath />
          </section>
        </DoorBlock>

        <DoorBlock>
          <section style={{ display: "grid", gap: 18 }} aria-labelledby="guides-title">
            <div>
              <span className="label">Finding your way</span>
              <h2 id="guides-title" style={{ marginTop: 8 }}>Practical guides</h2>
            </div>
            <div className={`${styles.hub} snap-row`}>
              {GUIDES.map((g, i) => (
                <Link key={g.id} href={`/academy/guide/${g.id}`} transitionTypes={["page-turn"]} className={`slab-card ${styles.card}`}>
                  <span className={styles.guideNo}>Guide {i + 1}</span>
                  <span className={styles.cardGr} lang="grc">{g.greek}</span>
                  <h3>{g.title}</h3>
                  <p className="muted">{g.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        </DoorBlock>
      </Door>
    </Page>
  );
}
