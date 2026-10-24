# 06. "More about it": the second layer

Status: ready-for-agent
Type: HITL
Blocked by: 05
Spec: `../spec.md`, "Solution", "Placement". User stories 15, 20, 21

## What to build

- "More about it" opens the second layer:
  - on a computer, a side panel built on the shell from ticket 01
  - on a phone, the sheet dragged up to nearly full
- The second layer holds, in this order:
  - the LSJ entry, abridged, with "The whole entry"
  - where else the word occurs ("12 times in the Iliad"), which opens Echoes
  - how the sentence is built
  - the lesson that explains the grammar
  - Word Study
  - the other dictionaries (Wiktionary, Logeion, Perseus)
- The credits become one quiet line at the foot. They name the treebank and GLAUx with their licence, and LSJ with
  Perseus's licence.
- Wiktionary stays in the second layer and never repeats a meaning already shown.

## Acceptance criteria

- [ ] `check-credits` passes, with the credits shown once, at the foot of the second layer.
- [ ] `check-lookup` checks that, from the first layer, one tap or click shows the full LSJ entry, Echoes, the
      sentence, the lesson and Word Study.
- [ ] Escape or × closes the second layer back to the first, then the look-up.
- [ ] The owner has looked at it and given the go.

## Comments
