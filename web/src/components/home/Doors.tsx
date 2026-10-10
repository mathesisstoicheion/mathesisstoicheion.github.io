/**
 * The five doors, as picture cards (Phase 11): shown to a first visit under "Where are you starting?", so the whole
 * site can be seen at a glance. The same five as the menu and the phone bar (NAV in config/areas.ts).
 */
import Link from "next/link";
import { AREAS, NAV, doorWord, type AreaId } from "@/config/areas";
import { IMAGES, srcSet } from "@/wiki/images";
import styles from "./Start.module.css";

/** One picture and one line for each door; `n` is filled in by the home page from the catalogue. */
const DOOR: Partial<Record<AreaId, { pic: string; line: (n: { works: number; lessons: number }) => string }>> = {
  study: { pic: "douris-school-cup", line: (n) => `From the alphabet to participles and pronouns, in ${n.lessons} lessons, with a few minutes' practice a day.` },
  library: { pic: "socrates-louvre", line: (n) => `${n.works.toLocaleString("en-GB")} works, from Homer to the Byzantine scholars, many with English beside the Greek.` },
  wiki: { pic: "mask-of-agamemnon", line: () => "The world that wrote them: the map, the Census of names, archaeology and the wiki." },
  forum: { pic: "themistocles-ostraka", line: () => "Ask a question, help with a passage, and argue a motion in the weekly debate." },
  treasury: { pic: "athenian-owl", line: () => "Everything you keep: passages, words to practise, notes and notebooks." },
};

export default function Doors({ works, lessons }: { works: number; lessons: number }) {
  const pics = NAV.map((id) => IMAGES[DOOR[id]!.pic]);
  return (
    <>
      <ul className={styles.doors}>
        {NAV.map((id, i) => {
          const a = AREAS[id], im = pics[i];
          return (
            <li key={id} className="rv">
              <Link className={styles.door} href={a.href} transitionTypes={["page-turn"]}>
                <span className={styles.doorPic}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- self-hosted, sized files; no image service */}
                  <img src={`/images/${im.file}`} srcSet={srcSet(im)} sizes="(max-width: 460px) 100vw, (max-width: 1100px) 33vw, 240px"
                    alt={im.alt} title={`${im.title} · ${im.sourceName} · ${im.licence}`} width={im.width} height={im.height} loading="lazy" decoding="async" />
                </span>
                <span className={styles.doorTxt}>
                  <b>{doorWord(id)}</b>
                  <span className={styles.doorGr}>{a.greek ? <span lang="grc">{a.greek}</span> : a.name}</span>
                  <span>{DOOR[id]!.line({ works, lessons })}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className={styles.doorCredit}>Pictures: {pics.map((im) => `${im.title} (${im.sourceName}, ${im.licence})`).join("; ")}.</p>
    </>
  );
}
