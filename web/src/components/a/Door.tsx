/**
 * A room of the site (Learn, Explore, Mine, Search, and Talk while the forum is open), set as the printed page sets a part
 * of a book (redesign SPEC.md 4.4): the page's head with its title, its Greek name in red, what the name means, the room's
 * main action (PageHead); then the room's parts, each a section under a rule (DoorBlock). No photograph: the owner,
 * 2026-10-25, wants pictures only where they teach.
 */
import type { ReactNode } from "react";
import PageHead from "@/components/PageHead";
import { AREAS, trail, type AreaId } from "@/config/areas";

export default function Door({ id, action, side, carve, children }: {
  id: AreaId;
  /** what stands at the right of the title, where a plate would (the Treasury's contents) */
  side?: ReactNode;
  /** the room's one main thing: its search box or its next step */
  action?: ReactNode;
  /** a line in Greek capitals set above the name, for a room with no Greek name of its own, and its source */
  carve?: { text: string; caption: ReactNode };
  children: ReactNode;
}) {
  const a = AREAS[id];
  return (
    <div className="door">
      <PageHead path={trail(id)} size="large" inscription={carve?.text} title={a.name} greek={a.greek}
        purpose={<>{a.origin} {a.fit}</>} action={action} side={side}>
        {carve && <p className="area-carve-cap">{carve.caption}</p>}
      </PageHead>
      <div className="door-body">{children}</div>
    </div>
  );
}

/** One of a room's parts: a section of the page under a rule of ink. */
export function DoorBlock({ id, label, children }: { id?: string; label?: string; children: ReactNode }) {
  return (
    <div className="wrap">
      <section className="door-part" id={id} aria-label={label}>{children}</section>
    </div>
  );
}
