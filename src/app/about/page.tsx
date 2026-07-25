import { readFile } from "node:fs/promises";
import type { Metadata } from "next";
import { AvatarFrame } from "@/components/identity/AvatarFrame";
import path from "node:path";
import { TechnicalSkills } from "@/components/about/TechnicalSkills";
import { MarkdownContent } from "@/components/blog/MarkdownContent";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About",
  description: "About Jiacheng (Harry) He, his interests, and his approach to software.",
  alternates: { canonical: "/about" }
};

export default async function AboutPage() {
  const source = await readFile(path.join(process.cwd(), "src/content/about.md"), "utf8");

  return (
    <div className="page-shell">
      <h1 className={styles.title}>About</h1>

      <div className={styles.layout}>
        <AvatarFrame
          className={styles.portrait}
          src="/brand/kito.webp"
          alt="Harry's Kito avatar"
          width={336}
          height={336}
          sizes="(max-width: 768px) 180px, 280px"
        />
        <article className="prose">
          <MarkdownContent source={source} />
          <TechnicalSkills />
        </article>
      </div>
    </div>
  );
}
