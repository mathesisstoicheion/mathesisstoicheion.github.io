import { ViewTransition } from "react";
import FlyLetters from "@/components/a/FlyLetters";

/**
 * Wraps every page so that navigating between areas plays the page-turn transition.
 * It has to sit in each page, not in the layout: layouts persist, so they never enter or exit.
 * `screen` names which of design A's pages it is: "home", "library", "reader", or any other ("room").
 */
export default function Page({ children, screen = "room" }: { children: React.ReactNode; screen?: "home" | "library" | "reader" | "room" }) {
  return (
    <ViewTransition
      enter={{ "page-turn": "page-turn", default: "none" }}
      exit={{ "page-turn": "page-turn", default: "none" }}
      default="none"
    >
      {/* which of design A's pages it is (styles/tokens.css). Every page other than the home page, the library and the
          reader has the home page's floating letters behind it (the owner, 2026-10-20: "Every page must follow the design
          choices of the homepage"); those three draw their own. */}
      <main id="main" tabIndex={-1} data-screen={screen}>
        {screen === "room" && <FlyLetters className="page-dust" />}
        {children}
      </main>
    </ViewTransition>
  );
}
