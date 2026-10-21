/*
 * Stands in for the site's offline helper while the site is closed for its redesign.
 * A returning visitor's browser fetches this in place of the old helper; it deletes the kept copies
 * of the old site, removes itself and reloads open tabs, so they show the holding page.
 * (The Scroll Case, the reader's own saved texts in browser storage, is left alone.)
 */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) await caches.delete(key);
    await self.registration.unregister();
    for (const client of await self.clients.matchAll({ type: "window" })) client.navigate(client.url);
  })());
});
