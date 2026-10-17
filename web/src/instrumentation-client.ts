/**
 * Runs in the browser before the site starts. Next calls onRouterTransitionStart the moment it begins moving to
 * another page of the site; this passes that on as a "mathesis:navstart" event, so that NavWait.tsx can show a thread of
 * light along the header's foot while a slow connection fetches the next page.
 */
export function onRouterTransitionStart(url: string, navigationType: "push" | "replace" | "traverse") {
  dispatchEvent(new CustomEvent("mathesis:navstart", { detail: { url, type: navigationType } }));
}
