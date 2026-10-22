/**
 * A room of the site (Learn, Explore, Mine, Search, and Talk while the forum is open), set as the printed page sets a part
 * of a book (redesign SPEC.md 4.4): the page's head with its title, its Greek name in red, what the name means, the room's
 * main action and its plate, a museum's colour photograph with its credit (PageHead); then the room's parts, each a
 * section under a rule (DoorBlock).
 */
import type { ReactNode } from "react";
import PageHead from "@/components/PageHead";
import { AREAS, trail, type AreaId } from "@/config/areas";

export default function Door({ id, plate, why, action, carve, children }: {
  id: AreaId;
  /** the room's plate: a photograph in lib/photos.ts */
  plate: string;
  /** a few words on why it belongs to the room (only what the museum's record or a named source says) */
  why?: string;
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
        purpose={<>{a.origin} {a.fit}</>} action={action} piece={{ piece: plate, why }}>
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
