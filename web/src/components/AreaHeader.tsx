import type { ReactNode } from "react";
import PageHead from "@/components/PageHead";
import { AREAS, trail, type AreaId } from "@/config/areas";

// the five doors and the Agora have the large head; every place inside them the shorter one (PAGE-RULES.md, rule 1)
const LARGE: AreaId[] = ["study", "library", "search", "wiki", "treasury", "forum"];

/**
 * The head every area opens with (PageHead, PAGE-RULES.md): the path from the menu's word down to it, its name in full
 * with the Greek in gold, and what the name means and why it fits, with the area's own object in design A's engraved
 * window at the right. An area with no Greek name of its own may set a line that belongs to it above its name instead,
 * with its source (`carve`). `action` is the page's one main thing (on a phone it comes before the window); `children` follow.
 */
export default function AreaHeader({ id, carve, action, children }: { id: AreaId; carve?: { text: string; caption: ReactNode }; action?: ReactNode; children?: ReactNode }) {
  const a = AREAS[id];
  return (
    <>
      <PageHead path={trail(id)} size={LARGE.includes(id) ? "large" : "short"} inscription={a.greek ? null : carve?.text}
        title={a.name} greek={a.greek} purpose={<>{a.origin} {a.fit}</>} action={action}
        className="area-head">
        {!a.greek && carve && <p className="area-carve-cap">{carve.caption}</p>}
        {children}
      </PageHead>
      <div className="wrap"><div className="meander area-meander" aria-hidden="true" /></div>
    </>
  );
}
