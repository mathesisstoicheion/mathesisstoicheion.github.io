# 10. Homer's lines fit whole on a phone

Status: ready-for-agent
Type: HITL
Blocked by: 03
Spec: `../spec.md`, "Sizes". User story 6

## What to build

- **Verse fit.** A function from a passage's longest line and the width of the screen to the Greek size for verse:
  about 16.5 to 18 px, never below 16 px.
- **Wrapping.** A line that still does not fit wraps with a hanging indent.
- **Scope.** Prose keeps the reader's size setting. The old "Fit lines" switch is replaced by this and moves to
  `_archive/` if nothing else uses it.

## Acceptance criteria

- [ ] A unit test checks that the Iliad's longest lines at 390 px fit, and that the size is never below 16 px.
- [ ] A check on the built site confirms that every line of Iliad 1 fits whole at 390 × 844.
- [ ] The owner has read a page of Homer on the OnePlus and given the go.

## Comments
