# 07. Greek alone by default, the English one tap away

Status: ready-for-agent
Type: HITL
Blocked by: 02
Spec: `../spec.md`, "Defaults and saved settings". User stories 3, 4, 5

## What to build

- The default for columns becomes "greek" in `lib/settings.ts`.
- A saved "both" changes once to "greek", through the settings upgrade. "Both" stays in Aa.
- Each passage gets a quiet "Show the English" under it, which opens Murray's (or the edition's) English for that
  passage only, with its credit line. "Hide the English" closes it again.

## Acceptance criteria

- [ ] A unit test checks the upgrade: a saved "both" becomes "greek" once, and a later choice of "both" is kept.
- [ ] `check-reader` checks that a book opens with no English column.
- [ ] `check-reader` checks that the English for one passage shows and hides, and the other passages stay Greek.
- [ ] The owner has looked at it and given the go.

## Comments
