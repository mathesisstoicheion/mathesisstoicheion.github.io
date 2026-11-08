/**
 * Live look-up in English Wiktionary (CC BY-SA 4.0). Wiktionary lists every possible analysis
 * of a form out of context; we show them all rather than guess. Only the word is sent.
 *
 * Its definition API sends each sense as a piece of HTML. That HTML can carry a page's style sheet (a <style> element:
 * ".mw-parser-output .object-usage-tag{font-style:italic}…"), and a sense with sub-senses carries them as nested lists, which
 * the API then also sends again, one by one, as senses of their own. So the HTML is read as a tree, never as text with its
 * tags stripped: what is not reading matter (style, script, footnote marks) goes, a sense keeps its sub-senses under it,
 * and a sub-sense already shown under its parent is not shown again on its own.
 */

/** A sense: its own words, and the senses under it (διά: "with genitive", and under it "in a line", "through"…). */
export interface WiktItem { text: string; sub: WiktItem[] }
export interface WiktSense { pos: string; items: WiktItem[]; lemma: string | null }
export interface WiktResult { title: string; senses: WiktSense[]; lemmaSenses: WiktSense[] | null; url: string }

const API = "https://en.wiktionary.org/api/rest_v1/page/definition/";
const cache = new Map<string, Promise<WiktSense[] | null>>();

// ------------------------------------------------------------ a small reader of Wiktionary's HTML (runs in the browser and in tests)

interface El { tag: string; cls: string; title: string; kids: Node[]; openLists?: number }
type Node = El | string;

const VOID = new Set(["br", "img", "link", "meta", "wbr", "hr", "input", "source"]);
/**
 * Elements that are not reading matter: a style sheet, a script, a footnote mark or the footnote itself (the API sends ὅς's
 * reference to Stanford's Odyssey as a definition), an empty placeholder.
 */
const dropped = (e: El) =>
  e.tag === "style" || e.tag === "script" || e.tag === "link" || e.tag === "template" ||
  (e.tag === "sup" && /\breference\b/.test(e.cls)) || /\b(mw-empty-elt|mw-ref|mw-references|references|mw-cite-backlink|reference-text|mw-reference-text|maintenance-line|previewonly)\b/.test(e.cls);

const ENT: Record<string, string> = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", ndash: "–", mdash: "—", hellip: "…", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", thinsp: " ", zwj: "", zwnj: "" };
export const decode = (s: string) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) =>
    e[0] === "#" ? String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : ENT[e.toLowerCase()] ?? m);

/** HTML → a tree of elements and text. Tolerant: an end tag closes up to its open element; one with none open is ignored. */
export function parseHtml(html: string): El {
  const root: El = { tag: "#root", cls: "", title: "", kids: [] };
  const stack: El[] = [root];
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w-]*)([^>]*?)(\/?)>|([^<]+)|</g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const top = stack[stack.length - 1];
    if (m[5] !== undefined || m[0] === "<") { top.kids.push(decode(m[5] ?? "<")); continue; }
    if (!m[2]) continue;   // a comment
    const tag = m[2].toLowerCase();
    if (m[1]) {
      const at = stack.map((e) => e.tag).lastIndexOf(tag);
      if (at > 0) stack.length = at;
      continue;
    }
    const attr = (name: string) => decode(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, "i").exec(m![3])?.[1] ?? "");
    const el: El = { tag, cls: attr("class"), title: attr("title"), kids: [] };
    top.kids.push(el);
    if (tag === "style" || tag === "script") {
      // their contents are not HTML: skip to the end tag
      const end = html.toLowerCase().indexOf(`</${tag}`, re.lastIndex);
      re.lastIndex = end < 0 ? html.length : end;
      el.kids.push("");
      continue;
    }
    if (!m[4] && !VOID.has(tag)) stack.push(el);
  }
  // lists still open at the end: the API cut this sense short (see sensesOf)
  root.openLists = stack.filter((e) => e.tag === "ol" || e.tag === "ul").length;
  return root;
}

const isList = (n: Node): boolean => typeof n !== "string" && (n.tag === "ol" || n.tag === "ul" || n.tag === "dl");

/** One line of text: a template Wiktionary left unexpanded ("{{a discourse particle…}}") as its words in brackets, spaces gathered, none before a comma or a closing bracket, none inside brackets. */
export const tidy = (s: string) =>
  s.replace(/\{\{\s*([^{}]*?)\s*\}\}/g, "($1)").replace(/[\s ]+/g, " ").replace(/\s+([,.;:!?)\]])/g, "$1").replace(/([([])\s+/g, "$1").replace(/^[\s,;:]+|[\s,;:]+$/g, "").trim();

/** The text of a node, leaving out what is not reading matter and, unless asked, the lists in it. */
function textOf(n: Node, lists = false): string {
  if (typeof n === "string") return n;
  if (dropped(n)) return "";
  if (!lists && isList(n)) return "";
  const inner = n.kids.map((k) => textOf(k, lists)).join("");
  return n.tag === "br" || n.tag === "li" || n.tag === "dd" || n.tag === "p" || n.tag === "div" ? ` ${inner} ` : inner;
}

/** The lists directly under a node (not inside another list). */
function listsIn(n: Node): El[] {
  if (typeof n === "string" || dropped(n)) return [];
  if (isList(n)) return [n as El];
  return n.kids.flatMap(listsIn);
}

/** A piece of a sense's HTML as an item: its own words, and its sub-senses (the items of the lists in it). */
function itemOf(n: El): WiktItem {
  const sub = n.kids.flatMap(listsIn)
    .flatMap((l) => l.kids.filter((k): k is El => typeof k !== "string" && (k.tag === "li" || k.tag === "dd")))
    .map(itemOf)
    .filter(worthShowing);
  return { text: tidy(n.kids.map((k) => textOf(k)).join("")), sub };
}

/** A sense with something to read: words that are more than a bare heading ("[with ᾧ]" with nothing under it), or senses under it. */
const worthShowing = (it: WiktItem) => it.sub.length > 0 || (!!it.text && !isHeading(it.text));

/** A sense's words as they compare: every level, in order. */
const key = (it: WiktItem): string => `${it.text}{${it.sub.map(key).join("|")}}`;

/** The "of <lemma>" link of a form-of entry ("inflection of ἀείδω"). */
function lemmaOf(root: El): string | null {
  const links: string[] = [];
  const walk = (n: Node, inFormOf: boolean) => {
    if (typeof n === "string" || dropped(n)) return;
    const here = inFormOf || /\bform-of-definition-link\b/.test(n.cls);
    if (here && n.tag === "a" && n.title) links.push(n.title);
    n.kids.forEach((k) => walk(k, here));
  };
  walk(root, false);
  return links[0]?.replace(/#.*$/, "") ?? null;
}

/**
 * The senses of one part of speech, from the HTML of each definition as the API sends it: a definition that is a sub-sense
 * of one already read (the API sends both) is left out, and so is one with no words. The API cuts a sense with sub-senses
 * short at the first one with an example under it (ἐπί: "[with genitive]" and only "on, upon", its list left open), and then
 * sends the rest of its sub-senses one by one: those go back under it, until a sense that heads others of its own.
 */
export function sensesOf(definitions: string[]): { items: WiktItem[]; lemma: string | null } {
  const items: WiktItem[] = [];
  const seen = new Set<string>();
  const note = (it: WiktItem) => { seen.add(key(it)); it.sub.forEach(note); };
  // the word each sense is a form of ("inflection of ἀείδω"), or null for a sense with a meaning of its own
  const formOf: (string | null)[] = [];
  // the sense whose list the API left open, and how deep: what follows belongs under it
  let open: { item: WiktItem; depth: number } | null = null;
  for (const html of definitions) {
    const root = parseHtml(html);
    const it = itemOf(root);
    if (!worthShowing(it)) continue;
    if (seen.has(key(it))) continue;
    note(it);
    if (open && !it.sub.length && !isHeading(it.text)) {
      // under the open sense, as deep as its list was left open
      let under = open.item;
      for (let d = 1; d < open.depth && under.sub.length; d++) under = under.sub[under.sub.length - 1];
      under.sub.push(it);
      continue;
    }
    items.push(it);
    formOf.push(lemmaOf(root));
    open = root.openLists && it.sub.length ? { item: it, depth: root.openLists } : null;
  }
  // a form of another word only when every sense says so: γίγνομαι's "used as past of εἰμί" does not make it a form of εἰμί
  const lemma = formOf.length && formOf.every(Boolean) ? formOf[0] : null;
  return { items, lemma };
}

/** A sense's words that only head the senses under it: Wiktionary's "[with genitive]", "[+ dative]". */
export const isHeading = (text: string) => /^\[[^\]]*\]$/.test(text.trim());

/** The plain words of every line of a sense, for comparing and for tests. */
export function linesOf(items: WiktItem[]): string[] {
  return items.flatMap((it) => [it.text, ...linesOf(it.sub)].filter(Boolean));
}

type ApiEntry = { language: string; partOfSpeech: string; definitions: { definition: string }[] };

/** Wiktionary's answer for a title → the Ancient Greek senses in it. */
export function sensesFromApi(data: Record<string, ApiEntry[]>): WiktSense[] {
  const senses: WiktSense[] = [];
  for (const list of Object.values(data)) for (const e of list) {
    if (e.language !== "Ancient Greek") continue;
    const { items, lemma } = sensesOf(e.definitions.map((d) => d.definition ?? ""));
    if (items.length) senses.push({ pos: e.partOfSpeech, items, lemma });
  }
  return senses;
}

async function fetchSenses(title: string, signal?: AbortSignal): Promise<WiktSense[] | null> {
  if (!cache.has(title)) {
    cache.set(title, (async () => {
      const res = await fetch(API + encodeURIComponent(title) + "?redirect=true", { signal });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`Wiktionary answered ${res.status}`);
      const senses = sensesFromApi((await res.json()) as Record<string, ApiEntry[]>);
      return senses.length ? senses : null;
    })().catch((e) => { cache.delete(title); throw e; }));
  }
  return cache.get(title)!;
}

/** Look up a form; if Wiktionary says it is a form of another word, fetch that word too. */
export async function lookUpWiktionary(forms: string[], signal?: AbortSignal): Promise<WiktResult | null> {
  for (const title of forms) {
    const senses = await fetchSenses(title, signal);
    if (!senses) continue;
    const lemma = senses.find((s) => s.lemma && s.lemma !== title)?.lemma ?? null;
    const lemmaSenses = lemma ? await fetchSenses(lemma, signal).catch(() => null) : null;
    return { title, senses, lemmaSenses, url: `https://en.wiktionary.org/wiki/${encodeURIComponent(title)}#Ancient_Greek` };
  }
  return null;
}
