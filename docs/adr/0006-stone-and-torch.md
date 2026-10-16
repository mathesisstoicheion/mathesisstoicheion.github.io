# 6. Three designs compared; Stone and torch chosen; motion stays calm; the name's emblem
Date: 2026-10-16
Follows: 0005-calm-motion-and-gathering-letters.md.

Context:
- After version 10 of the samples the owner asked: "Do that, then create 2 other complete redesigns that I can A. B. C. test".
- Along the way they asked for:
  - multitouch: the site should track "where your finger is when scrolling", not only a first touch;
  - snapping: "some of the scrolling should be automatic and should snap into place. Make a slower scroll".
- Three complete designs were built and published side by side:
  - A, "Gold and lamplight": the direction of ADRs 1 to 5;
  - B, "Stone and torch": a dark stone wall read by a torch, with carved stoichedon Greek and re-lit reliefs;
  - C, "Clay and glaze": black glaze and terracotta, with a turning prize amphora.
- The owner then asked for "a quick and snappy scroll with springy animation and more flashy animations". About fifteen minutes later they rejected it: "No, no. Keep the slow scroll. Maybe just not THAT slow. And make it more snappy. Get rid of the flashy animations. It's horrible. I liked the way it was before".
- They asked what object goes with the name, and of three suggestions said: "I like all the ideas. Maybe we should incorporate them all?" The suggestions were a wax tablet with stylus, a sundial's pointer, and a compass with a geometry figure.
- Their choice: "I like stone and torch", and then "Stone and torch" on the question whether to build on it alone.

Decision:
- The site is built on design B, "Stone and torch" (see `DESIGN.md`). A and C stay as they are, to look back at.
- Motion stays calm:
  - the wheel is a little slowed (0.8 of normal) and smooth;
  - there is no snapping: the page stays where it is left (see the note below);
  - nothing sparks, flares or flashes.
- On a phone every finger carries its own light, even while the page scrolls.
- The name gets an emblem that shows the three meanings of στοιχεῖον in one still life:
  - a letter: the wax tablet;
  - a sundial's shadow: the stylus standing in the wax, whose shadow is the line Euclid builds on;
  - an element: Euclid's first proposition, drawn with the compass.
- The emblem has its own home section, with each meaning quoted from LSJ, Aristophanes and Euclid. Its flat form is the header's mark.

Consequences:
- Any new effect must be calm. Before adding anything that bounces, sparks or flashes, ask the owner.
- Design tokens (colours, type, spacing) are taken from B, and the build starts from B's prototype.
- The quotations beside the emblem were checked against the sources:
  - LSJ: the site's LSJ pack;
  - Euclid 1.1: Heiberg's text, via Perseus;
  - Ecclesiazusae 652: Hall and Geldart's text, via Perseus.
- They must not be reworded without checking again.

Later the same day:
- The page had been gliding to a nearby section after it stopped. The owner: "no snapping. it's annoying".
- So the snapping was taken out: the page stops exactly where the wheel or the finger leaves it. The calm, slightly slowed wheel stays.
- Do not bring back snapping, or any automatic scroll, without asking the owner.
