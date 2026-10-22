"use client";
/**
 * A page's own plate (redesign SPEC.md 3.7, decision 6: "every page opens with one large photo plate beside its title,
 * chosen for that page"): the museum's colour photograph of the page's piece, numbered Plate I, with its credit printed
 * beneath. data/pieces.ts says which piece belongs to which page.
 *
 * At the head of a page it stands at the right of the title. A header holds it twice: beside the title for a computer
 * (`className="piece-desk"`) and after the page's main action for a phone (`"piece-phone"`); only the one shown is
 * fetched (its photograph loads lazily, and one that takes no room is never fetched).
 */
import { usePathname } from "next/navigation";
import { pieceFor } from "@/data/pieces";
import Plate from "@/components/plate/Plate";

export default function PageWin({ spec: given, className, n = 1 }: { spec?: { piece: string; why?: string } | null; className?: string; n?: number }) {
  const path = (usePathname() ?? "/").replace(/\/+$/, "") || "/";
  const spec = given !== undefined ? given : pieceFor(path);
  if (!spec) return null;
  return <Plate id={spec.piece} n={n} why={spec.why} className={`piece piece-head${className ? ` ${className}` : ""}`}
    sizes="(max-width: 760px) min(92vw, 420px), 320px" />;
}
