/**
 * A line of English with Greek in it (a lesson's title, a button's words): each run of Greek is marked as Greek
 * (lang="grc"), so it is set in the Greek face, read as Greek by screen readers, and never put in capitals by a label's or
 * a button's style (globals.css).
 */
import { Fragment } from "react";

const GREEK_RUN = /((?:[Ͱ-Ͽἀ-῿][̀-ͯͰ-Ͽἀ-῿’ʼ]*[\s,·;.]*)+)/u;

export default function GreekText({ text }: { text: string }) {
  const parts = text.split(GREEK_RUN);
  if (parts.length === 1) return <>{text}</>;
  return <>{parts.map((p, i) => (i % 2 ? <span key={i} lang="grc">{p}</span> : <Fragment key={i}>{p}</Fragment>))}</>;
}
