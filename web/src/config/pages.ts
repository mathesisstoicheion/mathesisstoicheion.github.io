/**
 * Every page of the site that the offline copy keeps (the service worker, public/sw.js, fetches
 * this list from /offline.json). A test checks it against the pages in src/app.
 */
import { LESSON_INFO as LESSONS } from "@/data/lesson-index";
import { CHECKPOINTS } from "@/data/checkpoints";
import { GUIDES } from "@/data/guides";
import { ENTRIES } from "@/wiki/index";
import { PRIVATE_TRANSLATIONS, PRIVATE_TRANSLATIONS_OLD } from "./admin";

export const STATIC_PAGES = [
  "/", "/library", "/library/author", "/read", "/search", "/downloads", "/treasury", "/treasury/word",
  "/academy", "/academy/today", "/academy/alphabet", "/academy/review", "/academy/tables", "/academy/vocabulary", "/academy/practice",
  "/stoa", "/stoa/authors", "/stoa/eras", "/stoa/editions", "/stoa/manuscripts", "/stoa/variants", "/stoa/kerameikos", "/stoa/census", "/stoa/periplus",
  "/town-hall", "/town-hall/pnyx", "/town-hall/thread", "/town-hall/new", "/town-hall/member", "/town-hall/moderation",
  "/town-hall/pnyx/debate", "/account",
  "/about", "/credits", "/guide",
];

/**
 * Pages kept out of search results and told to crawlers to skip (robots.txt): a person's own space, tools
 * that need a person to use them, and the app's query-address pages (each author's and work's page for search
 * engines is /author/<id> and /work/<id>; those two are made for every author and work, are not kept offline
 * in advance, and are the only pages the sitemap lists besides the public ones here).
 */
export const PRIVATE_PAGES = [
  "/account", "/treasury", "/treasury/word", "/read", "/search", "/library/author",
  "/town-hall/thread", "/town-hall/new", "/town-hall/member", "/town-hall/moderation", "/town-hall/pnyx/debate",
  "/academy/today", "/academy/review",
];

/** Pages that exist only while developing (the recording studio): never kept offline. */
export const DEV_PAGES = ["/academy/studio"];

/**
 * The moderator's own pages (the private translations, in Mine, and their first address, which now leads there):
 * linked only from the Treasury, for the moderator alone; never kept offline (nothing on them works without the
 * database, and every visitor's offline copy would fetch them), left out of the sitemap and the site's search,
 * and disallowed to crawlers in robots.txt.
 */
export const ADMIN_PAGES = [PRIVATE_TRANSLATIONS, PRIVATE_TRANSLATIONS_OLD];

export const offlinePages = () => [...STATIC_PAGES, ...LESSONS.flatMap((l) => [`/academy/lesson/${l.id}`, `/academy/lesson/${l.id}/practice`, `/academy/lesson/${l.id}/test`]), ...CHECKPOINTS.map((c) => `/academy/checkpoint/${c.id}`), ...GUIDES.map((g) => `/academy/guide/${g.id}`), ...ENTRIES.map((e) => `/stoa/${e.slug}`)];

/** Small data files every page may need, kept offline with the pages. */
export const OFFLINE_DATA = [
  "/data/catalog.json", "/data/core.json", "/data/abbrev.json", "/data/works-meta.json", "/data/authors-meta.json", "/data/author-names.json", "/data/difficulty.json",
  "/data/metre/_index.json", "/data/metre/_lengths.json", "/audio/index.json",
];
