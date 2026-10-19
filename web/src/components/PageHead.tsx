import Link from "next/link";
import type { ReactNode } from "react";
import PageWin from "@/components/a/PageWin";
import type { Step } from "@/config/areas";

/**
 * The one head every page opens with (PAGE-RULES.md, rule 1, agreed with the owner on 2026-10-18), in this order: the
 * path (rule 4: the menu's word, then the places down to this page), the title, the Greek name in gold, one upright line
 * saying what the page is for, and the page's own object in design A's engraved window, at the right on a computer
 * (components/a/PageWin.tsx; the owner, 2026-10-19: every page A did not draw keeps its layout, in A's look).
 *
 * `size="large"` is for the five doors and the Town Hall; every page inside them is `"short"`, shorter in its words and
 * spacing but never in its window (the owner's standing rule: the pictures stay big).
 *
 * On a phone the page's one main thing (`action`: its search box or main button) comes after the purpose line and before
 * the window (rule 2); `children` follow the window. The window is held twice, once beside the title for a computer and
 * once after the action for a phone; only the one shown is drawn.
 */
export default function PageHead({ path, inscription, inscriptionSays, title, greek, purpose, action, size = "short", piece, bare, desk = true, className, children }: {
  path: Step[];
  /** a few Greek words set in gold capitals above the title, as an inscription (the reading path's line, the Oracle's maxim) */
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
  /** false on a page that is a tool (a round of questions): on a computer its window stands beside the tool instead */
  desk?: boolean;
  className?: string;
  children?: ReactNode;
}) {
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
      {desk && <PageWin className="piece-desk" spec={piece} />}
      {inscription && <p className="ph-inscr" lang="grc" role={inscriptionSays ? "img" : undefined} aria-label={inscriptionSays}>{inscription}</p>}
      <h1 className="ph-title">
        {title}
        {greek && <span className="ph-greek" lang="grc">{greek}</span>}
      </h1>
      {purpose && <p className="ph-purpose">{purpose}</p>}
      {action && <div className="ph-action">{action}</div>}
      <PageWin className="piece-phone" spec={piece} />
      {children}
    </header>
  );
}
