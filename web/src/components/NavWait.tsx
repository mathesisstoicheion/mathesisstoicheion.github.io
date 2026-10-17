"use client";
/**
 * Waiting for the next page: while Next fetches a page over a slow connection, a light travels along the foot of the
 * header (the .navwait rules in globals.css), so a click never seems to have done nothing. It sets data-nav="wait" on
 * <html> when a move to another page begins (instrumentation-client.ts) and clears it once the new page is showing;
 * the light only fades in after a moment, so a page that arrives at once shows nothing at all.
 */
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

let safety = 0;
function clear() {
  clearTimeout(safety);
  delete document.documentElement.dataset.nav;
}

export default function NavWait() {
  const path = usePathname();
  const search = useSearchParams().toString();

  useEffect(() => {
    const start = (e: Event) => {
      const { url, type } = (e as CustomEvent<{ url: string; type: string }>).detail;
      const to = new URL(url, location.href);
      // the same page with other filters (the library's search writes its words into the address as you type) is not a wait
      if (to.origin !== location.origin || to.pathname === location.pathname && (type === "replace" || to.search === location.search)) return;
      clearTimeout(safety);
      document.documentElement.dataset.nav = "wait";
      // never left showing, whatever happens to the page asked for
      safety = window.setTimeout(clear, 15000);
    };
    addEventListener("mathesis:navstart", start);
    return () => removeEventListener("mathesis:navstart", start);
  }, []);

  useEffect(clear, [path, search]);

  return <div className="navwait" aria-hidden="true" />;
}
