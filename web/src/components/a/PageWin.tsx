"use client";
/**
 * A page's own plate: the photograph of what the page is about, numbered Plate I, with its credit printed beneath. Only a
 * page that names one has it (a Painted Stoa entry with its own photograph): the owner, 2026-10-25, "Photos should only
 * load where they are relevant ... It feels cheap and takes the focus away from the websites main focus: Reading." The
 * plate that every page once had (data/pieces.ts) is no longer shown.
 *
 * At the head of a page it stands at the right of the title. A header holds it twice: beside the title for a computer
 * (`className="piece-desk"`) and after the page's main action for a phone (`"piece-phone"`); only the one shown is
 * fetched (its photograph loads lazily, and one that takes no room is never fetched).
 */
import Plate from "@/components/plate/Plate";

export default function PageWin({ spec, className, n = 1 }: { spec?: { piece: string; why?: string } | null; className?: string; n?: number }) {
  if (!spec) return null;
  return <Plate id={spec.piece} n={n} why={spec.why} className={`piece piece-head${className ? ` ${className}` : ""}`}
    sizes="(max-width: 760px) min(92vw, 420px), 320px" />;
}
