import { ViewTransition } from "react";
import BackToTop from "@/components/BackToTop";

/**
 * Wraps every page so that navigating between areas plays the page-turn transition (the old page lifts away, the new one
 * inks in: globals.css).
 * It has to sit in each page, not in the layout: layouts persist, so they never enter or exit.
 * `screen` names which kind of page it is: "home", "library", "reader", or any other ("room").
 * `top` adds the shared "back to top" button, for the long pages (lists, indexes, the Census).
 */
export default function Page({ children, screen = "room", top = false }: { children: React.ReactNode; screen?: "home" | "library" | "reader" | "room"; top?: boolean }) {
  return (
    <ViewTransition
      enter={{ "page-turn": "page-turn", default: "none" }}
      exit={{ "page-turn": "page-turn", default: "none" }}
      default="none"
    >
      <main id="main" tabIndex={-1} data-screen={screen}>
        {children}
        {top && <BackToTop />}
      </main>
    </ViewTransition>
  );
}
