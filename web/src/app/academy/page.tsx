import type { Metadata } from "next";
import Link from "next/link";
import Page from "@/components/Page";
import Door, { DoorBlock } from "@/components/a/Door";
import { areaTitle } from "@/config/areas";
import AlphabetGlance from "@/components/academy/AlphabetGlance";
import { GUIDES } from "@/data/guides";
import styles from "@/components/academy/Academy.module.css";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";

export const metadata: Metadata = { title: areaTitle("study"), description: PAGE_DESCRIPTIONS.academy };

const TOOLS = [
  { href: "/academy/today", title: "Today's session", gr: "ἡμέρα", text: "A few minutes a day: one ending to practise and one real sentence to read." },
  { href: "/academy/alphabet", title: "The alphabet", gr: "τὰ γράμματα", text: "Every letter: how to write it, its name, and how it sounded." },
  { href: "/academy/practice", title: "Practice", gr: "ἄσκησις", text: "Quick drills on endings, and parsing real words in real sentences." },
  { href: "/academy/tables", title: "Tables of forms", gr: "παραδείγματα", text: "Every standard declension and conjugation, searchable and checked against real texts." },
  { href: "/academy/vocabulary", title: "Vocabulary by frequency", gr: "λέξεις", text: "The commonest words first, and how much of a text you can already read." },
];

export default function AcademyPage() {
  return (
    <Page>
      {/* the lessons, both tracks, are off the site since 2026-11-09 (config/lessons.ts): the Academy holds the tools */}
      {/* 2026-11-09: landing on Learn shows the letters at once, beside a short introduction: tap one to hear it */}
      <Door id="study" intro={<>Learn here what you need while you read: the letters, the endings, the commonest words. Start with the 24 letters: tap one to see its name and hear how it sounded.</>}
        side={<AlphabetGlance headingLevel={2} />}>
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
