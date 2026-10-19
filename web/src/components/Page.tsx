import { ViewTransition } from "react";
import FootFigure from "@/components/a/FootFigure";

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
      {/* every page inside an area ends with its area's figure (data/figures.ts), as the area's door shows it */}
      <main id="main" tabIndex={-1} data-screen={screen}>{children}{screen === "room" && <FootFigure />}</main>
    </ViewTransition>
  );
}
