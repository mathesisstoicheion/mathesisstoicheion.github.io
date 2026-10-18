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
  /** GLAUx's own headword, when it differs from the one shown to learners. */
  glaux?: string;
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
    passage: {
      intro: "Socrates comes back to the saying in Plato's *Phaedrus*. Walking by the river Ilissus, his friend Phaedrus asks whether he believes an old myth, and Socrates explains why he has no time for such questions. Read his answer a piece at a time.",
      work: "tlg0059.tlg012", ref: "230a", label: "Plato, Phaedrus 229e–230a",
      translator: "Harold North Fowler (1914)",
      sentences: [
        {
          pieces: [
            {
              words: [
                { form: "ἐμοὶ", lemma: "ἐγώ", here: "for me", dict: "I, we", src: "DCC", form_note: "the 'to' or 'for' form of ἐγώ, I: for me" },
                { form: "δὲ", lemma: "δέ", here: "but", dict: "and; but", src: "DCC", form_note: "a word that never changes; it is never first, but sits second in its sentence" },
                { form: "πρὸς", lemma: "πρός", here: "for, with a view to", dict: "to, towards, in relation to (+acc.)", src: "DCC", form_note: "a little word that never changes its form; here it goes with αὐτά" },
                { form: "αὐτὰ", lemma: "αὐτός", here: "them, these things", dict: "him, her, it etc. (in oblique cases)", src: "DCC", form_note: "the 'it' form (neuter), plural: them, the stories just mentioned" },
                { form: "οὐδαμῶς", lemma: "οὐδαμῶς", here: "not at all", dict: "in no wise", src: "LSJ", form_note: "a word that never changes its form" },
                { form: "ἐστι", lemma: "εἰμί", here: "there is", dict: "be, exist", src: "DCC", form_note: "he, she or it is, now" },
                { form: "σχολή", after: "·", lemma: "σχολή", here: "leisure, spare time", dict: "leisure, rest, ease", src: "LSJ", form_note: "a 'she' word (feminine), the subject: leisure is not there" },
              ],
              learn: {
                title: "“For me there is”: how Greek says I have",
                at: 0,
                text: [
                  "Greek can say *I have* by saying *there is … for me*. «ἐμοὶ … ἐστι σχολή» is literally *for me there is leisure*, that is, *I have leisure*.",
                  "«ἐμοί» is the 'to' or 'for' form of «ἐγώ», *I*. Its ending, not its place in the sentence, tells you that.",
                ],
              },
            },
          ],
          en: "But I have no leisure for them at all;",
          meaning: [
            "Phaedrus has asked whether Socrates believes the old story that the North Wind, Boreas, carried off a girl by this river. Socrates says that explaining such stories away, one by one, would take a great deal of spare time, and he has none for it.",
          ],
        },
        {
          pieces: [
            {
              words: [
                { form: "τὸ", lemma: "ὁ", here: "the", dict: "the", src: "DCC", form_note: "the 'it' form (neuter) of the, to match αἴτιον" },
                { form: "δὲ", lemma: "δέ", here: "and", dict: "and; but", src: "DCC", form_note: "a word that never changes; it sits second in its sentence" },
                { form: "αἴτιον", after: ",", lemma: "αἴτιος", here: "reason, cause", dict: "responsible, guilty", src: "DCC", form_note: "a describing word, responsible, in its 'it' form; with τό it means the thing responsible, the cause" },
                { form: "ὦ", lemma: "ὦ", here: "O, my", dict: "oh! (unemphatic when with the vocative)", src: "DCC", form_note: "a word that never changes; it comes before the name of the person spoken to" },
                { form: "φίλε", after: ",", lemma: "φίλος", here: "friend", dict: "beloved, dear; friendly", src: "DCC", form_note: "the form for calling someone: friend! Phaedrus is the one spoken to" },
                { form: "τούτου", lemma: "οὗτος", here: "of this", dict: "this, these", src: "DCC", form_note: "the 'of' form, 'it' form (neuter): of this, the reason for this" },
                { form: "τόδε", after: ".", lemma: "ὅδε", here: "(is) this", dict: "this", src: "DCC", form_note: "the 'it' form (neuter): this, the thing about to be said" },
              ],
              learn: {
                title: "Calling someone: ὦ φίλε",
                at: 4,
                text: [
                  "When you speak to someone, Greek puts the word for them in a special calling form, often after «ὦ». «φίλος» is *friend*; «ὦ φίλε» is *O friend!*, *my friend*.",
                  "Grammars call this the vocative. Many 'he' words ending «-ος» call with «-ε».",
                ],
              },
            },
          ],
          en: "and the reason, my friend, is this:",
          meaning: [
            "There is no *is* in the Greek: *the reason of this, this*. Greek often leaves out a verb that is easy to supply. «τόδε», *this here*, points forward to what Socrates says next.",
          ],
        },
        {
          pieces: [
            {
              words: [
                { form: "οὐ", lemma: "οὐ", here: "not", dict: "not (with indicative verbs)", src: "DCC", form_note: "a word that never changes its form" },
                { form: "δύναμαί", lemma: "δύναμαι", here: "I am able", dict: "(+infin.) to be able (to), be strong enough (to)", src: "DCC", form_note: "I do it, now. The extra accent on its last syllable comes from the little word after it, πω" },
                { form: "πω", lemma: "πω", here: "yet", dict: "up to this time, yet", src: "LSJ", form_note: "a word that never changes its form" },
              ],
              learn: {
                title: "The ending -μαι: I",
                at: 1,
                text: [
                  "«δύνα-μαι» ends in «-μαι», which here means *I*: *I am able*. No separate word for *I* is needed: the ending says it.",
                  "With «οὐ … πω» it means *I am not yet able*.",
                ],
              },
            },
            {
              words: [
                { form: "κατὰ", lemma: "κατά", here: "according to", dict: "down, down (from or along), throughout, according to", src: "DCC", form_note: "a little word that never changes its form" },
                { form: "τὸ", lemma: "ὁ", here: "the", dict: "the", src: "DCC", form_note: "the 'it' form (neuter) of the, to match γράμμα" },
                { form: "Δελφικὸν", lemma: "Δελφικός", here: "Delphic", dict: "Delphic, of Delphi", src: "LSJ", form_note: "a describing word, in its 'it' form to match γράμμα" },
                { form: "γράμμα", lemma: "γράμμα", here: "inscription, writing", dict: "letter, written character; (pl.) piece of writing, document(s)", src: "DCC", form_note: "an 'it' word (neuter), after κατά" },
              ],
              learn: {
                title: "The describing word sits inside",
                at: 2,
                text: [
                  "«τὸ Δελφικὸν γράμμα» is *the Delphic writing*. The describing word sits between *the* and its noun, just as in English.",
                  "All three words are in the 'it' form: the matching endings show that they belong together.",
                ],
              },
            },
            {
              words: [
                { form: "γνῶναι", lemma: "γιγνώσκω", here: "to know", dict: "come to know, learn; judge, think", src: "DCC", form_note: "the 'to' form of the verb: to know" },
                { form: "ἐμαυτόν", after: "·", lemma: "ἐμαυτοῦ", here: "myself", dict: "of me, of myself", src: "LSJ", form_note: "the thing to be known: the -ον ending marks it" },
              ],
              learn: {
                title: "To know: the -ναι ending",
                at: 0,
                text: [
                  "«γνῶ-ναι» ends in «-ναι», one of the endings for *to …*: *to know*. It finishes «δύναμαι», *I am able … to know*.",
                  "Grammars call this the infinitive.",
                ],
              },
            },
          ],
          en: "I am not yet able, as the Delphic inscription has it, to know myself;",
          meaning: [
            "The Delphic inscription is the saying carved at Apollo's temple: *know yourself*. Socrates says he has not managed it yet.",
          ],
        },
        {
          pieces: [
            {
              words: [
                { form: "γελοῖον", lemma: "γέλοιος", here: "ridiculous", dict: "mirth-provoking, amusing", src: "LSJ", form_note: "a describing word, in its 'it' form: a ridiculous thing" },
                { form: "δή", lemma: "δή", here: "indeed, so", dict: "surely, really, now, in fact, indeed (gives greater exactness)", src: "DCC", form_note: "a little word that never changes its form" },
                { form: "μοι", lemma: "ἐγώ", here: "to me", dict: "I, we", src: "DCC", form_note: "the 'to' form of ἐγώ, I: to me" },
                { form: "φαίνεται", lemma: "φαίνω", here: "it seems", dict: "(pass.) come to light, be seen, appear, appear to be", src: "DCC", form_note: "he, she or it does it, now: it seems" },
              ],
              learn: {
                title: "The ending -εται: it seems",
                at: 3,
                text: [
                  "«φαίν-εται» ends in «-εται»: *it seems*, *it appears*. The ending carries the *it*.",
                  "«φαίνω» on its own means *I bring to light*; with this ending it means *it shows itself*, *it seems*.",
                ],
              },
            },
            {
              words: [
                { form: "τοῦτο", lemma: "οὗτος", here: "this (thing)", dict: "this, these", src: "DCC", form_note: "the 'it' form (neuter): this, knowing himself" },
                { form: "ἔτι", lemma: "ἔτι", here: "still", dict: "still, yet", src: "DCC", form_note: "a word that never changes its form" },
                { form: "ἀγνοοῦντα", lemma: "ἀγνοέω", here: "not knowing", dict: "not to perceive or know, be ignorant of", src: "LSJ", form_note: "a verb used as a describing word: not knowing, describing Socrates himself" },
              ],
              learn: {
                title: "A verb that describes",
                at: 2,
                text: [
                  "«ἀγνοοῦντα» is a verb, *not know*, but its ending «-οῦντα» makes it a describing word: *not knowing*. Here it describes Socrates: *(me) still not knowing this*.",
                  "Grammars call this a participle. English does the same with *-ing*.",
                ],
              },
            },
            {
              words: [
                { form: "τὰ", lemma: "ὁ", here: "the", dict: "the", src: "DCC", form_note: "the 'it' form (neuter), plural, to match ἀλλότρια" },
                { form: "ἀλλότρια", lemma: "ἀλλότριος", here: "other people's (things)", dict: "of, belonging to another", src: "LSJ", form_note: "a describing word in the 'it' form, plural: other people's things" },
                { form: "σκοπεῖν", after: ".", lemma: "σκοπέω", here: "to look into", dict: "look at, watch; look into, consider, examine", src: "DCC", form_note: "the 'to' form of the verb: to look into" },
              ],
              learn: {
                title: "The + a describing word = a noun",
                at: 1,
                text: [
                  "«ἀλλότρια» means *belonging to someone else*. With «τά» and no noun, it becomes one: *the things that belong to others*, what is not one's own business.",
                  "English does this only now and then: *the rich*, *the old*. Greek does it all the time.",
                ],
              },
            },
          ],
          en: "so it seems to me ridiculous, when I do not yet know that, to investigate irrelevant things.",
          meaning: [
            "Until he knows himself, Socrates says, it is absurd to study things that are not his own concern. So he leaves the myths alone and examines himself instead: is he a monster more complicated and more furious than Typhon, or a gentler and simpler creature?",
          ],
        },
      ],
    },
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
    passage: {
      intro: "Socrates goes straight on to the river. Read the rest of his sentence about Heraclitus, a piece at a time.",
      sentences: [
        {
          pieces: [
            {
              words: [
                { form: "καὶ", lemma: "καί", here: "and", dict: "and, also, even", src: "DCC", form_note: "a word that never changes its form" },
                { form: "ποταμοῦ", lemma: "ποταμός", here: "of a river", dict: "river, stream", src: "DCC", form_note: "a 'he' word (masculine), in the 'of' form: of a river" },
                { form: "ῥοῇ", lemma: "ῥοή", here: "to the current", dict: "river, stream", src: "LSJ", form_note: "a 'she' word (feminine), in the 'to' form: to the flow" },
                { form: "ἀπεικάζων", lemma: "ἀπεικάζω", here: "likening", dict: "form from a model, represent, copy, become like", src: "LSJ", form_note: "a verb used as a describing word: likening, describing Heraclitus" },
              ],
              learn: {
                title: "Likening to: the 'to' form",
                at: 2,
                text: [
                  "To liken one thing *to* another, Greek puts the second thing in its 'to' form. «ῥο-ῇ» is the 'to' form of «ῥοή», *flow*: *likening (them) to the flow*.",
                  "«ποταμ-οῦ» is the 'of' form of «ποταμός», *river*: *to the flow of a river*.",
                ],
              },
            },
            {
              words: [
                { form: "τὰ", lemma: "ὁ", here: "the", dict: "the", src: "DCC", form_note: "the 'it' form (neuter), plural, to match ὄντα" },
                { form: "ὄντα", lemma: "εἰμί", here: "things that are", dict: "be, exist", src: "DCC", form_note: "a form of the verb be used as a describing word: being, in the 'it' form, plural" },
                { form: "λέγει", lemma: "λέγω", here: "he says", dict: "say, speak (of), recount", src: "DCC", form_note: "he, she or it does it, now: Heraclitus says" },
              ],
              learn: {
                title: "τὰ ὄντα: the things that are",
                at: 1,
                text: [
                  "«ὄντα» means *being*, from «εἰμί», *be*. With «τά» and no noun, it becomes one: *the things that are*, everything there is. Fowler translates it *the universe*.",
                  "It is the thing being likened: *likening the things that are to a river's flow, he says …*",
                ],
              },
            },
            {
              words: [
                { form: "ὡς", lemma: "ὡς", here: "that", dict: "as, since; (indir. statement) that", src: "DCC", form_note: "a word that never changes its form; after says, it means that" },
                { form: "δὶς", lemma: "δίς", here: "twice", dict: "twice", src: "LSJ", form_note: "a word that never changes its form" },
                { form: "ἐς", lemma: "εἰς", here: "into", dict: "into, to, towards", src: "DCC", form_note: "another spelling of εἰς, into; a little word that never changes" },
                { form: "τὸν", lemma: "ὁ", here: "the", dict: "the", src: "DCC", form_note: "the 'he' form, to match ποταμόν" },
                { form: "αὐτὸν", lemma: "αὐτός", here: "same", dict: "him- her- itself etc. (for emphasis); the same (with article)", src: "DCC", form_note: "the 'he' form, to match ποταμόν; the -ον ending follows ἐς" },
                { form: "ποταμὸν", lemma: "ποταμός", here: "river", dict: "river, stream", src: "DCC", form_note: "a 'he' word (masculine), with the -ον ending that follows ἐς" },
              ],
              learn: {
                title: "ὁ αὐτός: the same",
                at: 4,
                text: [
                  "«αὐτός» on its own means *self* or *him*. But between *the* and its noun it means *the same*: «τὸν αὐτὸν ποταμόν», *the same river*.",
                  "So the place of a word can change its meaning: watch for «αὐτός» right after *the*.",
                ],
              },
            },
            {
              words: [
                { form: "οὐκ", lemma: "οὐ", here: "not", dict: "not (with indicative verbs)", src: "DCC", form_note: "οὐ, not, written οὐκ before a vowel" },
                { form: "ἂν", lemma: "ἄν", here: "could", dict: "[marks verbs as potential (with optative)]", src: "DCC", form_note: "a little word that never changes; it adds could or would to the verb" },
                { form: "ἐμβαίης", after: ".", lemma: "ἐμβαίνω", here: "you would step in", dict: "step in", src: "LSJ", form_note: "you (one person) would do it; here you means anyone" },
              ],
              learn: {
                title: "ἄν: could, would",
                at: 1,
                text: [
                  "The little word «ἄν» turns a plain statement into a possibility. «ἐμβαίης» with «ἄν» is *you would step in*, *you could step in*; with «οὐκ», *you could not*.",
                  "Grammars call this verb form, with «ἄν», the potential optative. Its ending «-ης» here means *you*.",
                ],
              },
            },
          ],
          en: "and he likens the universe to the current of a river, saying that you cannot step twice into the same stream.",
          meaning: [
            "By the time you step in again, the water has flowed on: it is no longer the same river. Heraclitus uses the river as a picture of everything that exists, always changing.",
          ],
        },
      ],
    },
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
    passage: {
      intro: "The saying is only the start of a sentence. Read the rest of it, a piece at a time: four more short parts, each naming something hard about medicine.",
      sentences: [
        {
          pieces: [
            {
              words: [
                { form: "ἡ", lemma: "ὁ", here: "the", dict: "the", src: "DCC", form_note: "the 'she' form (feminine) of ὁ, for a 'she' word" },
                { form: "δὲ", lemma: "δέ", here: "and", dict: "and; but", src: "DCC", form_note: "a word that never changes its form" },
                { form: "τέχνη", lemma: "τέχνη", here: "the art (of medicine)", dict: "art, skill, craft", src: "DCC", form_note: "a 'she' word (feminine), the subject" },
                { form: "μακρὴ", after: ",", lemma: "μακρός", here: "long", dict: "long, tall, large, long-lasting", src: "DCC", form_note: "a describing word, in its 'she' form to match τέχνη" },
              ],
              learn: {
                title: "δέ sits second",
                at: 1,
                text: [
                  "«δέ» means *and* or *but*. It is never the first word: it always sits second in its part of the sentence, here just after «ἡ».",
                  "So «ἡ δὲ τέχνη» reads *and the art*. In this sentence each part after the first begins the same way: *the*, then «δέ».",
                ],
              },
            },
            {
              words: [
                { form: "ὁ", lemma: "ὁ", here: "the", dict: "the", src: "DCC", form_note: "the 'he' form (masculine) of the, for a 'he' word" },
                { form: "δὲ", lemma: "δέ", here: "and", dict: "and; but", src: "DCC", form_note: "a word that never changes; it sits second" },
                { form: "καιρὸς", lemma: "καιρός", here: "the right moment", dict: "the right time", src: "DCC", form_note: "a 'he' word (masculine), the subject" },
                { form: "ὀξὺς", after: ",", lemma: "ὀξύς", here: "quick, fleeting", dict: "sharp, keen, shrill, pungent", src: "DCC", form_note: "a describing word, in its 'he' form to match καιρός" },
              ],
              learn: {
                title: "No word for is",
                at: 3,
                text: [
                  "There is no *is* here: «ὁ καιρὸς ὀξύς» is *the moment (is) sharp*. Greek often leaves out *is* when it is easy to supply.",
                  "*Sharp* is what «ὀξύς» means; said of a moment, it means quick. Adams translates it *fleeting*.",
                ],
              },
            },
            {
              words: [
                { form: "ἡ", lemma: "ὁ", here: "the", dict: "the", src: "DCC", form_note: "the 'she' form (feminine) of the, for a 'she' word" },
                { form: "δὲ", lemma: "δέ", here: "and", dict: "and; but", src: "DCC", form_note: "a word that never changes; it sits second" },
                { form: "πεῖρα", lemma: "πεῖρα", here: "trying, experience", dict: "trial, attempt, experience", src: "LSJ", form_note: "a 'she' word (feminine), the subject" },
                { form: "σφαλερὴ", after: ",", lemma: "σφαλερός", here: "risky", dict: "likely to make one stumble, slippery, perilous", src: "LSJ", form_note: "a describing word, in its 'she' form to match πεῖρα" },
              ],
              learn: {
                title: "Ionic η for Attic α",
                at: 3,
                text: [
                  "The *Aphorisms* are written in Ionic, the Greek of Cos and the coast of Asia Minor. Where Athenians said «σφαλερά», with «-α», Ionic says «σφαλερή», with «-η».",
                  "Both are the 'she' form of the same word. The same goes for «μακρή»: in Athens it would be «μακρά».",
                ],
              },
            },
            {
              words: [
                { form: "ἡ", lemma: "ὁ", here: "the", dict: "the", src: "DCC", form_note: "the 'she' form (feminine) of the, for a 'she' word" },
                { form: "δὲ", lemma: "δέ", here: "and", dict: "and; but", src: "DCC", form_note: "a word that never changes; it sits second" },
                { form: "κρίσις", lemma: "κρίσις", here: "judging, decision", dict: "separating, distinguishing, decision, judgement", src: "LSJ", form_note: "a 'she' word (feminine), though it ends in -ις; the subject" },
                { form: "χαλεπή", after: ".", lemma: "χαλεπός", here: "difficult", dict: "difficult, troublesome", src: "DCC", form_note: "a describing word, in its 'she' form to match κρίσις" },
              ],
              learn: {
                title: "The is the clue",
                at: 2,
                text: [
                  "«κρίσις» does not end like «τέχνη» or «πεῖρα», but it is a 'she' word too. The word for *the* tells you: «ἡ».",
                  "The describing word agrees as well: «χαλεπή», the 'she' form. When a noun's ending leaves you unsure, look at its *the*.",
                ],
              },
            },
          ],
          en: "and Art long; the crisis fleeting; experience perilous, and decision difficult.",
          meaning: [
            "The moment to act on an illness passes quickly, trying out a treatment is risky, and judging what is wrong is hard.",
            "«καιρός» is not just time but the right time, the moment for doing something. Adams translates it *the crisis*, and «κρίσις» *decision*.",
          ],
        },
      ],
    },
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
    passage: {
      intro: "After its five short parts, the first aphorism ends with one longer sentence: what the doctor has to do. Read it a piece at a time.",
      sentences: [
        {
          pieces: [
            {
              words: [
                { form: "δεῖ", lemma: "δέω", here: "one must", dict: "lack, miss, stand in need of", src: "DCC", form_note: "it does it, now; used on its own, it means it is needed, one must" },
                { form: "δὲ", lemma: "δέ", here: "and", dict: "and; but", src: "DCC", form_note: "a word that never changes; it is never first, but sits second" },
                { form: "οὐ", lemma: "οὐ", here: "not", dict: "not (with indicative verbs)", src: "DCC", form_note: "a word that never changes its form" },
                { form: "μόνον", lemma: "μόνος", here: "only", dict: "alone, single", src: "DCC", form_note: "alone, used as a plain word that never changes: only" },
                { form: "ἑωυτὸν", lemma: "ἑαυτοῦ", here: "oneself", dict: "him- her- itself (reflexive pron.)", src: "DCC", form_note: "the -ον ending marks the one provided; Ionic spelling of ἑαυτόν" },
                { form: "παρέχειν", lemma: "παρέχω", here: "to present, to provide", dict: "provide, present, offer; allow, grant", src: "DCC", form_note: "the 'to' form of the verb: to present" },
              ],
              learn: {
                title: "δεῖ: one must",
                at: 0,
                text: [
                  "«δεῖ» means *there is need*, so *one must*. It names no person: whoever must act is left general. What must be done follows in the 'to' form, here «παρέχειν», *to present*.",
                  "So «δεῖ ἑωυτὸν παρέχειν» is *one must present oneself*: make oneself ready.",
                ],
              },
            },
            {
              words: [
                { form: "τὰ", lemma: "ὁ", here: "the", dict: "the", src: "DCC", form_note: "the 'it' form (neuter), plural, to match δέοντα" },
                { form: "δέοντα", lemma: "δέω", here: "things needed", dict: "lack, miss, stand in need of", src: "DCC", form_note: "a form of the verb used as a describing word: being needed, in the 'it' form, plural" },
                { form: "ποιεῦντα", after: ",", lemma: "ποιέω", here: "doing", dict: "make, produce, cause, do", src: "DCC", form_note: "a verb used as a describing word: doing, describing oneself; Ionic for ποιοῦντα" },
              ],
              learn: {
                title: "τὰ δέοντα: what is needed",
                at: 1,
                text: [
                  "«δέοντα» comes from the same verb as «δεῖ»: *being needed*. With «τά» and no noun, it becomes one: *the things that are needed*, what has to be done.",
                  "So the doctor must be *doing what is needed*. Adams translates it *what is right*.",
                ],
              },
            },
            {
              words: [
                { form: "ἀλλὰ", lemma: "ἀλλά", here: "but", dict: "but", src: "DCC", form_note: "a word that never changes its form" },
                { form: "καὶ", lemma: "καί", here: "also", dict: "and, also, even", src: "DCC", form_note: "a word that never changes; here it means also" },
                { form: "τὸν", lemma: "ὁ", here: "the", dict: "the", src: "DCC", form_note: "the 'he' form, to match νοσέοντα" },
                { form: "νοσέοντα", after: ",", lemma: "νοσέω", here: "sick man, patient", dict: "to be sick, ail", src: "LSJ", form_note: "a verb used as a describing word: being sick, in the 'he' form; with τόν, the sick man. Ionic for νοσοῦντα" },
              ],
              learn: {
                title: "Not only … but also",
                at: 0,
                text: [
                  "«οὐ μόνον … ἀλλὰ καί» works just like English *not only … but also*. Not only oneself, but also the patient.",
                  "The patient is presented in the same way: «τὸν νοσέοντα», *the sick man*, is in the same form as «ἑωυτόν»: the form for the one being presented.",
                ],
              },
            },
            {
              words: [
                { form: "καὶ", lemma: "καί", here: "and", dict: "and, also, even", src: "DCC", form_note: "a word that never changes its form" },
                { form: "τοὺς", lemma: "ὁ", here: "the", dict: "the", src: "DCC", form_note: "the 'he' form, plural, to match παρεόντας" },
                { form: "παρεόντας", after: ",", lemma: "πάρειμι", here: "those present, the attendants", dict: "be present, be ready or at hand", src: "DCC", form_note: "a verb used as a describing word: being present, 'he' form, plural; Ionic for παρόντας" },
                { form: "καὶ", lemma: "καί", here: "and", dict: "and, also, even", src: "DCC", form_note: "a word that never changes its form" },
                { form: "τὰ", lemma: "ὁ", here: "the", dict: "the", src: "DCC", form_note: "the 'it' form (neuter), plural" },
                { form: "ἔξωθεν", after: ".", lemma: "ἔξωθεν", here: "(things) outside", dict: "from without, outside", src: "LSJ", form_note: "a word that never changes its form" },
              ],
              learn: {
                title: "The + outside = the things outside",
                at: 5,
                text: [
                  "«ἔξωθεν» means *from outside*, and never changes. Put «τά» in front and it becomes a noun: «τὰ ἔξωθεν», *the things outside*, everything around the patient.",
                  "Greek can make a noun out of almost anything this way. Adams translates it *externals*.",
                ],
              },
            },
          ],
          en: "The physician must not only be prepared to do what is right himself, but also to make the patient, the attendants, and externals cooperate.",
          meaning: [
            "The Greek says only *one must*; Adams adds *the physician*, the reader the Aphorisms are written for. Doing the right thing yourself is not enough: the patient, the people around him and everything else must be made to work with you.",
          ],
        },
      ],
    },
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
    passage: {
      intro: "You have read the first words of Protagoras' book. Now read how that sentence ends, and how Diogenes Laertius says another of his books began, a piece at a time.",
      sentences: [
        {
          pieces: [
            {
              words: [
                { form: "τῶν", lemma: "ὁ", here: "of the (things)", dict: "the", src: "DCC", form_note: "the 'of' form of the, plural, to match ὄντων" },
                { form: "μὲν", lemma: "μέν", here: "on the one hand", dict: "on the one hand...on the other hand (often untranslated); μέν (by itself) indeed", src: "DCC", form_note: "a little word that never changes its form; it looks ahead to a δέ" },
                { form: "ὄντων", lemma: "εἰμί", here: "being, that are", dict: "be, exist", src: "DCC", form_note: "a form of the verb be used as a describing word, plural, in the 'of' form: of (things) being" },
                { form: "ὡς", lemma: "ὡς", here: "that", dict: "as, since; (introducing purpose clause) so that (+subj./opt.); (introducing indir. statement) that", src: "DCC", form_note: "a little word that never changes its form; here it means that" },
                { form: "ἔστιν", after: ",", lemma: "εἰμί", here: "they are", dict: "be, exist", src: "DCC", form_note: "he, she or it does it, now: it is; Greek uses it for a plural of things too" },
              ],
              learn: {
                title: "The things that are",
                at: 2,
                text: [
                  "«ὄντων» is the verb *be*, but its ending makes it a describing word: *being*. With *the* in front, «τῶν ὄντων», it needs no noun: *of the being (things)*, that is, *of things that are*.",
                  "Greek often does this. *The* plus a describing word makes a noun out of it, the way English says *the rich* or *the unknown*.",
                ],
              },
            },
            {
              words: [
                { form: "τῶν", lemma: "ὁ", here: "of the (things)", dict: "the", src: "DCC", form_note: "the 'of' form of the, plural, to match ὄντων" },
                { form: "δὲ", lemma: "δέ", here: "and on the other hand", dict: "and; but", src: "DCC", form_note: "a little word that never changes its form; it answers the μέν before it" },
                { form: "οὐκ", lemma: "οὐ", here: "not", dict: "not (with indicative verbs)", src: "DCC", form_note: "οὐ, spelled οὐκ before a vowel" },
                { form: "ὄντων", lemma: "εἰμί", here: "being, that are", dict: "be, exist", src: "DCC", form_note: "the verb be as a describing word, plural, in the 'of' form" },
                { form: "ὡς", lemma: "ὡς", here: "that", dict: "as, since; (introducing purpose clause) so that (+subj./opt.); (introducing indir. statement) that", src: "DCC", form_note: "a little word that never changes its form; here it means that" },
                { form: "οὐκ", lemma: "οὐ", here: "not", dict: "not (with indicative verbs)", src: "DCC", form_note: "οὐ, spelled οὐκ before a vowel" },
                { form: "ἔστιν", after: ".", lemma: "εἰμί", here: "they are", dict: "be, exist", src: "DCC", form_note: "he, she or it does it, now: it is" },
              ],
              learn: {
                title: "One hand, the other hand",
                at: 1,
                text: [
                  "«μέν» in the first half and «δέ» in the second set the two halves side by side: *on the one hand* the things that are, *on the other hand* the things that are not.",
                  "English usually leaves «μέν» untranslated and says *and* for «δέ», as the translation does here. The pair is everywhere in Greek prose.",
                ],
              },
            },
          ],
          en: "of things that are that they are, and of things that are not that they are not",
          meaning: [
            "Protagoras says man is the measure both of what is, that it is, and of what is not, that it is not.",
          ],
        },
        {
          pieces: [
            {
              words: [
                { form: "περὶ", lemma: "περί", here: "about, as to", dict: "around, about; concerning (+gen.)", src: "DCC", form_note: "a little place word that never changes its form; the word after it is in the 'of' form" },
                { form: "μὲν", lemma: "μέν", here: "(untranslated)", dict: "on the one hand...on the other hand (often untranslated); μέν (by itself) indeed", src: "DCC", form_note: "a little word that never changes its form" },
                { form: "θεῶν", lemma: "θεός", here: "the gods", dict: "god, goddess", src: "DCC", form_note: "plural, in the 'of' form, after περί" },
                { form: "οὐκ", lemma: "οὐ", here: "not", dict: "not (with indicative verbs)", src: "DCC", form_note: "οὐ, spelled οὐκ before a vowel" },
                { form: "ἔχω", lemma: "ἔχω", here: "I am able", dict: "have, hold, keep", src: "DCC", form_note: "I do it, now" },
                { form: "εἰδέναι", lemma: "οἶδα", here: "to know", dict: "to know (pf. in pres. sense); to know how to (+infin.)", src: "DCC", form_note: "the 'to' form of the verb: to know" },
              ],
              learn: {
                title: "I have, meaning I can",
                at: 4,
                text: [
                  "«ἔχω» means *I have*. With a *to* form of a verb after it, «ἔχω εἰδέναι», it means *I am able to know*: I have the means of knowing.",
                  "So «οὐκ ἔχω εἰδέναι» is *I am not able to know*, which the translation gives as *I have no means of knowing*.",
                ],
              },
            },
            {
              words: [
                { form: "οὔθʼ", lemma: "οὔτε", here: "either", dict: "neither...nor", src: "DCC", form_note: "οὔτε with its last vowel dropped before the next word" },
                { form: "ὡς", lemma: "ὡς", here: "that", dict: "as, since; (introducing purpose clause) so that (+subj./opt.); (introducing indir. statement) that", src: "DCC", form_note: "a little word that never changes its form; here it means that" },
                { form: "εἰσίν", after: ",", lemma: "εἰμί", here: "they exist", dict: "be, exist", src: "DCC", form_note: "they do it, now: they are" },
                { form: "οὔθʼ", lemma: "οὔτε", here: "or", dict: "neither...nor", src: "DCC", form_note: "οὔτε with its last vowel dropped before the next word" },
                { form: "ὡς", lemma: "ὡς", here: "that", dict: "as, since; (introducing purpose clause) so that (+subj./opt.); (introducing indir. statement) that", src: "DCC", form_note: "a little word that never changes its form" },
                { form: "οὐκ", lemma: "οὐ", here: "not", dict: "not (with indicative verbs)", src: "DCC", form_note: "οὐ, spelled οὐκ before a vowel" },
                { form: "εἰσίν", lemma: "εἰμί", here: "they exist", dict: "be, exist", src: "DCC", form_note: "they do it, now: they are" },
              ],
              learn: {
                title: "Neither … nor",
                at: 0,
                text: [
                  "«οὔτε … οὔτε» is *neither … nor*. Here it follows *not able to know*, so English turns it round: *(not able to know) either that they exist or that they do not exist*.",
                  "«οὔθʼ» is «οὔτε» cut short: before a vowel the -ε drops, and before the breathing on «ὡς» the τ becomes θ.",
                ],
              },
            },
          ],
          en: "As to the gods, I have no means of knowing either that they exist or that they do not exist",
          meaning: [
            "Protagoras says he cannot know whether the gods exist or not. He gives two reasons: the question is obscure, and human life is short.",
          ],
        },
      ],
    },
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
    passage: {
      intro: "You have read Socrates' words about the man he questioned. Now read the sentence that comes straight after them, a piece at a time.",
      sentences: [
        {
          pieces: [
            {
              words: [
                { form: "ἔοικα", lemma: "ἔοικα", here: "I seem", dict: "be like, look like (+dat.); seem; befit", src: "DCC", form_note: "I do it; it looks like a past form but means now: I seem" },
                { form: "γοῦν", lemma: "γοῦν", here: "then, at any rate", dict: "at least then, at all events", src: "LSJ", form_note: "a little word that never changes its form" },
                { form: "τούτου", lemma: "οὗτος", here: "than this man", dict: "this, these", src: "DCC", form_note: "the 'he' form, in the 'of' form; after a comparing word it means than this man" },
                { form: "γε", lemma: "γε", here: "at any rate", dict: "(enclitic) indeed; at least, at any rate", src: "DCC", form_note: "a little word that never changes its form; it leans on the word before it" },
              ],
              learn: {
                title: "A little word that stresses",
                at: 3,
                text: [
                  "«γε» puts weight on the word just before it, here «τούτου», *this man*: *than this man at any rate*. Socrates claims to be wiser than this one man, not than everyone.",
                  "«γε» never stands first and never changes its form. English shows the same stress with *at least* or *at any rate*, or just with the voice.",
                ],
              },
            },
            {
              words: [
                { form: "σμικρῷ", lemma: "μικρός", here: "in a little (thing)", dict: "small, little, short", src: "DCC", form_note: "the 'to' form, here meaning in or by; σμικρός is an old spelling of μικρός" },
                { form: "τινι", lemma: "τις", here: "some, a certain", dict: "someone, something, anyone, anything, some, any", src: "DCC", form_note: "the 'to' form, to match σμικρῷ" },
                { form: "αὐτῷ", lemma: "αὐτός", here: "just", dict: "him- her- itself etc. (for emphasis); the same", src: "DCC", form_note: "the 'to' form, to match τούτῳ; it stresses it: this very thing" },
                { form: "τούτῳ", lemma: "οὗτος", here: "this (thing)", dict: "this, these", src: "DCC", form_note: "the 'to' form, 'it' form" },
                { form: "σοφώτερος", lemma: "σοφός", here: "wiser", dict: "wise, clever, skilled", src: "DCC", form_note: "the comparing form of σοφός, in the 'he' form, because Socrates is speaking of himself" },
                { form: "εἶναι", after: ",", lemma: "εἰμί", here: "to be", dict: "be, exist", src: "DCC", form_note: "the 'to' form of the verb: to be" },
              ],
              learn: {
                title: "Wiser: the ending -τερος",
                at: 4,
                text: [
                  "«σοφός» is *wise*. Add «-τερος» and it becomes «σοφώτερος», *wiser*, the way English adds *-er*.",
                  "The person you are compared with goes in the 'of' form: «τούτου», earlier in this sentence, means *than this man*.",
                ],
              },
            },
            {
              words: [
                { form: "ὅτι", lemma: "ὅτι", here: "that", dict: "because, that", src: "DCC", form_note: "a little word that never changes its form" },
                { form: "ἃ", lemma: "ὅς", here: "what", dict: "who, which, that", src: "DCC", form_note: "the 'it' form, plural: the things which" },
                { form: "μὴ", lemma: "μή", here: "not", dict: "not (marks the negative as subjective or conditional)", src: "DCC", form_note: "a word for not that never changes its form; it makes the things general: whatever I do not know" },
                { form: "οἶδα", lemma: "οἶδα", here: "I know", dict: "to know (pf. in pres. sense); to know how to (+infin.)", src: "DCC", form_note: "I do it, now: I know" },
                { form: "οὐδὲ", lemma: "οὐδέ", here: "not … either", dict: "and not, but not, nor", src: "DCC", form_note: "a little word that never changes its form" },
                { form: "οἴομαι", lemma: "οἴομαι", here: "I think", dict: "think, suppose, imagine", src: "DCC", form_note: "I do it, now" },
                { form: "εἰδέναι", after: ".", lemma: "οἶδα", here: "(that I) know", dict: "to know (pf. in pres. sense); to know how to (+infin.)", src: "DCC", form_note: "the 'to' form of the verb: to know" },
              ],
              learn: {
                title: "Not … either",
                at: 4,
                text: [
                  "«οὐδέ» is «οὐ», *not*, joined to «δέ», *and*: *and not*, *not … either*. «οὐδὲ οἴομαι» is *I do not think either*.",
                  "So: what I do not know, I do not think I know either. Socrates' only claim to wisdom is that he does not fool himself.",
                ],
              },
            },
          ],
          en: "I seem, then, in just this little thing to be wiser than this man at any rate, that what I do not know I do not think I know either.",
          meaning: [
            "The man Socrates questioned thought he knew something when he did not. Socrates does not think he knows what he does not know, and in that one small thing, he says, he is wiser.",
          ],
        },
      ],
    },
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
    passage: {
      intro: "You have read Socrates' most famous sentence. Now read how it ends, and the sentence after it, a piece at a time.",
      sentences: [
        {
          pieces: [
            {
              words: [
                { form: "ταῦτα", lemma: "οὗτος", here: "these things", dict: "this, these", src: "DCC", form_note: "the 'it' form, plural: these things" },
                { form: "δʼ", lemma: "δέ", here: "and", dict: "and; but", src: "DCC", form_note: "δέ with its vowel dropped before the next word" },
                { form: "ἔτι", lemma: "ἔτι", here: "still", dict: "still, yet", src: "DCC", form_note: "a word that never changes its form" },
                { form: "ἧττον", lemma: "ἥσσων", here: "less", dict: "less, weaker (comp. of κακός or μικρός)", src: "DCC", form_note: "a comparing word, used here as a how-word: less; ἧττον is the Attic spelling of ἧσσον" },
                { form: "πείσεσθέ", lemma: "πείθω", here: "you will believe", dict: "persuade, win over; (mid. and pass.) obey, believe in, trust in (+dat.)", src: "DCC", form_note: "you (more than one) will do it; the -σεσθε ending is a future one" },
                { form: "μοι", lemma: "ἐγώ", here: "me", dict: "I, we", src: "DCC", form_note: "the 'to' form of I" },
                { form: "λέγοντι", after: ".", lemma: "λέγω", here: "(when I am) saying", dict: "say, speak (of), recount; pick up, collect, count", src: "DCC", form_note: "a verb used as a describing word, in the 'to' form, to match μοι" },
              ],
              learn: {
                title: "Believe, from persuade",
                at: 4,
                text: [
                  "«πείθω» means *I persuade*. In its other set of endings, the ones that turn the action back on the doer, it means *I let myself be persuaded*: *I believe, I trust*.",
                  "The person you believe goes in the 'to' form: «πείσεσθέ μοι», *you will believe me*. «λέγοντι» matches «μοι»: *me, saying these things*.",
                ],
              },
            },
          ],
          en: "you will believe me still less",
          meaning: [
            "Socrates has said that the best thing for a person is to talk every day about virtue, examining himself and others. If he says this too, he tells the jury, they will believe him even less.",
          ],
        },
        {
          pieces: [
            {
              words: [
                { form: "τὰ", lemma: "ὁ", here: "the matter, these things", dict: "the", src: "DCC", form_note: "the, 'it' form, plural, standing on its own: the things" },
                { form: "δὲ", lemma: "δέ", here: "but", dict: "and; but", src: "DCC", form_note: "a little word that never changes its form" },
                { form: "ἔχει", lemma: "ἔχω", here: "is", dict: "have, hold, keep", src: "DCC", form_note: "he, she or it does it, now; Greek uses it for a plural of things" },
                { form: "μὲν", lemma: "μέν", here: "(untranslated)", dict: "on the one hand...on the other hand (often untranslated); μέν (by itself) indeed", src: "DCC", form_note: "a little word that never changes its form; it looks ahead to a δέ" },
                { form: "οὕτως", after: ",", lemma: "οὕτως", here: "so, this way", dict: "in this way", src: "DCC", form_note: "a how-word that never changes its form" },
              ],
              learn: {
                title: "Have, meaning be",
                at: 2,
                text: [
                  "«ἔχω» means *I have, I hold*. With a how-word after it, it says how things are: «ἔχει οὕτως», *it holds this way*, that is, *it is so*.",
                  "Here *it* is «τὰ», *the things*: the matter *is* as Socrates says.",
                ],
              },
            },
            {
              words: [
                { form: "ὡς", lemma: "ὡς", here: "as", dict: "as, since; (introducing purpose clause) so that (+subj./opt.); (introducing indir. statement) that", src: "DCC", form_note: "a little word that never changes its form; here it means as" },
                { form: "ἐγώ", lemma: "ἐγώ", here: "I", dict: "I, we", src: "DCC", form_note: "I, said out loud for stress" },
                { form: "φημι", after: ",", lemma: "φημί", here: "say", dict: "say, assert, declare; οὐ φημί deny, refuse, say that...not", src: "DCC", form_note: "I do it, now" },
                { form: "ὦ", lemma: "ὦ", here: "O", dict: "oh! (unemphatic when with the vocative)", src: "DCC", form_note: "a calling word that never changes its form" },
                { form: "ἄνδρες", after: ",", lemma: "ἀνήρ", here: "gentlemen, men", dict: "man, husband", src: "DCC", form_note: "plural, in the calling form" },
              ],
              learn: {
                title: "Calling out to someone",
                at: 4,
                text: [
                  "Greek has a form for calling to people. «ὦ ἄνδρες» is *O men*: Socrates is talking straight to the jury, and the translation gives it as *gentlemen*.",
                  "The little word «ὦ» often comes first; here it adds no weight, much as English *O* would not.",
                ],
              },
            },
            {
              words: [
                { form: "πείθειν", lemma: "πείθω", here: "to convince (you)", dict: "persuade, win over; (mid. and pass.) obey, believe in, trust in (+dat.)", src: "DCC", form_note: "the 'to' form of the verb: to persuade" },
                { form: "δὲ", lemma: "δέ", here: "but", dict: "and; but", src: "DCC", form_note: "a little word that never changes its form; it answers the μέν before it" },
                { form: "οὐ", lemma: "οὐ", here: "not", dict: "not (with indicative verbs)", src: "DCC", form_note: "a word for not that never changes its form" },
                { form: "ῥᾴδιον", after: ".", lemma: "ῥᾴδιος", here: "easy", dict: "easy", src: "DCC", form_note: "a describing word, in the 'it' form" },
              ],
              learn: {
                title: "Is, left unsaid",
                at: 3,
                text: [
                  "There is no *is* in «πείθειν δὲ οὐ ῥᾴδιον». Greek often leaves it out, so read it in: *but to convince (you) is not easy*.",
                ],
              },
            },
          ],
          en: "This is as I say, gentlemen, but it is not easy to convince you",
          meaning: [
            "Socrates insists that what he says is true, but he knows it is hard to make the jury believe it.",
          ],
        },
      ],
    },
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
    passage: {
      intro: "You have read Aristotle's saying about man and the city. Now read the next part of his sentence, and a sentence a little further on, a piece at a time.",
      sentences: [
        {
          pieces: [
            {
              words: [
                { form: "καὶ", lemma: "καί", here: "and", dict: "and, also, even; καί...καί both...and", src: "DCC", form_note: "a word that never changes its form" },
                { form: "ὁ", lemma: "ὁ", here: "the", dict: "the", src: "DCC", form_note: "the 'he' form, to match ἄπολις" },
                { form: "ἄπολις", lemma: "ἄπολις", here: "(man) without a city", dict: "without city, state, country, outlaw, banished man, no true citizen", src: "LSJ", form_note: "a 'he' word (masculine), the one who does or is" },
                { form: "διὰ", lemma: "διά", here: "by, because of", dict: "through, during, because of (+gen., acc.)", src: "DCC", form_note: "a little word that never changes its form" },
                { form: "φύσιν", lemma: "φύσις", here: "nature", dict: "nature; (of the mind) one’s nature or disposition; regular order of nature", src: "DCC", form_note: "a 'she' word (feminine); the -ιν ending follows διά" },
              ],
              learn: {
                title: "ἀ- means without",
                at: 2,
                text: [
                  "«ἄπολις» is «πόλις», *city*, with «ἀ-» in front, which means *not* or *without*: *cityless*, a man with no city.",
                  "English has the same «ἀ-» in words borrowed from Greek: *a-theist*, without a god; *a-typical*, not typical.",
                ],
              },
            },
            {
              words: [
                { form: "καὶ", lemma: "καί", here: "and", dict: "and, also, even; καί...καί both...and", src: "DCC", form_note: "a word that never changes its form" },
                { form: "οὐ", lemma: "οὐ", here: "not", dict: "not (with indicative verbs)", src: "DCC", form_note: "a word for not that never changes its form" },
                { form: "διὰ", lemma: "διά", here: "by, because of", dict: "through, during, because of (+gen., acc.)", src: "DCC", form_note: "a little word that never changes its form" },
                { form: "τύχην", lemma: "τύχη", here: "fortune, chance", dict: "luck, fortune (good or bad), fate, chance", src: "DCC", form_note: "a 'she' word (feminine); the -ην ending follows διά" },
              ],
              learn: {
                title: "διά: through, or because of",
                at: 2,
                text: [
                  "«διά» with the 'of' form means *through*. With the ending that marks the thing done to, as here, it means *because of*: «διὰ τύχην», *because of fortune*.",
                  "So Aristotle sets the two side by side: cityless *by nature*, «διὰ φύσιν», and not *by fortune*, «διὰ τύχην».",
                ],
              },
            },
            {
              words: [
                { form: "ἤτοι", lemma: "ἤτοι", here: "either", dict: "= ἤ τοι, v. ἤ", src: "LSJ", form_note: "a little word that never changes its form" },
                { form: "φαῦλός", lemma: "φαῦλος", here: "low, poor", dict: "cheap, easy, slight, paltry", src: "LSJ", form_note: "a describing word, 'he' form; it takes a second accent from ἐστιν after it" },
                { form: "ἐστιν", after: ",", lemma: "εἰμί", here: "is", dict: "be, exist", src: "DCC", form_note: "he, she or it does it, now: he is" },
                { form: "ἢ", lemma: "ἤ", here: "or", dict: "or; than (after a comparative); ἤ...ἤ either...or", src: "DCC", form_note: "a little word that never changes its form" },
                { form: "κρείττων", lemma: "κρείσσων", glaux: "κρατύς", here: "higher, better", dict: "stronger, mightier; better, more excellent (comp. of ἀγαθός)", src: "DCC", form_note: "a comparing word, 'he' form; κρείττων is the Attic spelling of κρείσσων" },
                { form: "ἢ", lemma: "ἤ", here: "than", dict: "or; than (after a comparative); ἤ...ἤ either...or", src: "DCC", form_note: "a little word that never changes its form" },
                { form: "ἄνθρωπος", lemma: "ἄνθρωπος", here: "a man, a human", dict: "human being", src: "DCC", form_note: "a 'he' word (masculine), the one who does or is" },
              ],
              learn: {
                title: "ἤ: or, and than",
                at: 5,
                text: [
                  "«ἤ» means *or*: «ἤτοι … ἢ» is *either … or*. But after a comparing word it means *than*: «κρείττων ἢ ἄνθρωπος», *better than a man*.",
                  "So the cityless man is either a poor sort of man or more than a man: *low in the scale of humanity or above it*.",
                ],
              },
            },
          ],
          en: "and a man that is by nature and not merely by fortune citiless is either low in the scale of humanity or above it",
          meaning: [
            "A man who is without a city by his nature, not by bad luck, says Aristotle, is either less than a man or more than one. He compares him to a lone piece in a board game.",
          ],
        },
        {
          pieces: [
            {
              words: [
                { form: "λόγον", lemma: "λόγος", here: "speech", dict: "word, speech, discourse; thought, reason, account", src: "DCC", form_note: "a 'he' word (masculine); the -ον ending marks the thing had" },
                { form: "δὲ", lemma: "δέ", here: "and", dict: "and; but", src: "DCC", form_note: "a little word that never changes its form" },
                { form: "μόνον", lemma: "μόνος", here: "alone", dict: "alone, single", src: "DCC", form_note: "a word for alone, here used as a how-word: only" },
                { form: "ἄνθρωπος", lemma: "ἄνθρωπος", here: "man, a human", dict: "human being", src: "DCC", form_note: "a 'he' word (masculine), the one who does or is" },
                { form: "ἔχει", lemma: "ἔχω", here: "has, possesses", dict: "have, hold, keep", src: "DCC", form_note: "he, she or it does it, now" },
                { form: "τῶν", lemma: "ὁ", here: "of the", dict: "the", src: "DCC", form_note: "the 'of' form of the, plural, to match ζῴων" },
                { form: "ζῴων", lemma: "ζῷον", here: "animals", dict: "living being, animal", src: "DCC", form_note: "an 'it' word (neuter), plural, in the 'of' form: of the animals" },
              ],
              learn: {
                title: "The important word first",
                at: 0,
                text: [
                  "«λόγον», *speech*, comes first, though it is the thing had, not the one who has. Its ending «-ον» shows its job, so Greek can put it wherever it wants the weight: *speech* is what man alone has.",
                  "«ἄνθρωπος», with «-ος», is the one who has. English must say *man has speech*; Greek can say *speech … man has*.",
                ],
              },
            },
          ],
          en: "and man alone of the animals possesses speech",
          meaning: [
            "Aristotle says that of all the animals only man has speech. Voice can show pain and pleasure, he goes on, but speech shows what is helpful and harmful, and so what is right and wrong.",
          ],
        },
      ],
    },
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
    passage: {
      intro: "You have read the four words. Now read the whole question from Plato's *Laws*, and the answer it gets, a piece at a time.",
      sentences: [
        {
          pieces: [
            {
              words: [
                { form: "ἔσθʼ", lemma: "εἰμί", here: "is there", dict: "be, exist", src: "DCC", form_note: "ἔστι, there is, with its last vowel dropped before the next word; the τ turns into θ before the h sound at the start of ὅστις" },
                { form: "ὅστις", lemma: "ὅστις", here: "anyone who", dict: "anyone who, anything which; (in indir. quest.) who, which, what", src: "DCC", form_note: "the 'he' form (masculine), singular: the person the question is about" },
                { form: "ταῦτα", lemma: "οὗτος", here: "these things", dict: "this, these", src: "DCC", form_note: "the 'it' form (neuter), plural: these things, the argument just made" },
                { form: "ὁμολογῶν", lemma: "ὁμολογέω", here: "agreeing to", dict: "agree with, say the same thing as (+dat.)", src: "DCC", form_note: "a verb used as a describing word, in the 'he' form, singular, to match ὅστις: agreeing" },
              ],
              learn: {
                title: "A dropped vowel",
                at: 0,
                text: [
                  "«ἔσθʼ» is «ἔστι», *there is*. When a short vowel ends a word and the next word begins with a vowel, Greek often drops it and marks the gap with «ʼ». English does the same in *it's* for *it is*.",
                  "Here there is a second change: «ὅστις» begins with an *h* sound (the mark «ʽ» over its first letter), and that turns «τ» into «θ». So «ἔστι ὅστις» becomes «ἔσθʼ ὅστις».",
                ],
              },
            },
            {
              words: [
                { form: "ὑπομενεῖ", lemma: "ὑπομένω", here: "will stand for, will put up with", dict: "stay behind, remain; await; submit to, bear", src: "LSJ", form_note: "he will do it: the future, with the 'he, she or it' ending -εῖ" },
                { form: "μὴ", lemma: "μή", here: "not", dict: "not (marks the negative as subjective or conditional); εἰ μή if not, except", src: "DCC", form_note: "a word that never changes its form; it is the not used with a to … word like εἶναι" },
                { form: "θεῶν", lemma: "θεός", here: "of gods", dict: "god, goddess", src: "DCC", form_note: "the 'of' form, plural: the -ων ending means of" },
                { form: "εἶναι", lemma: "εἰμί", here: "to be (that they are)", dict: "be, exist", src: "DCC", form_note: "to be" },
                { form: "πλήρη", lemma: "πλήρης", here: "full", dict: "full of, infected by, polluted, satisfied, satiated", src: "LSJ", form_note: "the 'it' form (neuter), plural, to match πάντα" },
                { form: "πάντα", after: ";", lemma: "πᾶς", here: "all things", dict: "every, all; whole (with article)", src: "DCC", form_note: "the 'it' form (neuter), plural: all things. The ; after it is the Greek question mark" },
              ],
              learn: {
                title: "Full of: the 'of' form",
                at: 4,
                text: [
                  "«πλήρη» means *full*. What a thing is full of goes in the *of* form: «θεῶν», *of gods*, where the plural ending «-ων» means *of*.",
                  "So «θεῶν εἶναι πλήρη πάντα» is *all things to be full of gods*: *that all things are full of gods*. With «μὴ» in front, the stranger asks who would bear to hear that they are *not*.",
                ],
              },
            },
          ],
          en: "Is there any man that agrees with this view who will stand hearing it denied that all things are full of gods?",
          meaning: [
            "The Athenian stranger has argued that souls move the sun, the moon and the stars, and that these souls are gods. So, he asks, could anyone who agrees with that still deny that all things are full of gods?",
          ],
        },
        {
          pieces: [
            {
              words: [
                { form: "οὐκ", lemma: "οὐ", here: "not", dict: "not (with indicative verbs)", src: "DCC", form_note: "οὐ, not, spelled οὐκ before a vowel" },
                { form: "ἔστιν", lemma: "εἰμί", here: "there is", dict: "be, exist", src: "DCC", form_note: "he, she or it is; at the start of a sentence, there is. The -ν is added because the next word begins with a vowel" },
                { form: "οὕτως", after: ",", lemma: "οὕτως", here: "so", dict: "in this way", src: "DCC", form_note: "a word that never changes its form" },
                { form: "ὦ", lemma: "ὦ", here: "O", dict: "oh! (unemphatic when with the vocative)", src: "DCC", form_note: "a word that never changes; it goes with the person spoken to" },
                { form: "ξένε", after: ",", lemma: "ξένος", here: "stranger", dict: "guest-friend; foreigner, stranger", src: "DCC", form_note: "the calling form (vocative), singular: the -ε ending is used when speaking to someone" },
                { form: "παραφρονῶν", lemma: "παραφρονέω", here: "out of his mind", dict: "to be beside oneself, deranged, to be delirious", src: "LSJ", form_note: "a verb used as a describing word, in the 'he' form, singular, to match οὐδείς: being out of his mind" },
                { form: "οὐδείς", after: ".", lemma: "οὐδείς", here: "no one", dict: "no one, nothing", src: "DCC", form_note: "the 'he' form (masculine), singular: no one. It is made of οὐδέ, not even, and εἷς, one" },
              ],
              learn: {
                title: "Two nots: still no",
                at: 6,
                text: [
                  "«οὐκ» is *not*, and «οὐδείς» is *no one*. In English two negatives cancel out. In Greek, when *not* is followed by a word like *no one*, the second makes the first stronger.",
                  "So «οὐκ ἔστιν … οὐδείς» is *there is not anyone at all*, never *there is someone*.",
                ],
              },
            },
          ],
          en: "There is not a man, Stranger, so wrong-headed as that.",
          meaning: [
            "Clinias of Crete, one of the two old men walking with the stranger, answers at once: no one could be so out of his mind. Once the argument is granted, the gods are everywhere.",
          ],
        },
      ],
    },
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
    passage: {
      intro: "You have read the first half of the line. Now read its other half, and the sentence that follows it, a piece at a time.",
      sentences: [
        {
          pieces: [
            {
              words: [
                { form: "ἴσασιν", lemma: "οἶδα", here: "they know", dict: "to know", src: "DCC", form_note: "they know: the ending -ασι(ν) is the they ending of οἶδα, I know" },
                { form: "δὲ", lemma: "δέ", here: "but", dict: "and; but", src: "DCC", form_note: "a word that never changes and never comes first" },
                { form: "οὐδὲν", lemma: "οὐδείς", here: "nothing", dict: "no one, nothing", src: "DCC", form_note: "the 'it' form (neuter), singular: nothing" },
                { form: "ὧν", lemma: "ὅς", here: "of (the things) which", dict: "who, which, that", src: "DCC", form_note: "the 'of' form, plural: of the things which" },
                { form: "λέγουσι", after: ".", lemma: "λέγω", here: "they say", dict: "say, speak (of), recount; pick up, collect, count", src: "DCC", form_note: "they do it, now: the ending -ουσι means they" },
              ],
              learn: {
                title: "δέ: the second half",
                at: 1,
                text: [
                  "«δέ» means *but* or *and*. It never stands first: it comes second in its half of the sentence, after the word that leads it, here «ἴσασιν», *they know*.",
                  "It answers a «μέν» in the first half: «λέγουσι μὲν πολλὰ καὶ καλά, ἴσασιν δὲ οὐδέν», *on the one hand they say many fine things, but they know nothing*.",
                ],
              },
            },
          ],
          en: "but know none of the things they say",
          meaning: [
            "Socrates is speaking of prophets and givers of oracles: their words are fine, but they do not understand them.",
          ],
        },
        {
          pieces: [
            {
              words: [
                { form: "τοιοῦτόν", lemma: "τοιοῦτος", here: "such", dict: "such, of such a sort", src: "DCC", form_note: "the 'it' form (neuter), singular, to match πάθος. It takes a second accent from τι, which leans on it" },
                { form: "τί", lemma: "τις", here: "a kind of", dict: "someone, something, anyone, anything, some, any (enclitic indef. pron./adj.)", src: "DCC", form_note: "the 'it' form (neuter), singular, to match πάθος" },
                { form: "μοι", lemma: "ἐγώ", here: "to me", dict: "I, we", src: "DCC", form_note: "the 'to' form of ἐγώ, I: to me" },
                { form: "ἐφάνησαν", lemma: "φαίνω", here: "they appeared, it was plain", dict: "(pass.) come to light, be seen, appear", src: "DCC", form_note: "they did it, in the past: the ἐ- in front marks the past, and -σαν means they" },
                { form: "πάθος", lemma: "πάθος", here: "experience", dict: "experience; passion, emotion; state, condition", src: "DCC", form_note: "an 'it' word (neuter); here the thing experienced" },
              ],
              learn: {
                title: "ἐ-: the mark of the past",
                at: 3,
                text: [
                  "«ἐ-φάνη-σαν» begins with «ἐ-». Greek puts this «ἐ-» in front of a verb to say that it happened in the past.",
                  "So *they appear* becomes «ἐφάνησαν», *they appeared*: the poets, Socrates says, appeared this way to him.",
                ],
              },
            },
            {
              words: [
                { form: "καὶ", lemma: "καί", here: "also", dict: "and, also, even", src: "DCC", form_note: "a word that never changes its form; here it means also, too" },
                { form: "οἱ", lemma: "ὁ", here: "the", dict: "the", src: "DCC", form_note: "the 'he' form (masculine), plural, to match ποιηταί" },
                { form: "ποιηταὶ", lemma: "ποιητής", here: "the poets", dict: "creator, poet", src: "DCC", form_note: "the subject, plural. From ποιέω, I make: a poet is a maker" },
                { form: "πεπονθότες", after: ",", lemma: "πάσχω", here: "having experienced", dict: "suffer, experience", src: "DCC", form_note: "a verb used as a describing word, in the 'he' form, plural, to match ποιηταί; the perfect: having experienced, and still in that state" },
              ],
              learn: {
                title: "Appeared, having experienced",
                at: 3,
                text: [
                  "Greek says *the poets appeared to me, having experienced such a thing*. When «φαίνομαι», *I appear*, has a describing verb like «πεπονθότες» with it, it means *it is plain that*.",
                  "So English turns it round: *it was evident to me that the poets too had experienced something of this same sort*.",
                ],
              },
            },
          ],
          en: "it was evident to me that the poets too had experienced something of this same sort",
          meaning: [
            "Socrates finds the poets are in the same state as the prophets: they too say fine things without knowing what they mean.",
          ],
        },
      ],
    },
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
    passage: {
      intro: "You have read the first sentence. Now read the next one, where Aristotle gives his proof, a piece at a time.",
      sentences: [
        {
          pieces: [
            {
              words: [
                { form: "σημεῖον", lemma: "σημεῖον", here: "a sign (of this is)", dict: "sign, signal, mark", src: "DCC", form_note: "an 'it' word (neuter). The word is, ἐστί, is left out: (a) sign (is) …" },
                { form: "δʼ", lemma: "δέ", here: "and", dict: "and; but", src: "DCC", form_note: "δέ, with its vowel dropped before ἡ; it never comes first" },
                { form: "ἡ", lemma: "ὁ", here: "the", dict: "the", src: "DCC", form_note: "the 'she' form (feminine), singular, to match ἀγάπησις" },
                { form: "τῶν", lemma: "ὁ", here: "of the", dict: "the", src: "DCC", form_note: "the 'of' form, plural, to match αἰσθήσεων" },
                { form: "αἰσθήσεων", lemma: "αἴσθησις", here: "of the senses", dict: "sense-perception, sensation, the senses", src: "LSJ", form_note: "a 'she' word (feminine), in the 'of' form, plural" },
                { form: "ἀγάπησις", after: "·", lemma: "ἀγάπησις", here: "love, delight", dict: "affection", src: "LSJ", form_note: "a 'she' word (feminine), the subject. The raised dot · after it is the Greek semicolon" },
              ],
              learn: {
                title: "The 'of' words in the middle",
                at: 2,
                text: [
                  "«ἡ τῶν αἰσθήσεων ἀγάπησις» is *the love of the senses*. Greek can tuck the *of* words between *the* and its noun: *the of-the-senses love*.",
                  "Read «ἡ» and wait: its noun, «ἀγάπησις», comes at the end, after the words that belong to it.",
                ],
              },
            },
            {
              words: [
                { form: "καὶ", lemma: "καί", here: "indeed", dict: "and, also, even", src: "DCC", form_note: "a word that never changes its form; with γάρ, for indeed" },
                { form: "γὰρ", lemma: "γάρ", here: "for", dict: "for (explanatory), indeed", src: "DCC", form_note: "a word that never changes and never comes first" },
                { form: "χωρὶς", lemma: "χωρίς", here: "apart from", dict: "(+gen.) without, separate from", src: "DCC", form_note: "a word that never changes; what follows it is in the 'of' form" },
                { form: "τῆς", lemma: "ὁ", here: "the", dict: "the", src: "DCC", form_note: "the 'of' form, 'she' form, to match χρείας" },
                { form: "χρείας", lemma: "χρεία", here: "use, usefulness", dict: "need, want, necessity; use, service", src: "LSJ", form_note: "a 'she' word (feminine), in the 'of' form, after χωρίς" },
                { form: "ἀγαπῶνται", lemma: "ἀγαπάω", here: "they are loved", dict: "greet with affection, show affection for, love", src: "LSJ", form_note: "they have it done to them, now: the senses are loved" },
                { form: "διʼ", lemma: "διά", here: "for the sake of", dict: "through, because of", src: "DCC", form_note: "διά, with its vowel dropped before αὑτάς" },
                { form: "αὑτάς", after: ",", lemma: "ἑαυτοῦ", here: "themselves", dict: "him- her- itself (reflexive)", src: "DCC", form_note: "the 'she' form (feminine), plural, for the senses; the form a thing takes after διά when it means because of" },
              ],
              learn: {
                title: "-ονται: they are done to",
                at: 5,
                text: [
                  "«ἀγαπάω» means *I love*. «ἀγαπῶνται» means *they are loved*: the ending «-ονται» (here run together with the «-α-» of the verb into «-ῶνται») says that *they* have the thing done to them.",
                  "Who are *they*? The senses, «αἰσθήσεις»: *they are loved for their own sake*.",
                ],
              },
            },
            {
              words: [
                { form: "καὶ", lemma: "καί", here: "and", dict: "and, also, even", src: "DCC", form_note: "a word that never changes its form" },
                { form: "μάλιστα", lemma: "μάλα", here: "most of all", dict: "very, very much", src: "DCC", form_note: "the 'most' form of μάλα, very: most of all" },
                { form: "τῶν", lemma: "ὁ", here: "of the", dict: "the", src: "DCC", form_note: "the 'of' form, plural, to match ἄλλων" },
                { form: "ἄλλων", lemma: "ἄλλος", here: "others", dict: "other, another", src: "DCC", form_note: "the 'of' form, plural: of the others" },
              ],
              learn: {
                title: "Most of all: the 'of' form",
                at: 1,
                text: [
                  "«μάλιστα» is *most of all*. The group that something stands out from goes in the *of* form: «τῶν ἄλλων», *of the others*.",
                  "So «μάλιστα τῶν ἄλλων» is *most of all the others*, that is, more than any other sense.",
                ],
              },
            },
            {
              words: [
                { form: "ἡ", lemma: "ὁ", here: "the (sense)", dict: "the", src: "DCC", form_note: "the 'she' form (feminine), singular, for αἴσθησις, sense, which is left out" },
                { form: "διὰ", lemma: "διά", here: "through", dict: "through, because of", src: "DCC", form_note: "a word that never changes; with the 'of' form after it, it means through" },
                { form: "τῶν", lemma: "ὁ", here: "the", dict: "the", src: "DCC", form_note: "the 'of' form, plural, to match ὀμμάτων" },
                { form: "ὀμμάτων", after: ".", lemma: "ὄμμα", here: "the eyes", dict: "eye", src: "LSJ", form_note: "an 'it' word (neuter), in the 'of' form, plural" },
              ],
              learn: {
                title: "The with no noun",
                at: 0,
                text: [
                  "«ἡ» is *the*, but no noun follows it. Its noun is understood from earlier in the sentence: «αἴσθησις», *sense*.",
                  "So «ἡ διὰ τῶν ὀμμάτων» is *the (sense) through the eyes*: the sense of sight.",
                ],
              },
            },
          ],
          en: "An indication of this is our esteem for the senses; for apart from their use we esteem them for their own sake, and most of all the sense of sight.",
          meaning: [
            "This is Aristotle's proof that we desire to know: we love our senses even when they are of no use to us, and sight above all. He goes on to say that sight is loved most because it makes us know most, and shows us many differences between things.",
          ],
        },
      ],
    },
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
