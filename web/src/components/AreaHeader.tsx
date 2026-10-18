import type { ReactNode } from "react";
import PageHead from "@/components/PageHead";
import { AREAS, trail, type AreaId } from "@/config/areas";

// the five doors and the Town Hall have the large head; every place inside them the shorter one (PAGE-RULES.md, rule 1)
const LARGE: AreaId[] = ["study", "library", "search", "wiki", "treasury", "forum"];

/**
 * The head every area opens with (PageHead, PAGE-RULES.md): the path from the menu's word down to it, its Greek name
 * carved across the wall and lit by the torch (where it has one), its name in full with the Greek in gold, and what the
 * name means and why it fits, with the area's own piece of sculpture in its arch at the right. An area with no Greek name
 * of its own may carve a line that belongs to it instead, with its source (`carve`). `action` is the page's one main thing
 * (on a phone it comes before the statue); `children` follow.
 */
export default function AreaHeader({ id, carve, action, piece, children }: { id: AreaId; carve?: { text: string; caption: ReactNode }; action?: ReactNode; piece?: { piece: string; why?: string } | null; children?: ReactNode }) {
  const a = AREAS[id];
  return (
    <>
      <PageHead path={trail(id)} size={LARGE.includes(id) ? "large" : "short"} carve={a.greek ?? carve?.text ?? null}
        title={a.name} greek={a.greek} purpose={<>{a.origin} {a.fit}</>} action={action} piece={piece}
        className="area-head">
        {!a.greek && carve && <p className="area-carve-cap">{carve.caption}</p>}
        {children}
      </PageHead>
      <div className="wrap"><div className="meander area-meander" aria-hidden="true" /></div>
    </>
  );
}
