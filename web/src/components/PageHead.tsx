import Link from "next/link";
import type { ReactNode } from "react";
import Carving from "@/components/art/Carving";
import PagePiece from "@/components/art/PagePiece";
import type { Step } from "@/config/areas";
import { carvedCaps } from "@/lib/art/common";

/**
 * The one head every page opens with (PAGE-RULES.md, rule 1, agreed with the owner on 2026-10-18), in this order: the
 * path (rule 4: the menu's word, then the places down to this page), the Greek name carved faintly into the wall, the
 * title in bone, the Greek name in gold, one upright line saying what the page is for, and the page's statue in its
 * arched niche, at the right on a computer.
 *
 * `size="large"` is for the five doors and the Town Hall; every page inside them is `"short"`, shorter in its words and
 * spacing but never in its statue (the owner's standing rule: statues stay big).
 *
 * On a phone the page's one main thing (`action`: its search box or main button) comes after the purpose line and before
 * the statue (rule 2); `children` follow the statue. The statue is held twice, once beside the title for a computer and
 * once after the action for a phone; only the one shown is ever loaded and drawn (components/art/PagePiece.tsx).
 */
export default function PageHead({ path, carve, title, greek, purpose, action, size = "short", piece, steady, bare, desk = true, className, children }: {
  path: Step[];
  /** the words cut into the wall: the Greek name, unless the page carves something else (left out if too long) */
  carve?: string | null;
  title: ReactNode;
  greek?: string | null;
  purpose?: ReactNode;
  action?: ReactNode;
  size?: "large" | "short";
  /** the statue, when the page's address does not choose it (data/pieces.ts); null for none */
  piece?: { piece: string; why?: string } | null;
  steady?: boolean;
  /** inside a column that is already the page's width (no `wrap` of its own) */
  bare?: boolean;
  /** false on a page that is a tool (a round of questions): on a computer its statue stands beside the tool instead */
  desk?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const cut = carve === undefined ? greek : carve;
  const n = cut ? carvedCaps(cut).length : 0;
  return (
    <header className={`${bare ? "" : "wrap "}page-head ph ph-${size}${className ? ` ${className}` : ""}`}>
      <p className="ph-path label">
        {path.map((s, i) => (
          <span key={i}>
            {i > 0 && <span className="ph-sep" aria-hidden="true"> › </span>}
            {s.href && i < path.length - 1 ? <Link href={s.href} transitionTypes={["page-turn"]}>{s.label}</Link> : <span>{s.label}</span>}
          </span>
        ))}
      </p>
      {cut && n >= 2 && n <= 42 && <Carving text={cut} kind={size === "large" ? "title" : "name"} delay={0.15} className={`carve ph-carve${size === "large" ? " area-carve" : " page-carve"}`} />}
      {desk && <PagePiece className="piece-desk" spec={piece} steady={steady} />}
      <h1 className="ph-title">
        {title}
        {greek && <span className="ph-greek" lang="grc">{greek}</span>}
      </h1>
      {purpose && <p className="ph-purpose">{purpose}</p>}
      {action && <div className="ph-action">{action}</div>}
      <PagePiece className="piece-phone" spec={piece} steady={steady} />
      {children}
    </header>
  );
}
