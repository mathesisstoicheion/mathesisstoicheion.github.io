/**
 * Every checked author article at once: for the static /author/<id> pages (built on the server, so each page
 * holds only its own article) and for the tests. The browser loads one at a time (ARTICLE_LOADERS).
 */
import { draftFor, type AuthorArticle } from "./author-articles";
import { herodotus } from "./authors/tlg0016";
import { homer } from "./authors/tlg0012";
import { thucydides } from "./authors/tlg0003";
import { plato } from "./authors/tlg0059";
import { sophocles } from "./authors/tlg0011";
import { aristotle } from "./authors/tlg0086";
import { euripides } from "./authors/tlg0006";
import { aeschylus } from "./authors/tlg0085";

import { demosthenes } from "./authors/tlg0014";
import { aristophanes } from "./authors/tlg0019";
import { plutarch } from "./authors/tlg0007";
import { pindar } from "./authors/tlg0033";
import { xenophon } from "./authors/tlg0032";
import { hesiod } from "./authors/tlg0020";
import { lysias } from "./authors/tlg0540";
import { isocrates } from "./authors/tlg0010";
import { polybius } from "./authors/tlg0543";
import { plotinus } from "./authors/tlg2000";
import { newTestament } from "./authors/tlg0031";
import { septuagint } from "./authors/tlg0527";
import { lucian } from "./authors/tlg0062";
import { josephus } from "./authors/tlg0526";
import { galen } from "./authors/tlg0057";
import { hippocrates } from "./authors/tlg0627";
import { euclid } from "./authors/tlg1799";
import { archimedes } from "./authors/tlg0552";
import { ptolemy } from "./authors/tlg0363";
import { epicurus } from "./authors/tlg0537";

export const ARTICLES: Record<string, AuthorArticle> = { [herodotus.id]: herodotus, [homer.id]: homer, [thucydides.id]: thucydides, [plato.id]: plato, [sophocles.id]: sophocles, [aristotle.id]: aristotle, [euripides.id]: euripides, [aeschylus.id]: aeschylus, [demosthenes.id]: demosthenes, [aristophanes.id]: aristophanes, [plutarch.id]: plutarch, [pindar.id]: pindar, [xenophon.id]: xenophon, [hesiod.id]: hesiod, [lysias.id]: lysias, [isocrates.id]: isocrates, [polybius.id]: polybius, [plotinus.id]: plotinus, [newTestament.id]: newTestament, [septuagint.id]: septuagint, [lucian.id]: lucian, [josephus.id]: josephus, [galen.id]: galen, [hippocrates.id]: hippocrates, [euclid.id]: euclid, [archimedes.id]: archimedes, [ptolemy.id]: ptolemy, [epicurus.id]: epicurus };

/** The article for an author: the checked one, or (development only) a draft marked as unchecked. */
export function articleFor(id: string): { article: AuthorArticle; draft: boolean } | null {
  return ARTICLES[id] ? { article: ARTICLES[id], draft: false } : draftFor(id);
}
