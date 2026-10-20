import { ViewTransition } from "react";
import AreaStage from "@/components/a/AreaStage";
import FootPiece from "@/components/a/FootPiece";

/**
 * Wraps every page so that navigating between areas plays the page-turn transition.
 * It has to sit in each page, not in the layout: layouts persist, so they never enter or exit.
 * `screen` names design A's room the page is in: "home" (the doorway), "library", "reader", or any other ("room").
 */
export default function Page({ children, screen = "room" }: { children: React.ReactNode; screen?: "home" | "library" | "reader" | "room" }) {
  return (
    <ViewTransition
      enter={{ "page-turn": "page-turn", default: "none" }}
      exit={{ "page-turn": "page-turn", default: "none" }}
      default="none"
    >
      {/* which of design A's rooms the page is in: the doorway (home), or the lamp room (styles/tokens.css) */}
      {/* every page inside an area has its area's figure (data/figures.ts) behind it, its face in the page's head, and its
          own gilded piece at its foot */}
      <main id="main" tabIndex={-1} data-screen={screen}>{screen === "room" && <AreaStage />}{children}{screen === "room" && <FootPiece />}</main>
    </ViewTransition>
  );
}
