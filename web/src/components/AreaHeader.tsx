import type { ReactNode } from "react";
import Carving from "@/components/art/Carving";
import PagePiece from "@/components/art/PagePiece";
import { AREAS, type AreaId } from "@/config/areas";

/**
 * The header every area opens with (design B, Stone and torch): its plain name, its Greek name carved across the wall
 * and lit by the torch (where it has one), its name in full, and what the name means and why it fits. An area with no
 * Greek name of its own may carve a line that belongs to it instead, with its source (`carve`). The area's own piece of
 * sculpture stands in its niche at the right (components/art/PagePiece.tsx); on a phone it stands after the title and the line saying
 * what the page is for, so those come first.
 */
export default function AreaHeader({ id, carve, children }: { id: AreaId; carve?: { text: string; caption: ReactNode }; children?: ReactNode }) {
  const a = AREAS[id];
  const cut = a.greek ?? carve?.text;
  return (
    <header className="area-head">
      <div className="wrap">
        <div className="area-kicker"><span className="label">{a.english}</span></div>
        {cut && <Carving text={cut} kind="title" delay={0.15} className="carve area-carve" />}
        {!a.greek && carve && <p className="area-carve-cap">{carve.caption}</p>}
        <PagePiece className="piece-desk" />
        <h1>
          {a.name}
          {a.greek && <span className="area-greek" lang="grc">{a.greek}</span>}
        </h1>
        <p className="area-origin">{a.origin} {a.fit}</p>
        <PagePiece className="piece-phone" />
        {children}
      </div>
      <div className="wrap"><div className="meander" aria-hidden="true" /></div>
    </header>
  );
}
