import PageHead from "@/components/PageHead";
import { trail } from "@/config/areas";

/** The head of a Stoa reference page (Authors, Eras, Editions…): its path, its title and what it is for (PageHead). */
export default function RefHead({ title, greek, children }: { title: string; greek?: string; children: React.ReactNode }) {
  return <PageHead path={trail("wiki", title)} title={title} greek={greek} purpose={children} />;
}
