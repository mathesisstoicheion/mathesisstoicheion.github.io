/**
 * The five rooms of the site (the five doors of the menu and the phone bar, NAV in config/areas.ts), each a panel
 * set into the wall with its Greek name carved above it and lit by the torch.
 */
import Link from "next/link";
import Carving from "@/components/art/Carving";
import { AREAS, NAV, doorWord, type AreaId } from "@/config/areas";
import styles from "@/app/home.module.css";

/** Each room's carved name (with an interpunct where the word is short of its block), how many letters a row, and its line. */
const ROOM: Partial<Record<AreaId, { carve: string; cols: number; line: (n: { works: number; lessons: number }) => string }>> = {
  study: { carve: "ΑΚΑΔΗΜΕΙΑ", cols: 3, line: (n) => `From the alphabet to participles and pronouns, in ${n.lessons} lessons, with a few minutes' practice a day.` },
  library: { carve: "ΜΟΥΣΕΙΟΝ·", cols: 3, line: (n) => `The library: ${n.works.toLocaleString("en-GB")} works in Greek, many with English beside them.` },
  wiki: { carve: "ΣΤΟΑΠΟΙΚΙΛΗ·", cols: 4, line: () => "The world that wrote them: people, places, objects, the map and the Census of names." },
  forum: { carve: "ΑΓΟΡΑ·", cols: 3, line: () => "Ask a question, help with a passage, and argue a motion in the weekly debate." },
  treasury: { carve: "ΘΗΣΑΥΡΟΣ·", cols: 3, line: () => "Everything you keep: passages, words to practise, notes and notebooks." },
};
/** A room's Greek name, as a name (θησαυρός, a common noun, is written Θησαυρός here). */
const asName = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function Rooms({ works, lessons }: { works: number; lessons: number }) {
  return (
    <div className={styles.rgrid}>
      {NAV.map((id, i) => {
        const a = AREAS[id], r = ROOM[id]!;
        return (
          <Link key={id} className={`${styles.room} rv`} style={{ animationDelay: `${i * 0.12}s` }} href={a.href} transitionTypes={["page-turn"]}>
            <Carving text={r.carve} kind="room" cols={r.cols} delay={0.25 + i * 0.14} gain={1.25} className={styles.roomCarve} />
            <span className={styles.gk} lang="grc">{a.greek ? asName(a.greek) : a.name}</span>
            <span className={`${styles.roomWord} label`}>{doorWord(id)}</span>
            <p>{r.line({ works, lessons })}</p>
          </Link>
        );
      })}
    </div>
  );
}
