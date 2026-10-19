"use client";
/**
 * The reader's cover (design B, Stone and torch; DESIGN.md, Screens: Reader): the book's Greek title cut into the
 * stone in capitals, as it would have been carved, and, for a book that has one, its medallion (data/medallions.ts).
 * The torch lights the cover; as you scroll down into the text the torchlight fades away, and from then on nothing on
 * the page moves. On the Daylight page the cover is pale limestone in an even daylight, and there is no torch.
 */
import { useEffect, useRef } from "react";
import Carving from "@/components/art/Carving";
import ReliefWindow from "@/components/art/ReliefWindow";
import { carvedCaps } from "@/lib/art/common";
import { medallionOf } from "@/data/medallions";
import { setQuiet } from "@/lib/torch";
import styles from "./Reader.module.css";

export default function ReaderCover({ workId, greek, day }: { workId: string; greek?: string | null; day: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const med = medallionOf(workId);
  // a title too long to carve well (or with no Greek letters in it) is left to the heading below
  const carve = greek && carvedCaps(greek).length >= 2 && carvedCaps(greek).length <= 42 ? greek : null;

  // the torch lights the cover and fades as the cover scrolls away
  useEffect(() => {
    const el = box.current?.closest("header") ?? box.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      if (day) { setQuiet(true, 0); return; }
      const r = el.getBoundingClientRect(), h = Math.max(1, r.height);
      setQuiet(true, Math.max(0, Math.min(1, r.bottom / h)) * 0.85);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll, { passive: true });
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); setQuiet(true, 0); };
  }, [day]);

  return (
    <div ref={box} className={styles.coverBox}>
      {carve && <Carving text={carve} kind="cover" delay={0.1} day={day} className={`carve ${styles.coverCarve}`} />}
      {med && <ReliefWindow pic={med.pic} kind="medallion" alt={med.alt} day={day} delay={0.3} frameClassName={styles.coverMedal} />}
    </div>
  );
}
