# 03. Spacing on the scale and old colour names out of the reader

Status: ready-for-agent
Type: AFK (no visible change meant)
Blocked by: 01, 02
Spec: `../spec.md`, "Building order"

## What to build

- Every spacing value in the reader's files uses the scale (`--space-1` to `--space-8`: 4, 8, 12, 16, 24, 36, 56,
  80 px). This covers the 194 off-scale values in `Reader.module.css` and those in the reader's other CSS files.
  Hairline gaps of 1 or 2 px may stay, listed in one place.
- Font sizes in the reader use the type scale, except the reader's own Greek size setting.
- Use the role names in the reader's files. Remove names from scrapped looks (`--gold` meaning red, `--lintel` and the
  like) from them. A token in `tokens.css` that nothing uses after this is moved out to `_archive/`, never deleted
  outright.
- Fix the failing token check on `PathStepView.tsx` and `PracticeView.tsx` while doing this. It fails on main today.

## Acceptance criteria

- [ ] `check-tokens` passes, and the reader's files have a baseline of zero.
- [ ] Side-by-side screenshots of Iliad 1 and the Apology show no visible change beyond spacing rounded to the scale.
      The screenshots are for checking only and are not sent to the owner. Any noticeable change is described in
      words in the comments.
- [ ] The build and all checks in `checks.yml` pass.

## Comments
