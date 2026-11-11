import type { Entry } from "../types";

const entry: Entry = {
  slug: "kleobis-and-biton",
  title: "Kleobis and Biton",
  greek: "Κλέοβις καὶ Βίτων",
  category: "archaeology",
  kicker: "Two brothers in a story by Herodotus, and two marble statues dug up at Delphi",
  image: "kouros",
  hook: `When the rich king Croesus asked the Athenian sage Solon who was the happiest of men, Solon named two young brothers from Argos, Kleobis and Biton, who pulled their mother's cart to the temple of Hera and died that night in their sleep. The Argives, Herodotus says, set up statues of them at Delphi. In 1893 and 1894 French archaeologists digging at Delphi found two marble statues of young men, carved by an Argive sculptor. Whether they are the brothers of the story is still argued.`,
  body: `## The second happiest men

Herodotus tells the story as Solon's answer to Croesus. The brothers were Argives, strong men who had both won prizes in the games. At a festival of Hera their mother had to be taken to the goddess's temple by ox-cart, and the oxen were late from the fields, so [the young men put themselves under the yoke and pulled the cart five miles](cts:tlg0016.tlg001:1.31.2). Their mother prayed that the goddess would give them the best thing a human being can have. They feasted, slept in the temple, and never woke.

{{quote:statues}}

{legend} Solon's lesson is that no one should be called happy until his life has ended well. The story is a moral tale, and nothing in it can be checked. But the statues, Herodotus says, were real, and he expected his readers to be able to see them at Delphi.

## Found at Delphi

{well} French archaeologists excavating the sanctuary of Apollo at Delphi found two over-life-size marble statues of naked young men in 1893 and 1894, a year apart, near the Treasury of the Athenians; a second base turned up in 1907, reused in the wall of the Roman baths ([Delphi Museum](https://www.delphimuseum.gr/2025/03/the-twins-of-argos.html)). They date from the early sixth century BC. On the base of one statue the sculptor signed his name: "[Poly]medes the Argive made it" ([Smarthistory](https://smarthistory.org/kleobis-and-biton)).

## Are they the brothers?

{debated} The statues are most often identified as Kleobis and Biton: they are a pair, they are Argive work, and they were found where Herodotus says the Argives put the brothers' statues. A damaged inscription on the second base may name Biton. Other scholars read the inscriptions differently and think the pair are the divine twins Castor and Pollux, the Dioscuri. The museum at Delphi shows them as "the twins of Argos".

## The kouros

{well} Statues of this kind are now called *kouroi*, "youths": a naked young man, standing stiffly, arms at his sides, left foot forward. The Metropolitan Museum's kouros on this page, carved in Attica about 590–580 BC from Naxian marble, is one of the earliest marble statues of a human figure made there, and it marked the grave of a young Athenian aristocrat. The pose, the museum notes, was taken from Egyptian art ([The Met](https://www.metmuseum.org/art/collection/search/253370)); Greeks had been living and trading in [Egypt](wiki:egypt) for some decades by then. Greek sculptors used the formula throughout the sixth century BC, as a dedication to a god or as a marker over a grave.

{{timeline}}`,
  quotes: {
    statues: {
      work: "tlg0016.tlg001", ref: "1.31.5", label: "Herodotus 1.31.5",
      grc: "Ἀργεῖοι δὲ σφέων εἰκόνας ποιησάμενοι ἀνέθεσαν ἐς Δελφοὺς ὡς ἀριστῶν γενομένων.",
      tr: "The Argives made and dedicated at Delphi statues of them as being the best of men.",
      trFrom: "corpus", trBy: "A. D. Godley (1920)",
    },
  },
  timeline: [
    { when: "early 6th c. BC", what: "The two statues are carved by an Argive sculptor and set up at Delphi.", certainty: "well" },
    { when: "c. 590–580 BC", what: "The Metropolitan Museum's kouros is carved in Attica.", certainty: "well" },
    { when: "5th c. BC", what: "Herodotus tells the story and mentions the statues at Delphi.", certainty: "well" },
    { when: "1893–1894", what: "The statues are found near the Treasury of the Athenians.", certainty: "well" },
    { when: "1907", what: "The second base is found, reused in the Roman baths.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0016.tlg001", ref: "1.30.1", to: "1.33.1", label: "Herodotus 1.30–33", why: "Solon and Croesus: Tellus, Kleobis and Biton, and the meaning of happiness." },
  ],
  related: ["delphi", "egypt", "painted-statues"],
  places: ["540726", "570106"],
  primary: [
    { work: "tlg0016.tlg001", ref: "1.31.1", to: "1.31.5", label: "Herodotus 1.31" },
  ],
  secondary: [
    { id: "scott-delphi", note: "The sanctuary and its dedications, century by century." },
  ],
  written: "2026-11-11",
};
export default entry;
