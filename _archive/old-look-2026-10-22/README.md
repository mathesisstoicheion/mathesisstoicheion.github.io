# The old look, set aside on 2026-10-22

Files of the "Gold and lamplight" design (design A) that the printed-page redesign no longer uses: the lamplight, the
floating letters, the gliding and settling text, the opening windows, the letter-drawn pictures and their images.
They are kept here, in the same folders as they had under `web/`, because the house rule is never to delete; the owner
deletes later. The redesign's own notes are in the project files: `redesign/printed-page/SPEC.md` and `DECISIONS.md`.

What is here:

- `web/src/components/a/`: the lamplight's level setting, the floating letters, the gliding and settling text, the
  windows that opened onto each page, the home page's old desk and passage, the library's old stage, the famous books
  drawn in letters, and their stylesheets.
- `web/src/lib/a/lamplight.js`: the lamplight and the slow wheel.
- `web/src/lib/tempo.ts`: the old animation speed (the printed page has one movement only, the ink-in).
- `web/src/components/FindJump.tsx` and `web/src/app/library/library.module.css`: no longer used by any page.
- `web/scripts/prepare-engravings.py`: made the letter-drawn pictures.
- `web/public/images/a/`, `web/public/images/pieces/lit/`, `web/public/images/relit/`: the pictures those files used
  (lit and cut-out copies of the museum photographs; the photographs themselves stay in `web/public/images/`).
- `web/public/logo/owl.svg`, `web/public/favicon.ico`, `web/public/apple-touch-icon.png`, `web/public/icons/` and
  `android/app/src/main/res/mipmap-*/ic_launcher.png`: the old owl icons. The printer's device replaced them; the new
  icons are made by `web/scripts/make-logo.mjs`.
- `web/scripts/make-logo.mjs` and `web/scripts/make-share-card.mjs`: the old scripts that drew the owl and the old share
  picture (`web/public/og-card.png`, also here). New scripts of the same names draw the printer's device and the new
  share picture.
