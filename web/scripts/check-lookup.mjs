// The word look-up never covers the line being read (redesign SPEC.md 4.3 and 7; decision 4), on Plato's Apology with
// Fowler's English. It lists:
//   margin - one book on a computer (1280 × 900 on Paper, 1440 × 900 on Night, and 1440 and 1200 × 900 with Find open beside the
//            text): the look-up is not a window floating over the right margin (fixed to the screen, its left edge clear
//            of the text, the owner, 2026-10-26: "a floating window that opens on the right"), it moves when the text is
//            scrolled, it covers the reader's bar or the tapped word, it is narrower than 280 px (the quiet desk, ticket 04: about 300),
//            the word moves when it is looked up, Next does not keep it in place, or Escape does not close it and give the
//            keyboard back to the word. With Find open the margin's room is not kept for it (the quiet desk, ticket 10, the owner,
//            2026-10-30: the Greek would lose a third of its size): it takes the panel's place instead, the panel's box exactly (its four
//            edges on the panel's, within 1 px, so that nothing of the panel shows beside or below it; not over the text or the tapped
//            word), with the panel under it out of the keyboard's reach, and closing it shows the panel again as it was
//   sheet  - a narrower window (1000 × 800), a phone (390 × 844), and two books side by side (1280 × 900): the look-up's sheet
//            reaches over the word's line, when it opens low on the screen, at its full height, or on the next word; or it
//            opens higher than 27% of the screen (the quiet desk: it rests at about a quarter)
// Both lay out the first layer of the look-up (the quiet desk, ticket 05) and fail when, before "More about it" is pressed, it
// shows a certainty badge, the lesson card, a credit (GLAUx, CC BY, "Analysis:"…) or the dictionary, when it has no meaning line,
// or when "More about it" does not reveal the dictionary ("Dictionary · LSJ").
// And they check the second layer (ticket 06). One press of "More about it" shows, in this order, the LSJ entry (with "The whole
// entry"), where else the word occurs (a button that opens Echoes), "How the sentence is built", the lesson, Word Study and the
// other dictionaries, under the same small-capitals headings on a computer and a phone; the meaning the first layer gave is not
// said again; the credits are ONE line, once, at the very foot, naming only what is shown. "‹ Back" or Escape returns to the
// first layer (on a phone at its resting height, the keyboard on "More about it"), then Escape closes the look-up and gives the
// keyboard back to the word; × closes it from the second layer. On a computer the same window keeps its left edge and width,
// grows to the height it may have (with a panel open it is the panel's whole box from the first layer, and stays that), and stays fixed while the text scrolls. μῆνιν in the Iliad, 1.1 (on a computer and a phone)
// is checked in full: "12 times in the Iliad" (the number of words GLAUx analyses as μῆνις in the whole pack), the lesson "Why the
// accusative?", the credit line "Analysis and treebank: GLAUx (Keersmaekers 2021), CC BY-SA 4.0 · LSJ: Perseus Digital Library, CC BY-SA".
// And the back routes (the quiet desk, the owner, 2026-10-29: "the word lookup in the reader needs a back button"): from the second
// layer, "How the sentence is built" and "12 times in the Iliad" open the sentence panel and Echoes with a "‹ Back to μῆνις" that
// closes them and brings the look-up back on the same word with "More about it" open (Escape in them still just closes them); "‹ Back"
// in the second layer is at least 44 × 44 px under a finger; and on a phone the browser's Back steps second layer, first layer,
// closed (page.goBack()) without leaving /read or moving the passage, while × and Previous and Next keep the history level.
// And the look-up's fixes (the quiet desk, the owner, 2026-10-30), on μῆνιν in the Iliad: the second layer keeps the word's context under
// its head (the kind of word, "noun, feminine", and the meaning, a little smaller than the first layer's); "Dictionary · LSJ" is never an
// empty heading (some entry text, at least 40 characters, clipped to about six lines with a soft fade, and "The whole entry" lifts the
// clip, "The short entry" puts it back); "Go further" is rows, the same on a computer and a phone (each as wide as its part, ending in a
// red ›, a hairline under it, 44 px tall under a finger, in the order where else, the sentence, the lesson, Word Study); the grammar line
// ("Accusative singular") underlines its case only while Colour by case is on; Wiktionary out of reach is said plainly ("Wiktionary could
// not be reached.", never the raw error) with a "Try again" that looks it up again; the window's head shows the tapped word at once while
// the look-up is found, then the dictionary form, at the same height; and the phone sheet's top edge is a hairline, not a 2 px red rule
// under a heavy shadow, with its handle kept.
// The word packs and the dictionary are served from their own site (config/packs.ts); this check fetches them from the
// packs repository, so the look-up is as full as a reader sees it.
// usage: node web/scripts/check-lookup.mjs <base-url>   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
//        ONLY=margin reads the margin part only (the whole check takes minutes)
import { chromium } from "playwright";

const [base = "http://localhost:3100"] = process.argv.slice(2);
const PACKS = "https://raw.githubusercontent.com/mathesisstoicheion/packs/main";
const WORK = "tlg0059.tlg002";
const LOOKUP = 'aside[aria-label^="Look-up"]';
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];

/**
 * A reader's page. opts.settings adds to the saved settings (Colour by case: { cases: true }); opts.slow holds the word packs, LSJ
 * and the vocabulary back that many milliseconds, so that the look-up's first moments can be seen; opts.wikt is "fail" for Wiktionary
 * out of reach (otherwise it has no entry). The returned state can change wikt, and counts the requests Wiktionary was asked.
 */
async function open(w, h, scheme, path, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, serviceWorkers: "block", hasTouch: w < 800, isMobile: w < 800 });
  const page = await ctx.newPage();
  // the look-up must keep clear of the English beside the Greek, so this reader has chosen "Both" (a book opens on Greek alone now;
  // the quiet desk, ticket 07): the saved settings, version 3
  await page.addInitScript((extra) => { localStorage.setItem("mathesis:settings", JSON.stringify({ state: { columns: "both", ...extra }, version: 3 })); }, opts.settings ?? {});
  await page.route("**/data/{words,lsj,lexicon,syntax}/**", async (route) => {
    const p = new URL(route.request().url()).pathname.replace(/^\/data\//, "");
    try { await route.fulfill({ response: await route.fetch({ url: `${PACKS}/${p}` }) }); } catch { await route.abort(); }
  });
  if (opts.slow) await page.route(/\/(?:packs|data)\/(?:words|lsj|lexicon|syntax)\//, async (route) => { await new Promise((r) => setTimeout(r, opts.slow)); await route.fallback(); });
  const state = { wikt: opts.wikt ?? "none", wiktRequests: 0 };
  await page.route(/wiktionary\.org/, (route) => { state.wiktRequests++; return state.wikt === "fail" ? route.abort() : route.fulfill({ status: 404, contentType: "application/json", body: "{}" }); });
  await page.goto(base + path);
  await page.waitForSelector("article [data-w]", { timeout: 45000 });
  await page.waitForTimeout(2500);   // everything has inked in
  return { ctx, page, state };
}

/** The first word whose top is about `frac` of the way down the screen (in the first book), and which stands clear of the reader's foot bar. */
async function wordAt(page, frac) {
  return page.evaluate((frac) => {
    const ws = [...document.querySelectorAll("article [data-w]")];
    const y = innerHeight * frac;
    // (the reader's bar stands along the foot of the window: a word under it cannot be clicked, the quiet desk, ticket 09)
    const foot = document.querySelector("[data-foot-bar]"), fr = foot?.getBoundingClientRect();
    const floor = foot && fr && fr.top < innerHeight - 1 && getComputedStyle(foot).visibility !== "hidden" ? fr.top : innerHeight;
    const w = ws.find((e) => { const r = e.getBoundingClientRect(); return r.top >= y && r.bottom < floor - 8 && r.width > 0; });
    if (!w) return -1;
    w.setAttribute("data-check", "");
    return ws.indexOf(w);
  }, frac);
}

const boxes = (page) => page.evaluate((LOOKUP) => {
  const sel = document.querySelector("article [data-w][class*='__sel']") ?? document.querySelector("[data-check]");
  const look = document.querySelector(LOOKUP);
  const row = sel?.closest("section[data-key]");
  const r = (e) => { if (!e) return null; const b = e.getBoundingClientRect(); return { top: b.top, bottom: b.bottom, left: b.left, right: b.right, height: b.height }; };
  const side = [...document.querySelectorAll("aside")].find((a) => a !== look && getComputedStyle(a).position === "fixed");
  // (what stands at the look-up's middle, near its top: the look-up itself, or the panel under it)
  const lb = look?.getBoundingClientRect(), hit = lb ? document.elementFromPoint(lb.left + lb.width / 2, lb.top + 40) : null;
  return { bar: r(document.querySelector("[data-foot-bar]")), word: r(sel), look: r(look), tr: r(row?.querySelector("[data-tr]")), grc: r(row?.querySelector("[lang='grc']")), side: r(side), lookPos: look ? getComputedStyle(look).position : "", lookOnTop: !!hit && !!look && look.contains(hit) };
}, LOOKUP);

/**
 * The first layer holds the card and nothing else: the dictionary form, one meaning, what the word does here and its grammar,
 * with Previous, Next and More about it. No certainty badge, lesson card, credit or dictionary until More about it is pressed.
 */
async function firstLayer(page, tag) {
  const look = page.locator(LOOKUP);
  await look.getByText("Looking it up…").waitFor({ state: "detached", timeout: 20000 }).catch(() => found.push(`${tag}: the first layer was still "Looking it up…" after 20 s`));
  const seen = await page.evaluate((LOOKUP) => {
    const el = document.querySelector(LOOKUP);
    return {
      text: el?.textContent ?? "",
      badges: el?.querySelectorAll(".tag").length ?? 0,
      lessons: el?.querySelectorAll('a[href^="/academy/lesson/"], [class*="lessonLink"]').length ?? 0,
      meaning: el?.querySelector('[class*="cardMeaning"]')?.textContent?.trim() ?? "",
    };
  }, LOOKUP);
  if (seen.badges) found.push(`${tag}: the first layer shows a certainty badge before "More about it" is pressed`);
  if (seen.lessons) found.push(`${tag}: the first layer shows the lesson card before "More about it" is pressed`);
  const credit = seen.text.match(/GLAUx|CC BY|Analysis:|Keersmaekers|Dickinson College|Perseus Digital/);
  if (credit) found.push(`${tag}: the first layer shows a credit ("${credit[0]}") before "More about it" is pressed`);
  if (/Dictionary · LSJ/.test(seen.text)) found.push(`${tag}: the first layer shows the dictionary before "More about it" is pressed`);
  if (!seen.meaning) found.push(`${tag}: the first layer has no meaning line`);
}

/** "More about it" reveals the rest, the dictionary included. */
async function openMore(page, tag) {
  const more = page.locator(LOOKUP).getByRole("button", { name: "More about it" });
  if (!(await more.count())) { found.push(`${tag}: no "More about it" button`); return false; }
  await more.click();
  await page.waitForTimeout(700);
  if (!/Dictionary · LSJ/.test((await page.locator(LOOKUP).textContent()) ?? "")) found.push(`${tag}: "More about it" did not reveal the dictionary ("Dictionary · LSJ")`);
  return true;
}

/** The meaning line of the first layer, as it stands. */
const meaningOf = (page) => page.evaluate((LOOKUP) => document.querySelector(LOOKUP)?.querySelector('[class*="cardMeaning"]')?.textContent?.replace(/\s*\(from [^)]*\)\s*$/, "").trim() ?? "", LOOKUP);
const layerOf = (page) => page.evaluate((LOOKUP) => document.querySelector(LOOKUP)?.getAttribute("data-layer") ?? "", LOOKUP);
const norm = (x) => x.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
/** The kind of word the first layer names ("noun, feminine"), without the word tapped; "" when it names none. */
const kindOf = (page) => page.evaluate((LOOKUP) => {
  const t = document.querySelector(LOOKUP)?.querySelector('[class*="cardKind"]')?.textContent?.trim() ?? "";
  return /^You tapped /.test(t) ? "" : t.replace(/ · you tapped .*$/, "");
}, LOOKUP);
/** The size, in px, of the first layer's meaning line. */
const sizeOf = (page) => page.evaluate((LOOKUP) => parseFloat(getComputedStyle(document.querySelector(LOOKUP).querySelector('[class*="cardMeaning"]')).fontSize), LOOKUP);

/**
 * The grammar line names its case ("Accusative singular") and draws the case's colour and line under it only while Colour by case is
 * on, as the text does; with it off the line is plain small capitals (the quiet desk, the look-up's fixes, the owner, 2026-10-30).
 * Looks at the first layer of μῆνιν in the Iliad, 1.1.
 */
async function caseLine(page, tag, on) {
  const g = await page.evaluate((LOOKUP) => {
    const el = document.querySelector(LOOKUP)?.querySelector('[class*="cardGrammar"]');
    if (!el) return null;
    const probe = (v) => { const e = document.createElement("i"); e.style.color = `var(${v})`; document.body.append(e); const c = getComputedStyle(e).color; e.remove(); return c; };
    const marked = [el, ...el.querySelectorAll("*")].filter((e) => getComputedStyle(e).textDecorationLine.includes("underline"))
      .map((e) => ({ text: e.textContent.trim(), colour: getComputedStyle(e).textDecorationColor }));
    return { text: el.textContent.trim(), marked, cased: el.querySelectorAll("[data-case]").length, accusative: probe("--case-acc") };
  }, LOOKUP);
  if (!g) { found.push(`${tag}: the first layer has no grammar line`); return; }
  if (g.text !== "Accusative singular") found.push(`${tag}: the grammar line reads "${g.text}" (Accusative singular)`);
  if (on) {
    if (!g.marked.length || g.marked[0].colour !== g.accusative) found.push(`${tag}: with Colour by case on, the grammar line does not underline its case in the case's colour (underlined: ${JSON.stringify(g.marked)}; the accusative is ${g.accusative})`);
  } else if (g.marked.length || g.cased) found.push(`${tag}: the grammar line underlines "${g.marked.map((m) => m.text).join(", ")}" while Colour by case is off (it is plain small capitals)`);
}

/**
 * The phone sheet's top edge is a hairline rule with at most a soft shadow, not a 2 px red rule under a heavy shadow, and the handle to
 * drag it by stays (the quiet desk, the look-up's fixes, the owner, 2026-10-30; mockup B).
 */
async function sheetEdge(page, tag) {
  const e = await page.evaluate((LOOKUP) => {
    const el = document.querySelector(LOOKUP), s = getComputedStyle(el), g = el.querySelector('[class*="grab"]');
    return {
      border: s.borderTopStyle === "none" ? 0 : parseFloat(s.borderTopWidth) || 0, shadow: s.boxShadow,
      blurs: [...s.boxShadow.matchAll(/(-?[\d.]+)px (-?[\d.]+)px (-?[\d.]+)px/g)].map((m) => +m[3]),
      grab: g && getComputedStyle(g).display !== "none" ? g.getBoundingClientRect().width : 0,
      // (a sheet is dragged on a phone or a tablet; two books side by side on a wide screen have no handle to drag it by)
      draggable: matchMedia("(max-width: 1099px)").matches,
    };
  }, LOOKUP);
  if (e.border > 1) found.push(`${tag}: the sheet's top edge is a ${e.border} px rule (a hairline, 1 px)`);
  if (e.blurs.some((b) => b > 24)) found.push(`${tag}: the sheet throws a heavy shadow (${e.shadow}); at most a soft one`);
  if (e.draggable && e.grab < 30) found.push(`${tag}: the sheet has lost its handle`);
}

/**
 * "Dictionary · LSJ" is never an empty heading: where LSJ has no short definition but the one the card gives, it shows the start of
 * the whole entry itself, clipped to about six lines with a soft fade (its citations still links); "The whole entry" lifts the clip
 * and shows all of it, "The short entry" puts it back (the quiet desk, the look-up's fixes, the owner, 2026-10-30). The look-up
 * stands in its second layer, on μῆνιν in the Iliad, whose only short definition is the meaning.
 */
async function wholeEntry(page, tag) {
  const look = page.locator(LOOKUP);
  const read = () => page.evaluate((LOOKUP) => {
    const el = document.querySelector(LOOKUP);
    const h = [...el.querySelectorAll("h3")].find((x) => /^Dictionary · LSJ/.test(x.textContent));
    const sec = h?.closest("section");
    const btn = sec && [...sec.querySelectorAll("button")].find((b) => /^The (whole|short) entry$/.test(b.textContent.trim()));
    if (!sec || !btn) return null;
    // what stands between the heading and the button is the entry (or its start); a clip leaves the rest of the entry in the page, so
    // the text shown is the text that begins above the button
    const kids = [...sec.children].filter((c) => c !== h && c !== btn);
    const first = kids[0] ? getComputedStyle(kids[0]) : null;
    const limit = btn.getBoundingClientRect().top;
    let shown = 0;
    for (const k of kids) {
      const walk = document.createTreeWalker(k, NodeFilter.SHOW_TEXT);
      for (let n = walk.nextNode(); n; n = walk.nextNode()) {
        const r = document.createRange(); r.selectNodeContents(n);
        const top = r.getClientRects()[0]?.top;
        if (top !== undefined && top < limit - 1) shown += n.textContent.trim().length;
      }
    }
    return {
      text: kids.map((k) => k.textContent.trim()).join(" "), shown,
      height: limit - h.getBoundingClientRect().bottom,
      line: first ? parseFloat(first.lineHeight) || parseFloat(first.fontSize) * 1.55 : 22,
      clipped: kids.some((k) => getComputedStyle(k).overflowY !== "visible" && k.scrollHeight > k.clientHeight + 1),
      fade: kids.map((k) => getComputedStyle(k).maskImage).find((m) => m && m !== "none") ?? "",
      links: kids.reduce((n, k) => n + k.querySelectorAll('a[href^="/read"]').length, 0),
      // a citation under the clip is left out of the keyboard's way (tabindex -1); one the keyboard can still reach would be somewhere
      // nobody can see
      strays: kids.reduce((n, k) => { const edge = k.getBoundingClientRect().bottom; return n + (getComputedStyle(k).overflowY === "visible" ? 0 : [...k.querySelectorAll("a")].filter((a) => a.getBoundingClientRect().top >= edge - 1 && a.tabIndex >= 0).length); }, 0),
      skipped: kids.reduce((n, k) => n + k.querySelectorAll('a[tabindex="-1"]').length, 0),
      label: btn.textContent.trim(), expanded: btn.getAttribute("aria-expanded"),
    };
  }, LOOKUP);
  const a = await read();
  if (!a) { found.push(`${tag}: "Dictionary · LSJ" has no "The whole entry" button to check`); return; }
  if (a.shown < 40) found.push(`${tag}: "Dictionary · LSJ" shows ${a.shown} characters of entry text (at least 40: it is never an empty heading)`);
  if (!a.clipped) found.push(`${tag}: the start of the entry is not clipped (it is a preview of about six lines)`);
  else {
    const lines = (a.height - 8) / a.line;
    if (lines > 8.5 || lines < 3) found.push(`${tag}: the start of the entry is ${lines.toFixed(1)} lines tall (about six)`);
    if (!a.fade) found.push(`${tag}: the clipped entry has no soft fade at its foot`);
  }
  if (!a.links) found.push(`${tag}: the citations in the start of the entry are not links`);
  if (a.clipped && (a.strays || !a.skipped)) found.push(`${tag}: ${a.strays ? `${a.strays} citation(s) under the clip can be reached by the keyboard` : "no citation under the clip is left out of the keyboard's way"} (it would stop on something nobody can see)`);
  if (a.expanded !== "false") found.push(`${tag}: "The whole entry" reads aria-expanded="${a.expanded}" before it is pressed (false)`);
  await look.getByRole("button", { name: /^The whole entry$/ }).click();
  await page.waitForTimeout(500);
  const b = await read();
  if (!b) { found.push(`${tag}: "The whole entry" took the entry away`); return; }
  if (b.label !== "The short entry" || b.expanded !== "true") found.push(`${tag}: after "The whole entry" the button reads "${b.label}" with aria-expanded="${b.expanded}" ("The short entry", true)`);
  if (b.clipped || b.fade) found.push(`${tag}: "The whole entry" left the clip on the entry`);
  if (b.skipped) found.push(`${tag}: after "The whole entry" ${b.skipped} citation(s) are still left out of the keyboard's way`);
  if (b.height < a.height + 40 || b.shown <= a.shown) found.push(`${tag}: "The whole entry" did not show more of it (${Math.round(a.height)} px and ${a.shown} characters, then ${Math.round(b.height)} px and ${b.shown})`);
  await look.getByRole("button", { name: /^The short entry$/ }).click();
  await page.waitForTimeout(500);
  const c = await read();
  if (!c || c.label !== "The whole entry" || c.expanded !== "false" || !c.clipped || Math.abs(c.height - a.height) > 2) found.push(`${tag}: "The short entry" did not put the clip back (${c ? `${c.label}, ${Math.round(c.height)} px, clipped ${c.clipped}` : "no entry"})`);
}

/**
 * "More about it", and everything the second layer must be (ticket 06). The look-up stands in its first layer; this presses
 * More, checks what it then shows and where, calls `during` (the caller's own checks of the open second layer), then goes back
 * to the first layer by Escape and again by "‹ Back", leaving the look-up open in its first layer.
 *   opts.sheet   a sheet (a phone, a narrow window, two books) rather than the window over the margin
 *   opts.exact   the word is μῆνιν in the Iliad: the counted line, the lesson, Word Study and the credits are all checked exactly
 */
async function secondLayer(page, tag, opts, during) {
  const look = page.locator(LOOKUP);
  const rest = (await boxes(page)).look;
  const meaning = await meaningOf(page);
  const kind = await kindOf(page), meaningSize = await sizeOf(page);
  if (!(await openMore(page, tag))) return;
  const open = await page.evaluate((LOOKUP) => {
    const el = document.querySelector(LOOKUP);
    const text = (e) => e.textContent.trim().replace(/\s+/g, " ");
    // (a row of "Go further" ends in a ›, a sign; it is not part of what the row says)
    const find = (sel, re) => [...el.querySelectorAll(sel)].find((e) => re.test(text(e).replace(/\s*›$/, "")));
    const shown = (e) => !!e && e.checkVisibility() && e.getClientRects().length > 0;
    const credits = [...el.querySelectorAll("[data-credits]")];
    let after = "";
    if (credits.length) { const r = document.createRange(); r.setStartAfter(credits[credits.length - 1]); r.setEndAfter(el.lastChild); after = r.toString().trim(); }
    // the word's context under the head: the kind of word and the meaning; the head is "‹ Back", the headword and ×
    const recap = el.querySelector('[class*="secWord"]');
    const head = el.querySelector('[class*="panelHead"]');
    const kindEl = recap?.querySelector('[class*="secKind"]'), meaningEl = recap?.querySelector('[class*="secMeaning"]');
    // "Go further": the rows, each a button or a link, in the order they stand
    const further = [...el.querySelectorAll("h3")].find((e) => /^Go further/.test(text(e)))?.closest("section");
    const rubric = (() => { const e = document.createElement("i"); e.style.color = "var(--rubric)"; document.body.append(e); const c = getComputedStyle(e).color; e.remove(); return c; })();
    return {
      layer: el.getAttribute("data-layer"),
      text: text(el),
      first: !!el.querySelector('[class*="cardMeaning"], [class*="cardRole"], [class*="cardGrammar"]'),
      recap: recap ? {
        kind: kindEl ? text(kindEl) : "",
        meaning: meaningEl ? text(meaningEl).replace(/\s*\(from [^)]*\)\s*$/, "") : "",
        size: meaningEl ? parseFloat(getComputedStyle(meaningEl).fontSize) : 0,
        top: (meaningEl ?? recap).getBoundingClientRect().top, shown: shown(meaningEl),
      } : null,
      headBottom: head ? head.getBoundingClientRect().bottom : 0,
      rubric,
      coarse: matchMedia("(pointer: coarse)").matches,
      furtherW: further ? further.getBoundingClientRect().width : 0,
      rows: further ? [...further.querySelectorAll("a, button")].map((e) => {
        // (the row's › is the hidden mark whose text it is: the row's sign, before the words, is hidden from a screen reader too)
        const r = e.getBoundingClientRect(), mark = [...e.querySelectorAll('[aria-hidden="true"]')].find((x) => x.textContent.trim() === "›"), sign = e.querySelector("svg[data-icon]");
        const words = [...e.children].find((x) => x !== sign && x !== mark);
        return {
          text: text(e).replace(/\s*›$/, ""), h: r.height, w: r.width, right: r.right, shadow: getComputedStyle(e).boxShadow, link: e.tagName === "A",
          mark: mark ? { text: mark.textContent.trim(), right: mark.getBoundingClientRect().right, colour: getComputedStyle(mark).color } : null,
          signBeforeWords: !!sign && !!words && sign.getBoundingClientRect().right <= words.getBoundingClientRect().left + 1,
        };
      }) : [],
      heads: [...el.querySelectorAll("h3")].map((e) => ({ t: text(e), shown: shown(e) })),
      // the parts, in the order they must stand
      parts: [
        ["the LSJ heading", find("h3", /^Dictionary · LSJ/)],
        ["“The whole entry”", find("button", /^The whole entry$/)],
        ["where else it occurs", find("button", /^Where else/)],
        ["“How the sentence is built”", find("button", /^How the sentence is built$/)],
        ["the lesson", el.querySelector('a[href^="/academy/lesson/"]')],
        ["Word Study", el.querySelector('a[href^="/treasury/word"]')],
        ["the other dictionaries", find("h3", /^More dictionaries$/)],
        ["the credits", credits[0] ?? null],
      ].map(([name, node]) => ({ name, found: !!node, shown: shown(node), before: node ? [...el.querySelectorAll("*")].indexOf(node) : -1, text: node ? text(node).replace(/\s*›$/, "") : "", href: node?.getAttribute?.("href") ?? "" })),
      credits: credits.map(text),
      // the short definitions and senses the second layer gives (LSJ's, Wiktionary's)
      glosses: [...el.querySelectorAll('[class*="gloss"], [class*="senses"] p')].map(text),
      creditCount: credits.length,
      after,
      focusOnBack: document.activeElement?.textContent?.trim().endsWith("Back") ?? false,
      back: (() => {
        const b = [...el.querySelectorAll("button")].find((x) => /^‹?\s*Back$/.test(x.textContent.trim()));
        const r = b?.getBoundingClientRect();
        return b ? { w: r.width, h: r.height, size: parseFloat(getComputedStyle(b).fontSize), coarse: matchMedia("(pointer: coarse)").matches } : null;
      })(),
    };
  }, LOOKUP);
  if (open.layer !== "2") found.push(`${tag}: "More about it" did not show the second layer (data-layer ${open.layer})`);
  if (open.first) found.push(`${tag}: the second layer still shows the card of the first layer (its meaning, what the word does here, or its grammar)`);
  // the second layer keeps the word's context under its head: the kind of word and the meaning, as the first layer has them, the meaning a
  // little smaller (the quiet desk, the look-up's fixes, the owner, 2026-10-30)
  if (!open.recap) found.push(`${tag}: the second layer shows neither the kind of word nor the meaning under its head`);
  else {
    if (open.recap.kind !== kind) found.push(`${tag}: the second layer names the kind of word "${open.recap.kind}" (the first layer: "${kind}")`);
    if (open.recap.meaning !== meaning) found.push(`${tag}: the second layer's meaning line reads "${open.recap.meaning}" (the first layer: "${meaning}")`);
    if (!open.recap.shown) found.push(`${tag}: the second layer's meaning line is not shown`);
    if (open.recap.top < open.headBottom - 1) found.push(`${tag}: the second layer's meaning line stands ${Math.round(open.headBottom - open.recap.top)} px over the head (it is under it)`);
    if (open.recap.size >= meaningSize - 0.5) found.push(`${tag}: the second layer's meaning is ${open.recap.size} px, the first layer's ${meaningSize} px (a little smaller)`);
  }
  // "Go further" is rows, the same on a computer and a phone, in the order where else, the sentence, the lesson, Word Study, on the map:
  // each as wide as its part, its sign (the icon of where it goes) and its words on the left and a red › at the right end, a hairline under it (the last is closed by the next
  // part's own rule), and a finger's 44 px tall on a touch screen
  const ROWS = [["where else", /^Where else/], ["the sentence", /^How the sentence is built$/], ["the lesson", /^Lesson \d+: /], ["Word Study", /^Word Study: every form of /], ["the map", /^On the map: /]];
  const named = open.rows.map((r) => ({ ...r, name: ROWS.find(([, re]) => re.test(r.text))?.[0] ?? null }));
  for (const r of named) if (!r.name) found.push(`${tag}: "Go further" has "${r.text}" (not one of its rows: where else, the sentence, the lesson, Word Study, on the map)`);
  if (!named.length) found.push(`${tag}: "Go further" has no rows`);
  const order = named.filter((r) => r.name).map((r) => ROWS.findIndex(([n]) => n === r.name));
  if (order.some((n, i) => i && n < order[i - 1])) found.push(`${tag}: the rows of "Go further" stand in the order ${named.map((r) => r.name ?? "?").join(", ")} (where else, the sentence, the lesson, Word Study, on the map)`);
  named.forEach((r, i) => {
    const bad = [];
    if (open.coarse ? r.h < 43.5 : r.h < 35.5) bad.push(`is ${Math.round(r.h)} px tall${open.coarse ? " under a finger (at least 44)" : ""}`);
    if (r.w < open.furtherW - 2) bad.push(`is ${Math.round(r.w)} px wide in a part ${Math.round(open.furtherW)} px wide (a row is the full width)`);
    if (!r.signBeforeWords) bad.push("has no sign (the icon of where it goes) before its words");
    if (!r.mark || r.mark.text !== "›") bad.push("does not end in a ›");
    else {
      if (r.right - r.mark.right > 16) bad.push(`has its › ${Math.round(r.right - r.mark.right)} px short of the row's right end`);
      if (r.mark.colour !== open.rubric) bad.push(`has its › in ${r.mark.colour} (red, ${open.rubric})`);
    }
    if (i < named.length - 1 && !/inset/.test(r.shadow)) bad.push("has no hairline under it");
    if (bad.length) found.push(`${tag}: the "Go further" row "${r.text.slice(0, 40)}" ${bad.join("; ")}`);
  });
  // "‹ Back" is a button to find and to hit: a finger's 44 × 44 px on a touch screen, and as large as the panel's reading size
  if (!open.back) found.push(`${tag}: no "‹ Back" button in the second layer`);
  else if (open.back.coarse && (open.back.h < 43.5 || open.back.w < 43.5)) found.push(`${tag}: "‹ Back" is ${Math.round(open.back.w)} × ${Math.round(open.back.h)} px under a finger (at least 44 × 44)`);
  else if (!open.back.coarse && (open.back.h < 32 || open.back.size < 15)) found.push(`${tag}: "‹ Back" is ${Math.round(open.back.h)} px tall in ${Math.round(open.back.size)} px letters (it is a button at the panel's reading size)`);
  if (!open.focusOnBack) found.push(`${tag}: the keyboard did not move into the second layer when it opened (it belongs on "‹ Back")`);
  const has = (name) => open.parts.find((x) => x.name === name);
  // (a word with no LSJ entry or no analysis has no “whole entry” or credit to show, so only μῆνιν is held to all of them)
  const want = ["the LSJ heading", "where else it occurs", "“How the sentence is built”", "the other dictionaries"];
  if (opts.exact) want.push("“The whole entry”", "Word Study", "the lesson", "the credits");
  for (const name of want) if (!has(name).found) found.push(`${tag}: the second layer has no ${name}`);
  for (const x of open.parts) if (x.found && !x.shown) found.push(`${tag}: ${x.name} is in the second layer but not shown`);
  const placed = open.parts.filter((x) => x.found);
  for (let i = 1; i < placed.length; i++) if (placed[i].before < placed[i - 1].before) found.push(`${tag}: ${placed[i].name} comes before ${placed[i - 1].name} (the order is the LSJ entry, where else, the sentence, the lesson, Word Study, the other dictionaries, the credits)`);
  // the same small-capitals headings on a computer and a phone (none hidden)
  for (const hd of open.heads) if (!hd.shown) found.push(`${tag}: the heading "${hd.t}" is hidden (the computer and the phone show the same headings)`);
  if (!open.heads.some((x) => x.t === "Dictionary · LSJ")) found.push(`${tag}: no "Dictionary · LSJ" heading`);
  // credits: one line, once, at the very foot, and no other credit anywhere in the look-up
  if (open.creditCount > 1 || (opts.exact && open.creditCount !== 1)) found.push(`${tag}: ${open.creditCount} credit lines in the second layer (there is exactly one, at the foot)`);
  if (open.after) found.push(`${tag}: "${open.after.slice(0, 40)}" stands below the credits (they are the very foot)`);
  const once = (re, what) => { const n = (open.text.match(re) ?? []).length; if (n > 1 || (opts.exact && n !== 1)) found.push(`${tag}: ${what} appears ${n} times in the second layer (once, in the credit line)`); };
  once(/Keersmaekers/g, "GLAUx's credit");
  once(/Perseus Digital Library/g, "LSJ's credit");
  if (/Analysis:|Text provided under|Data accessed from/.test(open.text)) found.push(`${tag}: an old credit line is still in the second layer`);
  if (opts.exact) {
    const line = open.credits[0] ?? "";
    if (line !== "Analysis and treebank: GLAUx (Keersmaekers 2021), CC BY-SA 4.0 · LSJ: Perseus Digital Library, CC BY-SA") found.push(`${tag}: the credit line reads "${line}"`);
    const where = has("where else it occurs").text;
    if (where !== "Where else: 12 times in the Iliad") found.push(`${tag}: the where-else row reads "${where}" (Where else: 12 times in the Iliad)`);
    const lesson = has("the lesson");
    if (!/^Lesson 3: Who does what: the idea of case/.test(lesson.text) || !/Why the accusative\?/.test(lesson.text) || lesson.href !== "/academy/lesson/case") found.push(`${tag}: the lesson row reads "${lesson.text}" at ${lesson.href} (Lesson 3: Who does what: the idea of case, and why: Why the accusative?)`);
    const study = has("Word Study").text;
    if (study !== "Word Study: every form of μῆνις") found.push(`${tag}: the Word Study row reads "${study}" (Word Study: every form of μῆνις)`);
    // all four rows, in this order
    for (const n of ["where else", "the sentence", "the lesson", "Word Study"]) if (!named.some((r) => r.name === n)) found.push(`${tag}: "Go further" has no row for ${n}`);
  }
  // the meaning the first layer gave is not given again
  if (meaning && open.glosses.some((g) => norm(g) === norm(meaning))) found.push(`${tag}: the second layer says the first layer's meaning ("${meaning.slice(0, 40)}") again`);
  // the same window, grown in place
  const now = (await boxes(page)).look;
  if (now && rest) {
    if (opts.sheet) { if (now.height <= rest.height + 1) found.push(`${tag}: the sheet did not rise for the second layer (${Math.round(rest.height)} px before, ${Math.round(now.height)} px after)`); }
    else {
      if (Math.abs(now.left - rest.left) > 1 || Math.abs(now.right - rest.right) > 1) found.push(`${tag}: the second layer's window moved or changed width (left ${Math.round(rest.left)} to ${Math.round(now.left)}, right ${Math.round(rest.right)} to ${Math.round(now.right)})`);
      // (with a panel open the window is the panel's whole box from its first layer, so it has nothing to grow into: opts.whole)
      if (opts.whole) { if (Math.abs(now.height - rest.height) > 1) found.push(`${tag}: the window changed height for the second layer (${Math.round(rest.height)} px before, ${Math.round(now.height)} px after; it is the panel's whole box)`); }
      else if (now.height <= rest.height + 1) found.push(`${tag}: the window did not grow for the second layer (${Math.round(rest.height)} px before, ${Math.round(now.height)} px after)`);
      const vh = page.viewportSize().height;
      if (now.bottom > vh + 1) found.push(`${tag}: the second layer reaches ${Math.round(now.bottom - vh)} px below the screen`);
    }
  }
  await during?.();
  // the text scrolls under the window; on a computer the window with the second layer open stays where it is
  if (!opts.sheet && now) {
    await page.mouse.move(200, page.viewportSize().height / 2);
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(700);
    const s = (await boxes(page)).look;
    if (!s) found.push(`${tag}: the look-up closed when the text was scrolled with the second layer open`);
    else if (Math.abs(s.top - now.top) > 2 || Math.abs(s.left - now.left) > 2) found.push(`${tag}: the second layer moved ${Math.round(s.top - now.top)} px when the text was scrolled`);
  }
  // Escape goes back to the first layer, and the look-up stays open with the keyboard on "More about it"
  await look.focus();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(700);
  const esc = await page.evaluate((LOOKUP) => ({ open: !!document.querySelector(LOOKUP), layer: document.querySelector(LOOKUP)?.getAttribute("data-layer"), onMore: document.activeElement?.textContent?.trim() === "More about it" }), LOOKUP);
  if (!esc.open) found.push(`${tag}: Escape in the second layer closed the look-up (it goes back to the first layer)`);
  else {
    if (esc.layer !== "1") found.push(`${tag}: Escape in the second layer did not go back to the first layer`);
    if (!esc.onMore) found.push(`${tag}: after Escape the keyboard is not on "More about it"`);
  }
  // and "‹ Back" does the same, to the height it rested at
  await look.getByRole("button", { name: "More about it" }).click();
  await page.waitForTimeout(700);
  await look.getByRole("button", { name: "Back" }).click();
  await page.waitForTimeout(700);
  const back = await boxes(page);
  if ((await layerOf(page)) !== "1") found.push(`${tag}: "‹ Back" did not return to the first layer`);
  else if (back.look && rest && Math.abs(back.look.height - rest.height) > 2 && opts.sheet) found.push(`${tag}: after "‹ Back" the sheet is ${Math.round(back.look.height)} px tall (it rested at ${Math.round(rest.height)} px)`);
  if (!(await meaningOf(page))) found.push(`${tag}: after "‹ Back" the first layer has no meaning line`);
}

// ---- margin: one book on a computer
// (`panel`: a side panel is open beside the text. The margin's room is not kept for the look-up then, so that the Greek keeps its size; the look-up takes the
// panel's box exactly, so that the panel is wholly behind it, and is never over the text; the quiet desk, ticket 10, the owner, 2026-10-30)
const inMargin = (tag, b, panel = false) => {
  if (!b.look) { found.push(`margin ${tag}: no look-up opened`); return; }
  const over = Math.max(b.tr?.right ?? 0, b.grc?.right ?? 0);
  if (b.look.left < over - 1) found.push(`margin ${tag}: the look-up reaches ${Math.round(over - b.look.left)} px over the text (it belongs ${panel ? "over the panel's place" : "in the margin"})`);
  if (b.word && b.word.right > b.look.left + 1 && b.word.left < b.look.right - 1 && b.word.bottom > b.look.top + 1 && b.word.top < b.look.bottom - 1) found.push(`margin ${tag}: the look-up covers the tapped word`);
  // (the reader's bar stands along the foot: the look-up ends above it, and may start near the top of the window, the quiet desk, ticket 09)
  if (b.bar && b.look.bottom > b.bar.top + 1) found.push(`margin ${tag}: the look-up covers the reader's bar by ${Math.round(b.look.bottom - b.bar.top)} px`);
  if (b.look.right - b.look.left < 280) found.push(`margin ${tag}: the look-up is ${Math.round(b.look.right - b.look.left)} px wide (at least 280)`);
  if (b.lookPos !== "fixed") found.push(`margin ${tag}: the look-up is not fixed to the screen (it scrolls away with the text)`);
  if (panel) {
    if (!b.side) found.push(`margin ${tag}: no panel stands beside the text`);
    else {
      for (const [edge, got, want] of [["left", b.look.left, b.side.left], ["right", b.look.right, b.side.right], ["top", b.look.top, b.side.top], ["bottom", b.look.bottom, b.side.bottom]]) {
        if (Math.abs(got - want) > 1) found.push(`margin ${tag}: the look-up's ${edge} edge is at ${Math.round(got)} px, the panel's at ${Math.round(want)} px (it takes the panel's box, so that nothing of the panel shows)`);
      }
      if (!b.lookOnTop) found.push(`margin ${tag}: the panel stands over the look-up`);
    }
  }
};
// (Find's panel is 340 px wide below 1280 px, 400 px from there: the look-up takes the one or the other)
for (const [w, h, scheme, find] of [[1280, 900, "light"], [1440, 900, "dark"], [1440, 900, "light", true], [1200, 900, "light", true]]) {
  const tag = `${w}px ${scheme === "dark" ? "Night" : "Paper"}${find ? " with Find open" : ""}`;
  const { ctx, page } = await open(w, h, scheme, `/read?w=${WORK}`);
  if (find) {
    await page.keyboard.press("Control+f");
    await page.waitForSelector('aside[aria-label^="Find"]', { timeout: 10000 }).catch(() => found.push(`margin ${tag}: Find did not open`));
    await page.waitForTimeout(900);
  }
  // (with Find open the English stands under the Greek, so the lower word is looked for a little higher)
  for (const frac of find ? [0.3, 0.5] : [0.3, 0.75]) {
    await page.evaluate(() => scrollTo({ top: innerHeight * 1.4, behavior: "instant" }));
    await page.waitForTimeout(600);
    let i = await wordAt(page, frac);
    // (where the Greek stands on the screen is the page's layout to decide: with no word at this height the page is read on a little at a
    // time, 250 px, until one stands there; the quiet desk, ticket 09, took the bar from the top and moved every line up)
    for (let k = 0; i < 0 && k < 8; k++) { await page.evaluate(() => scrollBy({ top: 250, behavior: "instant" })); await page.waitForTimeout(300); i = await wordAt(page, frac); }
    if (i < 0) { found.push(`margin ${tag}: no word found ${Math.round(frac * 100)}% down the screen`); continue; }
    const word = page.locator("article [data-w]").nth(i);
    const before = await word.boundingBox();
    const panelBefore = find ? (await boxes(page)).side : null;   // (the panel as it stands before the look-up opens over it)
    await word.click();
    await page.waitForSelector(LOOKUP, { timeout: 10000 });
    await page.waitForTimeout(900);
    const b = await boxes(page);
    const after = await word.boundingBox();
    if (Math.abs(after.y - before.y) > 2) found.push(`margin ${tag}: the word moved ${Math.round(after.y - before.y)} px when it was looked up`);
    if (find && !panelBefore) found.push(`margin ${tag}: no panel stood beside the text before the look-up opened`);
    inMargin(tag, b, find);
    if (!b.look) continue;
    await firstLayer(page, `margin ${tag}`);
    if (find) {
      // the panel under the look-up is out of the keyboard's reach: a control that is covered must not take it (and the keyboard goes back where it was)
      const reached = await page.evaluate(() => {
        const c = document.querySelector('aside[aria-label^="Find"]')?.querySelector("input, button");
        if (!c) return null;
        const was = document.activeElement;
        c.focus();
        const took = document.activeElement === c;
        if (was instanceof HTMLElement) was.focus();
        return took;
      });
      if (reached === null) found.push(`margin ${tag}: the panel under the look-up has no control to try`);
      else if (reached) found.push(`margin ${tag}: a control of the panel under the look-up takes the keyboard (it is covered, and should be out of reach)`);
    }
    // the text scrolls under the window; the window stays where it is
    await page.mouse.move(200, h / 2);
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(700);
    const s2 = await boxes(page);
    if (!s2.look) found.push(`margin ${tag}: the look-up closed when the text was scrolled`);
    else if (Math.abs(s2.look.top - b.look.top) > 2 || Math.abs(s2.look.left - b.look.left) > 2) found.push(`margin ${tag}: the look-up moved ${Math.round(s2.look.top - b.look.top)} px when the text was scrolled`);
    const next = page.locator(LOOKUP).getByRole("button", { name: "Next word" });
    if (await next.count()) { await next.click(); await page.waitForTimeout(900); inMargin(`${tag}, on the next word`, await boxes(page), find); }
    else found.push(`margin ${tag}: no Next word button`);
    // with the rest opened, the window still stays where it is (it ends back in the first layer)
    await secondLayer(page, `margin ${tag}`, { sheet: false, whole: !!find }, async () => inMargin(`${tag}, with More about it open`, await boxes(page), find));
    await page.locator(LOOKUP).focus();
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
    const after2 = await page.evaluate((LOOKUP) => ({ open: !!document.querySelector(LOOKUP), back: !!document.activeElement?.matches("article [data-w]") }), LOOKUP);
    if (after2.open) found.push(`margin ${tag}: Escape did not close the look-up`);
    else if (!after2.back) found.push(`margin ${tag}: after Escape the keyboard is not back on the word`);
    if (find && panelBefore) {
      // closing the look-up shows the panel again, where it was and as wide, with nothing over it
      const now = await page.evaluate(() => {
        const p = document.querySelector('aside[aria-label^="Find"]');
        if (!p) return null;
        const r = p.getBoundingClientRect(), hit = document.elementFromPoint(r.left + r.width / 2, r.top + 40), c = p.querySelector("input, button");
        c?.focus();
        return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, shown: !!hit && p.contains(hit), reachable: !!c && document.activeElement === c };
      });
      if (!now) found.push(`margin ${tag}: closing the look-up closed Find too (the panel is not there)`);
      else {
        if (!now.shown) found.push(`margin ${tag}: after the look-up is closed the panel is still covered`);
        if (!now.reachable) found.push(`margin ${tag}: after the look-up is closed the panel's controls do not take the keyboard again`);
        if (Math.abs(now.left - panelBefore.left) > 1 || Math.abs(now.right - panelBefore.right) > 1) found.push(`margin ${tag}: the panel is not where it was after the look-up was closed (left ${Math.round(now.left)} px, was ${Math.round(panelBefore.left)} px)`);
      }
    }
  }
  await ctx.close();
}
// (ONLY=margin stops here: the parts after it take minutes)
if (process.env.ONLY === "margin") {
  await browser.close();
  if (found.length) { console.error(`The look-up, margin part only: ${found.length} problem(s)\n  ` + found.join("\n  ")); process.exit(1); }
  console.log("The look-up, margin part only: in order");
  process.exit(0);
}

// ---- sheet: a narrower window, a phone, two books side by side
for (const [w, h, path, label] of [[1000, 800, `/read?w=${WORK}`, "1000px"], [390, 844, `/read?w=${WORK}`, "390px"], [1280, 900, `/read?w=${WORK}&w2=tlg0059.tlg001`, "two books, 1280px"]]) {
  const { ctx, page } = await open(w, h, "light", path);
  await page.evaluate(() => scrollTo({ top: innerHeight * 1.4, behavior: "instant" }));
  // two books: each pane scrolls in its own box
  await page.evaluate(() => document.querySelectorAll("[data-key]")[0]?.closest("[class*='pane']")?.scrollBy({ top: innerHeight, behavior: "instant" }));
  await page.waitForTimeout(600);
  let i = await wordAt(page, 0.72);
  if (i < 0) {
    // the Greek of a passage is shorter on a phone now (smaller type, narrower gutters: the quiet desk, ticket 10), so a scroll of a fixed distance can land under it, among
    // the English, whose words are not tappable: bring a word of the Greek's middle to that height instead
    await page.evaluate(() => {
      const ws = [...document.querySelectorAll("article [lang=grc] [data-w]")], w = ws[Math.floor(ws.length / 2)];
      if (w) scrollBy({ top: w.getBoundingClientRect().top - innerHeight * 0.72, behavior: "instant" });
    });
    await page.waitForTimeout(600);
    i = await wordAt(page, 0.72);
  }
  if (i < 0) { found.push(`sheet ${label}: no word found low on the screen`); await ctx.close(); continue; }
  const word = page.locator("article [data-w]").nth(i);
  if (w < 800) await word.tap(); else await word.click();
  await page.waitForSelector(LOOKUP, { timeout: 10000 });
  await page.waitForTimeout(1200);
  const check = async (when) => {
    const b = await boxes(page);
    if (!b.look || !b.word) { found.push(`sheet ${label}: ${when}: no look-up, or no word marked as looked up`); return; }
    if (b.word.bottom > h || b.word.top < 0) found.push(`sheet ${label}: ${when}: the word's line is off the screen (${Math.round(b.word.top)} px)`);
    else if (b.look.top < b.word.bottom - 1) found.push(`sheet ${label}: ${when}: the look-up reaches ${Math.round(b.word.bottom - b.look.top)} px over the word's line`);
    return b;
  };
  const first = await check("as it opens");
  if (first?.look && first.look.height > h * 0.27 + 1) found.push(`sheet ${label}: it opens ${Math.round(first.look.height)} px tall, ${Math.round(first.look.height / h * 100)}% of the screen (it rests at 27% or less)`);
  await firstLayer(page, `sheet ${label}`);
  await sheetEdge(page, `sheet ${label}`);
  // "More about it" raises the sheet to all the room it has, and reveals the dictionary; "‹ Back" brings it down again
  await secondLayer(page, `sheet ${label}`, { sheet: true }, async () => { await check("at its full height"); });
  const next = page.locator(LOOKUP).getByRole("button", { name: "Next word" });
  if (await next.count()) { await next.click(); await page.waitForTimeout(900); await check("on the next word"); }
  await ctx.close();
}

/** Open the look-up on μῆνιν, Iliad 1.1, with the word tapped on a phone and clicked elsewhere. */
async function lookUp(page, phone) {
  const word = page.locator('[data-u="1.1"] [data-w="μῆνιν"]');
  if (phone) await word.tap(); else await word.click();
  await page.waitForSelector(LOOKUP, { timeout: 10000 });
  await page.waitForTimeout(900);
  await page.locator(LOOKUP).getByText("Looking it up…").waitFor({ state: "detached", timeout: 20000 }).catch(() => {});
}
const headOf = (page) => page.evaluate((LOOKUP) => document.querySelector(LOOKUP)?.querySelector('[class*="pw"]')?.textContent?.trim() ?? "", LOOKUP);

/**
 * The back routes (from the second layer to the sentence panel or Echoes, and back to the word). The look-up stands in its
 * first layer, on μῆνιν. Each route: More about it, then the link; the look-up closes and the panel opens with a back sign and "Back to μῆνις";
 * Back brings the look-up back on the same word in the second layer. Escape in the panel only closes it. Ends with the look-up
 * open in its first layer.
 */
async function backRoutes(page, tag, phone) {
  const look = page.locator(LOOKUP);
  for (const [name, link, panel] of [
    ["the sentence", /^How the sentence is built$/, 'aside[aria-label="How the sentence is built"]'],
    ["where else", /^Where else/, 'aside[aria-label="Echoes"]'],
  ]) {
    const here = `${tag}, ${name}`;
    for (const pass of ["escape", "back"]) {
      if (!(await look.count())) await lookUp(page, phone);
      if ((await layerOf(page)) !== "2") { await look.getByRole("button", { name: "More about it" }).click(); await page.waitForTimeout(700); }
      const way = look.getByRole("button", { name: link });
      if (!(await way.count())) { found.push(`${here}: the second layer has no row to open ${name} from`); return; }
      await way.click();
      const shown = await page.waitForSelector(panel, { timeout: 20000 }).then(() => true, () => false);
      if (!shown) { found.push(`${here}: the panel did not open`); return; }
      await page.waitForTimeout(700);
      if (await look.count()) found.push(`${here}: the look-up stayed open under the panel`);
      const back = page.locator(panel).getByRole("button", { name: /^Back to/ });
      if (!(await back.count())) { found.push(`${here}: the panel has no "Back to" button`); await page.locator(panel).focus(); await page.keyboard.press("Escape"); continue; }
      const label = ((await back.first().textContent()) ?? "").trim().replace(/\s+/g, " ");
      if (pass === "escape") {
        // (the back sign is the site's shared icon, drawn before the words: the quiet desk, ticket 09, the owner, 2026-10-30)
        const sign = await back.first().locator("svg[data-icon]").count();
        if (!/^Back to μῆνις$/.test(label) || !sign) found.push(`${here}: the button reads "${label}"${sign ? "" : " with no back sign"} (a back sign, then "Back to μῆνις")`);
        // Escape in the panel closes it, as before, and does not bring the look-up back
        await page.locator(panel).focus();
        await page.keyboard.press("Escape");
        await page.waitForTimeout(700);
        if (await page.locator(panel).count()) found.push(`${here}: Escape did not close the panel`);
        if (await look.count()) found.push(`${here}: Escape in the panel brought the look-up back (it only closes the panel)`);
        continue;
      }
      await back.first().click();
      await page.waitForSelector(LOOKUP, { timeout: 10000 }).catch(() => found.push(`${here}: "Back to μῆνις" did not bring the look-up back`));
      await page.waitForTimeout(1000);
      if (await page.locator(panel).count()) found.push(`${here}: the panel stayed open after "Back to μῆνις"`);
      if (!(await look.count())) continue;
      if ((await layerOf(page)) !== "2") found.push(`${here}: the look-up came back in layer ${await layerOf(page)} (the second layer, "More about it", is where the reader came from)`);
      if (!/Dictionary · LSJ/.test((await look.textContent()) ?? "")) found.push(`${here}: the look-up came back without "More about it" open`);
      if ((await headOf(page)) !== "μῆνις") found.push(`${here}: the look-up came back on "${await headOf(page)}" (the same word, μῆνις)`);
      const marked = await page.evaluate(() => [...document.querySelectorAll("article [data-w][class*='__sel']")].map((e) => e.getAttribute("data-w")));
      if (marked.join() !== "μῆνιν") found.push(`${here}: the word marked in the text is "${marked.join()}" (μῆνιν)`);
      // and it is the second layer's own Back that goes on from here
      await look.focus();
      await page.keyboard.press("Escape");
      await page.waitForTimeout(600);
    }
  }
}

/**
 * The phone's back gesture steps back through the look-up: second layer, first layer, closed, with the reader staying on its page
 * and its passage; and × / Previous and Next keep the history level (they add nothing of their own).
 */
async function historySteps(page, tag) {
  const look = page.locator(LOOKUP);
  const state = () => page.evaluate(() => ({ step: history.state?.lookupStep ?? 0, len: history.length, path: location.pathname, search: location.search, top: Math.round(document.querySelector('[data-u="1.1"] [data-w="μῆνιν"]')?.getBoundingClientRect().top ?? -9999) }));
  const wait = () => page.waitForTimeout(800);
  // (a Back that left the reader leaves nothing more to check)
  const left = () => { const gone = !new URL(page.url()).pathname.startsWith(new URL(start.url).pathname); if (gone) found.push(`${tag}: the browser's Back left the reader (now at ${page.url()})`); return gone; };
  const start = { ...(await state()), url: page.url() };
  await lookUp(page, true);
  const first = await state();
  if (first.step !== 1 || first.len !== start.len + 1) found.push(`${tag}: opening the look-up left the history at step ${first.step}, ${first.len - start.len} entries added (one step, one entry)`);
  const placed = first.top;   // where the line stands with the look-up open (it may have been brought up)
  await look.getByRole("button", { name: "More about it" }).click();
  await wait();
  const second = await state();
  if (second.step !== 2 || second.len !== start.len + 2) found.push(`${tag}: "More about it" left the history at step ${second.step}, ${second.len - start.len} entries added (two)`);
  // the browser's Back: the second layer to the first
  await page.goBack().catch(() => {});
  await wait();
  if (left()) return;
  if (!(await look.count())) found.push(`${tag}: Back from the second layer closed the look-up (it goes to the first layer)`);
  else if ((await layerOf(page)) !== "1") found.push(`${tag}: Back from the second layer left the look-up in layer ${await layerOf(page)}`);
  let now = await state();
  if (now.path !== start.path || now.search !== start.search) found.push(`${tag}: Back changed the page address to ${now.path}${now.search}`);
  if (now.step !== 1) found.push(`${tag}: Back from the second layer landed on step ${now.step} (1)`);
  // Next adds no entry
  const next = look.getByRole("button", { name: "Next word" });
  if (await next.count()) {
    await next.click(); await wait();
    const stepped = await state();
    if (stepped.len !== now.len || stepped.step !== 1) found.push(`${tag}: Next word changed the history (step ${stepped.step}, ${stepped.len - now.len} entries added)`);
    await look.getByRole("button", { name: "Previous word" }).click(); await wait();
  }
  // the browser's Back again: the first layer closes
  await page.goBack().catch(() => {});
  await wait();
  if (left()) return;
  if (await look.count()) found.push(`${tag}: a second Back did not close the look-up`);
  now = await state();
  if (now.path !== start.path || now.search !== start.search) found.push(`${tag}: Back left or changed the page (${now.path}${now.search})`);
  if (now.step !== 0) found.push(`${tag}: after the look-up closed the history is at step ${now.step} (0)`);
  if (!(await page.locator('[data-u="1.1"] [data-w="μῆνιν"]').count())) found.push(`${tag}: after Back the reader no longer shows Iliad 1.1`);
  else if (Math.abs(now.top - placed) > 40 && Math.abs(now.top - start.top) > 40) found.push(`${tag}: Back moved the passage (the line stood ${placed} px from the top with the look-up open and ${start.top} px before, then ${now.top} px)`);
  // × from the second layer steps back over both entries, and a new look-up is not stacked on old ones
  await lookUp(page, true);
  await look.getByRole("button", { name: "More about it" }).click();
  await wait();
  await look.getByRole("button", { name: "Close look-up" }).click();
  await wait();
  now = await state();
  if (await look.count()) found.push(`${tag}: × did not close the look-up`);
  if (now.step !== 0 || now.path !== start.path || now.search !== start.search) found.push(`${tag}: after × the history is at step ${now.step} on ${now.path}${now.search} (step 0, the reader's page)`);
  await lookUp(page, true);
  if ((await state()).step !== 1) found.push(`${tag}: a look-up opened after × is at step ${(await state()).step} (1)`);
  // Escape closes it too (from the first layer, with the keyboard in the look-up), and a tap in the margin of the text
  await look.focus();
  await page.keyboard.press("Escape");
  await wait();
  now = await state();
  if (now.step !== 0) found.push(`${tag}: after Escape the history is at step ${now.step} (0)`);
  // Back now leaves nothing of the look-up to step through: it must not close or reopen anything
  if (await look.count()) found.push(`${tag}: Escape did not close the look-up`);
}

// ---- the second layer on μῆνιν, Iliad 1.1: a computer (the window over the margin) and a phone (the sheet)
for (const [w, h, label] of [[1280, 900, "1280px"], [390, 844, "390px"]]) {
  const tag = `μῆνιν in the Iliad, ${label}`;
  const { ctx, page } = await open(w, h, "light", "/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1");
  const word = page.locator('[data-u="1.1"] [data-w="μῆνιν"]');
  if (w < 800) await word.tap(); else await word.click();
  await page.waitForSelector(LOOKUP, { timeout: 10000 });
  await page.waitForTimeout(900);
  await firstLayer(page, tag);
  await caseLine(page, tag, false);
  if (w >= 800) inMargin(tag, await boxes(page)); else await sheetEdge(page, tag);
  await secondLayer(page, tag, { sheet: w < 800, exact: true }, () => wholeEntry(page, tag));
  await backRoutes(page, tag, w < 800);
  if (!(await page.locator(LOOKUP).count())) await lookUp(page, w < 800);
  if ((await layerOf(page)) === "2") { await page.locator(LOOKUP).focus(); await page.keyboard.press("Escape"); await page.waitForTimeout(600); }
  // × closes the look-up from the second layer, not only back to the first
  await page.locator(LOOKUP).getByRole("button", { name: "More about it" }).click();
  await page.waitForTimeout(500);
  await page.locator(LOOKUP).getByRole("button", { name: "Close look-up" }).click();
  await page.waitForTimeout(500);
  if (await page.locator(LOOKUP).count()) found.push(`${tag}: × in the second layer did not close the look-up`);
  // Escape from the first layer closes it and gives the keyboard back to the word
  await word.focus();
  await page.keyboard.press("Enter");
  await page.waitForSelector(LOOKUP, { timeout: 10000 });
  await page.locator(LOOKUP).focus();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  const gone = await page.evaluate((LOOKUP) => ({ open: !!document.querySelector(LOOKUP), back: !!document.activeElement?.matches("article [data-w]") }), LOOKUP);
  if (gone.open) found.push(`${tag}: Escape in the first layer did not close the look-up`);
  else if (!gone.back) found.push(`${tag}: after Escape the keyboard is not back on the word`);
  await ctx.close();
}

const ILIAD = "/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1";

// ---- Colour by case on: the grammar line underlines its case in the case's colour and line, as the text does
{
  const { ctx, page } = await open(1280, 900, "light", ILIAD, { settings: { cases: true } });
  await lookUp(page, false);
  await caseLine(page, "μῆνιν in the Iliad, 1280px, with Colour by case on", true);
  await ctx.close();
}

// ---- Wiktionary out of reach: said plainly, never as the raw error, with a "Try again" that looks it up again (the quiet desk,
// the look-up's fixes, the owner, 2026-10-30)
for (const [w, h, label] of [[1280, 900, "1280px"], [390, 844, "390px"]]) {
  const tag = `μῆνιν in the Iliad, ${label}, Wiktionary out of reach`;
  const { ctx, page, state } = await open(w, h, "light", ILIAD, { wikt: "fail" });
  await lookUp(page, w < 800);
  const look = page.locator(LOOKUP);
  await look.getByRole("button", { name: "More about it" }).click();
  await page.waitForTimeout(900);
  const part = look.locator("section", { has: page.locator("h3", { hasText: /^Wiktionary · live/ }) });
  const said = async () => ((await part.count()) ? ((await part.first().textContent()) ?? "").replace(/^Wiktionary · live/, "").replace(/\s+/g, " ").trim() : "");
  const first = await said();
  if (!first) { found.push(`${tag}: no "Wiktionary · live" part says that Wiktionary could not be reached`); await ctx.close(); continue; }
  if (!/^Wiktionary could not be reached\./.test(first) || /Failed|fetch|Error|\(/.test(first)) found.push(`${tag}: the failure reads "${first}" ("Wiktionary could not be reached." and "Try again", not the browser's own error)`);
  const retry = part.getByRole("button", { name: /^Try again$/ });
  if (!(await retry.count())) found.push(`${tag}: the failure has no "Try again" button`);
  else {
    const asked = state.wiktRequests;
    await retry.click();
    await page.waitForTimeout(900);
    if (state.wiktRequests <= asked) found.push(`${tag}: "Try again" did not ask Wiktionary again`);
    if (!/^Wiktionary could not be reached\./.test(await said()) || !(await retry.count())) found.push(`${tag}: after a second failure the part does not say so again, with "Try again" (it reads "${await said()}")`);
    // and once Wiktionary answers (here: no entry for the form), the failure is gone
    state.wikt = "none";
    if (await retry.count()) await retry.click();
    await page.waitForTimeout(1200);
    if (await part.count()) found.push(`${tag}: after "Try again", with Wiktionary reachable, the part still reads "${await said()}"`);
  }
  await ctx.close();
}

// ---- while the look-up is still being found, its head shows the word that was tapped, then the dictionary form, at the same height
for (const [w, h, label] of [[1280, 900, "1280px"], [390, 844, "390px"]]) {
  const tag = `μῆνιν in the Iliad, ${label}, while it loads`;
  const { ctx, page } = await open(w, h, "light", ILIAD, { slow: 2500 });
  const word = page.locator('[data-u="1.1"] [data-w="μῆνιν"]');
  if (w < 800) await word.tap(); else await word.click();
  await page.waitForSelector(LOOKUP, { timeout: 10000 });
  const head = () => page.evaluate((LOOKUP) => {
    const el = document.querySelector(LOOKUP), pw = el.querySelector('[class*="pw"]'), hd = el.querySelector('[class*="panelHead"]');
    return { text: pw?.textContent?.trim() ?? "", greek: pw?.getAttribute("lang") === "grc", waiting: /Looking it up/.test(el.textContent), height: hd?.getBoundingClientRect().height ?? 0 };
  }, LOOKUP);
  const during = await head();
  if (!during.waiting) found.push(`${tag}: the look-up was not still loading when its head was read, so its first moment could not be seen`);
  else if (during.text !== "μῆνιν" || !during.greek) found.push(`${tag}: the head reads "${during.text}" while it loads (the tapped word, μῆνιν, in Greek)`);
  await page.locator(LOOKUP).getByText("Looking it up…").waitFor({ state: "detached", timeout: 30000 }).catch(() => found.push(`${tag}: the look-up was still "Looking it up…" after 30 s`));
  await page.waitForTimeout(500);
  const after = await head();
  if (after.text !== "μῆνις") found.push(`${tag}: once it is ready the head reads "${after.text}" (the dictionary form, μῆνις)`);
  if (Math.abs(after.height - during.height) > 1) found.push(`${tag}: the head is ${Math.round(during.height)} px tall while the look-up loads and ${Math.round(after.height)} px once it is ready (the same height)`);
  await ctx.close();
}

// ---- the phone's back gesture, on a page of its own (so that the entries counted are only this one's)
{
  const { ctx, page } = await open(390, 844, "light", "/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1");
  await historySteps(page, "μῆνιν in the Iliad, 390px, the browser's Back");
  await ctx.close();
}

await browser.close();
if (found.length) {
  console.error(`The look-up: ${found.length} problem(s)\n  ` + found.join("\n  "));
  process.exit(1);
}
console.log("The look-up: a first layer with no badge, lesson card or credit, and the rest in a second layer behind More about it (the word's kind and meaning under its head, the LSJ entry never an empty heading, Go further as rows of where else, the sentence, the lesson and Word Study, the other dictionaries, one credit line at the foot; ‹ Back and Escape return); the case underlined only with Colour by case on; Wiktionary out of reach said plainly with Try again; the tapped word in the head while it loads; a window at least 280 px wide floating over the right margin on a computer, still while the text scrolls, and with a panel open beside the text the panel's own box instead, the panel wholly behind it (closing it shows the panel again), and a low sheet with a hairline edge that stops below the line elsewhere");
