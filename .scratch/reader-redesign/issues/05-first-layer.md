# 05. The look-up's first layer: the word, one meaning, plain grammar

Status: built (2026-10-29), waiting for the owner's look
Type: HITL
Blocked by: 04
Spec: `../spec.md`, "The look-up card", "Plain grammar". User stories 16 to 19, 23

## What to build

- **The look-up card.** A pure function from a word and its place in the text to what the first layer shows:
  - the dictionary form and the kind of word ("μῆνις, noun, feminine")
  - one meaning line with its source: the core vocabulary list if the word is in it, otherwise LSJ's short definition
  - the role in the sentence, only where the treebank has it, through `governor()` in `lib/constructions.ts` and a
    small table of relations in plain words; an unknown relation gives nothing
  - the grammar in plain words ("Accusative singular"), built on `lib/lookup/postag.ts`
- **The note and the sheet** show only this card, with Previous, Next, "More about it" and ×. The meaning is the
  largest English on the screen: about 25 px on a computer, 22 px on a phone. Everything else the look-up shows today
  moves behind "More about it", which until ticket 06 opens the current full view.
- **Screen readers.** The note is announced with the word it explains.

## Acceptance criteria

- [x] Unit tests check that μῆνιν in Iliad 1.1 (real data) gives μῆνις, "noun, feminine", "wrath, revengeful
      temper", "Accusative singular" and "object of ἄειδε".
- [x] Unit tests check that a word in a work with no treebank gives no role line.
- [x] Unit tests check that a word in no dictionary says so plainly.
- [x] A unit test checks a set of real tags and their plain wording.
- [x] No meaning line is ever made up. Every one traces to the core list or LSJ, which a test checks.
- [x] `check-lookup` checks that the first layer shows no badge, no lesson card and no credits.
- [ ] The owner has looked at it and given the go.

## Comments
- Coded by a helper (Sonnet), as the owner asked on 2026-10-26; planned and reviewed by the lead.
- The card is `lookupCard` in `web/src/lib/lookup/card.ts`; `kindOf` and `plainGrammar` are in `postag.ts`. Tests use real
  slices of Iliad 1.1 to 1.7 from the packs repository, saved in `web/src/lib/lookup/fixtures/iliad-1-1.json` with their
  source URLs: μῆνιν gives μῆνις, "noun, feminine", "wrath, revengeful temper" (LSJ), "object of ἄειδε" and "Accusative
  singular", as the ticket expected. 33 real tags are checked for their plain wording.
- Relations in plain words: subject, object, predicate, object complement, attribute, adverbial addition, apposition,
  and the main verb. Any other relation (a vocative, a particle…) shows no role rather than a guess.
- The meaning names its source to screen readers ("from LSJ") and in a tooltip; visibly the card follows mockup B.
- "More about it" (it reads "Less" when open) shows the rest as before; ticket 06 redesigns it. In the sheet it also
  raises the sheet to full height.
- Noticed, for ticket 06: some of LSJ's short definitions are rough (Ζεύς: "planet Jupiter, monad"); the core list
  wins where a word is on it. Ἀχιλλεύς has an LSJ entry with no short definition; the card then says so plainly.
- `check-lookup` fails on a badge, the lesson card, a credit or the dictionary in the first layer, and when More does
  not reveal the dictionary. All the site's checks pass apart from the Learn page's older one.

