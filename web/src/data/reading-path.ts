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
  /** a word met earlier that this one is a relative of, so it is not counted as new */
  kin?: string;
}

export interface PathPart { words: PathWord[]; en: string }

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
  /** the one new piece of grammar */
  learn: { title: string; text: string[] };
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
    learn: {
      title: "Greek can leave the verb out",
      text: [
        "There is no verb here at all. Greek often leaves out a verb that is easy to supply, and the reader fills it in: *[do] nothing too much*.",
        "«μηδέν» is built from «μηδέ» *not even* and «ἕν» *one*: *not even one thing*. Its «μη-» is the *don't* kind of *not*, used in commands and wishes. On step 3 you will meet its partner, «οὐδέν», with the other kind of *not*.",
      ],
    },
    links: [
      { href: map("540726"), label: "Delphi on the map", note: "the places the texts name, and how often" },
      { href: "/stoa/delphi", label: "Delphi and the oracle", note: "the Pythia, the tripod and the riddling answers" },
      { href: read("tlg0059.tlg022", "343"), label: "Read Protagoras 343 in the reader", note: "the whole passage, with every word explained" },
    ],
  },
  {
    id: "know-yourself",
    carve: "ΓΝΩΘΙΣΑΥΤΟΝ",
    title: "Know yourself",
    who: "The other saying at Delphi",
    work: "tlg0059.tlg022", ref: "343b", label: "Plato, Protagoras 343b",
    translator: "W. R. M. Lamb (1924)",
    where: [
      "Still at Delphi, in the same sentence of the *Protagoras*. Plato names this saying first of the two.",
      "Socrates calls this short, memorable style of the old sages Spartan, “laconic brevity”.",
    ],
    parts: [{
      words: [
        { form: "γνῶθι", lemma: "γιγνώσκω", here: "know!", dict: "come to know, learn; judge, think", src: "DCC", form_note: "a command, to one person" },
        { form: "σαυτόν", lemma: "σεαυτοῦ", here: "yourself", dict: "of thyself (also written σαυτοῦ)", src: "LSJ", form_note: "the thing being known: the -ον ending marks it" },
      ],
      en: "Know thyself",
    }],
    learn: {
      title: "A command",
      text: [
        "Step 1 left its verb out. This saying has one: «γνῶθι» is a command, said to one person: *know!* The ending «-θι» is one of the endings Greek uses for telling someone to do something.",
        "There is no word for *you* in front of it. Greek does not need one: the verb's ending already says who is meant. You will see this on every step of the path.",
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
      "Now you cross the Aegean to Ephesus, on the coast of Asia Minor. Diogenes Laertius, who wrote the lives of the philosophers, says Heraclitus was a native of Ephesus, and “lofty-minded beyond all other men”.",
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
          { form: "οὐδὲν", lemma: "οὐδείς", kin: "μηδείς", here: "nothing", dict: "no one, nothing", src: "DCC", form_note: "the partner of μηδέν (step 1); its οὐ- is the not of plain fact: here, nothing in fact stays" },
          { form: "μένει", lemma: "μένω", here: "stays", dict: "stay, remain, endure, await", src: "DCC", form_note: "he, she or it does it, now" },
        ],
        en: "and nothing remains still",
      },
    ],
    learn: {
      title: "The ending -ει: it does",
      text: [
        "Both verbs end in «-ει»: «χωρ-εῖ» *it moves*, «μέν-ει» *it stays*. That ending means *he, she or it does this now*.",
        "The ending carries the *it*, so no separate word is needed, just as the command on step 2 needed no *you*.",
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
      "You sail south to the island of Cos. Hippocrates was born there around 460 BC; he is called the Father of Medicine, though very little is known for certain about what he himself wrote.",
      "The *Aphorisms* are short rules for doctors, and this is how the first one begins. You will read the rest of the sentence on the next step.",
    ],
    parts: [{
      words: [
        { form: "ὁ", lemma: "ὁ", here: "the", dict: "the", src: "DCC", form_note: "the 'he' form (masculine), for a 'he' word" },
        { form: "βίος", lemma: "βίος", here: "life", dict: "life", src: "DCC", form_note: "a 'he' word (masculine), the subject" },
        { form: "βραχὺς", after: ",", lemma: "βραχύς", here: "short", dict: "brief, short", src: "DCC", form_note: "a describing word, in its 'he' form to go with βίος (more on this next step)" },
      ],
      en: "Life is short,",
    }],
    learn: {
      title: "The: ὁ",
      text: [
        "Greek has a word for *the*: «ὁ». It changes to match its noun. Every Greek noun is a 'he', a 'she' or an 'it' word (masculine, feminine or neuter). «βίος» is a 'he' word, so it gets «ὁ».",
        "Greek uses *the* where English often leaves it out: «ὁ βίος», *the life*, means life in general. And there is no *is*: Greek leaves it out, as step 1 left out its verb. *The life [is] short.*",
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
    who: "Hippocrates, the same sentence",
    work: "tlg0627.tlg012", ref: "1.1", label: "Hippocrates, Aphorisms 1.1",
    translator: "Francis Adams (1886)",
    where: [
      "Still on Cos, in the same sentence. The *art* is medicine: the sentence goes on to say the physician must be ready to do what is right himself, and to make the patient and the attendants work with him.",
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
    learn: {
      title: "Words that match",
      text: [
        "«τέχνη» is a 'she' word, so *the* takes its 'she' form, «ἡ». The describing word matches too: «βραχύς» went with the 'he' word «βίος» on step 4; here «μακρή» goes with the 'she' word «τέχνη».",
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
      "North now, to Abdera on the coast of Thrace. Diogenes Laertius says Protagoras was born there (though the comic poet Eupolis called him a man of Teos), and that he gave public readings for which he charged fees.",
      "He says Protagoras was the first to hold that every question has two opposing sides, and that he began a book with this sentence.",
      "Plato's Socrates takes it up in the *Theaetetus*: if each of us is the measure, things are for me as they seem to me, and for you as they seem to you.",
    ],
    parts: [{
      words: [
        { form: "πάντων", lemma: "πᾶς", here: "of all", dict: "every, all", src: "DCC", form_note: "the 'of' form, plural; you met πάντα on step 3" },
        { form: "χρημάτων", lemma: "χρῆμα", here: "of things", dict: "thing, matter; (in the plural) goods, money", src: "DCC", form_note: "the 'of' form, plural" },
        { form: "μέτρον", lemma: "μέτρον", here: "the measure", dict: "that by which anything is measured, measure, rule", src: "LSJ", form_note: "an 'it' word (neuter)" },
        { form: "ἄνθρωπος", lemma: "ἄνθρωπος", here: "a human being", dict: "human being", src: "DCC", form_note: "the subject" },
      ],
      en: "Man is the measure of all things",
    }],
    learn: {
      title: "The ending -ων: of",
      text: [
        "«πάντ-ων», «χρημάτ-ων»: the ending «-ων» means *of*, for plural nouns of every kind. *Of all things*. Greek has no separate word for *of*; the ending does the work.",
        "Grammars call this the genitive. The main word, «ἄνθρωπος», is in its plain form (the nominative).",
        "And again no *is*: *of all things [the] measure [is] a human being*. «ἄνθρωπος» means a person, man or woman; older translations say *man*.",
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
      "Now to Athens, to the court where Socrates is on trial for his life. Plato's *Apology* is his speech of defence.",
      "He tells the jury that his friend Chaerephon once went to Delphi, the temple of steps 1 and 2, and asked whether anyone was wiser than Socrates. The Pythia, Apollo's priestess, answered that no one was.",
      "Puzzled, Socrates went to a man who was thought wise, and found that he only thought he knew. Walking away, he reasoned: neither of us knows anything fine and good, but this man thinks he knows when he does not. Then he says this of himself.",
    ],
    parts: [
      {
        words: [
          { form: "οὐκ", lemma: "οὐ", here: "not", dict: "not (with indicative verbs)", src: "DCC", form_note: "οὐ, written οὐκ before a vowel; the not of plain fact, as in οὐδέν on step 3" },
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
    learn: {
      title: "The endings for I",
      text: [
        "«οἶδ-α» *I know* and «οἴ-ομαι» *I think* both mean *I*. Their endings say so: «-α» for one kind of verb, «-ομαι» for another. As with *you* on step 2 and *it* on step 3, no separate word for *I* is needed.",
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
    who: "Socrates, later in the same speech",
    work: "tlg0059.tlg002", ref: "38a", label: "Plato, Apology 38a",
    translator: "Harold North Fowler (1914)",
    where: [
      "Still in court. The jury has found Socrates guilty, and he must propose his own penalty. He will not promise to keep quiet: that, he says, would be to disobey the god.",
      "The best thing for a person, he says, is to talk every day about virtue and the other things they hear him discussing, examining himself and others. And then this.",
      "LSJ quotes this line for both «ἀνεξέταστος» and «βιωτός».",
    ],
    parts: [{
      words: [
        { form: "ὁ", lemma: "ὁ", here: "the", dict: "the", src: "DCC", form_note: "the 'he' form (masculine), as on step 4" },
        { form: "δὲ", lemma: "δέ", here: "and", dict: "and; but", src: "DCC", form_note: "second word, as on step 5" },
        { form: "ἀνεξέταστος", lemma: "ἀνεξέταστος", here: "unexamined", dict: "not searched out, not inquired into or examined", src: "LSJ", form_note: "the 'he' form (masculine), to match βίος" },
        { form: "βίος", lemma: "βίος", here: "life", dict: "life", src: "DCC", form_note: "the subject, as on step 4" },
        { form: "οὐ", lemma: "οὐ", here: "not", dict: "not (with indicative verbs)", src: "DCC", form_note: "as on step 7" },
        { form: "βιωτὸς", lemma: "βιωτός", here: "worth living", dict: "to be lived, worth living", src: "LSJ", form_note: "the 'he' form (masculine), to match βίος. Built from βιόω live, a relative of βίος; the ending -τος often means can be done: livable" },
        { form: "ἀνθρώπῳ", lemma: "ἄνθρωπος", here: "for a human being", dict: "human being", src: "DCC", form_note: "the 'to' or 'for' form" },
      ],
      en: "the unexamined life is not worth living",
    }],
    learn: {
      title: "The ending -ῳ: for",
      text: [
        "«ἀνθρώπ-ῳ»: the ending «-ῳ» means *to* or *for*. *For a human being*, life without examining is not worth living. Grammars call this the dative. You know «ἄνθρωπος» from step 6; only its ending has changed.",
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
      "North to Stagira in Chalcidice, and to Aristotle. Diogenes Laertius says he was born at Stagira, joined Plato at seventeen and stayed with him twenty years; he later taught at the Lyceum in Athens.",
      "Here, at the start of the *Politics*, he has just traced how families grow into villages and villages into the city (the «πόλις»). From this, he says, it is clear that the city exists by nature, and that man is by nature an animal of the city.",
      "A few lines on he gives the reason: of all the animals, only man has speech.",
    ],
    parts: [{
      words: [
        { form: "ὁ", lemma: "ὁ", here: "the", dict: "the", src: "DCC", form_note: "the 'he' form; with a general word it means the whole kind" },
        { form: "ἄνθρωπος", lemma: "ἄνθρωπος", here: "human being, humankind", dict: "human being", src: "DCC", form_note: "the subject, as on step 6" },
        { form: "φύσει", lemma: "φύσις", here: "by nature", dict: "nature; one's nature; the order of nature", src: "DCC", form_note: "the 'by' form" },
        { form: "πολιτικὸν", lemma: "πολιτικός", here: "of the city, political", dict: "of, for, or relating to citizens", src: "LSJ", form_note: "the 'it' form (neuter), to match ζῷον. Built from πόλις, city: our word political comes from it" },
        { form: "ζῷον", lemma: "ζῷον", here: "animal", dict: "living being, animal", src: "DCC", form_note: "an 'it' word (neuter)" },
      ],
      en: "man is by nature a political animal",
    }],
    learn: {
      title: "The 'by' form: φύσει",
      text: [
        "«φύσ-ει» has the same *to* or *for* ending as «ἀνθρώπῳ» on step 8, in another family of nouns («φύσις», «πόλις» and their kind). Without any extra word it can also mean *by* or *in*: *by nature*.",
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
      "Back to Miletus, home of Thales, the first of the seven sages Socrates named on step 1. Aristotle writes that Thales thought all things are full of gods (*On the Soul* 1.5), with the same four Greek words as below, in another order.",
      "This line is from Plato's *Laws*. A stranger from Athens argues that the souls that move the sun, the moon and the stars are gods, and asks: will anyone who agrees deny that all things are full of gods?",
    ],
    parts: [{
      words: [
        { form: "θεῶν", lemma: "θεός", here: "of gods", dict: "god, goddess", src: "DCC", form_note: "the 'of' form, plural: the -ων of step 6" },
        { form: "εἶναι", lemma: "εἰμί", here: "to be (that they are)", dict: "be, exist", src: "DCC", form_note: "to be" },
        { form: "πλήρη", lemma: "πλήρης", here: "full", dict: "full of (with the 'of' form)", src: "LSJ", form_note: "the 'it' form (neuter), plural, to match πάντα; full takes the 'of' form: θεῶν, of gods" },
        { form: "πάντα", lemma: "πᾶς", here: "all things", dict: "every, all", src: "DCC", form_note: "all things, as on step 3" },
      ],
      en: "all things are full of gods",
    }],
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
      "Back to Socrates' trial in Athens, to an earlier part of his speech. After the man of step 7, he says, he went to the poets, thinking he would prove there that he knew less than they did.",
      "He asked them what their poems meant, and found that hardly anyone present would not have spoken about the poems better than the poets themselves. They compose, he decided, not by wisdom but by nature and inspiration, like prophets and givers of oracles.",
      "This line is about those prophets. Its other half says that they know none of the things they say.",
    ],
    parts: [{
      words: [
        { form: "λέγουσι", lemma: "λέγω", here: "they say", dict: "say, speak (of), recount; pick up, collect, count", src: "DCC", form_note: "they do it, now" },
        { form: "μὲν", lemma: "μέν", here: "(on the one hand)", dict: "on the one hand … on the other hand (often untranslated)", src: "DCC", form_note: "a word that never changes and never comes first; it warns that a δέ half is coming (here: but they know nothing)" },
        { form: "πολλὰ", lemma: "πολύς", here: "many things", dict: "much, many", src: "DCC", form_note: "the 'it' form (neuter), plural: many things" },
        { form: "καὶ", lemma: "καί", here: "and", dict: "and, also, even", src: "DCC", form_note: "as on step 3. Greek says many and fine things; English drops the and" },
        { form: "καλά", lemma: "καλός", here: "fine", dict: "beautiful, noble, honorable", src: "DCC", form_note: "the 'it' form (neuter), plural, to match πολλά" },
      ],
      en: "say many fine things,",
    }],
    learn: {
      title: "The ending -ουσι: they",
      text: [
        "«λέγ-ουσι» means *they say*. Compare «χωρ-εῖ» *it moves* on step 3: the front of the verb stays, and the ending changes with who does it. «-ει» is *he, she or it*; «-ουσι» is *they*.",
        "Again no separate word is needed: the ending is the *they*. You will meet *they* once more on the next step, in its other form.",
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
      "Of the six words below, you have met five already.",
    ],
    parts: [{
      words: [
        { form: "πάντες", lemma: "πᾶς", here: "all", dict: "every, all", src: "DCC", form_note: "the 'he' form (masculine), plural; πάντα and πάντων were its relatives" },
        { form: "ἄνθρωποι", lemma: "ἄνθρωπος", here: "human beings", dict: "human being", src: "DCC", form_note: "the subject, plural" },
        { form: "τοῦ", lemma: "ὁ", here: "the (… knowing)", dict: "the", src: "DCC", form_note: "the 'of' form, for the 'it' word εἰδέναι" },
        { form: "εἰδέναι", lemma: "οἶδα", here: "to know, knowing", dict: "to know", src: "DCC", form_note: "to know: οἶδα of step 7, with the to-ending -ναι of step 10" },
        { form: "ὀρέγονται", lemma: "ὀρέγω", here: "reach for, desire", dict: "reach after, grasp at, yearn for (with the 'of' form)", src: "LSJ", form_note: "they do it" },
        { form: "φύσει", after: ".", lemma: "φύσις", here: "by nature", dict: "nature", src: "DCC", form_note: "the 'by' form, as on step 9" },
      ],
      en: "All men naturally desire knowledge.",
    }],
    learn: {
      title: "τὸ εἰδέναι: knowing, as a noun",
      text: [
        "Put *the* in front of a *to …* word and it becomes a noun: «τὸ εἰδέναι», *the knowing*, knowledge.",
        "«ὀρέγομαι» means *I reach out for*, and the thing reached for goes in the *of* form, as with *full of* on step 10. So *the* becomes «τοῦ»: *they reach for the knowing*.",
        "«ὀρέγ-ονται» is *they*, like «λέγ-ουσι» on step 11, but in the other form: «-ονται» is the *they* of verbs like «οἴ-ομαι», *I think*, on step 7. *All human beings, by nature, reach for knowing.*",
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

/** The dictionary forms a step brings in for the first time (a relative of a word met earlier is not new). */
export function newWords(i: number): string[] {
  const out: string[] = [];
  for (const w of PATH[i].parts.flatMap((p) => p.words)) {
    if (firstMet(w.lemma, i) || (w.kin && firstMet(w.kin, i)) || out.includes(w.lemma)) continue;
    out.push(w.lemma);
  }
  return out;
}

/** The line as printed: the words with their punctuation. */
export const partText = (p: PathPart) => p.words.map((w) => w.form + (w.after ?? "")).join(" ");
