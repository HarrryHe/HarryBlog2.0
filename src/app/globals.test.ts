import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("global prose layout", () => {
  it("lets prose adopt its parent grid placement", async () => {
    const stylesheet = await readFile(path.join(process.cwd(), "src/app/globals.css"), "utf8");

    expect(stylesheet).not.toMatch(/\.prose\s*\{[^}]*grid-column\s*:/s);
  });

  it("uses JetBrains Mono as the site-wide default without removing the sans token", async () => {
    const stylesheet = await readFile(path.join(process.cwd(), "src/app/globals.css"), "utf8");

    expect(stylesheet).toMatch(/body\s*\{[^}]*font-family:\s*var\(--font-mono\)/s);
    expect(stylesheet).toContain('--font-sans:');
  });

  it("keeps list-marker utilities with the reusable Markdown renderer", async () => {
    const markdownRenderer = await readFile(
      path.join(process.cwd(), "src/components/blog/MarkdownContent.tsx"),
      "utf8"
    );

    expect(markdownRenderer).toContain('className="list-disc ps-6 marker:text-dim"');
    expect(markdownRenderer).toContain('className="list-decimal ps-6 marker:text-dim"');
  });
});
