import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import subsetFont from "subset-font";

const sourceDirectory = process.env.JETBRAINS_NERD_FONT_DIR ?? "/usr/share/fonts/TTF";
const outputDirectory = path.join(process.cwd(), "public/fonts");
const weights = [
  ["Regular", "400"],
  ["Bold", "700"]
];

const latinGlyphs = Array.from({ length: 0x250 }, (_, codePoint) =>
  String.fromCodePoint(codePoint)
).join("");
const additionalGlyphs = "↗←→—–…“”‘’·•◦✓✕";

await Promise.all(
  weights.map(async ([style, weight]) => {
    const sourcePath = path.join(
      sourceDirectory,
      `JetBrainsMonoNerdFontMono-${style}.ttf`
    );
    const targetPath = path.join(outputDirectory, `jetbrains-mono-nerd-${weight}.woff2`);
    const source = await readFile(sourcePath);
    const subset = await subsetFont(source, latinGlyphs + additionalGlyphs, {
      targetFormat: "woff2"
    });

    await writeFile(targetPath, subset);
  })
);
