import Link from "next/link";
import type { PostDocument } from "@/lib/content/posts";
import styles from "./PostHeader.module.css";

export function PostHeader({ post }: { post: PostDocument }) {
  const date = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${post.publishedAt}T00:00:00Z`));

  return (
    <header className={styles.header}>
      <div className={styles.context}>
        <p className={styles.route}>~/posts/{post.slug}</p>
        <Link href="/archive" className={styles.archiveLink}>
          <span aria-hidden="true">←</span> Archive
        </Link>
      </div>
      <h1>{post.title}</h1>
      <p className={styles.description}>{post.description}</p>
      <div className={styles.meta}>
        <time dateTime={post.publishedAt}>{date}</time>
        <span>{post.readingMinutes} min read</span>
        {post.tags.length > 0 && <span>{post.tags.join(" · ")}</span>}
      </div>
    </header>
  );
}
