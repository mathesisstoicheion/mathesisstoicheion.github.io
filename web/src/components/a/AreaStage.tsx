"use client";
/**
 * The area's figure behind every page inside it (the owner, 2026-10-19: "each page has its own distinct design, but with an
 * overall, unifying design"; 2026-10-20: "The figures should grow into the background, as you scroll, then stay there, until
 * you scroll back to the top, then it animates into the face again"). Its face gathers in the page's head, where the page's
 * own gilded piece stood (that moves to the foot of the page, FootPiece.tsx), and its object grows behind the page as you
 * scroll (FigStage.tsx). The doors, the home page, the reader and the pages outside the areas have none.
 */
import { usePathname } from "next/navigation";
import FigStage from "./FigStage";
import { AREAS } from "@/config/areas";
import { figureFor } from "@/data/figures";

export default function AreaStage() {
  const path = (usePathname() ?? "/").replace(/\/+$/, "") || "/";
  const f = figureFor(path);
  if (!f || AREAS[f.area].href === path) return null;
  return <FigStage fig={f.id} area />;
}
