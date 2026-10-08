/**
 * The "Show me" tours of The Guide (/guide): each opens a real page and points at its controls one at a time
 * (components/tour/Tour.tsx draws the light and the card). A tour lives on one page; it starts from the Guide's
 * "Show me" button, or from any link carrying ?tour=<id>.
 *
 * A target is a CSS selector, optionally with words its text must contain; the first one that is showing on
 * the screen is used, so a step can name the wide-screen control and its phone twin. A step whose control is
 * not on the page (no translation, signed out, nothing found) is skipped rather than shown pointing at nothing.
 */
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

export const TOURS: Record<string, Tour> = {
  learn: {
    id: "learn",
    title: "Learn Greek",
    start: "/academy",
    steps: [
      { at: [t('section[aria-label="The alphabet"] [role=listbox]'), t('section[aria-label="The alphabet"]')], title: "The Academy: begin with the letters", text: "Twenty-four letters. Choose one to see its name and hear it. You need no Greek at all to start here.", phoneText: "Twenty-four letters. Tap one to see its name and hear it. You need no Greek at all to start here." },
      { at: [t('section[aria-label="The alphabet"] [role=radiogroup][aria-label="Pronunciation"]')], title: "Three ways to say them", text: "As Athenians most probably spoke in the 5th and 4th centuries BC; the Erasmian way, used in Western schools since the 16th century; or with the sounds of modern Greek." },
      { at: [t('section[aria-labelledby="lessons-title"] a[href^="/academy/lesson/"]')], title: "Start with lesson 1", text: "Each lesson teaches one thing with real sentences from the texts, then checks it with a few questions." },
      { at: [t('section[aria-labelledby="tools-title"] a[href="/academy/today"]'), t('a[href="/academy/today"]')], title: "A little every day", text: "Today's session mixes practice with the words you are learning, each brought back just as you would start to forget it." },
      { at: [t('section[aria-labelledby="guides-title"] a[href^="/academy/guide/"]')], title: "Practical guides", text: "Which Greek is which, how a dictionary lists a word, and which dictionary to use." },
    ],
  },

  find: {
    id: "find",
    title: "Find a text",
    start: "/library",
    steps: [
      { at: [t("#library-search")], title: "The Mouseion: search the library", text: "Type an author or a title. Titles can be typed in Greek too, and accents and capitals don't matter: «iliad», «ιλιας» or Ἰλιάς all find the Iliad." },
      { at: [t('[role=radiogroup][aria-label="Translation"]')], title: "With or without English", text: "Show every work, only the ones with an English translation beside the Greek, or only Greek." },
      { at: [t("details summary", "Not sure where to begin")], title: "Not sure where to begin?", text: "Our suggestions, from the easiest Greek to the hardest. Under each work, “common words” says how much of its text is the commonest Greek: the higher, the easier." },
      { at: [t('[role=group][aria-label="Kind of writing"]')], title: "Kinds of writing", text: "Narrow the shelves to epic, drama, history, philosophy and the rest. More filters choose a period, a dialect, or how hard the vocabulary is." },
      { at: [t('#author-tlg0012 a[href^="/read?w="]'), t("#author-tlg0012")], title: "Open a work", text: "Each author lists their works. Click a title and it opens in the Scroll, the reader, with the Greek and the English side by side.", phoneText: "Each author lists their works. Tap a title and it opens in the Scroll, the reader, with the Greek and the English side by side." },
    ],
  },

  read: {
    id: "read",
    title: "Read in the Scroll",
    start: "/read?w=tlg0012.tlg001&at=1.1",
    steps: [
      { at: [t('section[data-key="1.1"]')], title: "The Scroll: Greek beside English", text: "Each row is one passage: the Greek on the left, the translation of the same lines on the right. The number at the start is its reference, here Iliad book 1, line 1.", phoneText: "Each row is one passage: the Greek, then the translation of the same lines. The number at the start is its reference, here Iliad book 1, line 1." },
      { at: [t('[role=radiogroup][aria-label="Columns"]')], title: "One column or two", text: "Read the Greek and the English together, or only one of them. The choice is kept for this book." },
      { at: [t("label", "Greek text")], with: [t("label", "Translation")], title: "Editions and translations", text: "Many works have more than one Greek edition or translation. Choose them here; the site remembers your choice." },
      { at: [t("#reader-goto")], only: "wide", title: "Go to a passage", text: "Type a reference, like 6.237 for book 6, line 237, and press Go." },
      { at: [t('[data-readbar] button[aria-haspopup="dialog"]')], only: "phone", title: "Contents", text: "The button with the book's name opens the contents: every book of the work, a box to go to any passage, and your marks." },
      { at: [t('button[aria-label="Next page"]'), t('[data-readbar] button[aria-label^="Next"]')], title: "Turn the page", text: "Long works come a book or a chapter at a time. The arrow keys turn the pages too.", phoneText: "Long works come a book or a chapter at a time. These arrows turn the pages." },
    ],
  },

  word: {
    id: "word",
    title: "Look up a word",
    start: "/read?w=tlg0012.tlg001&at=1.1",
    steps: [
      { at: [t('[data-u="1.1"] [data-w]')], advance: [LOOKUP], title: "Look up any Greek word", text: "Every word in the Greek can be looked up. Try it: click μῆνιν, “wrath”, the first word of the Iliad (or press Next).", phoneText: "Every word in the Greek can be looked up. Try it: tap μῆνιν, “wrath”, the first word of the Iliad (or press Next)." },
      {
        click: [t('[data-u="1.1"] [data-w]')],
        at: [LOOKUP],
        title: "What the word is",
        text: "Its dictionary form, its grammar here (for a noun: its case, the ending that shows its job in the sentence, and singular or plural), and its meaning from LSJ (Liddell–Scott–Jones), the great Greek–English dictionary. “Checked by hand” means a scholar confirmed the analysis.",
      },
      {
        at: [t(`${LOOKUP.sel} button`, "sentence")], with: [t(`${LOOKUP.sel} button`, "Echoes"), t(`${LOOKUP.sel} button`, "Word Study")],
        title: "More from here",
        text: "See how the whole sentence is built, find every other place the word appears, or study the word in depth.",
      },
    ],
  },

  aids: {
    id: "aids",
    title: "Reading aids",
    start: "/read?w=tlg0012.tlg001&at=1.1",
    steps: [
      { at: [t('[role=group][aria-label="Reading aids"]'), t('button[aria-controls="read-aids"]')], title: "Reading aids", text: "Help for when the Greek is hard: each one switches on and off.", phoneText: "Help for when the Greek is hard, under Aids: each one switches on and off." },
      // on a phone, open the Aids sheet so the next steps can point inside it
      { click: [t('button[aria-controls="read-aids"][aria-expanded="false"]')], at: [t("button[aria-pressed]", "Transliteration")], title: "Transliteration", text: "Shows each Greek word in Latin letters beneath it, so you can sound it out." },
      { at: [t("button[aria-pressed]", "Colour by case")], title: "Colour by case", text: "A Greek word's ending shows its job in the sentence (its case): who acts, who or what is acted on, whose it is. This colours each word by its case, so you can see who does what to whom." },
      { at: [t("button[aria-pressed]", "Vocabulary")], title: "The page's vocabulary", text: "Lists the words on this page, the ones used most first, with their meanings." },
      { at: [t("button[aria-pressed]", "Try it first")], title: "Try it first", text: "Hides each translation until you ask for it, so you read the Greek yourself first. A good way to learn." },
      { at: [t('button[title^="Find a word or phrase"]'), t("#read-aids button", "Find")], title: "Find in this text", text: "Search the whole book for a word or a phrase, in Greek or in English. Press / or Ctrl+F.", phoneText: "Search the whole book for a word or a phrase, in Greek or in English." },
      { at: [t('button[title^="Hear the English translation"]'), t("#read-aids button", "Listen")], title: "Listen", text: "Hear the English read aloud, passage by passage, with each passage marked as it is read." },
      { at: [t("button[aria-pressed]", "Places")], with: [t("button[aria-pressed]", "Manuscript")], title: "Places and manuscripts", text: "Places puts the places on the page on a map. Manuscript shows the passage as it would have been written by hand, in capitals without spaces, and for some works on a real medieval manuscript page." },
    ],
  },

  keep: {
    id: "keep",
    title: "Keep what you find",
    start: "/read?w=tlg0012.tlg001&at=1.1",
    steps: [
      { at: [t('button[data-row="1.1"]')], advance: [ACTIONS], title: "Passage actions", text: "To keep a passage, click its number or select some of its words. Try it: click 1.1 (or press Next).", phoneText: "To keep a passage, tap its number or press and hold a word. Try it: tap 1.1 (or press Next)." },
      {
        click: [t('button[data-row="1.1"]')],
        at: [ACTIONS],
        title: "Keep what you find",
        text: "Bookmark it, highlight it in one of four colours, write a note on it, or add it to a research notebook with its citation.",
      },
      { esc: true, at: [t('header nav[aria-label="Areas of the site"] a[href="/treasury"]'), t('nav[style*="site-tabbar"] a[href="/treasury"]')], title: "The Treasury", text: "Everything you keep goes to the Treasury, My Library: notes, bookmarks, highlights, words and notebooks, ready to download or print. It is kept in this browser; sign in to keep it in step across your devices." },
    ],
  },

  explore: {
    id: "explore",
    title: "Explore the Greek world",
    start: "/stoa",
    steps: [
      { at: [t('main a[class*="featured"]'), t('input[aria-label="Search the Painted Stoa"]')], title: "The Painted Stoa", text: "Articles on the Greek world, its people, ideas and everyday life, each with its sources and links into the texts. Here is one of them." },
      { at: [t('nav[aria-labelledby="ref-h"] a[href="/stoa/authors"]')], with: [t('nav[aria-labelledby="ref-h"] a[href="/stoa/eras"]'), t('nav[aria-labelledby="ref-h"] a[href="/stoa/editions"]')], title: "Authors, eras and editions", text: "Every author with their works and dates, the centuries of Greek, and the printed editions behind the texts." },
      { at: [t('nav[aria-labelledby="ref-h"] a[href="/stoa/periplus"]')], title: "The Periplus: the map", text: "The places the texts name, on a map you can pan and zoom, with the passages that mention each one." },
      { at: [t('nav[aria-labelledby="ref-h"] a[href="/stoa/census"]')], title: "The Census", text: "The people, gods, places and things in the texts, counted: who is mentioned most, and where." },
      { at: [t('main a[href="/stoa/kerameikos"]')], title: "The Kerameikos", text: "Archaeology: what digging, broken pots and graves tell us about the Greeks." },
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
      { at: [t('nav[aria-label="Categories"]')], title: "The Town Hall", text: "Ask a question about a passage, share what you are reading, report a bug or suggest an idea." },
      { at: [t('main a[href^="/town-hall/new"]'), t("main p", "Sign in or join")], title: "Join in", text: "Anyone can read the conversations. To start one or reply, sign in or join; it is free." },
      { at: [t('main a[href="/town-hall/pnyx"]')], title: "The Pnyx", text: "Debates: someone proposes a motion, members argue for and against, and vote." },
    ],
  },

  settings: {
    id: "settings",
    title: "Make it yours",
    start: "/",
    steps: [
      { at: [t('button[aria-label="The Oracle: Search"]'), t('nav[style*="site-tabbar"] button[aria-haspopup="dialog"]')], title: "Search from anywhere", text: "Find a work, an author, a page of the site or a Greek word. Ctrl+K opens it on any page.", phoneText: "Find a work, an author, a page of the site or a Greek word, from any page." },
      { at: [t('button[aria-label="Settings"]')], title: "Settings", text: "Light or dark (Auto follows your device), the Greek and English typefaces, text size and line spacing, and less animation if you prefer. Offline reading is here too." },
      { at: [t('button[aria-label^="Connection:"]')], title: "The connection light", text: "Green when you are online. Click it for offline reading: keeping texts on this device so they open without a connection.", phoneText: "Green when you are online. Tap it for offline reading: keeping texts on this device so they open without a connection." },
      { at: [t('header a[href="/account"]')], title: "Your account", text: "Optional. With an account your notes and progress follow you from device to device, and you can join in at the Town Hall." },
    ],
  },
};

/** The Guide's chapters, in order, with the tour each one shows. */
export const CHAPTER_ORDER = ["learn", "find", "read", "word", "aids", "keep", "explore", "search", "talk", "settings"] as const;
