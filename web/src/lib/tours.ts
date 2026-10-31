/**
 * The "Show me" tours of The Guide (/guide): each opens a real page and points at its controls one at a time
 * (components/tour/Tour.tsx draws the light and the card). A tour lives on one page; it starts from the Guide's
 * "Show me" button, or from any link carrying ?tour=<id>.
 *
 * A target is a CSS selector, optionally with words its text must contain; the first one that is showing on
 * the screen is used, so a step can name the wide-screen control and its phone twin. A step whose control is
 * not on the page (no translation, signed out, nothing found) is skipped rather than shown pointing at nothing.
 */
import { FORUM_OPEN } from "@/config/areas";

export interface Target { sel: string; text?: string }
export interface Step {
  /** where the light falls: the first target showing on screen */
  at: Target[];
  /** more controls lit together with it, in one box (two pickers side by side, a row of buttons) */
  with?: Target[];
  title: string;
  text: string;
  /** wording for phones, where one taps and there are no keys */
  phoneText?: string;
  /** a step only for wide screens, or only for phones */
  only?: "wide" | "phone";
  /** done when the step opens, before looking for its target (e.g. open a word's look-up) */
  click?: Target[];
  /** press Escape first, to put away what the step before opened (the passage actions) */
  esc?: boolean;
  /** move on by itself when one of these appears: the reader did what the step asks */
  advance?: Target[];
}
export interface Tour {
  id: string;
  /** the chapter's title in the Guide */
  title: string;
  /** the page it runs on, with the query that sets up a good example */
  start: string;
  steps: Step[];
}

const t = (sel: string, text?: string): Target => (text ? { sel, text } : { sel });
const LOOKUP = t('aside[aria-label^="Look-up:"]');
const ACTIONS = t('[role=toolbar][aria-label="Passage actions"]');
/** the small tools stand in the header on a wide screen and in the menu on a narrower one: a step that points at one opens
 *  the menu first, and where the Menu button is not showing the click does nothing */
const MENU = t('header button[aria-label="Menu"][aria-expanded="false"]');
/** the reader's foot bar (the quiet desk, the guide, the owner, 2026-10-31): the bar itself, and the buttons that open its three menus (while they are shut).
 *  A menu that is shut is hidden, so a step that names one (below) is only ever lit while it is open. On a phone the bar slips away as the text is read on;
 *  the tour brings it back and holds it for a moment each time it lights a control (Tour.tsx, holdBars). */
const FOOT = t("[data-foot-bar]");
const OPEN_TEXT = t('button[aria-controls$="-aa"][aria-expanded="false"]');
const OPEN_STUDY = t('button[aria-controls$="-study"][aria-expanded="false"]');
const OPEN_GOTO = t('button[aria-controls$="-goto"][aria-expanded="false"]');
const TEXT_MENU = t('[id$="-aa"]');
const GOTO_MENU = t('[id$="-goto"]');
/** a group of Study's rows, by its heading ("Edition and translation") */
const STUDY_GROUP = (heading: string) => t('[id$="-study"] section', heading);

export const TOURS: Record<string, Tour> = {
  learn: {
    id: "learn",
    title: "Learn Greek",
    start: "/academy",
    steps: [
      { at: [t('a.btn[href^="/academy/reading/"]'), t('a.btn[href^="/academy/lesson/"]')], title: "The Academy: your next lesson", text: "Your next lesson is always here. If you know no Greek, it is the first: the twenty-four letters, and six names you already know to sound out." },
      { at: [t('section[aria-labelledby="reading-title"] ol')], title: "Learn by reading", text: "Each lesson is one real line, from the sayings carved at Delphi to the first sentence of Aristotle's Metaphysics: its letters, its words, how it is built, then you read it yourself. A practice lesson comes after every three." },
      { at: [t('section[aria-labelledby="tools-title"] a[href="/academy/today"]'), t('a[href="/academy/today"]')], title: "A little every day", text: "Today's session brings back a lesson when it is due for a refresh, then one question on endings and one real sentence." },
      { at: [t('section[aria-labelledby="lessons-title"] a[href^="/academy/lesson/"]')], title: "The grammar course", text: "The second track teaches the grammar in order, from the alphabet to Homer. Each lesson explains one thing with real sentences, then checks it with a short test." },
      { at: [t('section[aria-labelledby="guides-title"] a[href^="/academy/guide/"]')], title: "Practical guides", text: "Which Greek is which, how a dictionary lists a word, and which dictionary to use." },
    ],
  },

  find: {
    id: "find",
    title: "Find a text",
    start: "/library",
    steps: [
      { at: [t("#library-search")], title: "The Mouseion: search the library", text: "Type an author or a title. Titles can be typed in Greek too, and accents and capitals don't matter: «iliad», «ιλιας» or Ἰλιάς all find the Iliad." },
      { at: [t('[role=radiogroup][aria-label="Show"]')], title: "With or without English", text: "Show every work, only the ones with an English translation beside the Greek, or only Greek." },
      { at: [t("details summary", "Not sure where to begin")], title: "Not sure where to begin?", text: "Our suggestions, from the easiest Greek to the hardest. Beside each work, a small meter shows how hard its words are: one bar for easy words, three for many rare ones." },
      { click: [t("#library-filters:not([open]) > summary")], at: [t('[role=group][aria-label="Kind of writing"]')], title: "Kinds of writing", text: "Narrow the shelves to epic, drama, history, philosophy and the rest. More filters choose a period, a dialect, or how hard the vocabulary is." },
      // the quiet desk, the guide (the owner, 2026-10-31): a title opens on the Greek alone, not the Greek and the English side by side
      { at: [t('#author-tlg0012 a[href^="/read?w="]'), t("#author-tlg0012")], title: "Open a work", text: "Click an author to see their works, those with English first. Click a title and it opens in the reader on the Greek alone: Show the English, under each passage, opens the translation.", phoneText: "Tap an author to see their works, those with English first. Tap a title and it opens in the reader on the Greek alone: Show the English, under each passage, opens the translation." },
    ],
  },

  read: {
    id: "read",
    title: "Read a text",
    start: "/read?w=tlg0012.tlg001&at=1.1",
    steps: [
      // the quiet desk, the guide (the owner, 2026-10-31): a book opens on the Greek alone, with "Show the English" under each passage; one bar along the foot
      // holds Library, where you are (Go to), Text (the columns, the page, the size of the Greek, the space between lines) and Study (every other tool)
      { at: [t('section[data-key="1.1"]')], title: "A book opens on the Greek alone", text: "Each block is one passage. The number at its start is its reference, here Iliad book 1, line 1. Under the Greek, Show the English opens that passage's translation, and Hide the English puts it away." },
      { at: [FOOT], title: "One bar at the foot of the page", text: "Library goes back to the library. The middle says where you are. Text sets the look of the page. Study holds every other tool.", phoneText: "Library goes back to the library. The middle says where you are. Text sets the look of the page. Study holds every other tool. As you read on, the bar slips away; it comes back when you scroll up or tap the page." },
      { click: [OPEN_TEXT], at: [TEXT_MENU], title: "Text: the columns and the look of the page", text: "Text holds the columns: Greek, Both (the English beside the Greek) or English. It also holds the page (Follow device, Paper or Night), the size of the Greek and the line spacing. Your choices are kept on this device, for every book." },
      { esc: true, click: [OPEN_STUDY], at: [STUDY_GROUP("Edition and translation")], title: "Editions and translations", text: "Many works have more than one Greek edition or translation. Under Study, Edition and translation has a list for the Greek text and one for the translation. The site remembers your choice for each book." },
      { esc: true, click: [OPEN_GOTO], at: [GOTO_MENU], title: "Go to a passage", text: "The middle of the bar says where you are, and opens this box. Page lists the parts of the book, so you can turn to one. Or type a reference, like 6.237 for book 6, line 237, and press Go." },
      { esc: true, at: [t("button", "Continue to")], title: "Turn the page", text: "Long works come a book or a chapter at a time. Continue, at the foot of the page, turns to the next one, and the arrow keys turn the pages too.", phoneText: "Long works come a book or a chapter at a time. Continue, at the foot of the page, turns to the next." },
    ],
  },

  word: {
    id: "word",
    title: "Look up a word",
    start: "/read?w=tlg0012.tlg001&at=1.1",
    steps: [
      { at: [t('[data-u="1.1"] [data-w]')], advance: [LOOKUP], title: "Look up any Greek word", text: "Every word in the Greek can be looked up. Try it: click μῆνιν, “wrath”, the first word of the Iliad (or press Next).", phoneText: "Every word in the Greek can be looked up. Try it: tap μῆνιν, “wrath”, the first word of the Iliad (or press Next)." },
      // the quiet desk, the guide (the owner, 2026-10-31): the first view is the dictionary form, the kind of word, one meaning, the word's job in this sentence and its
      // form, with Previous and Next; "More about it" opens the second view, which holds the whole LSJ entry and Go further
      {
        click: [t('[data-u="1.1"] [data-w]')],
        at: [LOOKUP],
        title: "What the look-up shows",
        text: "The look-up opens beside the text. It shows the word's dictionary form, what kind of word it is, its meaning, its job in this sentence and its form. Previous and Next step from word to word.",
        phoneText: "The look-up opens as a sheet at the foot of the screen. It shows the word's dictionary form, what kind of word it is, its meaning, its job in this sentence and its form. Previous and Next step from word to word.",
      },
      {
        // Go further is behind "More about it": open it first
        click: [t(`${LOOKUP.sel} button`, "More about it")],
        at: [t(`${LOOKUP.sel} ul[class*="ways"]`)],
        title: "Go further",
        text: "More about it opens the whole entry from LSJ (Liddell–Scott–Jones), the great Greek–English dictionary. Go further, below it, leads on from the word: where else it comes in the book, how the sentence is built, a lesson on its form when there is one, and Word Study, every form of the word. Back returns to the first view; × closes the look-up.",
      },
    ],
  },

  aids: {
    id: "aids",
    title: "Reading aids",
    start: "/read?w=tlg0012.tlg001&at=1.1",
    steps: [
      // the quiet desk, the guide (the owner, 2026-10-31): Study holds every tool in groups (Reading help, Go deeper, Edition and translation, More). The steps point only at rows
      // the Iliad shows: "Try it first" is there only with the Greek and the English side by side, so it is in the chapter and not in the tour
      { at: [t('button[aria-controls$="-study"]')], title: "Reading aids", text: "Study, at the foot of the page, holds every reading tool, in groups: Reading help, then Go deeper, then Edition and translation. Some rows have a switch at the right: press the row to turn it on, and press it again to turn it off. A number beside Study says how many switches are on." },
      // open Study so the next steps can point inside it (it stays open while the tour steps through)
      { click: [OPEN_STUDY], at: [t("button[data-tool=translit]")], title: "Transliteration", text: "Shows each line in Latin letters, under the Greek, so you can sound it out." },
      { at: [t("button[data-tool=cases]")], title: "Colour by case", text: "A Greek word's ending shows its job in the sentence: its case. This underlines each word in the colour of its case, so you can see who does what to whom. A key to the colours appears at the top of the page." },
      { at: [t("button[data-tool=metre]")], title: "Metre", text: "Marks which syllables of a line of verse are long and which are short, and where its beats (feet) and its pause (caesura) fall, so you can see its rhythm. Only books of verse have it. A key to the marks appears at the top of the page." },
      { at: [t("button[data-tool=vocab]")], title: "The page's vocabulary", text: "Lists the words on this page, the ones used most first, with their meanings." },
      { at: [t("button[data-tool=find]")], title: "Find in this text", text: "Search the whole book for a word or a phrase, in Greek or in English. Press Ctrl+F to open it from the keyboard.", phoneText: "Search the whole book for a word or a phrase, in Greek or in English." },
      { at: [t("button[data-tool=listen]")], title: "Listen", text: "Hear the English read aloud, passage by passage, the word being read lit as it goes. With the Greek alone, each passage's English opens as it is read." },
      { at: [t("button[data-tool=places]")], with: [t("button[data-tool=ms]")], title: "Places and manuscripts", text: "Places on this page shows the places the page names on a map. How it was written shows the passage as a scribe would have written it by hand, in capitals without spaces, and for some works on a real medieval manuscript page." },
    ],
  },

  keep: {
    id: "keep",
    title: "Keep what you find",
    start: "/read?w=tlg0012.tlg001&at=1.1",
    steps: [
      { at: [t('button[data-row="1.1"]')], advance: [ACTIONS], title: "Keep a passage", text: "To keep a passage, click its number or select some of its words. Try it: click 1.1 (or press Next).", phoneText: "To keep a passage, tap its number or press and hold a word. Try it: tap 1.1 (or press Next)." },
      // the quiet desk, the guide (the owner, 2026-10-31): the passage strip, in the order of what you do with a place: keep it (Bookmark, Favourite, Note, four colours), then take it
      // elsewhere (Notebook, Share, Echoes), and × last
      {
        click: [t('button[data-row="1.1"]')],
        at: [ACTIONS],
        title: "The passage strip",
        text: "Bookmark marks the place. Favourite adds it to your favourite passages. Note lets you write on it, and the four colours highlight it. Notebook adds it, with its citation, to a research notebook. Share copies it as a link, as text or as an image. Echoes shows where else these words come. × closes the strip.",
      },
      // (one book has no site header: the light falls on the row of Study that lists your marks; two books keep the header, and the light falls on its Treasury link)
      { esc: true, click: [OPEN_STUDY], at: [t('header a[href="/treasury"]'), t("button[data-tool=marks]")], title: "The Treasury", text: "Your notes and marks, under Study at the foot of the page, lists what you have kept in this book. Everything you keep also goes to the Treasury: notes, favourite passages (your anthology), bookmarks, highlights, words and notebooks, ready to download or print. It is kept in this browser; sign in to keep it in step across your devices." },
    ],
  },

  explore: {
    id: "explore",
    title: "Explore the Greek world",
    start: "/stoa",
    steps: [
      { at: [t('nav[aria-labelledby="explore-h"] a[href="/stoa/periplus"]')], title: "The Periplus: the map", text: "The places the texts name, on a map you can pan and zoom, with the passages that mention each one." },
      { at: [t('nav[aria-labelledby="explore-h"] a[href="/stoa/census"]')], title: "The Census", text: "The people, gods, places and things in the texts, counted: who is mentioned most, and where." },
      { at: [t('nav[aria-labelledby="explore-h"] a[href="/stoa/kerameikos"]')], title: "The Kerameikos", text: "Archaeology: what digging, broken pots and graves tell us about the Greeks." },
      { at: [t('main a[class*="featured"]'), t('input[aria-label="Search the Painted Stoa"]')], title: "The Painted Stoa", text: "Articles on the Greek world, its people, ideas and everyday life, each with its sources and links into the texts. Here is one of them." },
      { at: [t('nav[aria-labelledby="ref-h"] a[href="/stoa/authors"]')], with: [t('nav[aria-labelledby="ref-h"] a[href="/stoa/eras"]'), t('nav[aria-labelledby="ref-h"] a[href="/stoa/editions"]')], title: "Authors, eras and editions", text: "Every author with their works and dates, the centuries of Greek, and the printed editions behind the texts." },
    ],
  },

  search: {
    id: "search",
    title: "Search everything",
    start: "/search?q=%CE%BC%E1%BF%86%CE%BD%CE%B9%CE%BD&o=date",
    steps: [
      { at: [t("#oracle-q")], title: "The Oracle: search every text", text: "Type Greek, or Greek in Latin letters: «menin» finds μῆνιν." },
      { at: [t('[role=tablist][aria-label="What to search"]')], title: "What to look for", text: "An exact Greek form; a dictionary word in all its forms (λόγος also finds λόγου, λόγοις…); or the English translations." },
      { at: [t('[role=radiogroup][aria-label="Show the results"]')], title: "Three ways to see the results", text: "By work; as a concordance, a list with every match lined up down the middle; or as statistics, by author and by century." },
      { at: [t('aside[aria-label="Narrow the search"]')], title: "Narrow it down", text: "Keep to one author, one work or one period." },
    ],
  },

  talk: {
    id: "talk",
    title: "Ask and argue",
    start: "/town-hall",
    steps: [
      { at: [t('nav[aria-label="Categories"]')], title: "The Agora", text: "Ask a question about a passage, share what you are reading, report a bug or suggest an idea." },
      { at: [t('main a[href^="/town-hall/new"]'), t("main p", "Sign in or join")], title: "Join in", text: "Anyone can read the conversations. To start one or reply, sign in or join; it is free." },
      { at: [t('main a[href="/town-hall/pnyx"]')], title: "The Pnyx", text: "Debates: someone proposes a motion, members argue for and against, and vote." },
    ],
  },

  settings: {
    id: "settings",
    title: "Make it yours",
    start: "/",
    steps: [
      { at: [t('header button[aria-label="Search"]')], title: "Search from anywhere", text: "Find a work, an author, a page of the site or a Greek word. Ctrl+K opens it on any page.", phoneText: "Find a work, an author, a page of the site or a Greek word, from any page." },
      { click: [MENU], at: [t('header button[aria-label="Settings"]')], title: "Settings", text: "The page (Paper, Night, or as your device is set), the size of the Greek and the line spacing." },
      { click: [MENU], at: [t('button[aria-label^="Connection:"]')], title: "Offline reading", text: "The light is green when you are online. Click it for offline reading: keeping texts on this device so they open without a connection.", phoneText: "The light is green when you are online. Tap it for offline reading: keeping texts on this device so they open without a connection." },
      { click: [MENU], at: [t('header a[href="/account"]')], title: "Your account", text: FORUM_OPEN ? "Optional. With an account your notes and progress follow you from device to device, and you can join in at the Agora."
        : "Optional. With an account your notes and progress follow you from device to device." },
    ],
  },
};

/** The Guide's chapters, in order, with the tour each one shows. */
export const CHAPTER_ORDER = (["learn", "find", "read", "word", "aids", "keep", "explore", "search", "talk", "settings"] as const)
  .filter((id) => FORUM_OPEN || id !== "talk");
