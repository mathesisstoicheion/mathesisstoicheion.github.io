/**
 * Sharing, with no account and nothing posted on the site (the owner, 2026-10-30: "every thought and creation: Shareable,
 * including making a pot"): the device's own share sheet where there is one (a phone's, and most computers'), otherwise
 * the link, with any words that go with it, copied ready to paste. What is shared lives in the link itself: an entry's
 * address, a note's words beside its entry's address, a painted pot or a played tune packed into the address's #.
 */
import { useUI } from "@/lib/ui";

export interface Shared {
  /** what the share sheet calls it */
  title: string;
  /** words that go with the link (a note); left out, only the link is shared */
  text?: string;
  url: string;
  /** a picture to send instead of a link, where the device can share files (a pot too detailed for a link) */
  files?: File[];
}

/** "shared": the share sheet took it; "copied": the link (and its words) went to the clipboard; "cancelled": the share
 *  sheet was closed; "failed": the browser allowed neither. */
export type ShareResult = "shared" | "copied" | "cancelled" | "failed";

export async function share(s: Shared): Promise<ShareResult> {
  const data: ShareData = s.files?.length ? { title: s.title, text: s.text, files: s.files } : { title: s.title, text: s.text, url: s.url };
  if (typeof navigator.share === "function" && (!navigator.canShare || navigator.canShare(data))) {
    try { await navigator.share(data); return "shared"; }
    catch (e) { if ((e as DOMException)?.name === "AbortError") return "cancelled"; }
  }
  // a picture this device cannot hand on: the caller saves it instead
  if (s.files?.length) return "failed";
  const toast = useUI.getState().showToast;
  const words = s.text ? `${s.text}\n\n${s.url}` : s.url;
  try {
    await navigator.clipboard.writeText(words);
    toast(s.text ? "Copied, with its link: paste it anywhere." : "Link copied: paste it anywhere.");
    return "copied";
  } catch {
    // no clipboard either (an old browser, or one that blocks it): the link to copy by hand
    window.prompt("Copy this link:", s.url);
    return "failed";
  }
}
