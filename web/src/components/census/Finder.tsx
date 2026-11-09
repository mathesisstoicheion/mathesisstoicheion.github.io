"use client";
/**
 * Finding and filtering, as one search box and one sentence that says what is shown:
 *   “Show gods and heroes in the whole library, most mentioned first, used any number of times.”
 * Each underlined part is a button; it opens its choices in a drawer just under the sentence (one at a time), and the
 * sentence always reads back what is chosen, so the list never shows something nobody can name.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { EMPTY_SCOPE, groupInfo, groupOf, scopeParams, SHELVES, type Category, type CensusMeta, type Scope } from "@/lib/census";
import { BANDS, inList, ORDERS, WORD_KINDS, type Register } from "@/lib/census-register";
import Icon from "@/components/Icon";
import type { ListState } from "./Census";
import type { ListOutput } from "./rows";
import { fmt } from "./shared";
import styles from "./Census.module.css";

type Go = (changes: [string, string | null][]) => void;
type Slot = "what" | "where" | "order" | "often";

/** Labels for the lists the register adds to categories(). */
export function listLabel(c: string): { label: string; one: string; blurb: string } | null {
  if (c === "names") return { label: "All names", one: "name", blurb: "Every name: people, gods and heroes, places and peoples together." };
  if (c === "things") return { label: "All things", one: "thing", blurb: "Every word for a thing that has been sorted into a group: ships, animals, food and the rest." };
  const k = WORD_KINDS.find((x) => x.id === c);
  if (!k || ["words", "noun", "verb", "adj"].includes(c)) return null;
  const blurbs: Record<string, string> = {
    adv: "Adverbs: how, when and where (καλῶς, νῦν, ἐκεῖ).",
    pron: "Pronouns: I, you, this, who (ἐγώ, οὗτος, τίς).",
    small: "The little words that hold sentences together: the article, prepositions, conjunctions, particles and interjections.",
    num: "Number words (εἷς, δύο, τρεῖς…).",
  };
  return { label: k.label, one: k.one, blurb: blurbs[c] ?? "" };
}

export default function Finder({ meta, reg, cats, state, comparing, scopeB, go, out }: {
  meta: CensusMeta; reg: Register; cats: Category[]; state: ListState; comparing: boolean; scopeB: Scope; go: Go; out: ListOutput | null;
}) {
  const [open, setOpen] = useState<Slot | null>(null);
  const cat = cats.find((c) => c.id === state.c);
  const label = (cat?.label ?? listLabel(state.c)?.label ?? state.c).toLowerCase();
  const where = (s: Scope) => groupInfo(meta, groupOf(s)).label.replace(/^The /, "the ");
  const order = ORDERS.find((o) => o.id === state.order)!;
  const band = BANDS.find((b) => b.id === state.band);
  const often = band ? (band.id === "1" ? "only once" : band.id === "1000" ? "1,000 times or more" : `${band.label} times`) : "any number of times";
  const isDefault = state.c === "god" && groupOf(state.scope) === "all" && state.order === "most" && !state.band && !state.onlyOne && !state.query && !comparing;

  // the search box writes to the address a moment after typing stops
  const [q, setQ] = useState(state.query);
  const [lastQuery, setLastQuery] = useState(state.query);
  if (state.query !== lastQuery) { setLastQuery(state.query); setQ(state.query); }
  useEffect(() => {
    if (q === state.query) return;
    const t = setTimeout(() => go([["q", q.trim() || null], ["i", null]]), 260);
    return () => clearTimeout(t);
  }, [q, state.query, go]);

  const box = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    const away = (e: PointerEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(null); };
    addEventListener("keydown", esc);
    addEventListener("pointerdown", away);
    return () => { removeEventListener("keydown", esc); removeEventListener("pointerdown", away); };
  }, [open]);

  const slot = (id: Slot, text: React.ReactNode, name: string) => (
    <button type="button" className={styles.slot} aria-expanded={open === id} aria-controls="finder-drawer" aria-label={`${name}: ${typeof text === "string" ? text : ""}`.trim()}
      onClick={() => setOpen(open === id ? null : id)}>
      {text}<Icon name="chevron-down" />
    </button>
  );
  const choose = (changes: [string, string | null][]) => { go([...changes, ["i", null]]); setOpen(null); };

  return (
    <section ref={box} className={styles.finder} aria-label="Find and filter">
      <label className={styles.search}>
        <Icon name="search" />
        <input type="search" aria-label="Find a word, name or phrase" value={q} onChange={(e) => setQ(e.target.value)} enterKeyHint="search" autoComplete="off" spellCheck={false}
          placeholder="Find a word, name or phrase: Greek, Latin letters or English" />
        {q && <button type="button" className={styles.clear} onClick={() => setQ("")} aria-label="Clear the search"><Icon name="close" /></button>}
      </label>

      <p className={styles.sentence}>
        Show {slot("what", label, "What")} in {slot("where", comparing ? `${where(state.scope)}, beside ${where(scopeB)}` : where(state.scope), "Where")},{" "}
        {slot("order", order.label, "Order")}, used {slot("often", often + (state.onlyOne ? ", by one author only" : ""), "How often")}.
        {state.query && <> Only those matching <q className={styles.matching}>{state.query}</q>.</>}
        {!isDefault && (
          <button type="button" className={styles.reset} onClick={() => { setQ(""); choose([["c", null], ["o", null], ["h", null], ["u", null], ["q", null], ["cmp", null], ...scopeParams(EMPTY_SCOPE), ...scopeParams(EMPTY_SCOPE, "b")]); }}>
            Start again
          </button>
        )}
      </p>

      <div id="finder-drawer" className={styles.drawer} hidden={!open} role="region" aria-label={open ? { what: "What to count", where: "Where to count", order: "In what order", often: "How often" }[open] : undefined}>
        {open === "what" && <WhatChoices reg={reg} cats={cats} meta={meta} current={state.c} onPick={(c) => choose([["c", c], ...(c === "phrase" && ["rising", "falling", "marked"].includes(state.order) ? [["o", null] as [string, null]] : [])])} />}
        {open === "where" && (
          <div className={styles.scopes}>
            <ScopePicker meta={meta} scope={state.scope} title={comparing ? "Left" : "Where"} onChange={(s) => go([...scopeParams(s), ["i", null], ...(groupOf(s) === "all" && state.order === "marked" ? [["o", null] as [string, null]] : [])])} />
            {comparing
              ? <ScopePicker meta={meta} scope={scopeB} title="Right" onChange={(s) => go([...scopeParams(s, "b")])} onClose={() => go([["cmp", null], ...scopeParams(EMPTY_SCOPE, "b")])} />
              : <button type="button" className={`btn ghost ${styles.compareBtn}`} onClick={() => go([["cmp", "1"], ...scopeParams({ ...EMPTY_SCOPE, a: state.scope.a === "tlg0012" ? "tlg0020" : "tlg0012" }, "b")])}>
                  Compare side by side <span className="arr">→</span>
                </button>}
            <button type="button" className="btn small" onClick={() => setOpen(null)}>Done</button>
          </div>
        )}
        {open === "order" && (
          <ul className={styles.orders}>
            {ORDERS.map((o) => {
              const off = (o.needsScope && groupOf(state.scope) === "all") || (state.c === "phrase" && ["rising", "falling", "marked"].includes(o.id));
              return (
                <li key={o.id}>
                  <button type="button" aria-pressed={state.order === o.id} disabled={off} onClick={() => choose([["o", o.id === "most" ? null : o.id]])}>
                    <b>{o.short}</b>
                    <span>{ORDER_HELP[o.id]}{off && (state.c === "phrase" ? " Not for phrases." : " Choose an author, a work, a kind of writing or a period first.")}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {open === "often" && (
          <div className={styles.often}>
            <ul className={styles.orders}>
              <li><button type="button" aria-pressed={!state.band} onClick={() => choose([["h", null]])}><b>Any number of times</b><span>Everything in the list.</span></button></li>
              {BANDS.map((b, i) => (
                <li key={b.id}>
                  <button type="button" aria-pressed={state.band === b.id} onClick={() => choose([["h", b.id]])}>
                    <b>{b.id === "1" ? "Only once" : `${b.label} times`}</b>
                    <span>{out ? `${fmt(out.bands[i])} here` : "…"}{b.id === "1" && " · the words scholars call hapax legomena, “said once”"}</span>
                  </button>
                </li>
              ))}
            </ul>
            <label className={styles.check}>
              <input type="checkbox" checked={state.onlyOne} onChange={(e) => go([["u", e.target.checked ? "1" : null], ["i", null]])} />
              Only those used by one author and no other
            </label>
          </div>
        )}
      </div>
    </section>
  );
}

const ORDER_HELP: Record<string, string> = {
  most: "The most mentioned at the top.",
  least: "The rarest at the top: words used once come first.",
  az: "Alphabetically, from α to ω.",
  rising: "Used more and more: how many times as often, for the size of each, in the Roman age (1st–3rd c. AD) as in the Classical age (5th–4th c. BC). Words used at least 50 times in those two.",
  falling: "Going out of use: how many times less often in the Roman age than in the Classical age. Words used at least 50 times in those two.",
  marked: "Most typical of what you chose: used here far more often than in the rest of the library (by a log-likelihood test; at least 10 uses here). The figure says how many times as often.",
};

function WhatChoices({ reg, cats, meta, current, onPick }: { reg: Register; cats: Category[]; meta: CensusMeta; current: string; onPick: (c: string) => void }) {
  const sizes = useMemo(() => {
    const s: Record<string, number> = { ...meta.sizes };
    for (const c of ["names", "things", ...WORD_KINDS.map((k) => k.id)]) {
      if (s[c] !== undefined && c !== "names" && c !== "things") continue;
      let n = 0;
      for (let i = 0; i < reg.w.length; i++) if (inList(reg, c, i)) n++;
      s[c] = n;
    }
    return s;
  }, [reg, meta]);
  const shelf = (id: string): { id: string; label: string }[] => {
    if (id === "names") return [{ id: "names", label: "All names" }, ...cats.filter((c) => c.shelf === "names").map((c) => ({ id: c.id, label: c.label }))];
    if (id === "things") return [{ id: "things", label: "All things" }, ...cats.filter((c) => c.shelf === "things").map((c) => ({ id: c.id, label: c.label }))];
    if (id === "words") return WORD_KINDS.map((k) => ({ id: k.id, label: k.label }));
    return [{ id: "phrase", label: "Repeated phrases" }];
  };
  return (
    <div className={styles.what}>
      {SHELVES.map((s) => (
        <div key={s.id} className={styles.whatCol}>
          <p className="label">{s.label}</p>
          <ul>
            {shelf(s.id).map((c) => (
              <li key={c.id}>
                <button type="button" aria-pressed={current === c.id} onClick={() => onPick(c.id)}>
                  {c.label}{sizes[c.id] !== undefined && <small>{fmt(sizes[c.id])}</small>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// ------------------------------------------------------------ choosing where to count
export function ScopePicker({ meta, scope, onChange, title, onClose }: { meta: CensusMeta; scope: Scope; onChange: (s: Scope) => void; title: string; onClose?: () => void }) {
  const authors = useMemo(() => [...meta.authors].sort((x, y) => x[1].localeCompare(y[1], "en")), [meta]);
  const author = scope.a ? meta.authors.find((a) => a[0] === scope.a) : undefined;
  const families = Object.entries(meta.groups).filter(([id]) => /^f\d+$/.test(id));
  const periods = Object.entries(meta.groups).filter(([id]) => /^p\d+$/.test(id));
  const isAll = groupOf(scope) === "all";
  return (
    <fieldset className={styles.scope}>
      <legend className="label">{title}</legend>
      <label>
        <span>Author</span>
        <select value={scope.a ?? ""} onChange={(e) => onChange({ ...EMPTY_SCOPE, a: e.target.value || null, f: e.target.value ? null : scope.f, p: e.target.value ? null : scope.p })}>
          <option value="">Any author</option>
          {authors.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
        </select>
      </label>
      {author && author[3].length > 1 && (
        <label>
          <span>Work</span>
          <select value={scope.w ?? ""} onChange={(e) => onChange({ ...scope, w: e.target.value || null })}>
            <option value="">All {author[3].length} works</option>
            {author[3].map(([id, t]) => <option key={id} value={id}>{t}</option>)}
          </select>
        </label>
      )}
      {!author && (
        <>
          <label>
            <span>Kind of writing</span>
            <select value={scope.f ?? ""} onChange={(e) => onChange({ ...scope, f: e.target.value === "" ? null : +e.target.value })}>
              <option value="">Any kind</option>
              {families.map(([id, [label]]) => <option key={id} value={id.slice(1)}>{label}</option>)}
            </select>
          </label>
          <label>
            <span>Period</span>
            <select value={scope.p ?? ""} onChange={(e) => onChange({ ...scope, p: e.target.value === "" ? null : +e.target.value })}>
              <option value="">Any period</option>
              {periods.map(([id, [label]]) => <option key={id} value={id.slice(1)}>{label}</option>)}
            </select>
          </label>
        </>
      )}
      <div className={styles.scopeBtns}>
        {!isAll && <button type="button" className="chip" onClick={() => onChange(EMPTY_SCOPE)}>Whole library</button>}
        {onClose && <button type="button" className="chip" onClick={onClose} aria-label="Stop comparing">× Stop comparing</button>}
      </div>
    </fieldset>
  );
}
