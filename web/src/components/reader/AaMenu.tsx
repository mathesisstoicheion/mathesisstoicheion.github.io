"use client";
/**
 * Aa: the small menu for the page and the type (the quiet desk, ticket 09, the owner, 2026-10-30). It holds the page (Follow device, Paper or
 * Night), the size of the Greek, the line spacing, and the columns (Greek, Both or English), each named in the site's small label style with its
 * sign. The first three are the very controls of Settings > Reading (ReadingControls), so a change in either is the same change. There is no
 * choice of typeface and no sample here: the Greek is Gentium (settings version 4); the sample is for Settings.
 * The columns are the old bar's Both / Greek / English: Greek is the first because it is how a book opens; while two Greek editions are compared
 * they are fixed, and with no translation only the Greek can show. Above them (the owner, 2026-11-09), the Greek edition and the translation.
 */
import ReadingControls, { Choice, Segmented } from "@/components/ReadingControls";
import type { ReactNode } from "react";
import type { Columns } from "@/lib/settings";
import { MenuHead } from "./ReaderBar";
import styles from "./ReaderBar.module.css";

const COLUMNS: [Columns, string][] = [["greek", "Greek"], ["both", "Both"], ["trans", "English"]];

export default function AaMenu({ columns, onColumns, hasTranslation, comparing, texts }: {
  columns: Columns; onColumns: (c: Columns) => void;
  /** the book has a translation chosen (without one the English cannot be shown) */
  hasTranslation: boolean;
  /** two Greek editions are being compared: the columns are fixed */
  comparing: boolean;
  /** the Greek edition and the translation (StudyMenu.tsx, EditionPicks): the text you read, beside how it is set (the owner, 2026-11-09) */
  texts?: ReactNode;
}) {
  return (
    <>
      <MenuHead title="Page and text" />
      <div className={styles.body}>
        {texts}
        <ReadingControls>
          <Choice icon="columns">Columns</Choice>
          <Segmented label="Columns" value={columns} options={COLUMNS} onChange={onColumns}
            unavailable={(c) => comparing || (c !== "greek" && !hasTranslation)} />
        </ReadingControls>
      </div>
    </>
  );
}
