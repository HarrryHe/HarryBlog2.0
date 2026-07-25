import Link from "next/link";
import type { PostSummary } from "@/lib/content/posts";
import styles from "./PostRow.module.css";

interface PostRowProps {
  post: PostSummary;
  index?: number;
}

export function PostRow({ post, index }: PostRowProps) {
  const date = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${post.publishedAt}T00:00:00Z`));

  return (
    <article className={styles.row}>
      <span className={styles.number} aria-hidden="true">
        {String((index ?? 0) + 1).padStart(2, "0")}
      </span>
      <div className={styles.content}>
        <Link href={post.url}>
          <h3>{post.title}</h3>
          <span className={styles.arrow} aria-hidden="true">
            ↗
          </span>
        </Link>
        <p>{post.description}</p>
        <div className={styles.meta}>
          <time dateTime={post.publishedAt}>{date}</time>
          <span>{post.readingMinutes} min read</span>
          {post.tags.length > 0 && <span>{post.tags.join(" · ")}</span>}
        </div>
      </div>
    </article>
  );
}
