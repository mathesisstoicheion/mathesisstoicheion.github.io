/** The five reference pages of the Painted Stoa, in the order the reference shelf lists them (RefHead.tsx). */
export const REF_PAGES = [
  { id: "authors", href: "/stoa/authors", title: "Authors", greek: "Συγγραφεῖς" },
  { id: "eras", href: "/stoa/eras", title: "Eras of Greek", greek: "Χρόνοι" },
  { id: "manuscripts", href: "/stoa/manuscripts", title: "Manuscripts & transmission", greek: "Παράδοσις" },
  { id: "editions", href: "/stoa/editions", title: "Editions & translations", greek: "Ἐκδόσεις" },
  { id: "variants", href: "/stoa/variants", title: "Textual variants", greek: "Γραφαί" },
] as const;
export type RefId = (typeof REF_PAGES)[number]["id"];
