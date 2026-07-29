import { readFile } from "node:fs/promises";
import type { Metadata } from "next";
import { AvatarFrame } from "@/components/identity/AvatarFrame";
import path from "node:path";
import { TechnicalSkills } from "@/components/about/TechnicalSkills";
import { MarkdownContent } from "@/components/blog/MarkdownContent";

export const metadata: Metadata = {
  title: "About",
  description: "About Jiacheng (Harry) He, his interests, and his approach to software.",
  alternates: { canonical: "/about" }
};

export default async function AboutPage() {
  const source = await readFile(path.join(process.cwd(), "src/content/about.md"), "utf8");

  return (
    <div className="page-shell">
      <h1 className="m-0 text-[clamp(1.9rem,4vw,3.15rem)] font-[540] leading-none tracking-[-0.055em] text-strong">
        About
      </h1>

      <div className="mt-[clamp(1.5rem,4vw,2.5rem)] grid grid-cols-1 items-start gap-6 md:grid-cols-[minmax(6.5rem,9rem)_minmax(0,1fr)] md:gap-[clamp(1.5rem,4vw,3.5rem)]">
        <AvatarFrame
          className="w-32 justify-self-center md:sticky md:top-8 md:w-full md:justify-self-auto"
          src="/brand/kito.webp"
          alt="Harry's Kito avatar"
          width={336}
          height={336}
          sizes="(max-width: 768px) 180px, 280px"
        />
        <article className="prose">
          <MarkdownContent source={source} />
        </article>
      </div>
    </div>
  );
}
