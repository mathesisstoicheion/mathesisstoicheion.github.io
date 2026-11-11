"use client";
/**
 * The reader's own controls under the book's title (the owner, 2026-11-11): the Greek / Both / English switch, the choice of Greek edition and
 * translation, and "Add your own text". Nothing here keeps a setting of its own: the switch is the Columns choice of Aa and the two pickers are
 * the ones in the Text menu (the same EditionPicks), so a change in one place is the same change in the others. "Add your own text" opens the
 * private collection's window (MineDialog, its "Import a text" tab); like that window, it is for the moderator's account only.
 */
import { Segmented } from "@/components/ReadingControls";
import Icon from "@/components/Icon";
import type { Columns } from "@/lib/settings";
import { EditionPicks, type StudyProps } from "./StudyMenu";
import styles from "./Reader.module.css";

const COLUMNS: [Columns, string][] = [["greek", "Greek"], ["both", "Both"], ["trans", "English"]];

export default function HeadTools({ menu, columns, onColumns, onImport }: {
  menu: StudyProps; columns: Columns; onColumns: (c: Columns) => void;
  /** present only for the moderator: opens the private collection's window */
  onImport?: () => void;
}) {
  return (
    <div className={styles.headTools} data-head-tools="">
      <Segmented label="Show" value={columns} options={COLUMNS} onChange={onColumns}
        unavailable={(c) => !!menu.cmpText || (c !== "greek" && !menu.trText)} />
      <EditionPicks {...menu} />
      {onImport && <button type="button" className={`btn ghost ${styles.headImport}`} onClick={onImport}><Icon name="upload" />Add your own text</button>}
    </div>
  );
}
