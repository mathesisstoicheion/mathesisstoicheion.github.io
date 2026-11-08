/**
 * The one tool panel open at the side of the text: Find, Vocabulary, Places, Manuscripts, Talk, or the list of differences.
 *
 * At most one is open at a time (the owner's rule: "the panels a row of Study opens: one at a time"), so the reader keeps a
 * single `Tool` (or `null`) rather than one yes/no for each panel: two can never be open together by mistake, and opening one
 * is one step, not six. The Echoes and the sentence panel are not tools: they hold a passage or a word of their own and lay
 * over a tool for a while (Reader.tsx).
 */
import type { StudyPanel } from "./StudyMenu";

/** A tool panel, by the name its row of Study has. */
export type Tool = StudyPanel;
/** The tool open now, if any. */
export type ToolSlot = Tool | null;

/** Every tool, in the order of the Study menu. */
export const TOOLS: readonly Tool[] = ["find", "vocab", "places", "ms", "talk", "cmp"];

/** A row of Study (or a tool's own button) pressed: it opens its tool, in place of any other, or closes it if it is the one open. */
export const toggleTool = (now: ToolSlot, t: Tool): ToolSlot => (now === t ? null : t);

/** A tool's own × (or Back): it closes, if it is the one open; any other stays. */
export const closeTool = (now: ToolSlot, t: Tool): ToolSlot => (now === t ? null : now);

/**
 * The Echoes open: Find and the list of differences wait behind them and come back when they close (what was found, or which
 * difference, is kept); the other tools close.
 */
export const underEchoes = (now: ToolSlot): ToolSlot => (now === "find" || now === "cmp" ? now : null);
