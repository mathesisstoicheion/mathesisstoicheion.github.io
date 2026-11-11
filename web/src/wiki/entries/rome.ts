import type { Entry } from "../types";

const entry: Entry = {
  slug: "rome",
  title: "Rome, seen from Greece",
  greek: "Ῥώμη",
  category: "people",
  kicker: "The city that conquered the Greeks, and the Greeks who explained it",
  image: "togatus",
  hook: `Rome is a Latin city, but the library names it more often than Athens. From the second century BC onwards Greek writers had to account for the people who had conquered them: a hostage who became the friend of a Roman general, a scholar who argued that the Romans were really Greeks, a biographer who set Greek and Roman lives side by side. Their books, written in Greek about Rome, are among the main sources for Roman history.`,
  body: `## The question Polybius asked

Polybius was a politician of the Achaean League in the Peloponnese. After Rome defeated Macedon in 168 BC, he was among the [more than a thousand Achaeans sent to Italy](cts:tlg0525.tlg001:7.10.11) and kept there until the [few hundred still alive were set free, in the seventeenth year](cts:tlg0525.tlg001:7.10.12). He spent them in Rome, as a friend of the young Scipio Aemilianus, who, Polybius says, was [no more than eighteen](cts:tlg0543.tlg001:31.24.1) when their friendship began. Out of that exile came his *Histories*, which open with a challenge to the Greek reader:

{{quote:question}}

{well} His answer, worked out in his sixth book, was the Roman constitution: a [mixture of monarchy, aristocracy and democracy](cts:tlg0543.tlg001:6.11.11-6.11.12) in the consuls, the Senate and the people, each checking the others.

## Corinth, 146 BC

{well} The Greek cities' last war against Rome ended in 146 BC. The Roman commander Mummius waited outside Corinth's open gates for fear of an ambush, and on the third day after the battle he [took the city by storm and burned it](cts:tlg0525.tlg001:7.16.7). In the same year Rome destroyed Carthage. From then on, mainland Greece was under Roman rule. In 86 BC the Roman general Sulla stormed [Athens](wiki:athens) itself.

## The Romans as Greeks

{debated} Writing in Rome under Augustus, Dionysius of Halicarnassus spent the first book of his *Roman Antiquities* proving that the founders of Rome were Greek settlers from Arcadia and elsewhere. He ends the argument with a flourish:

{{quote:greek}}

Few modern historians accept his genealogy, but his purpose is clear. Dionysius was making Roman rule acceptable to Greek readers and Greek culture respectable to Roman ones. He also records the ancient attempts to date the founding of Rome, and how [they disagreed](cts:tlg0081.tlg001:1.74.1).

## Parallel lives

Plutarch of Chaeronea, writing around AD 100, paired the biographies of famous Greeks and Romans, so that a reader could set [Pericles](wiki:pericles) beside Fabius Maximus, or Alexander beside Caesar. Much later, Greek writers were still writing Roman history: Appian of Alexandria on the civil wars, Cassius Dio on the whole of it, and Procopius, in the sixth century AD, on the wars of the emperor Justinian, for an empire that still called itself Roman and spoke Greek.

{{timeline}}`,
  quotes: {
    question: {
      work: "tlg0543.tlg001", ref: "1.1.5", label: "Polybius 1.1.5",
      grc: "τίς γὰρ οὕτως ὑπάρχει φαῦλος ἢ ῥᾴθυμος ἀνθρώπων ὃς οὐκ ἂν βούλοιτο γνῶναι πῶς καὶ τίνι γένει πολιτείας ἐπικρατηθέντα σχεδὸν ἅπαντα τὰ κατὰ τὴν οἰκουμένην οὐχ ὅλοις πεντήκοντα καὶ τρισὶν ἔτεσιν ὑπὸ μίαν ἀρχὴν ἔπεσε τὴν Ῥωμαίων, ὃ πρότερον οὐχ εὑρίσκεται γεγονός,",
      tr: "For who is so worthless or so idle that he would not wish to know how, and under what kind of government, almost the whole inhabited world was conquered and fell under the single rule of the Romans in less than fifty-three years, a thing never known to have happened before?",
      trFrom: "site", trBy: "this site",
    },
    greek: {
      work: "tlg0081.tlg001", ref: "1.89.1", label: "Dionysius of Halicarnassus, Roman Antiquities 1.89.1",
      grc: "ὥστε θαρρῶν ἤδη τις ἀποφαινέσθω πολλὰ χαίρειν φράσας τοῖς βαρβάρων καὶ δραπετῶν καὶ ἀνεστίων ἀνθρώπων καταφυγὴν τὴν Ῥώμην ποιοῦσιν Ἑλλάδα πόλιν αὐτήν",
      tr: "So let anyone now declare with confidence, and with a long farewell to those who make Rome a refuge of barbarians, runaways and homeless men, that it is a Greek city.",
      trFrom: "site", trBy: "this site",
    },
  },
  timeline: [
    { when: "8th c. BC", what: "Rome's founding, by the traditional dates, which ancient writers disputed.", certainty: "legend" },
    { when: "168 BC", what: "Rome defeats Macedon at Pydna.", certainty: "well" },
    { when: "167 BC", what: "Over a thousand Achaeans, Polybius among them, are taken to Italy.", certainty: "well" },
    { when: "146 BC", what: "Mummius destroys Corinth; Rome destroys Carthage.", certainty: "well" },
    { when: "86 BC", what: "Sulla storms Athens.", certainty: "well" },
    { when: "late 1st c. BC", what: "Dionysius of Halicarnassus writes the Roman Antiquities in Rome.", certainty: "well" },
    { when: "c. AD 100", what: "Plutarch writes his Parallel Lives.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0543.tlg001", ref: "1.1.1", to: "1.4.11", label: "Polybius 1.1–4", why: "Why the rise of Rome is the subject worth writing about." },
    { work: "tlg0543.tlg001", ref: "6.11.11", to: "6.18.8", label: "Polybius 6.11–18", why: "Consuls, Senate and people: the mixed constitution." },
    { work: "tlg0543.tlg001", ref: "31.23.1", to: "31.25.1", label: "Polybius 31.23–25", why: "How a Greek hostage and a young Roman became friends." },
    { work: "tlg0081.tlg001", ref: "1.89.1", to: "1.90.2", label: "Dionysius, Roman Antiquities 1.89–90", why: "The case for Rome as a Greek city." },
  ],
  related: ["athens", "pericles"],
  places: ["423025"],
  primary: [
    { work: "tlg0543.tlg001", ref: "1.1.5", label: "Polybius 1.1.5" },
    { work: "tlg0543.tlg001", ref: "6.11.11", label: "Polybius 6.11" },
    { work: "tlg0543.tlg001", ref: "31.24.1", label: "Polybius 31.24" },
    { work: "tlg0525.tlg001", ref: "7.10.11", label: "Pausanias 7.10.11" },
    { work: "tlg0525.tlg001", ref: "7.16.7", label: "Pausanias 7.16.7" },
    { work: "tlg0081.tlg001", ref: "1.74.1", label: "Dionysius, Roman Antiquities 1.74" },
    { work: "tlg0081.tlg001", ref: "1.89.1", label: "Dionysius, Roman Antiquities 1.89" },
  ],
  secondary: [
    { id: "gruen-hellenistic-rome", note: "How Rome came to rule the Greek world, and how the Greeks dealt with it." },
  ],
  written: "2026-11-11",
};
export default entry;
