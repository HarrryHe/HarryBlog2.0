import type { ArticleHeading } from "@/lib/content/headings";
import styles from "./TableOfContents.module.css";

export function TableOfContents({ headings }: { headings: ArticleHeading[] }) {
  if (headings.length === 0) {
    return null;
  }

  const links = headings.map((heading) => (
    <li key={heading.id} data-depth={heading.depth}>
      <a href={`#${heading.id}`}>{heading.text}</a>
    </li>
  ));

  return (
    <>
      <aside className={styles.desktop} aria-label="Table of contents">
        <p>ON THIS PAGE</p>
        <ol>{links}</ol>
      </aside>
      <details className={styles.mobile}>
        <summary>On this page</summary>
        <ol>{links}</ol>
      </details>
    </>
  );
}
