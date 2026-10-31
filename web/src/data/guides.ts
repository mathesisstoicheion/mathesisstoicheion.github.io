/**
 * Practical guides in the Academy: finding your way among the kinds of Greek, dictionaries and the
 * site's own look-up. Written for this site (nothing is taken from the old one); every fact about the
 * language or a book rests on a source in `sources`, and every Greek form or quotation comes from the
 * library's texts, LSJ (Perseus's copy, which the site uses) or GLAUx's hand-checked analysis.
 *
 * Built from the lessons' sections (lessons.ts), with the same conventions: «…» Greek, **…** bold,
 * *…* italic. "real" passages are read from the source files, and the lesson test checks their quotes.
 */
import type { Section } from "./lessons";

export interface Guide {
  id: string;
  title: string;
  greek: string;
  summary: string;
  minutes: number;
  sections: Section[];
  /** what each fact rests on */
  sources: { label: string; url: string }[];
}

export const GUIDES: Guide[] = [
  {
    id: "which-greek", title: "Which Greek?", greek: "διάλεκτοι", minutes: 8,
    summary: "Homer, Herodotus, the Athenians and the New Testament: how their Greek differs, and what to expect.",
    sections: [
      { kind: "p", text: "There was never just one Ancient Greek. Greek was spoken in many dialects, grouped by scholars as **Doric** in the west, **Aeolic** and **Arcado-Cypriot** in the centre, and **Attic** and **Ionic** in the east, and the books in this library were written over more than a thousand years. They are all Greek: the letters and most words are shared, and the first differences you notice are mostly in vowels and in some endings." },
      { kind: "grid", title: "The kinds of Greek you will meet", head: ["Kind", "Who wrote in it", "Look out for"], rows: [
        ["**Homer's Greek**", "The Iliad and the Odyssey: a language of poetry, mainly an old form of Ionic with some Aeolic and a few Arcado-Cypriot features", "η where Attic has ᾱ; genitives in «-εω» («Πηληϊάδεω», Iliad 1.1); datives in «-εσσι» («κύνεσσιν», 1.4); past tenses sometimes without their augment («τεῦχε», 1.4)"],
        ["**Ionic**", "Herodotus", "η even after ε, ι and ρ, where Attic keeps ᾱ: «ἱστορίης», «αἰτίην» for Attic «ἱστορίας», «αἰτίαν»"],
        ["**Attic**", "Athens: the tragedians, the orators, Plato, Aristotle, Xenophon", "the forms the grammars and this Academy's tables give"],
        ["**Doric colouring**", "Choral songs, as in Pindar, and the sung parts of tragedy", "ᾱ where Attic has η: «ἀέλιος» for «ἥλιος», the sun"],
        ["**Aeolic**", "Sappho and Alcaeus of Lesbos", "in literature, a dialect of lyric poetry only"],
        ["**Koine**, the “common” Greek", "From Alexander's conquests on: the Septuagint, the New Testament, Polybius, Plutarch, Marcus Aurelius", "Attic at heart; used from about 300 BC to AD 600"],
      ], note: "The dialect groups and writers: Wikipedia's pages on the Ancient Greek dialects, Homeric Greek and Koine Greek (see the sources below)." },
      { kind: "real", title: "Four openings, four kinds of Greek", items: [
        { work: "tlg0012.tlg001", ref: "1.1", quote: "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος", label: "Homer, Iliad 1.1", note: "«Πηληϊάδεω» “son of Peleus” has Homer's genitive in «-εω»." },
        { work: "tlg0016.tlg001", ref: "1.1.0", quote: "Ἡροδότου Ἁλικαρνησσέος ἱστορίης ἀπόδεξις ἥδε", label: "Herodotus, the first sentence", note: "Ionic «ἱστορίης»: an Athenian would write «ἱστορίας»." },
        { work: "tlg0032.tlg006", ref: "1.1.1", quote: "Δαρείου καὶ Παρυσάτιδος γίγνονται παῖδες δύο", label: "Xenophon, Anabasis 1.1.1", note: "Plain Attic prose, the Greek the grammars describe." },
        { work: "tlg0031.tlg004", ref: "1.1", quote: "ἦν ὁ λόγος", label: "John 1.1", note: "Koine: the Greek of the New Testament." },
      ] },
      { kind: "grid", title: "One word, three ways: “the sun”", head: ["Greek", "Form", "Where"], rows: [
        ["Homer (epic)", "«ἠέλιος»", "always in Homer: «λαμπρὸν φάος ἠελίοιο», Iliad 1.605"],
        ["Doric colouring", "«ἀέλιος»", "Pindar, and the sung parts of tragedy: «ἀκτὶς ἀελίου», Sophocles, Antigone 100"],
        ["Attic", "«ἥλιος»", "«τελευταῖον δὴ οἶμαι τὸν ἥλιον», Plato, Republic 7.516"],
      ], note: "The forms and where they are used: LSJ's entry «ἥλιος». Each example is in the library; open it in the reader." },
      { kind: "tip", text: "You do not need to learn the dialects before you read. The look-up gives the dictionary word for Homer's and Herodotus' forms too: click «Ἀχιλῆος» in Iliad 1.1 and it answers «Ἀχιλλεύς»." },
      { kind: "check", items: [
        { q: "Herodotus writes «ἱστορίης». How does an Athenian write it?", options: ["«ἱστορίας»", "«ἱστορίεω»", "«ἱστορίοιο»"], answer: 0, why: "After ι Attic keeps the long α that Ionic turns into η." },
        { q: "In which kind of Greek is the New Testament written?", options: ["Homer's Greek", "Koine", "Aeolic"], answer: 1, why: "The New Testament is in Koine, the common Greek that grew from Attic after Alexander." },
      ] },
      { kind: "links", items: [
        { href: "/stoa/eras", label: "Greek through the centuries", note: "the Painted Stoa's Eras page: authors and works century by century" },
        { href: "/library", label: "The library by dialect", note: "the Mouseion's filters include the dialect of each work" },
      ] },
    ],
    sources: [
      { label: "Wikipedia, Ancient Greek dialects (the groups; which writers used which; η for ᾱ in Ionic and Attic)", url: "https://en.wikipedia.org/wiki/Ancient_Greek_dialects" },
      { label: "Wikipedia, Homeric Greek (its mixture of dialects; genitives in -εω, datives in -εσσι, missing augments)", url: "https://en.wikipedia.org/wiki/Homeric_Greek" },
      { label: "Wikipedia, Koine Greek (the name, “common”; its dates, its Attic core, what was written in it)", url: "https://en.wikipedia.org/wiki/Koine_Greek" },
      { label: "LSJ, the entry ἥλιος (the epic, Doric and Attic forms), on Logeion", url: "https://logeion.uchicago.edu/%E1%BC%A5%CE%BB%CE%B9%CE%BF%CF%82" },
    ],
  },

  {
    id: "dictionary-form", title: "How a dictionary lists a word", greek: "τὸ λῆμμα", minutes: 10,
    summary: "Why you look up τίθημι to find ἔθηκε, how to read the head of an entry, and how to find the dictionary form yourself.",
    sections: [
      { kind: "p", text: "A Greek word changes its ending with its work in the sentence, so one word can have dozens of forms. A dictionary cannot list them all, so it lists each word once, under one form: the **dictionary form**, or headword. In the first four lines of the Iliad, «ἔθηκε» is found under «τίθημι», and «κύνεσσιν» under «κύων»." },
      { kind: "grid", title: "What the head of an entry tells you (as LSJ prints it)", head: ["Kind of word", "Headword", "What it means"], rows: [
        ["Noun", "«λόγος, ὁ»", "the nominative singular, then the article: «ὁ» masculine, «ἡ» feminine, «τό» neuter"],
        ["Noun that changes its stem", "«ἀνήρ, ὁ, ἀνδρός»", "the genitive as well, since the stem («ἀνδρ-») is not the nominative's"],
        ["Noun of both genders", "«κύων, ὁ and ἡ … gen. κυνός»", "“dog” can be masculine or feminine"],
        ["Adjective", "«ἀγαθός, ή, όν»", "the masculine, then the endings of the feminine («ἀγαθή») and the neuter («ἀγαθόν»)"],
        ["Verb", "«τίθημι», «ἀείδω»", "the first person singular of the present, “I place”, “I sing”; the meaning is given simply: “set, put, place”"],
      ], note: "Headwords copied from LSJ, the dictionary the site's look-up uses (its marks for long and short vowels left out)." },
      { kind: "p", text: "**Getting from a form to its headword.** Take off the ending (the tables of forms show them). A past tense usually begins with an **augment**, «ἐ-»: take that off too, so «ἔθηκε» “placed” leads to «θη-», the stem of «τίθημι». Homer often leaves the augment out: «τεῦχε» is a past tense of «τεύχω». And a few common words change their stem altogether, as «Διός», the genitive of «Ζεύς», or «ἀνδρῶν» from «ἀνήρ»; dictionaries print such forms at the head of the entry." },
      { kind: "reveal", title: "Find the dictionary word (all from Iliad 1.1–7)", items: [
        { grc: "μῆνιν", answer: "μῆνις, “wrath”: accusative" },
        { grc: "ψυχὰς", answer: "ψυχή, “life, spirit”: accusative plural" },
        { grc: "ἔθηκε", answer: "τίθημι, “set, put, place”: aorist" },
        { grc: "κύνεσσιν", answer: "κύων, “dog”: dative plural, Homer's ending" },
        { grc: "τεῦχε", answer: "τεύχω, “make”: past tense without its augment" },
        { grc: "ἀνδρῶν", answer: "ἀνήρ, “man”: genitive plural" },
        { grc: "Διὸς", answer: "Ζεύς: genitive" },
        { grc: "Ἀχιλῆος", answer: "Ἀχιλλεύς: genitive, Homer's form" },
      ] },
      { kind: "p", text: "The answers are GLAUx's analysis of these lines, checked by hand; the meanings are the first senses in LSJ." },
      { kind: "real", title: "Try it in the text", items: [
        { work: "tlg0012.tlg001", ref: "1.1", quote: "μῆνιν ἄειδε θεὰ", label: "Iliad 1.1–4", note: "Click any word: the look-up shows its dictionary form, worked out for this very place." },
      ] },
      { kind: "tip", text: "On this site the look-up does this for you. Doing it by hand a few times is still the quickest way to learn the endings, and it is what you do with a printed dictionary." },
      { kind: "check", items: [
        { q: "Under which word would you look up «ἔθηκε»?", options: ["«ἔθηκα»", "«τίθημι»", "«θήκη»"], answer: 1, why: "Verbs are listed under the first person singular of the present." },
        { q: "The head of an entry reads «ἀγαθός, ή, όν». What are «ή» and «όν»?", options: ["The endings of the feminine and the neuter", "Two other meanings", "The genitive and the dative"], answer: 0, why: "Adjectives give the masculine, then the feminine and neuter endings." },
      ] },
      { kind: "links", items: [
        { href: "/academy/tables", label: "Tables of forms", note: "every ending, checked against real texts" },
        { href: "/academy/lesson/past-tenses", label: "The past: imperfect and aorist", note: "the lesson on the augment" },
      ] },
    ],
    sources: [
      { label: "LSJ (Liddell, Scott and Jones, A Greek–English Lexicon), the Perseus Digital Library's copy used by this site: the entries λόγος, ἀνήρ, κύων, ἀγαθός, τίθημι, ἀείδω, μῆνις, ψυχή, τεύχω", url: "https://github.com/PerseusDL/lexica" },
      { label: "GLAUx (A. Keersmaekers): the hand-checked analysis of Iliad 1.1–7", url: "https://github.com/alekkeersmaekers/glaux" },
    ],
  },

  {
    id: "which-dictionary", title: "Which dictionary?", greek: "λεξικά", minutes: 7,
    summary: "The great Greek dictionaries, what each is for, and which ones you can use free online.",
    sections: [
      { kind: "p", text: "Every reader of Greek ends up with a favourite dictionary. Here are the ones you will hear about, what each is for, and where to find them." },
      { kind: "grid", title: "The dictionaries", head: ["Dictionary", "What it is", "Good for"], rows: [
        ["**LSJ**: Liddell, Scott and Jones, *A Greek–English Lexicon*", "The standard large dictionary, first published in 1843 by Oxford University Press; the ninth edition (1940) with a Revised Supplement (1996). Free online since 2007 through the Perseus Project", "Looking up anything; its entries cite the passages where a word is used. This site's look-up uses it"],
        ["The “Middle Liddell”: *An Intermediate Greek–English Lexicon* (1889)", "A shorter LSJ that keeps the authors' names, for the literature most often read", "Students"],
        ["Autenrieth, *A Homeric Dictionary*", "Georg Autenrieth's dictionary of Homer's words, in English (the edition of 1891 on Perseus and Logeion)", "Reading Homer"],
        ["*The Cambridge Greek Lexicon* (2021)", "About 37,000 words from about 90 authors, Homer to the early second century AD, in present-day English; made first for students (editor-in-chief James Diggle). A review in the Bryn Mawr Classical Review praises its translations and questions gaps in what it covers", "Students of the classical authors"],
        ["*The Brill Dictionary of Ancient Greek* (2015)", "About 140,000 entries, from the eighth century BC to the sixth AD; the English edition of Franco Montanari's Italian dictionary", "Later Greek and non-literary texts as well"],
        ["BDAG: *A Greek–English Lexicon of the New Testament and Other Early Christian Literature* (3rd edition, 2000)", "The dictionary of the New Testament, revised by Frederick W. Danker (University of Chicago Press); its reviewer in the Bryn Mawr Classical Review called it “the best tool of its kind that exists in any language”", "The New Testament and early Christian writers"],
      ], note: "Each description rests on the publisher's page, a review or a reference page listed below." },
      { kind: "p", text: "**Free, online, at once:** Logeion, from the University of Chicago, searches several dictionaries together, among them LSJ, the Middle Liddell and Autenrieth. The look-up in this site's reader links to it, and to Perseus, under “More dictionaries”." },
      { kind: "p", text: "**What this site uses:** LSJ in the Perseus Digital Library's copy (CC BY-SA), short definitions of the commonest words from the Dickinson College Commentaries' Greek Core Vocabulary, and Wiktionary, fetched live." },
      { kind: "check", items: [
        { q: "You are reading the Gospel of John. Which dictionary is made for it?", options: ["Autenrieth", "BDAG", "The Middle Liddell"], answer: 1, why: "BDAG covers the New Testament and other early Christian literature." },
        { q: "Which dictionary does this site's look-up use for full entries?", options: ["LSJ", "The Cambridge Greek Lexicon", "The Brill Dictionary"], answer: 0, why: "LSJ, in the Perseus Digital Library's openly licensed copy." },
      ] },
      { kind: "links", items: [
        { href: "/academy/guide/looking-up", label: "Looking a word up here", note: "the reader's look-up, step by step" },
      ] },
    ],
    sources: [
      { label: "Wikipedia, A Greek–English Lexicon (LSJ's editions, the Middle and Little Liddell, free since 2007)", url: "https://en.wikipedia.org/wiki/A_Greek%E2%80%93English_Lexicon" },
      { label: "Perseus Digital Library, Georg Autenrieth, A Homeric Dictionary", url: "http://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.04.0073" },
      { label: "Cambridge University Press, “Cambridge Greek Lexicon is a milestone in the history of Classics”", url: "https://www.cambridge.org/us/news-and-insights/Cambridge-Greek-Lexicon-is-a-milestone-in-the-history-of-Classics" },
      { label: "Bryn Mawr Classical Review 2022.02.39, review of The Cambridge Greek Lexicon", url: "https://bmcr.brynmawr.edu/2022/2022.02.39/" },
      { label: "Bryn Mawr Classical Review 2018.03.46, review of The Brill Dictionary of Ancient Greek", url: "https://bmcr.brynmawr.edu/2018/2018.03.46/" },
      { label: "Bryn Mawr Classical Review 2001.06.01, review of BDAG (3rd edition)", url: "https://bmcr.brynmawr.edu/2001/2001.06.01/" },
      { label: "Wikipedia, Logeion", url: "https://en.wikipedia.org/wiki/Logeion" },
      { label: "Dickinson College Commentaries, Greek Core Vocabulary", url: "https://dcc.dickinson.edu/greek-core-list" },
    ],
  },

  {
    id: "looking-up", title: "Looking a word up here", greek: "ζήτησις", minutes: 6,
    summary: "The reader's look-up and the Word Study page, step by step, and how to keep the words you meet.",
    sections: [
      // the quiet desk, the guide (the owner, 2026-10-31): written from the look-up as it is now: a first view (the dictionary form, the kind of word, one meaning, the word's
      // job in this sentence, its form, Previous and Next), and "More about it" behind it (the LSJ entry, Go further, Wiktionary, more dictionaries, how sure the grammar is)
      { kind: "p", text: "Every Greek word in the reader is a button. Click it and the look-up opens beside the text; on a phone, tap it and the look-up opens as a sheet at the foot of the screen. With a keyboard, press **Tab** until you reach the Greek, move from word to word with the arrow keys, press **Enter** to open the look-up and **Escape** to close it." },
      { kind: "grid", title: "The first view", head: ["Part", "What it tells you"], rows: [
        ["**The word at the top**", "The dictionary form: the word as a dictionary lists it («μῆνις» for «μῆνιν»)"],
        ["**The kind of word**", "Noun, verb, adjective and so on, with the word you tapped: “noun, feminine · you tapped «μῆνιν»”"],
        ["**The meaning**", "One short meaning: the definition from the core vocabulary for the 500 or so commonest words, otherwise LSJ's short definition"],
        ["**Its job here**", "What the word does in this very sentence, such as “Here it is the object of «ἄειδε».” It shows only for texts whose sentences have been analysed"],
        ["**Its form**", "Its case, number, tense and so on, in plain words: “Accusative singular”"],
        ["**Previous and Next**", "Step to the word before or the word after, without closing the look-up"],
        ["**More about it**", "Opens the second view"],
      ], note: "The × at the top right closes the look-up." },
      { kind: "grid", title: "More about it", head: ["Part", "What it tells you"], rows: [
        ["**Dictionary · LSJ**", "The first meanings, and “The whole entry” for all of LSJ's article"],
        ["**Go further**", "Rows that lead on from the word: where else it comes in this book (Echoes), how the sentence is built, a lesson on this form when there is one, Word Study, and, for a place, its map"],
        ["**Wiktionary · live**", "Wiktionary's entry, when you are online"],
        ["**More dictionaries**", "Links to Logeion and Perseus"],
        ["**At the foot**", "How sure the grammar is. “Checked by hand” means the analysis comes from a treebank checked by scholars; “Automatic analysis” means GLAUx's program made it (about 97% accurate). Then the credits"],
      ], note: "Back, at the top left, returns to the first view; Escape does the same." },
      { kind: "p", text: "**Word Study**, one of the rows under Go further, gathers everything about one word: its meaning (the core definition and LSJ), every form laid out as a grammar prints it, how often it is used in each period and by which authors, one passage from each period with the word marked, its family (the words built on it and the English words that come from it, from Wiktionary), and your own note on it." },
      { kind: "tip", text: "Click a passage's number, or select several words (on a phone, press and hold a word), for more: the passage strip offers Bookmark, Favourite, Note, four highlight colours, Notebook, Share and Echoes, which finds where else the words occur." },
      { kind: "links", items: [
        { href: "/read?w=tlg0012.tlg001&at=1.1", label: "Try it: Iliad 1.1 in the reader", note: "click «μῆνιν»" },
        { href: "/treasury/word?l=%CE%BB%CF%8C%CE%B3%CE%BF%CF%82", label: "Word Study: «λόγος»", note: "an example page" },
      ] },
    ],
    sources: [
      { label: "GLAUx (A. Keersmaekers): the word analyses", url: "https://github.com/alekkeersmaekers/glaux" },
      { label: "Dickinson College Commentaries, Greek Core Vocabulary", url: "https://dcc.dickinson.edu/greek-core-list" },
      { label: "LSJ, the Perseus Digital Library's copy", url: "https://github.com/PerseusDL/lexica" },
    ],
  },
];

export const guideById = (id: string) => GUIDES.find((g) => g.id === id);
