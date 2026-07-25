import Link from "next/link";
import type { PostSummary } from "@/lib/content/posts";
import styles from "./PostNavigation.module.css";

export function PostNavigation({
  newer,
  older
}: {
  newer?: PostSummary;
  older?: PostSummary;
}) {
  if (!newer && !older) {
    return null;
  }

  return (
    <nav className={styles.navigation} aria-label="Adjacent posts">
      {newer ? (
        <Link href={newer.url}>
          <span>← Newer</span>
          <strong>{newer.title}</strong>
        </Link>
      ) : (
        <span />
      )}
      {older && (
        <Link href={older.url}>
          <span>Older →</span>
          <strong>{older.title}</strong>
        </Link>
      )}
    </nav>
  );
}
