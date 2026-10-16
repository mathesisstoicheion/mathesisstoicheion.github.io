import Carving from "@/components/art/Carving";
import { AREAS, type AreaId } from "@/config/areas";

/**
 * The header every area opens with (design B, Stone and torch): its plain name, its Greek name carved across the wall
 * and lit by the torch (where it has one), its name in full, and what the name means and why it fits.
 */
export default function AreaHeader({ id, children }: { id: AreaId; children?: React.ReactNode }) {
  const a = AREAS[id];
  return (
    <header className="area-head">
      <div className="wrap">
        <div className="area-kicker"><span className="label">{a.english}</span></div>
        {a.greek && <Carving text={a.greek} kind="title" delay={0.15} className="carve area-carve" />}
        <h1>
          {a.name}
          {a.greek && <span className="area-greek" lang="grc">{a.greek}</span>}
        </h1>
        <p className="area-origin">{a.origin} {a.fit}</p>
        {children}
      </div>
      <div className="wrap"><div className="meander" aria-hidden="true" /></div>
    </header>
  );
}
