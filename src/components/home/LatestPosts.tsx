import Link from "next/link";
import { PostRow } from "@/components/blog/PostRow";
import type { PostSummary } from "@/lib/content/posts";

interface LatestPostsProps {
  posts: PostSummary[];
}

export function LatestPosts({ posts }: LatestPostsProps) {
  return (
    <section
      className="mx-auto mt-[clamp(2.5rem,6vw,3.75rem)] w-[calc(100%-var(--page-gutter)*2)] max-w-[var(--content-width)]"
      aria-labelledby="latest-posts-title"
    >
      <header className="mb-[0.9rem] flex flex-col items-start justify-between gap-3 border-b border-strong-border pb-3 min-[38rem]:flex-row min-[38rem]:items-end min-[38rem]:gap-4">
        <div>
          <h2
            id="latest-posts-title"
            className="m-0 text-[clamp(1.35rem,3vw,1.9rem)] font-[540] tracking-[-0.035em] text-strong"
          >
            Latest notes
          </h2>
        </div>
        <Link
          className="font-mono text-[0.66rem] tracking-[0.06em] text-dim no-underline uppercase transition-colors duration-150 hover:text-primary focus-visible:text-primary"
          href="/archive"
        >
          Full archive <span aria-hidden="true">→</span>
        </Link>
      </header>

      {posts.length > 0 ? (
        <div className="border-b border-subtle">
          {posts.slice(0, 5).map((post, index) => (
            <PostRow key={post.slug} post={post} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-muted">
          <p className="m-0 py-[0.2rem]">No published notes yet.</p>
        </div>
      )}
    </section>
  );
}
