import Link from "next/link";

/**
 * The short "where next" line at the foot of a page (GOLD-AND-LAMPLIGHT-PLAN.md, page-flow defaults): two or three
 * related pages, so a page never simply stops.
 */
export default function WhereNext({ links }: { links: { href: string; label: string; note?: string }[] }) {
  return (
    <nav className="wrap where-next" aria-label="Where next">
      <span className="label">Where next</span>
      <ul>
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} transitionTypes={["page-turn"]}>{l.label}</Link>
            {l.note && <small>{l.note}</small>}
          </li>
        ))}
      </ul>
    </nav>
  );
}
