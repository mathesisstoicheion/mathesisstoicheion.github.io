# 10. Explicit states, not flags side by side
Date: 2026-11-08

Context:
- The owner asked for every hidden state machine in the app to be found, and for the ones worth it to be made explicit,
  for the reader, for whoever works on the code next, and for the agents that do.
- A hidden state machine here is a set of yes/no flags (or a flag beside a value) that are really one thing with a few
  named states. Every place that changes one flag has to remember to reset the others, and some mixes mean nothing.
- The sweep found these, among about 590 files:
  - The reader's side tools: six flags (Find, Vocabulary, Places, Manuscripts, Talk, the list of differences), reset by
    hand in eight places. One place (Ctrl+F) missed one, so two tools could be open at once.
  - The Stoa board's buttons (Approve, Decline, Delete, Put it up, Show more): a busy flag beside an error text in each,
    and an item page whose item was "undefined" while loading, "null" when missing, plus an error text.
  - The lyre's "Record what you play": four flags (taking, tune, tuneBad, replaying).
- Already explicit, and left as they are: the reader's loading (`Load`), the private book (`useMineBook`), the reader's
  one small menu at a time (`drop`), the lyre's MIDI and WAV states, the Amphora's tilt, the Back steps (`useBackSteps`).
- Left alone on purpose: the forum (frozen: bugs only), and lone flags that are a real yes/no (a button busy while it
  hands over, a panel open or shut).

Decision:
1. Where flags are really one thing, keep one typed state with a `state` field (or one slot), as `Load` and
   `useMineBook` already do. The steps between states live in a small pure module beside the code, with tests:
   - `web/src/components/reader/tool.ts`: the one tool open at the side (`ToolSlot`).
   - `web/src/lib/task.ts`: a button's work for the database, `idle | busy | done | error` (`useTask`).
   - `web/src/lib/lyre/own.ts`: your own playing on the lyre, `empty | recording | kept`.
2. Each module's test also guards against the flags coming back (a new `setFindOpen`, or `setBusy` beside `setError`
   on the board).
3. Behaviour stays as it was, except where the flags allowed a mix nobody meant: Ctrl+F now replaces the list of
   differences like every other tool, and a tune opened from a link ends a recording or playback under way.

Consequences:
- New work on these parts adds a state, not a flag. A new reader tool is one more name in `TOOLS`.
- The forum keeps its flags until it is unfrozen.
