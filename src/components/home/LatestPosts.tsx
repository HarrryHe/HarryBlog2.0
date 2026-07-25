import Link from "next/link";
import { PostRow } from "@/components/blog/PostRow";
import type { PostSummary } from "@/lib/content/posts";
import styles from "./LatestPosts.module.css";

interface LatestPostsProps {
  posts: PostSummary[];
}

export function LatestPosts({ posts }: LatestPostsProps) {
  return (
    <section className={styles.section} aria-labelledby="latest-posts-title">
      <header className={styles.header}>
        <div>
          <h2 id="latest-posts-title">Latest notes</h2>
        </div>
        <Link href="/archive">
          Full archive <span aria-hidden="true">→</span>
        </Link>
      </header>

      {posts.length > 0 ? (
        <div>
          {posts.slice(0, 5).map((post, index) => (
            <PostRow key={post.slug} post={post} index={index} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>No published notes yet.</p>
        </div>
      )}
    </section>
  );
}
