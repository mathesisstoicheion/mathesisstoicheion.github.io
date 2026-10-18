/**
 * Learn by reading: one guided path of real Greek lines, from the sayings carved at Delphi to the
 * first sentence of Aristotle's Metaphysics, after a step 0 for the letters. The rules Noa agreed
 * (2026-10-18): nothing is used before it is taught; one piece of grammar and at most four new words a
 * step; at most eight words a line; words, then grammar, then the line, then the English.
 *
 * Every Greek line is copied from the library's own edition (`npx tsx scripts/passage.ts <work> <ref>`), and
 * each English line from the library's published translation of the same place. Both are checked against the
 * source files by reading-path.test.ts (NETWORK=1). The dictionary forms are GLAUx's analyses at that place
 * (`npx tsx scripts/path-words.ts <work> <ref> "<line>"`), and each meaning is the DCC core list's or LSJ's
 * (`src` says which); "here" narrows it to the sense the line uses.
 */
export interface PathWord {
  /** the word as the edition prints it */
  form: string;
  /** punctuation printed after it, if any */
  after?: string;
  /** dictionary form (GLAUx's analysis at this place) */
  lemma: string;
  /** what it means in this line */
  here: string;
  /** the dictionary's meaning, and which dictionary */
  dict: string;
  src: "DCC" | "LSJ";
  /** the form in plain English */
  form_note: string;
}

export interface PathPart { words: PathWord[]; en: string }

/** One piece of a passage sentence, at most eight words, taught like a lesson; `at` is the word where its grammar comes up. */
export interface PathPiece { words: PathWord[]; learn: { title: string; text: string[]; at?: number } }

/**
 * The passage "Continue" teaches: by default the sentences around the line, in the same work; `work`, `ref`,
 * `label` and `translator` name another place when the passage comes from elsewhere (as for "Know yourself").
 */
export interface PathPassage { intro: string; work?: string; ref?: string; label?: string; translator?: string; sentences: PathSentence[] }

/** A sentence of the passage around a line: its pieces, then the published English and what it means. */
export interface PathSentence { pieces: PathPiece[]; en: string; meaning: string[] }

export interface PathLink { href: string; label: string; note?: string }

export interface PathStep {
  id: string;
  /** a few words of the line, carved at the top of the page (capitals, as Greek was carved) */
  carve: string;
  title: string;
  /** who said it, as a short line under the title */
  who: string;
  /** the passage in the library */
  work: string;
  ref: string;
  label: string;
  /** the translation's translator and date, for the credit under the English */
  translator: string;
  /** where you are: a few sentences, each true of the sources linked below */
  where: string[];
  /** the line, in parts revealed one at a time */
  parts: PathPart[];
  /** what the line means, in plain words, shown once its English is revealed */
  meaning: string[];
  /** the one new piece of grammar */
  learn: { title: string; text: string[] };
  /** the rest of the passage, sentence by sentence, for "Continue" */
  passage?: PathPassage;
  /** places, people and passages to go further, all on the site */
  links: PathLink[];
}

const read = (work: string, at: string) => `/read?w=${work}&at=${at}`;
const map = (id: string) => `/stoa/periplus?p=${id}`;

export const PATH: PathStep[] = [
  {
    id: "nothing-too-much",
    carve: "ΜΗΔΕΝΑΓΑΝ",
    title: "Nothing in excess",
    who: "Carved at Delphi, as Socrates tells it in Plato's Protagoras",
    work: "tlg0059.tlg022", ref: "343b", label: "Plato, Protagoras 343b",
    translator: "W. R. M. Lamb (1924)",
    where: [
      "You are at Delphi, on the slopes of Mount Parnassus, at the temple of Apollo where his oracle spoke.",
      "In Plato's *Protagoras*, Socrates names seven wise men of old: Thales of Miletus, Pittacus of Mytilene, Bias of Priene, Solon of Athens, Cleobulus of Lindus, Myson of Chen and Chilon of Sparta. He says they met together and dedicated their wisdom to Apollo by writing two sayings in his temple at Delphi, “which are on every tongue”.",
      "This is one of the two, and it is only two words long. LSJ, the great Greek dictionary, records that Aristotle gave it to Chilon, the Spartan among the seven. The poet Pindar used it too.",
    ],
    parts: [{
      words: [
        { form: "μηδὲν", lemma: "μηδείς", here: "nothing", dict: "no one, nothing", src: "DCC", form_note: "the 'it' form (neuter), so it means nothing rather than no one" },
        { form: "ἄγαν", lemma: "ἄγαν", here: "too much", dict: "very much, too much", src: "LSJ", form_note: "a word that never changes its form" },
      ],
      en: "Nothing overmuch",
    }],
    meaning: [
      "Literally *nothing too much*; in plainer English, *nothing in excess*. It is advice for every part of life, for what you do, what you feel and what you want: keep to balance and restraint, neither too much nor too little, even of good things.",
      "Aristotle later built this idea into his ethics. In the *Nicomachean Ethics* (Book 2) he describes each virtue as a middle point between two faults, one of excess and one of too little: courage, for example, lies between cowardice and rashness.",
      "In Plato's *Charmides*, Critias claims it was carved later than *Know yourself*, by people who mistook *Know yourself* for a piece of advice rather than the god's greeting.",
    ],
    learn: {
      title: "Greek can leave the verb out",
      text: [
        "There is no verb here at all. Greek often leaves out a verb that is easy to supply, and the reader fills it in: *[do] nothing too much*.",
        "«μηδέν» is built from «μηδέ» *not even* and «ἕν» *one*: *not even one thing*. Its «μη-» is the *don't* kind of *not*, used in commands and wishes.",
      ],
    },
    links: [
      { href: map("540726"), label: "Delphi on the map", note: "the places the texts name, and how often" },
      { href: "/stoa/delphi", label: "Delphi and the oracle", note: "the Pythia, the tripod and the riddling answers" },
      { href: read("tlg0059.tlg022", "343"), label: "Read Protagoras 343 in the reader", note: "the whole passage, with every word explained" },
    ],
    passage: {
      intro: "You have read the saying. Now read the sentence of Plato's *Protagoras* it comes from, and the two short sentences after it, a piece at a time.",
      sentences: [
        {
          pieces: [
            {
              words: [
                { form: "οὗτοι", lemma: "οὗτος", here: "these (men)", dict: "this, these", src: "DCC", form_note: "the 'he' form (masculine), plural: these men, the seven wise men just named" },
                { form: "καὶ", lemma: "καί", here: "also", dict: "and, also, even", src: "DCC", form_note: "a word that never changes its form; here it means also" },
                { form: "κοινῇ", lemma: "κοινῇ", here: "together", dict: "in common, together (from κοινός, common)", src: "LSJ", form_note: "a word that never changes its form" },
                { form: "συνελθόντες", lemma: "συνέρχομαι", here: "having come together", dict: "go together, come together, assemble, meet", src: "LSJ", form_note: "a verb used as a describing word, in the 'he' form, plural, to match οὗτοι" },
              ],
              learn: {
                title: "A verb that describes",
                at: 3,
                text: [
                  "«συνελθόντες» is a verb, *come together*, but its ending «-όντες» makes it a describing word: *having come together*. It describes «οὗτοι», *these men*, and matches it: both are the 'he' form, plural.",
                  "Grammars call this a participle. English does the same with *-ing*: *these men, meeting together, …*",
                ],
              },
            },
            {
              words: [
                { form: "ἀπαρχὴν", lemma: "ἀπαρχή", here: "the first-fruits", dict: "beginning of a sacrifice, primal offering, first-fruits", src: "LSJ", form_note: "a 'she' word (feminine); the -ην ending marks the thing given" },
                { form: "τῆς", lemma: "ὁ", here: "of the", dict: "the", src: "DCC", form_note: "the 'of' form of the, 'she' form, to match σοφίας" },
                { form: "σοφίας", lemma: "σοφία", here: "of (their) wisdom", dict: "cleverness, skill, sound judgement, wisdom", src: "LSJ", form_note: "a 'she' word (feminine), in the 'of' form" },
                { form: "ἀνέθεσαν", lemma: "ἀνατίθημι", here: "they dedicated", dict: "set up as an offering, dedicate; lay upon", src: "LSJ", form_note: "they did it, in the past" },
                { form: "τῷ", lemma: "ὁ", here: "to the", dict: "the", src: "DCC", form_note: "the 'to' form of the, 'he' form, to match Ἀπόλλωνι" },
                { form: "Ἀπόλλωνι", lemma: "Ἀπόλλων", here: "to Apollo", dict: "Apollo", src: "LSJ", form_note: "the 'to' form" },
              ],
              learn: {
                title: "Endings tell each word's job",
                text: [
                  "Three nouns, three endings, three jobs. «ἀπαρχ-ήν»: the thing they gave. «σοφί-ας»: *of* wisdom. «Ἀπόλλων-ι»: *to* Apollo.",
                  "*The* changes with them: «τῆς» goes with *of*, «τῷ» with *to*. In English the order of the words tells you who does what; in Greek the endings do.",
                ],
              },
            },
            {
              words: [
                { form: "εἰς", lemma: "εἰς", here: "into", dict: "into, to, towards", src: "DCC", form_note: "a little place word that never changes its form" },
                { form: "τὸν", lemma: "ὁ", here: "the", dict: "the", src: "DCC", form_note: "the 'he' form, to match νεών" },
                { form: "νεὼν", lemma: "ναός", here: "temple", dict: "temple", src: "DCC", form_note: "a 'he' word (masculine), after εἰς; νεών is the Attic spelling of ναόν" },
                { form: "τὸν", lemma: "ὁ", here: "the (one)", dict: "the", src: "DCC", form_note: "the again: the temple, the one at Delphi" },
                { form: "ἐν", lemma: "ἐν", here: "in, at", dict: "in, among", src: "DCC", form_note: "a little place word that never changes its form" },
                { form: "Δελφοῖς", after: ",", lemma: "Δελφοί", here: "Delphi", dict: "Delphi", src: "LSJ", form_note: "a plural name, in the form that follows ἐν" },
              ],
              learn: {
                title: "Little place words: εἰς and ἐν",
                text: [
                  "«εἰς» means *into* and «ἐν» means *in* or *at*. They never change, but the word after each one takes a set ending: after «εἰς», «τὸν νεών»; after «ἐν», «Δελφοῖς».",
                  "Grammars call them prepositions. Say «τὸν ἐν Δελφοῖς» as one phrase: *the one at Delphi*.",
                ],
              },
            },
            {
              words: [
                { form: "γράψαντες", lemma: "γράφω", here: "writing, having written", dict: "write", src: "DCC", form_note: "a verb used as a describing word, like συνελθόντες, describing the seven men" },
                { form: "ταῦτα", lemma: "οὗτος", here: "these (things)", dict: "this, these", src: "DCC", form_note: "the 'it' form (neuter), plural: these things; the -α ending marks what they wrote" },
                { form: "ἃ", lemma: "ὅς", here: "which", dict: "who, which, that", src: "DCC", form_note: "the 'it' form (neuter), plural, to match ταῦτα" },
                { form: "δὴ", lemma: "δή", here: "indeed", dict: "surely, really, now, in fact, indeed", src: "DCC", form_note: "a word that never changes and never comes first; it adds weight" },
                { form: "πάντες", lemma: "πᾶς", here: "all (people)", dict: "every, all", src: "DCC", form_note: "the 'he' form (masculine), plural: everyone" },
                { form: "ὑμνοῦσιν", after: ",", lemma: "ὑμνέω", here: "sing of, celebrate", dict: "sing of, celebrate in a hymn", src: "LSJ", form_note: "they do it, now; our word hymn comes from it" },
              ],
              learn: {
                title: "ἅ: which",
                at: 2,
                text: [
                  "«ἅ» means *which*. It joins a second statement onto a word: *these things, which everyone indeed sings of*. It matches the word it points back to: «ταῦτα» is the 'it' form, plural, so «ἅ» is too.",
                  "Do not mix it up with «ἀ-» at the front of a word, which means *not*: «ἅ» stands alone, with a rough breathing (*ha*).",
                ],
              },
            },
            {
              words: [
                { form: "γνῶθι", lemma: "γιγνώσκω", here: "know!", dict: "come to know, learn; judge, think", src: "DCC", form_note: "a command, to one person" },
                { form: "σαυτόν", lemma: "σεαυτοῦ", here: "yourself", dict: "of thyself (also written σαυτοῦ)", src: "LSJ", form_note: "the thing being known: the -ον ending marks it" },
                { form: "καὶ", lemma: "καί", here: "and", dict: "and, also, even", src: "DCC", form_note: "a word that never changes its form" },
                { form: "μηδὲν", lemma: "μηδείς", here: "nothing", dict: "no one, nothing", src: "DCC", form_note: "the 'it' form (neuter): nothing" },
                { form: "ἄγαν", after: ".", lemma: "ἄγαν", here: "too much", dict: "very much, too much", src: "LSJ", form_note: "a word that never changes its form" },
              ],
              learn: {
                title: "A command",
                at: 0,
                text: [
                  "«γνῶθι» is a command, said to one person: *know!* The ending «-θι» is one of the endings Greek uses for telling someone to do something. There is no word for *you*: the ending already says who is meant.",
                  "And here are the two sayings, side by side, as they were carved.",
                ],
              },
            },
          ],
          en: "they assembled together and dedicated these as the first-fruits of their lore to Apollo in his Delphic temple, inscribing there those maxims which are on every tongue—Know thyself and Nothing overmuch.",
          meaning: [
            "The seven wise men met and gave the best of their wisdom to Apollo, the way the first fruits of a harvest were given to a god: they had the two sayings written up in his temple at Delphi, where everyone could read them.",
          ],
        },
        {
          pieces: [
            {
              words: [
                { form: "τοῦ", lemma: "τίς", here: "of what?", dict: "who? what? which?", src: "DCC", form_note: "the 'of' form of what?, going with ἕνεκα" },
                { form: "δὴ", lemma: "δή", here: "now, then", dict: "surely, really, now, in fact, indeed", src: "DCC", form_note: "a word that never changes and never comes first" },
                { form: "ἕνεκα", lemma: "ἕνεκα", here: "for the sake of", dict: "on account of, for the sake of", src: "DCC", form_note: "a word that never changes; it comes after its 'of' word: τοῦ ἕνεκα, for the sake of what, why" },
                { form: "ταῦτα", lemma: "οὗτος", here: "these things", dict: "this, these", src: "DCC", form_note: "the 'it' form (neuter), plural" },
                { form: "λέγω", after: ";", lemma: "λέγω", here: "I say", dict: "say, speak (of), recount", src: "DCC", form_note: "I do it, now" },
              ],
              learn: {
                title: "The Greek question mark",
                at: 4,
                text: [
                  "The mark after «λέγω» looks like our semicolon, but in Greek it is the question mark: «;». So this is a question: *for the sake of what, then, do I say these things?*",
                  "Socrates asks it himself, to make his point clear.",
                ],
              },
            },
          ],
          en: "To what intent do I say this?",
          meaning: ["Socrates stops to say why he has told the story of the seven wise men. The answer comes next."],
        },
        {
          pieces: [
            {
              words: [
                { form: "ὅτι", lemma: "ὅτι", here: "(to show) that", dict: "because, that", src: "DCC", form_note: "a word that never changes its form" },
                { form: "οὗτος", lemma: "οὗτος", here: "this", dict: "this, these", src: "DCC", form_note: "the 'he' form (masculine), to match τρόπος" },
                { form: "ὁ", lemma: "ὁ", here: "the", dict: "the", src: "DCC", form_note: "the 'he' form (masculine)" },
                { form: "τρόπος", lemma: "τρόπος", here: "way, style", dict: "way, manner, fashion; way of life, habit, custom", src: "DCC", form_note: "a 'he' word (masculine), the subject" },
                { form: "ἦν", lemma: "εἰμί", here: "was", dict: "be, exist", src: "DCC", form_note: "he, she or it was" },
                { form: "τῶν", lemma: "ὁ", here: "of the", dict: "the", src: "DCC", form_note: "the 'of' form of the, plural" },
                { form: "παλαιῶν", lemma: "παλαιός", here: "of old (times)", dict: "old, ancient", src: "DCC", form_note: "a describing word in the 'of' form, plural: of the old ones" },
              ],
              learn: {
                title: "ἦν: was",
                at: 4,
                text: [
                  "«ἦν» means *was*: *he, she or it was*. It is the past of «ἐστί», *is*.",
                  "Read the piece as Greek puts it: *that this the way was of the old ones*. Then put it into English: *that this was the way of the ancients*.",
                ],
              },
            },
            {
              words: [
                { form: "τῆς", lemma: "ὁ", here: "of the", dict: "the", src: "DCC", form_note: "the 'of' form of the, 'she' form, to match φιλοσοφίας" },
                { form: "φιλοσοφίας", after: ",", lemma: "φιλοσοφία", here: "of philosophy", dict: "love of knowledge, pursuit of it, study", src: "LSJ", form_note: "a 'she' word (feminine), in the 'of' form; built from φίλος, loving, and σοφία, wisdom" },
                { form: "βραχυλογία", lemma: "βραχυλογία", here: "brevity in speech", dict: "brevity in speech or writing", src: "LSJ", form_note: "a 'she' word (feminine); built from βραχύς, short, and λόγος, speech" },
                { form: "τις", lemma: "τις", here: "a kind of", dict: "someone, something; some, any", src: "DCC", form_note: "it leans on the word before it, and is said with it" },
                { form: "Λακωνική", lemma: "Λακωνικός", here: "Spartan, laconic", dict: "Laconian, of Laconia (the land of Sparta)", src: "LSJ", form_note: "the 'she' form (feminine), to match βραχυλογία" },
              ],
              learn: {
                title: "τις: a kind of",
                at: 3,
                text: [
                  "«τις» means *some* or *a kind of*. Put after a word, it softens it: «βραχυλογία τις», *a kind of brevity*. It leans on the word before it and is said together with it.",
                  "Our word *laconic*, short and to the point, comes from «Λακωνικός»: the Spartans of Laconia were famous for saying a lot in few words.",
                ],
              },
            },
          ],
          en: "To show how the ancient philosophy had this style of laconic brevity",
          meaning: [
            "This is Socrates' point: the old wise men put their philosophy into short, pointed sayings, the way the Spartans spoke. *Nothing in excess* is one of them: two words that say a great deal.",
          ],
        },
      ],
    },
  },
  {
    id: "know-yourself",
    carve: "ΓΝΩΘΙΣΑΥΤΟΝ",
    title: "Know yourself",
    who: "Carved at Delphi, as Socrates tells it in Plato's Protagoras",
    work: "tlg0059.tlg022", ref: "343b", label: "Plato, Protagoras 343b",
    translator: "W. R. M. Lamb (1924)",
    where: [
      "You are at Delphi, on the slopes of Mount Parnassus, at the temple of Apollo. In Plato's *Protagoras*, Socrates says the seven wise men of old wrote two sayings in this temple, “which are on every tongue”. Plato names this one first.",
      "Socrates calls this short, memorable style of the old sages Spartan, “laconic brevity”.",
    ],
    parts: [{
      words: [
        { form: "γνῶθι", lemma: "γιγνώσκω", here: "know!", dict: "come to know, learn; judge, think", src: "DCC", form_note: "a command, to one person" },
        { form: "σαυτόν", lemma: "σεαυτοῦ", here: "yourself", dict: "of thyself (also written σαυτοῦ)", src: "LSJ", form_note: "the thing being known: the -ον ending marks it" },
      ],
      en: "Know thyself",
    }],
    meaning: [
      "Literally *know yourself*: know what you are, and where your limits lie. In Plato's *Charmides*, Critias reads it as the god's greeting to everyone who enters the temple, meaning *Be temperate!*: keep a sound mind, as a human being and not a god.",
      "In the *Phaedrus*, Socrates says he has no time to explain the old myths, because he is not yet able, as the Delphic inscription has it, to know himself.",
    ],
    learn: {
      title: "A command",
      text: [
        "«γνῶθι» is a command, said to one person: *know!* The ending «-θι» is one of the endings Greek uses for telling someone to do something.",
        "There is no word for *you* in front of it. Greek does not need one: the verb's ending already says who is meant. You will see this all the time in Greek.",
      ],
    },
    links: [
      { href: map("540726"), label: "Delphi on the map" },
      { href: read("tlg0059.tlg022", "343"), label: "Read Protagoras 343 in the reader" },
    ],
  },
  {
    id: "everything-moves",
    carve: "ΠΑΝΤΑΧΩΡΕΙ",
    title: "Everything moves on",
    who: "Heraclitus of Ephesus, as Socrates reports him in Plato's Cratylus",
    work: "tlg0059.tlg005", ref: "402a", label: "Plato, Cratylus 402a",
    translator: "Harold North Fowler (1926)",
    where: [
      "You are at Ephesus, on the coast of Asia Minor. Diogenes Laertius, who wrote the lives of the philosophers, says Heraclitus was a native of Ephesus, and “lofty-minded beyond all other men”.",
      "In Plato's *Cratylus*, Socrates reports what Heraclitus says: everything moves and nothing stays. He likened the world to a flowing river, saying you could not step into the same river twice.",
      "These are Socrates' words for Heraclitus' idea, as Plato wrote them. LSJ quotes this very line to show what «χωρεῖ» means: *to be in motion or flux*.",
    ],
    parts: [
      {
        words: [
          { form: "πάντα", lemma: "πᾶς", here: "all things", dict: "every, all", src: "DCC", form_note: "the 'it' form (neuter), plural: all things. A plural 'it' word takes a singular verb, so read it as all things moves" },
          { form: "χωρεῖ", lemma: "χωρέω", here: "moves on", dict: "make room, give way, withdraw; go forward; be in motion", src: "LSJ", form_note: "he, she or it does it, now" },
        ],
        en: "all things move",
      },
      {
        words: [
          { form: "καὶ", lemma: "καί", here: "and", dict: "and, also, even", src: "DCC", form_note: "a word that never changes its form" },
          { form: "οὐδὲν", lemma: "οὐδείς", here: "nothing", dict: "no one, nothing", src: "DCC", form_note: "the 'it' form (neuter): nothing. Its οὐ- is the not of plain fact: here, nothing in fact stays" },
          { form: "μένει", lemma: "μένω", here: "stays", dict: "stay, remain, endure, await", src: "DCC", form_note: "he, she or it does it, now" },
        ],
        en: "and nothing remains still",
      },
    ],
    meaning: [
      "Nothing in the world stays the same: everything is always changing, like a river whose water is never the same water twice.",
      "Socrates brings it up for fun while explaining names: he suggests that whoever named the gods Rhea and Cronus, names of streams, had the same thought as Heraclitus.",
    ],
    learn: {
      title: "The ending -ει: it does",
      text: [
        "Both verbs end in «-ει»: «χωρ-εῖ» *it moves*, «μέν-ει» *it stays*. That ending means *he, she or it does this now*.",
        "The ending carries the *it*, so no separate word for *it* is needed.",
      ],
    },
    links: [
      { href: map("599612"), label: "Ephesus on the map" },
      { href: read("tlg0004.tlg001", "9.1.1"), label: "Diogenes Laertius on Heraclitus", note: "the start of his life, in the reader" },
      { href: read("tlg0059.tlg005", "402"), label: "Read Cratylus 402 in the reader", note: "the river, in context" },
    ],
  },
  {
    id: "life-is-short",
    carve: "ΟΒΙΟΣΒΡΑΧΥΣ",
    title: "Life is short",
    who: "Hippocrates of Cos, the first of the Aphorisms",
    work: "tlg0627.tlg012", ref: "1.1", label: "Hippocrates, Aphorisms 1.1",
    translator: "Francis Adams (1886)",
    where: [
      "You are on the island of Cos, off the coast of Asia Minor. Hippocrates was born there around 460 BC; he is called the Father of Medicine, though very little is known for certain about what he himself wrote.",
      "The *Aphorisms* are short rules for doctors, and this is how the first one begins. The rest of the sentence is the next lesson.",
    ],
    parts: [{
      words: [
        { form: "ὁ", lemma: "ὁ", here: "the", dict: "the", src: "DCC", form_note: "the 'he' form (masculine), for a 'he' word" },
        { form: "βίος", lemma: "βίος", here: "life", dict: "life", src: "DCC", form_note: "a 'he' word (masculine), the subject" },
        { form: "βραχὺς", after: ",", lemma: "βραχύς", here: "short", dict: "brief, short", src: "DCC", form_note: "a describing word, in its 'he' form to go with βίος (matching endings show which words go together)" },
      ],
      en: "Life is short,",
    }],
    meaning: [
      "A human life is too short for everything there is to learn. For Hippocrates, the doctor, this is the first thing to know about medicine: you will not live long enough to master it.",
    ],
    learn: {
      title: "The: ὁ",
      text: [
        "Greek has a word for *the*: «ὁ». It changes to match its noun. Every Greek noun is a 'he', a 'she' or an 'it' word (masculine, feminine or neuter). «βίος» is a 'he' word, so it gets «ὁ».",
        "Greek uses *the* where English often leaves it out: «ὁ βίος», *the life*, means life in general. And there is no *is*: Greek often leaves out a verb that is easy to supply. *The life [is] short.*",
      ],
    },
    links: [
      { href: map("599581"), label: "Cos on the map" },
      { href: "/author/tlg0627", label: "Hippocrates", note: "his life and the Hippocratic writings" },
      { href: read("tlg0627.tlg012", "1.1"), label: "Read the Aphorisms in the reader" },
    ],
  },
  {
    id: "the-art-is-long",
    carve: "ΗΤΕΧΝΗΜΑΚΡΗ",
    title: "The art is long",
    who: "Hippocrates of Cos, the first of the Aphorisms, continued",
    work: "tlg0627.tlg012", ref: "1.1", label: "Hippocrates, Aphorisms 1.1",
    translator: "Francis Adams (1886)",
    where: [
      "You are on the island of Cos, home of Hippocrates, the Father of Medicine. His *Aphorisms* open: *Life is short*, and then this. The *art* is medicine: the sentence goes on to say the physician must be ready to do what is right himself, and to make the patient and the attendants work with him.",
      "It is written in Ionic, the dialect of Cos and the coast of Asia Minor: Athenians would have said «μακρά» for «μακρή».",
    ],
    parts: [{
      words: [
        { form: "ἡ", lemma: "ὁ", here: "the", dict: "the", src: "DCC", form_note: "the 'she' form (feminine) of ὁ, for a 'she' word" },
        { form: "δὲ", lemma: "δέ", here: "and", dict: "and; but", src: "DCC", form_note: "a word that never changes; it is never the first word, but sits second in its half of the sentence" },
        { form: "τέχνη", lemma: "τέχνη", here: "the art (of medicine)", dict: "art, skill, craft", src: "DCC", form_note: "a 'she' word (feminine), the subject" },
        { form: "μακρὴ", lemma: "μακρός", here: "long", dict: "long, tall, large, long-lasting", src: "DCC", form_note: "the 'she' form (feminine), to match τέχνη" },
      ],
      en: "and Art long",
    }],
    meaning: [
      "The skill takes longer to learn than a lifetime allows. The sentence goes on, in Adams's translation: *the crisis fleeting; experience perilous, and decision difficult*. The doctor must act fast, on knowledge that is never complete.",
    ],
    learn: {
      title: "Words that match",
      text: [
        "«τέχνη» is a 'she' word, so *the* takes its 'she' form, «ἡ». The describing word matches too: «μακρή» goes with the 'she' word «τέχνη».",
        "Matching endings are how you tell which word goes with which. You will lean on this on every step from now on.",
      ],
    },
    links: [
      { href: map("599581"), label: "Cos on the map" },
      { href: "/stoa/asclepius", label: "Asclepius", note: "the healing god of the doctors' guild" },
      { href: read("tlg0627.tlg012", "1.1"), label: "Read the Aphorisms in the reader" },
    ],
  },
  {
    id: "measure-of-all-things",
    carve: "ΠΑΝΤΩΝΜΕΤΡΟΝ",
    title: "The measure of all things",
    who: "Protagoras of Abdera, the first words of his book",
    work: "tlg0004.tlg001", ref: "9.8.51", label: "Diogenes Laertius, Lives 9.51",
    translator: "R. D. Hicks (1925)",
    where: [
      "You are at Abdera, on the coast of Thrace. Diogenes Laertius says Protagoras was born there (though the comic poet Eupolis called him a man of Teos), and that he gave public readings for which he charged fees.",
      "He says Protagoras was the first to hold that every question has two opposing sides, and that he began a book with this sentence.",
      "Plato's Socrates takes it up in the *Theaetetus*: if each of us is the measure, things are for me as they seem to me, and for you as they seem to you.",
    ],
    parts: [{
      words: [
        { form: "πάντων", lemma: "πᾶς", here: "of all", dict: "every, all", src: "DCC", form_note: "the 'of' form, plural, of πᾶς, all" },
        { form: "χρημάτων", lemma: "χρῆμα", here: "of things", dict: "thing, matter; (in the plural) goods, money", src: "DCC", form_note: "the 'of' form, plural" },
        { form: "μέτρον", lemma: "μέτρον", here: "the measure", dict: "that by which anything is measured, measure, rule", src: "LSJ", form_note: "an 'it' word (neuter)" },
        { form: "ἄνθρωπος", lemma: "ἄνθρωπος", here: "a human being", dict: "human being", src: "DCC", form_note: "the subject" },
      ],
      en: "Man is the measure of all things",
    }],
    meaning: [
      "There is no standard outside us: people decide what is real and true, each by how things seem to them.",
      "That is how Socrates reads it in Plato's *Theaetetus*: things are for me as they seem to me, and for you as they seem to you. Socrates goes on to test the idea and does not accept it.",
    ],
    learn: {
      title: "The ending -ων: of",
      text: [
        "«πάντ-ων», «χρημάτ-ων»: the ending «-ων» means *of*, for plural nouns of every kind. *Of all things*. Greek has no separate word for *of*; the ending does the work.",
        "Grammars call this the genitive. The main word, «ἄνθρωπος», is in its plain form (the nominative).",
        "And there is no *is*: *of all things [the] measure [is] a human being*. «ἄνθρωπος» means a person, man or woman; older translations say *man*.",
      ],
    },
    links: [
      { href: map("501323"), label: "Abdera on the map" },
      { href: read("tlg0004.tlg001", "9.8.50"), label: "Diogenes Laertius on Protagoras", note: "his whole life, in the reader" },
      { href: read("tlg0059.tlg006", "152"), label: "Read Theaetetus 152 in the reader", note: "Socrates tests the saying" },
    ],
  },
  {
    id: "what-i-do-not-know",
    carve: "ΟΥΚΟΙΔΑ",
    title: "I do not think I know",
    who: "Socrates at his trial, in Plato's Apology",
    work: "tlg0059.tlg002", ref: "21d", label: "Plato, Apology 21d",
    translator: "Harold North Fowler (1914)",
    where: [
      "You are in Athens, in the court where Socrates is on trial for his life. Plato's *Apology* is his speech of defence.",
      "He tells the jury that his friend Chaerephon once went to Delphi, to Apollo's temple, and asked whether anyone was wiser than Socrates. The Pythia, Apollo's priestess, answered that no one was.",
      "Puzzled, Socrates went to a man who was thought wise, and found that he only thought he knew. Walking away, he reasoned: neither of us knows anything fine and good, but this man thinks he knows when he does not. Then he says this of himself.",
    ],
    parts: [
      {
        words: [
          { form: "οὐκ", lemma: "οὐ", here: "not", dict: "not (with indicative verbs)", src: "DCC", form_note: "οὐ, written οὐκ before a vowel; the not of plain fact" },
          { form: "οἶδα", after: ",", lemma: "οἶδα", here: "I know", dict: "to know", src: "DCC", form_note: "I do it" },
        ],
        en: "as I do not know anything,",
      },
      {
        words: [
          { form: "οὐδὲ", lemma: "οὐδέ", here: "not … either", dict: "and not, but not, nor", src: "DCC", form_note: "a word that never changes" },
          { form: "οἴομαι", lemma: "οἴομαι", here: "I think (I do)", dict: "think, suppose, imagine", src: "DCC", form_note: "I do it" },
        ],
        en: "do not think I do either.",
      },
    ],
    meaning: [
      "Socrates claims only one kind of wisdom: when he does not know something, he does not fool himself that he does.",
      "The man he questioned thought he knew and did not. Socrates says he seems to be wiser than him in just this small thing, and that this is what the oracle's answer meant.",
    ],
    learn: {
      title: "The endings for I",
      text: [
        "«οἶδ-α» *I know* and «οἴ-ομαι» *I think* both mean *I*. Their endings say so: «-α» for one kind of verb, «-ομαι» for another. No separate word for *I* is needed.",
        "Greek leaves the second *know* out, as English can: *nor do I think [I know]*. The translator's *anything* comes from the words just before: *anything fine and good*.",
      ],
    },
    links: [
      { href: map("579885"), label: "Athens on the map" },
      { href: "/stoa/trial-of-socrates", label: "The trial of Socrates" },
      { href: "/author/tlg0059", label: "Plato" },
      { href: read("tlg0059.tlg002", "21"), label: "Read Apology 21 in the reader", note: "the oracle and the wise man" },
    ],
  },
  {
    id: "the-unexamined-life",
    carve: "ΒΙΟΣΒΙΩΤΟΣ",
    title: "The unexamined life",
    who: "Socrates at his trial, in Plato's Apology",
    work: "tlg0059.tlg002", ref: "38a", label: "Plato, Apology 38a",
    translator: "Harold North Fowler (1914)",
    where: [
      "You are in Athens, in the court where Socrates is on trial for his life. The jury has found him guilty, and he must propose his own penalty. He will not promise to keep quiet: that, he says, would be to disobey the god.",
      "The best thing for a person, he says, is to talk every day about virtue and the other things they hear him discussing, examining himself and others. And then this.",
      "LSJ quotes this line for both «ἀνεξέταστος» and «βιωτός».",
    ],
    parts: [{
      words: [
        { form: "ὁ", lemma: "ὁ", here: "the", dict: "the", src: "DCC", form_note: "the 'he' form (masculine), to match βίος" },
        { form: "δὲ", lemma: "δέ", here: "and", dict: "and; but", src: "DCC", form_note: "a word that never changes; it is never first, but sits second" },
        { form: "ἀνεξέταστος", lemma: "ἀνεξέταστος", here: "unexamined", dict: "not searched out, not inquired into or examined", src: "LSJ", form_note: "the 'he' form (masculine), to match βίος" },
        { form: "βίος", lemma: "βίος", here: "life", dict: "life", src: "DCC", form_note: "a 'he' word (masculine), the subject" },
        { form: "οὐ", lemma: "οὐ", here: "not", dict: "not (with indicative verbs)", src: "DCC", form_note: "a word that never changes: the not of plain fact" },
        { form: "βιωτὸς", lemma: "βιωτός", here: "worth living", dict: "to be lived, worth living", src: "LSJ", form_note: "the 'he' form (masculine), to match βίος. Built from βιόω live, a relative of βίος; the ending -τος often means can be done: livable" },
        { form: "ἀνθρώπῳ", lemma: "ἄνθρωπος", here: "for a human being", dict: "human being", src: "DCC", form_note: "the 'to' or 'for' form" },
      ],
      en: "the unexamined life is not worth living",
    }],
    meaning: [
      "A life in which you never question how you live, and why, is not worth living. For Socrates, talking about virtue and examining himself and others every day was the best thing a person could do, so he would not give it up to save his life.",
    ],
    learn: {
      title: "The ending -ῳ: for",
      text: [
        "«ἀνθρώπ-ῳ»: the ending «-ῳ» means *to* or *for*. *For a human being*, life without examining is not worth living. Grammars call this the dative. Its plain form is «ἄνθρωπος»; only the ending has changed.",
        "Worth knowing for the long word: «ἀν-» at the front means *un-* or *not*, and the rest comes from «ἐξετάζω», *examine* (Socrates uses it a few words earlier: *examining myself and others*).",
      ],
    },
    links: [
      { href: "/stoa/trial-of-socrates", label: "The trial of Socrates" },
      { href: read("tlg0059.tlg002", "38"), label: "Read Apology 38 in the reader", note: "the penalty he proposes" },
    ],
  },
  {
    id: "political-animal",
    carve: "ΠΟΛΙΤΙΚΟΝΖΩΙΟΝ",
    title: "An animal of the city",
    who: "Aristotle, Politics, Book 1",
    work: "tlg0086.tlg035", ref: "1.1253a", label: "Aristotle, Politics 1.1253a",
    translator: "Harris Rackham (1944)",
    where: [
      "You are at Stagira in Chalcidice, in northern Greece, home of Aristotle. Diogenes Laertius says he was born at Stagira, joined Plato at seventeen and stayed with him twenty years; he later taught at the Lyceum in Athens.",
      "Here, at the start of the *Politics*, he has just traced how families grow into villages and villages into the city (the «πόλις»). From this, he says, it is clear that the city exists by nature, and that man is by nature an animal of the city.",
      "A few lines on he gives the reason: of all the animals, only man has speech.",
    ],
    parts: [{
      words: [
        { form: "ὁ", lemma: "ὁ", here: "the", dict: "the", src: "DCC", form_note: "the 'he' form; with a general word it means the whole kind" },
        { form: "ἄνθρωπος", lemma: "ἄνθρωπος", here: "human being, humankind", dict: "human being", src: "DCC", form_note: "the subject" },
        { form: "φύσει", lemma: "φύσις", here: "by nature", dict: "nature; one's nature; the order of nature", src: "DCC", form_note: "the 'by' form" },
        { form: "πολιτικὸν", lemma: "πολιτικός", here: "of the city, political", dict: "of, for, or relating to citizens", src: "LSJ", form_note: "the 'it' form (neuter), to match ζῷον. Built from πόλις, city: our word political comes from it" },
        { form: "ζῷον", lemma: "ζῷον", here: "animal", dict: "living being, animal", src: "DCC", form_note: "an 'it' word (neuter)" },
      ],
      en: "man is by nature a political animal",
    }],
    meaning: [
      "Human beings are made by nature to live together in communities. Aristotle adds that someone who by nature has no city is either less than human or more than human.",
      "His reason is speech: only humans can talk about what is good and bad, right and wrong, and sharing that is what makes a household and a city.",
    ],
    learn: {
      title: "The 'by' form: φύσει",
      text: [
        "«φύσ-ει» is the *to* or *for* form of «φύσις», nature, in the family of nouns like «φύσις» and «πόλις». Without any extra word it can also mean *by* or *in*: *by nature*.",
        "So: *the human being [is] by nature a city-animal*. Aristotle means more than politics: a living being made to live in a community.",
      ],
    },
    links: [
      { href: "/author/tlg0086", label: "Aristotle", note: "his life, and his books' strange journey" },
      { href: read("tlg0086.tlg035", "1.1253a"), label: "Read Politics 1.1253a in the reader", note: "the reason: only man has speech" },
    ],
  },
  {
    id: "full-of-gods",
    carve: "ΘΕΩΝΠΛΗΡΗ",
    title: "Full of gods",
    who: "Thales' idea, in Plato's Laws",
    work: "tlg0059.tlg034", ref: "10.899", label: "Plato, Laws 10.899b",
    translator: "R. G. Bury (1926)",
    where: [
      "You are at Miletus, on the coast of Asia Minor, home of Thales, the first of the seven wise men of old. Aristotle writes that Thales thought all things are full of gods (*On the Soul* 1.5), with the same four Greek words as below, in another order.",
      "This line is from Plato's *Laws*. A stranger from Athens argues that the souls that move the sun, the moon and the stars are gods, and asks: will anyone who agrees deny that all things are full of gods?",
    ],
    parts: [{
      words: [
        { form: "θεῶν", lemma: "θεός", here: "of gods", dict: "god, goddess", src: "DCC", form_note: "the 'of' form, plural: the -ων ending means of" },
        { form: "εἶναι", lemma: "εἰμί", here: "to be (that they are)", dict: "be, exist", src: "DCC", form_note: "to be" },
        { form: "πλήρη", lemma: "πλήρης", here: "full", dict: "full of (with the 'of' form)", src: "LSJ", form_note: "the 'it' form (neuter), plural, to match πάντα; full takes the 'of' form: θεῶν, of gods" },
        { form: "πάντα", lemma: "πᾶς", here: "all things", dict: "every, all", src: "DCC", form_note: "the 'it' form (neuter), plural: all things" },
      ],
      en: "all things are full of gods",
    }],
    meaning: [
      "The divine is not far away: it is in everything around us. In the *Laws*, the argument is that the souls that move the sun, the moon and the stars are gods, so the whole world is full of them.",
    ],
    learn: {
      title: "εἶναι, to be",
      text: [
        "«εἶναι» is *to be*. Its ending, «-ναι», is one of the endings that mean *to …*; the most common is «-ειν», as in «μένειν» *to stay*.",
        "Here it reports what someone thinks. Greek says *all things to be full of gods*, where English says *that all things are full of gods*. Whenever you see *to be* after someone thinks or says something, read it as *that … is* or *that … are*.",
      ],
    },
    links: [
      { href: map("599799"), label: "Miletus on the map" },
      { href: read("tlg0086.tlg002", "1.5"), label: "Aristotle on Thales", note: "On the Soul 1.5, in the reader (Greek only)" },
      { href: read("tlg0059.tlg034", "10.899"), label: "Read Laws 10.899 in the reader" },
    ],
  },
  {
    id: "they-say-fine-things",
    carve: "ΛΕΓΟΥΣΙΚΑΛΑ",
    title: "They say many fine things",
    who: "Socrates on the poets and prophets, in Plato's Apology",
    work: "tlg0059.tlg002", ref: "22c", label: "Plato, Apology 22c",
    translator: "Harold North Fowler (1914)",
    where: [
      "You are in Athens, at the trial of Socrates. In his speech of defence he tells how he went looking for anyone wiser than himself. After questioning a man thought to be wise, he says, he went to the poets, thinking he would prove there that he knew less than they did.",
      "He asked them what their poems meant, and found that hardly anyone present would not have spoken about the poems better than the poets themselves. They compose, he decided, not by wisdom but by nature and inspiration, like prophets and givers of oracles.",
      "This line is about those prophets. Its other half says that they know none of the things they say.",
    ],
    parts: [{
      words: [
        { form: "λέγουσι", lemma: "λέγω", here: "they say", dict: "say, speak (of), recount; pick up, collect, count", src: "DCC", form_note: "they do it, now" },
        { form: "μὲν", lemma: "μέν", here: "(on the one hand)", dict: "on the one hand … on the other hand (often untranslated)", src: "DCC", form_note: "a word that never changes and never comes first; it warns that a δέ half is coming (here: but they know nothing)" },
        { form: "πολλὰ", lemma: "πολύς", here: "many things", dict: "much, many", src: "DCC", form_note: "the 'it' form (neuter), plural: many things" },
        { form: "καὶ", lemma: "καί", here: "and", dict: "and, also, even", src: "DCC", form_note: "a word that never changes. Greek says many and fine things; English drops the and" },
        { form: "καλά", lemma: "καλός", here: "fine", dict: "beautiful, noble, honorable", src: "DCC", form_note: "the 'it' form (neuter), plural, to match πολλά" },
      ],
      en: "say many fine things,",
    }],
    meaning: [
      "The prophets and oracle-givers say beautiful things, but do not understand them: the words come from the god, not from their own knowledge. Socrates finds the poets are the same: they write by inspiration, not by wisdom.",
    ],
    learn: {
      title: "The ending -ουσι: they",
      text: [
        "«λέγ-ουσι» means *they say*. The front of the verb, «λέγ-», means *say*, and the ending says who does it: «λέγ-ει» would be *he, she or it says*; «λέγ-ουσι» is *they say*.",
        "No separate word is needed: the ending is the *they*.",
      ],
    },
    links: [
      { href: "/stoa/trial-of-socrates", label: "The trial of Socrates" },
      { href: read("tlg0059.tlg002", "22"), label: "Read Apology 22 in the reader", note: "the poets and the craftsmen" },
    ],
  },
  {
    id: "desire-to-know",
    carve: "ΤΟΥΕΙΔΕΝΑΙ",
    title: "All human beings desire to know",
    who: "Aristotle, the first sentence of the Metaphysics",
    work: "tlg0086.tlg025", ref: "1.1", label: "Aristotle, Metaphysics 1.1 (980a)",
    translator: "Hugh Tredennick (1933)",
    where: [
      "The top of the climb: the opening sentence of Aristotle's *Metaphysics*.",
      "He gives the sign straight away: we delight in our senses for their own sake, even when they are of no use to us, and most of all in sight, because sight most of all helps us to know things.",
    ],
    parts: [{
      words: [
        { form: "πάντες", lemma: "πᾶς", here: "all", dict: "every, all", src: "DCC", form_note: "the 'he' form (masculine), plural, of πᾶς, all" },
        { form: "ἄνθρωποι", lemma: "ἄνθρωπος", here: "human beings", dict: "human being", src: "DCC", form_note: "the subject, plural" },
        { form: "τοῦ", lemma: "ὁ", here: "the (… knowing)", dict: "the", src: "DCC", form_note: "the 'of' form, for the 'it' word εἰδέναι" },
        { form: "εἰδέναι", lemma: "οἶδα", here: "to know, knowing", dict: "to know", src: "DCC", form_note: "to know: from οἶδα, I know, with the ending -ναι, to" },
        { form: "ὀρέγονται", lemma: "ὀρέγω", here: "reach for, desire", dict: "reach after, grasp at, yearn for (with the 'of' form)", src: "LSJ", form_note: "they do it" },
        { form: "φύσει", after: ".", lemma: "φύσις", here: "by nature", dict: "nature", src: "DCC", form_note: "the 'by' form: by nature" },
      ],
      en: "All men naturally desire knowledge.",
    }],
    meaning: [
      "Wanting to know is part of being human: we do not learn only because it is useful. Aristotle's proof is that we enjoy our senses, and sight above all, even when they are no use to us.",
    ],
    learn: {
      title: "τὸ εἰδέναι: knowing, as a noun",
      text: [
        "Put *the* in front of a *to …* word and it becomes a noun: «τὸ εἰδέναι», *the knowing*, knowledge.",
        "«ὀρέγομαι» means *I reach out for*, and the thing reached for goes in the *of* form. So *the* becomes «τοῦ»: *they reach for the knowing*.",
        "«ὀρέγ-ονται» ends in «-ονται», *they*: the *they* ending of verbs whose *I* form ends in «-ομαι», like «ὀρέγομαι». *All human beings, by nature, reach for knowing.*",
      ],
    },
    links: [
      { href: "/author/tlg0086", label: "Aristotle" },
      { href: read("tlg0086.tlg025", "1.1"), label: "Read on in the Metaphysics", note: "the senses, memory and experience" },
    ],
  },
];

/** Step 0, before the first line: the letters, read on names the learner already knows. */
export const LETTERS_STEP = {
  id: "letters",
  carve: "ΓΡΑΜΜΑΤΑ",
  title: "The letters",
  who: "Before the first line: sounding out names you already know",
  /** three things to know about reading the letters */
  notes: [
    "A vowel that starts a word carries a small mark, a breathing. The rough breathing, as in «ὁ», is an *h*: «ὁ» is *ho*. The smooth breathing, as in «Ἀθῆναι», is no sound at all. (Modern Greek drops the *h*.)",
    "The marks «ά», «ὰ» and «ᾶ» are accents. For now, read past them.",
    "«ου» together sounds like the *oo* of *food*, and «σ» is written «ς» at the end of a word.",
  ],
  names: [
    { gr: "Σωκράτης", en: "Socrates" },
    { gr: "Πλάτων", en: "Plato" },
    { gr: "Ἀριστοτέλης", en: "Aristotle" },
    { gr: "Ἀθῆναι", en: "Athens" },
    { gr: "Δελφοί", en: "Delphi" },
    { gr: "Ἀπόλλων", en: "Apollo" },
  ],
};

export const pathStep = (id: string) => PATH.find((s) => s.id === id);

/** The step where a dictionary form first appears, if before step `before` (for "you met this on step n"). */
export function firstMet(lemma: string, before: number): number | null {
  for (let i = 0; i < before; i++) if (PATH[i].parts.some((p) => p.words.some((w) => w.lemma === lemma))) return i + 1;
  return null;
}

/** The line as printed: the words with their punctuation. */
export const partText = (p: PathPart) => p.words.map((w) => w.form + (w.after ?? "")).join(" ");
