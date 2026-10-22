import Link from "next/link";
import type { ReactNode } from "react";
import PageWin from "@/components/a/PageWin";
import type { Step } from "@/config/areas";

/**
 * The one head every page opens with, set as the printed page sets a title (redesign SPEC.md 3.7 and 4.4; the sample's
 * catalogue head): the path as a small-capital kicker after a red rule (the menu's word, then the places down to this
 * page), the title, its Greek name in GFS Didot in red, one line saying what the page is for, and at the right the page's
 * own plate, a museum's colour photograph numbered Plate I with its credit (components/a/PageWin.tsx).
 *
 * `size="large"` is for the rooms themselves; every page inside them is `"short"`, smaller in its title and spacing but
 * never in its plate.
 *
 * On a phone the page's one main thing (`action`: its search box or main button) comes after the purpose line and before
 * the plate (PAGE-RULES.md rule 2); `children` follow. The plate is held twice, once beside the title for a computer and
 * once after the action for a phone; only the one shown is fetched.
 */
export default function PageHead({ path, inscription, inscriptionSays, title, greek, purpose, action, size = "short", piece, bare, desk = true, className, children }: {
  path: Step[];
  /** a few Greek words set in capitals above the title, as an inscription (the reading path's line, the Oracle's maxim) */
  inscription?: string | null;
  /** what the inscription means, read out in its place when it is a sign rather than words (the not-found page's ΥΔ) */
  inscriptionSays?: string;
  title: ReactNode;
  greek?: string | null;
  purpose?: ReactNode;
  action?: ReactNode;
  size?: "large" | "short";
  /** the object in the window, when the page's address does not choose it (data/pieces.ts); null for none */
  piece?: { piece: string; why?: string } | null;
  /** inside a column that is already the page's width (no `wrap` of its own) */
  bare?: boolean;
  /** false on a page that is a tool (a round of questions): on a computer its plate stands beside the tool instead */
  desk?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <header className={`${bare ? "" : "wrap "}page-head ph ph-${size}${desk ? "" : " ph-tool"}${className ? ` ${className}` : ""}`}>
      <div className="ph-text">
        <p className="ph-path label">
          {path.map((s, i) => (
            <span key={i}>
              {i > 0 && <span className="ph-sep" aria-hidden="true"> · </span>}
              {s.href && i < path.length - 1 ? <Link href={s.href} transitionTypes={["page-turn"]}>{s.label}</Link> : <span>{s.label}</span>}
            </span>
          ))}
        </p>
        {inscription && <p className="ph-inscr" lang="grc" role={inscriptionSays ? "img" : undefined} aria-label={inscriptionSays}>{inscription}</p>}
        <h1 className="ph-title">
          {title}
          {greek && <span className="ph-greek" lang="grc">{greek}</span>}
        </h1>
        {purpose && <p className="ph-purpose">{purpose}</p>}
        {action && <div className="ph-action">{action}</div>}
      </div>
      {desk && <PageWin className="piece-desk" spec={piece} />}
      <PageWin className="piece-phone" spec={piece} />
      {children && <div className="ph-more">{children}</div>}
    </header>
  );
}
