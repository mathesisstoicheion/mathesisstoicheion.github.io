/**
 * A door of the site (Learn, Explore, Talk, Mine, Search), built as the library is (the owner, 2026-10-19: "mixes elements
 * of gold and torch (A) and ... the Museion"; "each page has its own distinct design, but with an overall, unifying
 * design"): the area's figure on a stage pinned behind the page (FigStage.tsx), where the letters of a real Greek text
 * gather into a face beside the door's name and, as you scroll, become the area's object, grown large behind the page
 * until you scroll back to the top (the owner, 2026-10-20); over it, dark blocks with the door's name, its main action
 * and its parts, across the page's whole width (the owner, 2026-10-20: "Everything is stuck to the left, and doesn't fill
 * out the page"); and one of design A's red windows onto a gilded object of the area. On a phone the face comes first,
 * above the name.
 */
import type { ReactNode } from "react";
import FigStage from "./FigStage";
import Win from "./Win";
import type { Picture } from "./pictures";
import { AREAS, type AreaId } from "@/config/areas";
import { FIGURES, figureCredit, type FigureId } from "@/data/figures";
import s from "./a.module.css";

const cap = (t: string) => t[0].toUpperCase() + t.slice(1);

export default function Door({ id, fig, art, action, carve, children }: {
  id: AreaId;
  fig: FigureId;
  /** the door's red window: a gilded object of the area (components/a/pictures.ts, A_ART) */
  art: Picture;
  /** the door's one main thing: its search box or its next step */
  action?: ReactNode;
  /** a line in Greek capitals set above the name, for a door with no Greek name of its own, and its source */
  carve?: { text: string; caption: ReactNode };
  children: ReactNode;
}) {
  const a = AREAS[id], f = FIGURES[fig];
  const redWin = (where: string) => (
    <div className={`${s.wrap} ${s[where]}`}>
      <Win className={`${s.win} ${s.band} ${s.art}`} src={art.src} label={art.label} caption={art.cap} capClass={s.wcap} />
    </div>
  );
  return (
    <div className={`${s.screen} ${s.door}`}>
      <FigStage fig={fig} />
      <div className={s.flow}>
        <div className={`${s.wrap} ${s["door-hero"]}`}>
          <header className={s.blk}>
            <span className={s.mono} style={{ color: "var(--a-accent)" }}>{a.door ?? a.english} · {a.name}</span>
            {carve && <p className={s["door-carve"]} lang="grc">{carve.text}</p>}
            <h1 className={s["lib-title"]}>{a.name}{a.greek && <span className={s["gr-t"]} lang="grc">{a.greek}</span>}</h1>
            <p className={s.lede}>{a.origin} {a.fit}</p>
            {action && <div className={s["door-action"]}>{action}</div>}
            {carve && <p className={s.cap}>{carve.caption}</p>}
            <p className={`${s.stcap} ${s.mono}`}>The letters gather into {f.who}, spelled out of {f.from}. Scroll on, and they become {f.object} behind the page; back at the top, {f.who} again. Press and hold to read.</p>
          </header>
          <div className={`${s.win} ${s.tall} ${s.gap}`} data-face-anchor="" role="img" aria-label={`${cap(f.who)}, spelled out letter by letter from the Greek of ${f.from}; scroll on, and the letters become ${f.object} behind the page. Press and hold to read`}>
            <span className={s.wcap}>{cap(f.who)} · spelled out of {f.from} · press and hold to read</span>
          </div>
        </div>
        {redWin("art-desk")}
        <div className={s["door-body"]}>{children}</div>
        {redWin("art-phone")}
        <div className={`${s.wrap} ${s["door-credit"]}`}>
          <div className={s.blk}><p className={s.cap}>{figureCredit(f)} The red window: {art.credit}.</p></div>
        </div>
      </div>
    </div>
  );
}

/** One of a door's dark blocks, across the page's width, with the figure's object showing in the gaps between them. */
export function DoorBlock({ id, label, children }: { id?: string; label?: string; children: ReactNode }) {
  return (
    <div className={s.wrap}>
      <section className={s.blk} id={id} aria-label={label}>{children}</section>
    </div>
  );
}
