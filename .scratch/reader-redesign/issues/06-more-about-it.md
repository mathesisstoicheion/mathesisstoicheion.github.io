# 06. "More about it": the second layer

Status: built (2026-10-29), waiting for the owner's look
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

- [x] `check-credits` passes, with the credits shown once, at the foot of the second layer.
- [x] `check-lookup` checks that, from the first layer, one tap or click shows the full LSJ entry, Echoes, the
      sentence, the lesson and Word Study.
- [x] Escape or × closes the second layer back to the first, then the look-up.
- [ ] The owner has looked at it and given the go.

## Comments
- Coded by a helper (Sonnet), planned and reviewed by the lead.
- Computer: following the owner's "floating window" (2026-10-26), More does not open a panel at the screen's edge; the
  same window over the margin grows (up to the height of the screen) to hold the second layer, so the text never
  reflows. Phone: the sheet rises to full height. "‹ Back" and Escape return to the first layer; Escape again, or ×,
  closes the look-up.
- Order: Dictionary · LSJ (its short definitions, less the one the card already gives, and "The whole entry"); Go
  further (where else the word occurs, e.g. "12 times in the Iliad", counted from the work's word pack; how the
  sentence is built; the lesson; Word Study; the map for a place); Wiktionary (never repeating the card's meaning);
  More dictionaries (Logeion, Perseus); one sentence on how sure the analysis is; one credit line naming only the
  sources shown (for μῆνιν: GLAUx with the treebank, CC BY-SA 4.0, and LSJ from the Perseus Digital Library, CC BY-SA).
- The "Core vocabulary · #rank" section is gone; the core list's credit is in the foot line when its meaning is shown.
- LSJ entries ran a Greek word straight into the citation after it ("μήνιοςPl. R. 390e"); a space now separates them
  (here and in Word Study).
- Still describing the old look-up, for a later ticket: the in-site guide (`src/data/guides.ts`) and a tour
  (`src/lib/tours.ts`).
- All the site's checks pass, apart from the Learn page's older one.


## Comment, 2026-10-29: back routes (Noa: "The word lookup in the reader needs a back button", chose "All three")

- "How the sentence is built" and "12 times in the Iliad", opened from the look-up, show "‹ Back to μῆνις" above their
  title. It closes the panel and reopens the look-up on the same word, in the second layer. Opened from the Tools menu,
  there is no Back.
- "‹ Back" in More is now a button at reading size with room around it, 44 px on a touch screen.
- The phone's back gesture (the browser's Back) steps from the second layer to the first, then closes the look-up,
  without leaving the reader or moving the text (`useBackSteps.ts`). Not in the floating window or two books side by
  side. Tested only with Chromium's Back, not on a real phone yet.
- check-lookup tests all three. All the site's checks pass, apart from the Learn page's older one.
