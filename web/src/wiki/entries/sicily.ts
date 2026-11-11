import type { Entry } from "../types";

const entry: Entry = {
  slug: "sicily",
  title: "Sicily and Syracuse",
  greek: "Σικελία",
  category: "dark",
  kicker: "The rich island of Greek colonies, where Athens lost an army",
  image: "strategos-head",
  hook: `Sicily was the Greeks' new world: a large, fertile island to the west, settled from the eighth century BC by colonists from Corinth, Euboea, Megara, Rhodes and Crete. Its greatest city, Syracuse, grew richer than almost any city of the old country. Its tyrants paid Pindar to praise their chariot victories, and its ruler Hieron welcomed Aeschylus. And it was there, in 415–413 BC, that Athens sent the most costly and splendid force any single Greek city had yet put to sea, and lost it.`,
  body: `## An island of colonies

Thucydides opens his account of the Sicilian expedition with a short history of the island, people by people and colony by colony. The first Greeks, he says, were [Chalcidians from Euboea who founded Naxos](cts:tlg0003.tlg001:6.3.1); the year after, [Archias of Corinth founded Syracuse](cts:tlg0003.tlg001:6.3.2) on the offshore island of Ortygia, driving out the Sicels who lived there. He gives the intervals between the foundations in years, and modern dates for them are worked out from his figures.

{debated} Counting back from Thucydides' figures gives a date around 733 BC for Syracuse, but how exactly to count, and what his own figures were based on, is still argued.

## Tyrants and poets

{legend} In 480 BC, the Sicilians said, Gelon of Syracuse and Theron of Akragas defeated a great Carthaginian army at Himera [on the very day the Greeks beat the Persians at Salamis](cts:tlg0016.tlg001:7.166.1). Herodotus reports it as their story. Gelon's brother and successor Hieron won the horse race at Olympia in 476 BC, and Pindar celebrated it in the first Olympian ode.

## Athens' great mistake

Thucydides thought the Athenians did not know what they were taking on:

{{quote:ignorant}}

{well} In the summer of 415 BC [the fleet sailed](cts:tlg0003.tlg001:6.31.1), with Alcibiades, Nicias and Lamachus in command. Alcibiades was recalled to stand trial and fled to Sparta; Lamachus was killed; a Spartan general reached Syracuse and organised its defence; Athenian reinforcements came and were thrown away in a night attack and a battle in the Great Harbour. In 413 BC the army tried to escape overland and was destroyed. The prisoners were held in the stone quarries of Syracuse, where, Thucydides says, [crowded in a deep, narrow place without a roof, they suffered from the sun by day and the cold by night](cts:tlg0003.tlg001:7.87.1). He ends with the verdict:

{{quote:end}}

## The siege of 212 BC

{well} Syracuse remained the great power of Greek Sicily under the tyrants Dionysius I and II, whose court Plato visited, and under King Hieron II, who allied himself with Rome. When his successors went over to Carthage in the war with Hannibal, the Romans under Marcellus besieged the city and took it in 212 BC. Its defence had been helped by the machines of the mathematician Archimedes.

{legend} Plutarch gives more than one account of Archimedes' death. In the first, a soldier ordered him to come to Marcellus, and [Archimedes refused to go until he had finished his problem](cts:tlg0007.tlg022:19.4), so the soldier killed him; Marcellus, says Plutarch, was more grieved by this than by anything else in the capture.

{{timeline}}`,
  quotes: {
    ignorant: {
      work: "tlg0003.tlg001", ref: "6.1.1", label: "Thucydides 6.1.1",
      grc: "ἄπειροι οἱ πολλοὶ ὄντες τοῦ μεγέθους τῆς νήσου καὶ τῶν ἐνοικούντων τοῦ πλήθους καὶ Ἑλλήνων καὶ βαρβάρων",
      tr: "most of them being ignorant of the great size of the island and of the large number of its inhabitants, Hellenic as well as Barbarian",
      trFrom: "corpus", trBy: "C. F. Smith (1921)",
    },
    end: {
      work: "tlg0003.tlg001", ref: "7.87.6", label: "Thucydides 7.87.6",
      grc: "πανωλεθρίᾳ δὴ τὸ λεγόμενον καὶ πεζὸς καὶ νῆες καὶ οὐδὲν ὅτι οὐκ ἀπώλετο, καὶ ὀλίγοι ἀπὸ πολλῶν ἐπ’ οἴκου ἀπενόστησαν.",
      tr: "having met, as the saying goes, with utter destruction—land-force and fleet and everything perished, and few out of many came back home.",
      trFrom: "corpus", trBy: "C. F. Smith (1923)",
    },
  },
  timeline: [
    { when: "c. 734–733 BC", what: "Naxos and then Syracuse are founded, by Thucydides' reckoning.", certainty: "debated" },
    { when: "480 BC", what: "Gelon and Theron defeat the Carthaginians at Himera.", certainty: "well" },
    { when: "476 BC", what: "Hieron of Syracuse wins at Olympia; Pindar's first Olympian ode.", certainty: "well" },
    { when: "415 BC", what: "The Athenian expedition sails.", certainty: "well" },
    { when: "413 BC", what: "The Athenian army is destroyed; the prisoners are held in the quarries.", certainty: "well" },
    { when: "405–367 BC", what: "Dionysius I rules Syracuse.", certainty: "well" },
    { when: "212 BC", what: "Marcellus takes Syracuse; Archimedes is killed.", certainty: "well" },
  ],
  readIt: [
    { work: "tlg0003.tlg001", ref: "6.1.1", to: "6.5.3", label: "Thucydides 6.1–5", why: "Sicily before the Athenians came: its peoples and colonies." },
    { work: "tlg0003.tlg001", ref: "6.30.1", to: "6.32.2", label: "Thucydides 6.30–32", why: "The fleet sails from Piraeus, with all Athens watching." },
    { work: "tlg0003.tlg001", ref: "7.84.1", to: "7.87.6", label: "Thucydides 7.84–87", why: "The end at the river Assinarus, and the quarries." },
    { work: "tlg0007.tlg022", ref: "14.7", to: "19.6", label: "Plutarch, Marcellus 14–19", why: "Archimedes' machines and the fall of Syracuse." },
  ],
  related: ["athens", "plague-of-athens", "melos"],
  places: ["462492", "462503"],
  primary: [
    { work: "tlg0003.tlg001", ref: "6.1.1", label: "Thucydides 6.1.1" },
    { work: "tlg0003.tlg001", ref: "6.3.1", to: "6.3.2", label: "Thucydides 6.3" },
    { work: "tlg0003.tlg001", ref: "7.87.1", to: "7.87.6", label: "Thucydides 7.87" },
    { work: "tlg0016.tlg001", ref: "7.166.1", label: "Herodotus 7.166" },
    { work: "tlg0007.tlg022", ref: "19.4", to: "19.5", label: "Plutarch, Marcellus 19.4–5" },
  ],
  secondary: [
    { id: "kagan-nicias", note: "The expedition from its debate in Athens to its end." },
    { id: "hornblower-thuc-3", note: "Line-by-line commentary on Thucydides' books on Sicily." },
  ],
  written: "2026-11-11",
};
export default entry;
