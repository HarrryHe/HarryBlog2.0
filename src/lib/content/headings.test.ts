import { describe, expect, it } from "vitest";
import { extractHeadings } from "./headings";

describe("extractHeadings", () => {
  it("extracts level two and three headings with stable duplicate slugs", () => {
    const markdown = `# Page title

## The system

### Motion details

## The system
`;

    expect(extractHeadings(markdown)).toEqual([
      { depth: 2, text: "The system", id: "the-system" },
      { depth: 3, text: "Motion details", id: "motion-details" },
      { depth: 2, text: "The system", id: "the-system-1" }
    ]);
  });
});
