import Carving from "./Carving";
import { carvedCaps } from "@/lib/art/common";

/**
 * A page's Greek name cut into the wall above its title and lit by the torch, as every area's name is (AreaHeader):
 * the same words are in the title beside it, so the carving is only decoration. A name with no Greek letters, or too
 * long to carve well, is left to the title.
 */
export default function NameCarving({ greek, delay = 0.6 }: { greek?: string | null; delay?: number }) {
  const n = greek ? carvedCaps(greek).length : 0;
  if (!greek || n < 2 || n > 42) return null;
  return <Carving text={greek} kind="name" delay={delay} className="carve page-carve" />;
}
