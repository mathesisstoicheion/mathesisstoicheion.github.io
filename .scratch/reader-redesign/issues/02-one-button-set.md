# 02. One button set and one switch in the reader

Status: ready-for-agent
Type: AFK (no visible change meant)
Blocked by: 01
Spec: `../spec.md`, "Building order"

## What to build

- Bring the reader's button styles (chip with a switch, chip as an action, floatBtn, btn ghost and the rest) down to
  one set:
  - a quiet text button
  - a red text button for the one main action in a place
  - an icon button, at least 44 px on a phone
  - one switch, for on and off settings
- Move every button and switch in `web/src/components/reader/` onto the set.

## Acceptance criteria

- [ ] A check lists the button classes in the reader's files and fails on any outside the set.
- [ ] Every reader control is at least 44 px on a phone (390 px wide), checked on the built site.
- [ ] `check-design` (one primary button) and `check-a11y` pass in Paper and Night.
- [ ] The build passes.

## Comments
