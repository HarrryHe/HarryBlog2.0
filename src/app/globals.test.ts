import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("global prose layout", () => {
  it("lets prose adopt its parent grid placement", async () => {
    const stylesheet = await readFile(path.join(process.cwd(), "src/app/globals.css"), "utf8");

    expect(stylesheet).not.toMatch(/\.prose\s*\{[^}]*grid-column\s*:/s);
  });
});
