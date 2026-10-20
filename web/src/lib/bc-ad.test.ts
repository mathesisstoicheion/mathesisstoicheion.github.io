import { describe, expect, it } from "vitest";
import { bcAd, undated } from "./bc-ad";

describe("BC and AD", () => {
  it("turns BCE and CE into the site's convention", () => {
    expect(bcAd("c. 20 BCE-c. 50 CE")).toBe("c. 20 BC – c. AD 50");
    expect(bcAd("2nd century CE")).toBe("2nd century AD");
    expect(bcAd("ca. 14–68 CE")).toBe("ca. AD 14–68");
    expect(bcAd("ca. 27 BCE–68 CE")).toBe("ca. 27 BC – AD 68");
    expect(bcAd("1st centuries BCE and CE")).toBe("1st centuries BC and AD");
    expect(bcAd("1st century BCE–1st century CE")).toBe("1st century BC–1st century AD");
    expect(bcAd("Greek philosopher (c. 460–c. 370 BC)")).toBe("Greek philosopher (c. 460–c. 370 BC)");
  });
});

describe("a description without its dates", () => {
  const cases: [string, string | undefined][] = [
    ["4th-century BCE Greek philosopher", "Greek philosopher"],
    ["Greek orator and statesman (4th century BCE)", "Greek orator and statesman"],
    ["classical Athenian statesman and orator (384–322 BC)", "classical Athenian statesman and orator"],
    ["late 2nd/early 3rd century Greek rhetorician and grammarian", "Greek rhetorician and grammarian"],
    ["5th c. BCE Athenian politician and general, son of Niceratus", "Athenian politician and general, son of Niceratus"],
    ["Greek explorer and writer of the late 6th and early 5th centuries BCE", "Greek explorer and writer"],
    ["Greco-Roman geographer of the 1st centuries BCE and CE", "Greco-Roman geographer"],
    ["Armenian philosopher/5th century", "Armenian philosopher"],
    ["King of Macedon from 359 to 336 BC", "King of Macedon"],
    ["16th Roman Emperor from 161 to 180 and Stoic philosopher", "16th Roman Emperor and Stoic philosopher"],
    ["Greek Christian scholar, c. 260–c. 339", "Greek Christian scholar"],
    ["anonymous 8th century Christian author of a selection of legends", "anonymous Christian author of a selection of legends"],
    ["2nd-3rd century Greek peripatetic philosopher and commentator on Aristotle", "Greek peripatetic philosopher and commentator on Aristotle"],
    ["physician (1st century)", "physician"],
    ["ancient Greek poems composed between c. 800 BCE and c. 500 CE", "ancient Greek poems"],
    ["Alchemist", "Alchemist"],
    ["3rd century", undefined],
  ];
  for (const [from, to] of cases) it(from, () => expect(undated(from)).toBe(to));
});
