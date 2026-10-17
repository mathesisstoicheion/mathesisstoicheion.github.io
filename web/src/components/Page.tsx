import { ViewTransition } from "react";

/**
 * Wraps every page so that going from one page to another plays the page-turn transition, whichever link or button
 * took the reader there (the owner, 2026-10-17: "smooth animations when going between pages").
 * It has to sit in each page, not in the layout: layouts persist, so they never enter or exit.
 */
export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter="page-turn"
      exit="page-turn"
      default="none"
    >
      <main id="main" tabIndex={-1}>{children}</main>
    </ViewTransition>
  );
}
