"use client";
/**
 * The ledger of the author articles' accounts (Manuscripts & transmission, Textual variants): the authors in time order under
 * century headings, and the chosen author's opening paragraph in full.
 *  - a computer (1024 px and wider): the list of authors at the left, kept in view, the chosen account at the right;
 *  - a phone and narrow screens: the same list as rows that open in place to show the paragraph;
 *  - without JavaScript (and until this page has started): every account, stacked one after another.
 * A link to `#ledger-<id>` (the chart's author names) chooses that author. Nothing here is written anew: the paragraph is the
 * article's own (Transmission.tsx passes it whole).
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./Ledger.module.css";

export interface LedgerItem {
  id: string;
  name: string;
  /** the century group the author stands under */
  group: string;
  /** the account's opening words up to the first full stop, when short ("Wild papyri."), else null */
  lead: string | null;
  text: string;
  href: string;
}

const hashId = () => (typeof location === "undefined" ? null : /^#ledger-(.+)$/.exec(location.hash)?.[1] ?? null);

function Account({ a, heading: H }: { a: LedgerItem; heading: "h3" | "h4" }) {
  return (
    <>
      <H className={styles.name}>{a.name}</H>
      <p className={styles.text}>{a.text}</p>
      <Link href={a.href} transitionTypes={["page-turn"]} className={styles.go}>The whole account <span aria-hidden="true">→</span></Link>
    </>
  );
}

export default function Ledger({ items }: { items: LedgerItem[] }) {
  const [ready, setReady] = useState(false);
  const [wide, setWide] = useState(false);
  const [sel, setSel] = useState(items[0]?.id ?? "");
  const [open, setOpen] = useState<Set<string>>(new Set());

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const size = () => setWide(mq.matches);
    const pick = () => { const id = hashId(); if (id && items.some((a) => a.id === id)) { setSel(id); setOpen((o) => new Set(o).add(id)); } };
    size(); pick(); setReady(true);
    mq.addEventListener("change", size);
    window.addEventListener("hashchange", pick);
    return () => { mq.removeEventListener("change", size); window.removeEventListener("hashchange", pick); };
  }, [items]);

  const groups: { name: string; rows: LedgerItem[] }[] = [];
  for (const a of items) { const g = groups[groups.length - 1]; if (g && g.name === a.group) g.rows.push(a); else groups.push({ name: a.group, rows: [a] }); }
  const chosen = items.find((a) => a.id === sel) ?? items[0];

  if (!ready) {
    return (
      <div className={styles.stack}>
        {groups.map((g) => (
          <section key={g.name} className={styles.group}>
            <h3 className={`label ${styles.groupH}`}>{g.name}</h3>
            {g.rows.map((a) => <article key={a.id} id={`ledger-${a.id}`} className={styles.account}><Account a={a} heading="h4" /></article>)}
          </section>
        ))}
      </div>
    );
  }

  if (!wide) {
    return (
      <div className={styles.fold}>
        {groups.map((g) => (
          <section key={g.name} className={styles.group}>
            <h3 className={`label ${styles.groupH}`}>{g.name}</h3>
            <ul className={styles.list}>
              {g.rows.map((a) => {
                const shown = open.has(a.id);
                return (
                  <li key={a.id} id={`ledger-${a.id}`}>
                    <button type="button" className={styles.row} aria-expanded={shown} aria-controls={`panel-${a.id}`}
                      onClick={() => setOpen((o) => { const n = new Set(o); if (n.has(a.id)) n.delete(a.id); else n.add(a.id); return n; })}>
                      <b>{a.name}</b>{a.lead && <span>{a.lead}</span>}
                    </button>
                    <div id={`panel-${a.id}`} hidden={!shown} className={styles.panel}>
                      <p className={styles.text}>{a.text}</p>
                      <Link href={a.href} transitionTypes={["page-turn"]} className={styles.go}>The whole account <span aria-hidden="true">→</span></Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.ledger}>
      <nav className={styles.index} aria-label="Authors">
        {groups.map((g) => (
          <section key={g.name} className={styles.group}>
            <h3 className={`label ${styles.groupH}`}>{g.name}</h3>
            <ul className={styles.list}>
              {g.rows.map((a) => (
                <li key={a.id} id={`ledger-${a.id}`}>
                  <button type="button" className={styles.row} aria-current={a.id === chosen.id ? "true" : undefined} onClick={() => setSel(a.id)}>
                    <b>{a.name}</b>{a.lead && <span>{a.lead}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>
      <article className={styles.chosen} aria-live="polite">
        <Account a={chosen} heading="h3" />
      </article>
    </div>
  );
}
