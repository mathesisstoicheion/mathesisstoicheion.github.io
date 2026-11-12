import type { Entry } from "../types";

const entry: Entry = {
  slug: "tribute-lists",
  title: "The tribute lists",
  greek: "φόρος",
  category: "archaeology",
  kicker: "Athens' empire in its own accounts, cut in marble and found in hundreds of pieces",
  image: "tribute-list",
  hook: `Every year, from 454/3 BC, the Athenians gave one sixtieth of the tribute paid by their allies to the goddess Athena, and recorded each city's share on marble slabs set up on the Acropolis. The slabs were later broken up, and their fragments have been found by the hundred. Fitted back together by twentieth-century scholars, they are the empire's own books: which cities paid, how much, and when the payments went up. The small fragment on this page, now in New York, comes from the year the Athenians raised the tribute to its highest level.`,
  body: `## Money for the war against Persia

After the Persian Wars the Greek cities of the islands and the coast of Asia Minor formed a league under Athens to carry on the war. Some provided ships; others paid money instead. Thucydides records how it began:

{{quote:first}}

{well} Over the following decades more and more allies paid money rather than providing ships, and the league became an empire. In 454/3 BC the treasury was moved from Delos to Athens. Pericles' enemies, Plutarch says, cried out in the Assembly that [the people had lost its good name by removing the public moneys of the Greeks from Delos](cts:tlg0007.tlg012:12.1) into its own keeping.

## A sixtieth for the goddess

{well} From that year the Athenians set aside one sixtieth of each city's payment as an offering to Athena, and the officials responsible listed these offerings on stone, city by city. The first stone, inscribed on all four sides with the lists for 454/3 to 440/39 BC, stood about 3.8 metres high, the largest inscription Athens ever set up ([AIUK](https://atticinscriptions.com/papers/a-level-ancient-history-teachers-notes-1-period-study)). Because the lists record Athena's sixtieth, not the tribute itself, historians multiply each figure by sixty to find what a city paid.

## Putting the stones back together

{debated} The lists survive as hundreds of broken fragments: 184 for the first stone alone. Between 1939 and 1953 Benjamin Meritt, H. T. Wade-Gery and Malcolm McGregor published *The Athenian Tribute Lists*, which reassembled the stones and reconstructed the payments year by year. Their reconstruction is still the basis of the study of the empire, though parts of it have since been questioned.

## The year the tribute was raised

{well} The fragment on this page belongs to a different stone: the decree of 425/4 BC, moved by a man named Thoudippos, which reassessed the tribute of every city in the middle of the war with Sparta ([AIO](https://atticinscriptions.com/inscription/ML/69)). Heralds were sent out, a board of assessors fixed new sums, and every allied city was now required to bring a cow and a full suit of armour to the Great Panathenaia, like a colony. The total assessed was probably about 1,460 talents, though its first figure is damaged. When the war began, Thucydides reports, the tribute had been [about six hundred talents a year](cts:tlg0003.tlg001:2.13.3).

!! The island list on the stone includes [Melos](wiki:melos), which had never been a member of the league and had just fought off an Athenian attack in 426 BC. Athens assessed it anyway. In the winter of 416/5 BC it took the island by force.

{debated} Thucydides never mentions this reassessment. Plutarch, writing five centuries later, remembered the rise in tribute after Pericles' death and blamed it on the politicians who led the people:

{{quote:raised}}

{{timeline}}`,
  quotes: {
    first: {
      work: "tlg0003.tlg001", ref: "1.96.2", label: "Thucydides 1.96.2",
      grc: "καὶ Ἑλληνοταμίαι τότε πρῶτον Ἀθηναίοις κατέστη ἀρχή, οἳ ἐδέχοντο τὸν φόρον· οὕτω γὰρ ὠνομάσθη τῶν χρημάτων ἡ φορά. ἦν δ’ ὁ πρῶτος φόρος ταχθεὶς τετρακόσια τάλαντα καὶ ἑξήκοντα. ταμιεῖόν τε Δῆλος ἦν αὐτοῖς",
      tr: "And it was then that the Athenians first established the office of Hellenic treasurers, who received the tribute; for so the contribution of money was termed. The amount of the tribute first assessed was four hundred and sixty talents, and the treasury of the allies was Delos",
      trFrom: "corpus", trBy: "C. F. Smith (1919)",
    },
    raised: {
      work: "tlg0007.tlg024", ref: "24.3", label: "Plutarch, Aristides 24.3",
      grc: "Περικλέους δʼ ἀποθανόντος ἐπιτείνοντες οἱ δημαγωγοὶ κατὰ μικρὸν εἰς χιλίων καὶ τριακοσίων ταλάντων κεφάλαιον ἀνήγαγον",
      tr: "And after the death of Pericles the demagogues enlarged it little by little, and at last brought the sum total up to thirteen hundred talents",
      trFrom: "corpus", trBy: "Bernadotte Perrin (1914)",
    },
  },
  timeline: [
    { when: "478/7 BC", what: "The league is founded; the first tribute is set at 460 talents.", certainty: "well" },
    { when: "454/3 BC", what: "The treasury moves to Athens; the first list of Athena's sixtieth is inscribed.", certainty: "well" },
    { when: "431 BC", what: "War with Sparta; tribute is about 600 talents a year (Thucydides).", certainty: "well" },
    { when: "426 BC", what: "Melos resists an Athenian attack.", certainty: "well" },
    { when: "425/4 BC", what: "The reassessment decree of Thoudippos raises the tribute.", certainty: "well" },
    { when: "416/5 BC", what: "Athens captures Melos.", certainty: "well" },
    { when: "1939–1953", what: "Meritt, Wade-Gery and McGregor publish The Athenian Tribute Lists.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0003.tlg001", ref: "1.96.1", to: "1.99.3", label: "Thucydides 1.96–99", why: "How the league began, and how it became an empire." },
    { work: "tlg0003.tlg001", ref: "2.13.3", label: "Thucydides 2.13.3", why: "Athens' income at the start of the war." },
    { work: "tlg0007.tlg024", ref: "24.1", to: "24.3", label: "Plutarch, Aristides 24", why: "Aristides' first assessment, and what came after." },
  ],
  related: ["melos", "pericles", "athens"],
  places: ["579885", "599588"],
  primary: [
    { work: "tlg0003.tlg001", ref: "1.96.1", to: "1.96.2", label: "Thucydides 1.96" },
    { work: "tlg0003.tlg001", ref: "2.13.3", label: "Thucydides 2.13.3" },
    { work: "tlg0007.tlg012", ref: "12.1", label: "Plutarch, Pericles 12.1" },
    { work: "tlg0007.tlg024", ref: "24.3", label: "Plutarch, Aristides 24.3" },
  ],
  secondary: [
    { id: "meritt-atl", note: "The reconstruction of the lists, year by year." },
    { id: "meiggs-athenian-empire", note: "The history of the empire, built on the lists." },
  ],
  written: "2026-11-11",
};
export default entry;
