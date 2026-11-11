import type { Entry } from "../types";

const entry: Entry = {
  slug: "thebes",
  title: "Thebes of the seven gates",
  greek: "Θῆβαι",
  category: "people",
  kicker: "Cadmus' city: the stage of Greek tragedy, and for ten years the first power in Greece",
  image: "herakles-bronze",
  hook: `Thebes, the chief city of Boeotia, was a city of myths. Cadmus founded it; Heracles was born there; Oedipus ruled it; seven champions attacked its seven gates. Athenian tragedians set play after play in its royal house. In history it was Athens' awkward neighbour, which sided with Persia in 480 BC, broke the power of Sparta in 371 BC, and was wiped out by Alexander in 335 BC. Its poet Pindar's house was the one building he spared.`,
  body: `## Cadmus and the letters

{legend} The Greeks said that Thebes was founded by Cadmus, a prince from Phoenicia who came looking for his sister Europa. Herodotus believed that the Phoenicians who came with Cadmus [brought the alphabet to the Greeks](cts:tlg0016.tlg001:5.58.1-5.58.2), and he went to Thebes to look at the evidence himself:

{{quote:letters}}

{well} Modern scholars agree with half of this. The Greek alphabet was indeed adapted from the Phoenician, and Greeks long called their letters *phoinikeia*, "Phoenician things". But the tripods Herodotus saw cannot have been as old as he thought: alphabetic writing in Greece begins in the eighth century BC, centuries after any Amphitryon.

## A city made for tragedy

Heracles, the Thebans said, was born in their city; Pausanias was shown the ruins of the [house of Amphitryon and the chamber of Alcmena](cts:tlg0525.tlg001:9.11.1), Heracles' mother. The house of Laius and Oedipus gave the Athenian stage some of its greatest plays: Sophocles' [*Oedipus the King*](cts:tlg0011.tlg004:1) and [*Antigone*](cts:tlg0011.tlg002:1), Aeschylus' [*Seven Against Thebes*](cts:tlg0085.tlg004:1), and Euripides' [*Bacchae*](cts:tlg0006.tlg017:1), in which Dionysus comes home to the city of his mother Semele and destroys its king.

## On the wrong side

{well} When Xerxes invaded in 480 BC, Thebes joined the Persians, and its troops fought for them at Plataea the next year. After the battle the victorious Greeks marched on Thebes and [demanded that the city surrender the leaders who had sided with Persia](cts:tlg0016.tlg001:9.86.1). In the Peloponnesian War Thebes was Sparta's ally and Athens' enemy.

## Ten years at the top

{well} In 379 BC Theban exiles killed the pro-Spartan rulers of their city and drove out the Spartan garrison. Under Pelopidas and Epaminondas, Thebes built an army good enough to face Sparta's. Its core was the Sacred Band:

{{quote:band}}

{well} In 371 BC, at [Leuctra](cts:tlg0032.tlg001:6.4.4-6.4.15), the Thebans defeated a Spartan army in open battle and killed its king, Cleombrotus. Epaminondas then invaded the Peloponnese and freed Messenia, ending Sparta's rule over the [helots](wiki:helots) there. The Theban ascendancy ended when Epaminondas fell at Mantinea in 362 BC; Xenophon closes his history there, with [more confusion and disorder in Greece after the battle than before](cts:tlg0032.tlg001:7.5.26-7.5.27).

## Destroyed and rebuilt

{well} Thebes rose against Alexander in 335 BC, and he took the city and razed it. Diodorus says [more than six thousand Thebans were killed and more than thirty thousand taken captive](cts:tlg0060.tlg001:17.14.1). The historian Arrian adds that Alexander, they say, [spared the house of the poet Pindar and Pindar's descendants](cts:tlg0074.tlg001:1.9.10), out of respect for him. Some twenty years later Cassander, ruler of Macedon, [brought the scattered Thebans home and rebuilt the city](cts:tlg0525.tlg001:9.7.1), with help from Athens.

{{timeline}}`,
  quotes: {
    letters: {
      work: "tlg0016.tlg001", ref: "5.59.1", label: "Herodotus 5.59",
      grc: "εἶδον δὲ καὶ αὐτὸς Καδμήια γράμματα ἐν τῷ ἱρῷ τοῦ Ἀπόλλωνος τοῦ Ἰσμηνίου ἐν Θήβῃσι τῇσι Βοιωτῶν, ἐπὶ τρίποσι τισὶ ἐγκεκολαμμένα, τὰ πολλὰ ὅμοια ἐόντα τοῖσι Ἰωνικοῖσι.",
      tr: "I have myself seen Cadmean writing in the temple of Ismenian Apollo at Thebes of Boeotia engraved on certain tripods and for the most part looking like Ionian letters.",
      trFrom: "corpus", trBy: "A. D. Godley (1922)",
    },
    band: {
      work: "tlg0007.tlg021", ref: "18.1", label: "Plutarch, Pelopidas 18.1",
      grc: "τὸν δʼ ἱερὸν λόχον, ὥς φασι, συνετάξατο Γοργίδας πρῶτος ἐξ ἀνδρῶν ἐπιλέκτων τριακοσίων, οἷς ἡ πόλις ἄσκησιν καὶ δίαιταν ἐν τῇ Καδμείᾳ στρατοπεδευομένοις παρεῖχε",
      tr: "The sacred band, we are told, was first formed by Gorgidas, of three hundred chosen men, to whom the city furnished exercise and maintenance, and who encamped in the Cadmeia",
      trFrom: "corpus", trBy: "Bernadotte Perrin (1917)",
    },
  },
  timeline: [
    { when: "8th c. BC", what: "The Greeks adapt the Phoenician alphabet.", certainty: "well" },
    { when: "480–479 BC", what: "Thebes sides with Persia; its troops fight at Plataea.", certainty: "well" },
    { when: "379 BC", what: "Theban exiles free the city from its Spartan garrison.", certainty: "well" },
    { when: "371 BC", what: "Thebes defeats Sparta at Leuctra.", certainty: "well" },
    { when: "362 BC", what: "Epaminondas is killed at Mantinea.", certainty: "well" },
    { when: "335 BC", what: "Alexander destroys Thebes, sparing Pindar's house.", certainty: "well" },
    { when: "late 4th c. BC", what: "Cassander rebuilds the city.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0016.tlg001", ref: "5.57.1", to: "5.61.2", label: "Herodotus 5.57–61", why: "Cadmus' Phoenicians, the alphabet, and the inscribed tripods at Thebes." },
    { work: "tlg0032.tlg001", ref: "6.4.4", to: "6.4.15", label: "Xenophon, Hellenica 6.4.4–15", why: "The battle of Leuctra." },
    { work: "tlg0007.tlg021", ref: "18.1", to: "19.3", label: "Plutarch, Pelopidas 18–19", why: "The Sacred Band." },
    { work: "tlg0525.tlg001", ref: "9.5.1", to: "9.7.6", label: "Pausanias 9.5–7", why: "The city's history as the Thebans told it in Roman times." },
  ],
  related: ["helots", "spartan-upbringing"],
  places: ["541138"],
  primary: [
    { work: "tlg0016.tlg001", ref: "5.58.1", to: "5.59.1", label: "Herodotus 5.58–59" },
    { work: "tlg0016.tlg001", ref: "9.86.1", label: "Herodotus 9.86" },
    { work: "tlg0525.tlg001", ref: "9.11.1", label: "Pausanias 9.11.1" },
    { work: "tlg0525.tlg001", ref: "9.7.1", label: "Pausanias 9.7.1" },
    { work: "tlg0007.tlg021", ref: "18.1", label: "Plutarch, Pelopidas 18" },
    { work: "tlg0032.tlg001", ref: "6.4.4", to: "6.4.15", label: "Xenophon, Hellenica 6.4" },
    { work: "tlg0032.tlg001", ref: "7.5.26", to: "7.5.27", label: "Xenophon, Hellenica 7.5.26–27" },
    { work: "tlg0060.tlg001", ref: "17.14.1", label: "Diodorus 17.14" },
    { work: "tlg0074.tlg001", ref: "1.9.10", label: "Arrian, Anabasis 1.9.10" },
  ],
  secondary: [
    { id: "buckler-theban-hegemony", note: "Thebes at the height of its power, 371–362 BC." },
  ],
  written: "2026-11-11",
};
export default entry;
