/**
 * A door of the site (Learn, Explore, Talk, Mine, Search), in design A's own look (the owner, 2026-10-20: "Let's go with
 * gold and lamp everything"): dark blocks with the door's name, its main action and its parts, across the page's whole
 * width (the owner, 2026-10-20: "Everything is stuck to the left, and doesn't fill out the page"), and beside the name one
 * of A's tall red windows onto a gilded object of the area. On a phone the window comes first, above the name.
 */
import type { ReactNode } from "react";
import Win from "./Win";
import type { Picture } from "./pictures";
import { AREAS, type AreaId } from "@/config/areas";
import s from "./a.module.css";

export default function Door({ id, art, action, carve, children }: {
  id: AreaId;
  /** the door's red window: a gilded object of the area (components/a/pictures.ts, A_ART) */
  art: Picture;
  /** the door's one main thing: its search box or its next step */
  action?: ReactNode;
  /** a line in Greek capitals set above the name, for a door with no Greek name of its own, and its source */
  carve?: { text: string; caption: ReactNode };
  children: ReactNode;
}) {
  const a = AREAS[id];
  return (
    <div className={`${s.screen} ${s.door}`}>
      <div className={`${s.wrap} ${s["door-hero"]}`}>
        <header className={s.blk}>
          <span className={s.mono} style={{ color: "var(--a-accent)" }}>{a.door}</span>
          {carve && <p className={s["door-carve"]} lang="grc">{carve.text}</p>}
          {/* the Greek name large, the English name small beneath (review fixes, slice 2) */}
          <h1 className={s["lib-title"]}>{a.greek ? <><span lang="grc">{a.greek}</span><span className={s["en-t"]}>{a.name}</span></> : a.name}</h1>
          <p className={s.lede}>{a.origin} {a.fit}</p>
          {action && <div className={s["door-action"]}>{action}</div>}
          {carve && <p className={s.cap}>{carve.caption}</p>}
        </header>
        <Win className={`${s.win} ${s.tall}`} src={art.src} label={art.label} caption={art.cap} capClass={s.wcap} />
      </div>
      <div className={s["door-body"]}>{children}</div>
      <div className={`${s.wrap} ${s["door-credit"]}`}>
        <div className={s.blk}><p className={s.cap}>The red window: {art.credit}.</p></div>
      </div>
    </div>
  );
}

/** One of a door's dark blocks, across the page's width. */
export function DoorBlock({ id, label, children }: { id?: string; label?: string; children: ReactNode }) {
  return (
    <div className={s.wrap}>
      <section className={s.blk} id={id} aria-label={label}>{children}</section>
    </div>
  );
}
