"use client";
/**
 * The reader's own controls under the book's title (the owner, 2026-11-11): the Greek / Both / English switch, the choice of Greek edition and
 * translation, and "Add your own text". Nothing here keeps a setting of its own: the switch is the Columns choice of Aa and the two pickers are
 * the ones in the Text menu (the same EditionPicks), so a change in one place is the same change in the others. "Add your own text" opens the
 * private collection's window (MineDialog, its "Import a text" tab); like that window, it is for the moderator's account only.
 */
import { Segmented } from "@/components/ReadingControls";
import Icon from "@/components/Icon";
import { hasTranslation } from "@/lib/catalog";
import type { Columns } from "@/lib/settings";
import { EditionPicks, type StudyProps } from "./StudyMenu";
import styles from "./Reader.module.css";

const COLUMNS: [Columns, string][] = [["greek", "Greek"], ["both", "Both"], ["trans", "English"]];

export default function HeadTools({ menu, columns, onColumns, onImport }: {
  menu: StudyProps; columns: Columns; onColumns: (c: Columns) => void;
  /** present only for the moderator: opens the private collection's window */
  onImport?: () => void;
}) {
  // no English at all for this work: say so, grey English and Both, and tell where your own can come from (words on a hover, and in plain
  // sight below for a touch screen, which has no hover)
  const noEnglish = !menu.cmpText && !hasTranslation(menu.work);
  const why = onImport
    ? "There is no English translation of this work in the library. If you have one, add it with “Add your own text”."
    : "There is no English translation of this work in the library.";
  return (
    <div className={styles.headTools} data-head-tools="">
      <Segmented label="Show" value={columns} options={COLUMNS} onChange={onColumns}
        unavailable={(c) => !!menu.cmpText || (c !== "greek" && !menu.trText)}
        hint={(c) => (noEnglish && c !== "greek" ? why : undefined)} />
      {noEnglish && <p className={styles.headNote} role="note">No English translation of this work is in the library.{onImport && " You can add your own, or your own Greek, with the button below."}</p>}
      <EditionPicks {...menu} />
      {onImport && <button type="button" className={`btn ghost ${styles.headImport}`} onClick={onImport}><Icon name="upload" />Add your own text<span className="visually-hidden"> (a translation or a Greek version)</span></button>}
    </div>
  );
}
