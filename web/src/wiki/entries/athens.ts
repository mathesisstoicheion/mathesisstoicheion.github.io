import type { Entry } from "../types";

const entry: Entry = {
  slug: "athens",
  title: "Athens, the school of Hellas",
  greek: "Ἀθῆναι",
  category: "democracy",
  kicker: "The city most of the library was written in, or about, or against",
  image: "decree-fragment",
  hook: `Athens was never the largest Greek city, nor for long the strongest. But for about two centuries it was where the Greek world came to argue, to watch plays, to study and to be judged, and it wrote down far more than any other city. Every Greek tragedy and comedy that survives whole was written for the Athenian stage, and the speeches of the orators and the dialogues of Plato came out of the same city. Its citizens governed themselves by vote and by lot, and they set up their decisions on stone in public, like the fragment on this page, for anyone to read.`,
  body: `## One city out of many

{legend} The Athenians believed that Attica had once been a scatter of independent towns, each with its own council, until the hero-king Theseus [abolished their councils and made Athens the one capital](cts:tlg0003.tlg001:2.15.2). Thucydides, who tells the story, adds that the Athenians still kept a festival for it in his own day. Whatever its truth, the result was unusual: one city whose citizens lived all over a large territory, from the silver mines of [Laurion](wiki:laurion) to the border with Boeotia.

## The rock and the ruins

The Acropolis, the steep rock at the centre, was citadel and sanctuary at once. In 480 BC the Persians captured it, [killed those who had taken refuge there and burned it](cts:tlg0016.tlg001:8.53.2). When the Athenians rebuilt it, under [Pericles](wiki:pericles) and with money from their empire, they made the temples that still stand there, the Parthenon among them. Thucydides foresaw what ruins would do to the judgement of later ages:

{{quote:ruins}}

## The school of Hellas

{well} After the tyrants were driven out, the reforms of Cleisthenes in 508/7 BC gave Athens the democracy that lasted, with interruptions, until 322 BC. Herodotus thought the change explained Athens' sudden strength: once [free and equal, each man was eager to achieve for himself](cts:tlg0016.tlg001:5.78.1). Citizens voted in the Assembly, sat on juries chosen by the [allotment machine](wiki:kleroterion), and once a year could vote a man into exile by [ostracism](wiki:ostracism). In the first winter of the Peloponnesian War, Pericles, as Thucydides reports his funeral speech, made the claim the city has been remembered by:

{{quote:school}}

The same city suffered the [plague](wiki:plague-of-athens), voted to [kill the men of Mytilene](wiki:mytilene-debate) and then changed its mind, destroyed [Melos](wiki:melos), and put [Socrates](wiki:trial-of-socrates) to death. In 404 BC, starved into surrender, it watched its enemies [tear down its walls to the music of flute-girls](cts:tlg0032.tlg001:2.2.23).

## A university town

{well} Athens lost its empire but kept its schools. Plato taught in the Academy, Aristotle in the Lyceum, Epicurus in his Garden, and Zeno in the Painted Stoa in the market-place. Rome conquered Greece, and in 86 BC Sulla's army stormed Athens; Plutarch says the blood shed in the market-place [covered the whole Kerameikos inside the Dipylon gate](cts:tlg0007.tlg033:14.4). Athens recovered as a place of study, and when Pausanias wrote his guide to Greece in the second century AD, he began [with Athens](cts:tlg0525.tlg001:1.1.1).

## What the ground keeps

{well} The American School of Classical Studies has excavated the Agora, the city's market-place and civic centre, since 1931, and rebuilt the Stoa of Attalos in 1953–1956 as its museum ([ASCSA](https://ascsa.edu.gr/excavations/athenian-agora/about-the-excavations)). Its finds are the working parts of the democracy described above: inscribed laws and decrees, official weights and measures, jurors' tickets and ballots, and [ostraka](wiki:ostracism) scratched with the names of politicians. The city's main cemetery lies just outside the walls, in the [Kerameikos](wiki:kerameikos-cemetery).

{{timeline}}`,
  quotes: {
    ruins: {
      work: "tlg0003.tlg001", ref: "1.10.2", label: "Thucydides 1.10.2",
      grc: "Ἀθηναίων δὲ τὸ αὐτὸ τοῦτο παθόντων διπλασίαν ἂν τὴν δύναμιν εἰκάζεσθαι ἀπὸ τῆς φανερᾶς ὄψεως τῆς πόλεως ἢ ἔστιν.",
      tr: "Whereas if the Athenians suffered the same, their power would be guessed, from what could be seen of the city, to be twice what it is.",
      trFrom: "site", trBy: "this site",
    },
    school: {
      work: "tlg0003.tlg001", ref: "2.41.1", label: "Thucydides 2.41.1",
      grc: "ξυνελών τε λέγω τήν τε πᾶσαν πόλιν τῆς Ἑλλάδος παίδευσιν εἶναι",
      tr: "In a word, then, I say that our city as a whole is the school of Hellas",
      trFrom: "corpus", trBy: "C. F. Smith (1919)",
    },
  },
  timeline: [
    { when: "508/7 BC", what: "The reforms of Cleisthenes.", certainty: "well" },
    { when: "480 BC", what: "The Persians take and burn the Acropolis.", certainty: "well" },
    { when: "447 BC", what: "Work begins on the Parthenon.", certainty: "well" },
    { when: "431/0 BC", what: "Pericles' funeral speech, as Thucydides gives it.", certainty: "well" },
    { when: "404 BC", what: "Athens surrenders to Sparta; the Long Walls are pulled down.", certainty: "well" },
    { when: "322 BC", what: "Macedon ends the democracy after the Lamian War.", certainty: "well" },
    { when: "86 BC", what: "Sulla storms Athens.", certainty: "well" },
    { when: "2nd c. AD", what: "Pausanias begins his guide to Greece with Athens.", certainty: "well" },
    { when: "1931", what: "The American School begins excavating the Agora.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0003.tlg001", ref: "2.35.1", to: "2.46.2", label: "Thucydides 2.35–46", why: "Pericles' funeral speech: Athens as it wished to be seen." },
    { work: "tlg0003.tlg001", ref: "2.15.1", to: "2.16.2", label: "Thucydides 2.15–16", why: "How the city was made, and how its people lived in the countryside." },
    { work: "tlg0525.tlg001", ref: "1.1.1", to: "1.3.1", label: "Pausanias 1.1–3", why: "A visitor's way into the city, from the harbours to the Agora." },
  ],
  related: ["pericles", "ostracism", "kleroterion", "kerameikos-cemetery", "parthenon-marbles", "trial-of-socrates"],
  places: ["579885"],
  primary: [
    { work: "tlg0003.tlg001", ref: "1.10.2", label: "Thucydides 1.10.2" },
    { work: "tlg0003.tlg001", ref: "2.15.2", label: "Thucydides 2.15.2" },
    { work: "tlg0003.tlg001", ref: "2.41.1", label: "Thucydides 2.41.1" },
    { work: "tlg0016.tlg001", ref: "5.78.1", label: "Herodotus 5.78" },
    { work: "tlg0016.tlg001", ref: "8.53.2", label: "Herodotus 8.53" },
    { work: "tlg0032.tlg001", ref: "2.2.23", label: "Xenophon, Hellenica 2.2.23" },
    { work: "tlg0007.tlg033", ref: "14.3", to: "14.5", label: "Plutarch, Sulla 14" },
  ],
  secondary: [
    { id: "camp-archaeology-athens", note: "The city as excavation has revealed it, period by period." },
    { id: "hansen-demosthenes", note: "How the democracy worked." },
  ],
  written: "2026-11-11",
};
export default entry;
