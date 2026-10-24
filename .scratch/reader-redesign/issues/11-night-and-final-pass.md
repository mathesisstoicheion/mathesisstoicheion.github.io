# 11. Night, keyboard and the final pass

Status: ready-for-agent
Type: HITL
Blocked by: 04, 05, 06, 07, 08, 09, 10
Spec: `../spec.md`, "Testing". User stories 9, 22, 23

## What to build

- Check every new part in Night against mockup B's Night version, and fix what differs.
- Keyboard: reach the words, step between them, open More, close with Escape, and reach the bar, Aa and Study.
- Screen reader: the note is announced with its word, and the bar and Study have names.
- Run every check in `checks.yml`, plus the new reader checks, in Paper and Night, at 390 px and 1440 px.

## Acceptance criteria

- [ ] `check-a11y`, `check-look` and `check-ink` pass in Paper and Night.
- [ ] Every check in `checks.yml` passes.
- [ ] The owner has read in Night on the OnePlus and given the go.
- [ ] Nothing is published until the owner says "publish".

## Comments
