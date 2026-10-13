/**
 * A text field of a private translation, with its light markup (parseRich in lib/private-translations.ts):
 * paragraphs, line breaks, *italics*, and ⟦words⟧ the editor of the Greek thinks were added later, shown
 * dimmed between their brackets, with the explanation on hover and for screen readers. The text is only ever
 * text: nothing in a file is read as HTML.
 */
import { Fragment, type ReactNode } from "react";
import { parseRich, type RichNode } from "@/lib/private-translations";
import styles from "./PrivateTranslations.module.css";

export const ADDED_NOTE = "The editor thinks these words were added later";

function render(ns: RichNode[], key: string): ReactNode[] {
  return ns.map((n, i) => {
    const k = `${key}.${i}`;
    if (n.k === "text") return <Fragment key={k}>{n.s}</Fragment>;
    if (n.k === "br") return <br key={k} />;
    if (n.k === "i") return <i key={k}>{render(n.c, k)}</i>;
    return (
      <span key={k} className={styles.added} data-added="" title={ADDED_NOTE}>
        <span className="visually-hidden" lang="en">({ADDED_NOTE.toLowerCase()}:) </span>
        <span className={styles.bracket} aria-hidden="true">⟦</span>{render(n.c, k)}<span className={styles.bracket} aria-hidden="true">⟧</span>
      </span>
    );
  });
}

/** Each paragraph as a <p>; or, `inline`, the paragraphs run on in one line with breaks between (for short fields). */
export default function Rich({ text, inline = false }: { text: string | undefined; inline?: boolean }) {
  const paras = parseRich(text);
  if (inline) return <>{paras.map((p, i) => <Fragment key={i}>{i > 0 && <br />}{render(p, `${i}`)}</Fragment>)}</>;
  return <>{paras.map((p, i) => <p key={i}>{render(p, `${i}`)}</p>)}</>;
}
