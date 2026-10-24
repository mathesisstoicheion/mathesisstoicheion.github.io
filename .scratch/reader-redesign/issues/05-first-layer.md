# 05. The look-up's first layer: the word, one meaning, plain grammar

Status: ready-for-agent
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

- [ ] Unit tests check that μῆνιν in Iliad 1.1 (real data) gives μῆνις, "noun, feminine", "wrath, revengeful
      temper", "Accusative singular" and "object of ἄειδε".
- [ ] Unit tests check that a word in a work with no treebank gives no role line.
- [ ] Unit tests check that a word in no dictionary says so plainly.
- [ ] A unit test checks a set of real tags and their plain wording.
- [ ] No meaning line is ever made up. Every one traces to the core list or LSJ, which a test checks.
- [ ] `check-lookup` checks that the first layer shows no badge, no lesson card and no credits.
- [ ] The owner has looked at it and given the go.

## Comments
