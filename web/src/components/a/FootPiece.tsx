"use client";
/**
 * The foot of every page inside an area: the page's own gilded piece in design A's red window, which stood at the page's head
 * until the area's figure took its place there (the owner, 2026-10-20; PageWin.tsx), with a label beside it as in a museum:
 * the area, the figure behind the page and the texts and portrait it is made of, and the way back to the area's door.
 * The doors, the home page, the reader and the pages outside the areas have none.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import PageWin from "./PageWin";
import { AREAS } from "@/config/areas";
import { figureFor, figureCredit } from "@/data/figures";
import { pieceFor } from "@/data/pieces";
import s from "./a.module.css";

export default function FootPiece() {
  const path = (usePathname() ?? "/").replace(/\/+$/, "") || "/";
  const f = figureFor(path);
  if (!f || AREAS[f.area].href === path) return null;
  const a = AREAS[f.area], who = f.who[0].toUpperCase() + f.who.slice(1), piece = !!pieceFor(path);
  return (
    <aside className={`${s.screen} ${s["foot-piece"]}`} aria-label={`About this page's figure and picture, and the way back to ${a.name.replace(/^The /, "the ")}`}>
      <div className={`${s.wrap} ${s["fp-grid"]}${piece ? "" : ` ${s["fp-one"]}`}`}>
        <div className={s["fp-text"]}>
          <span className={s.mono} style={{ color: "var(--a-accent)" }}>{a.door ?? a.english} · {a.name}</span>
          <p className={s["fp-title"]}>{who} becomes {f.object}</p>
          <p className={s.cap}>{figureCredit(f)}</p>
          <Link className={s["fp-go"]} href={a.href} transitionTypes={["page-turn"]}>Back to {a.name.replace(/^The /, "the ")} <span aria-hidden="true">→</span></Link>
        </div>
        {piece && <PageWin red className="piece-foot" />}
      </div>
    </aside>
  );
}
