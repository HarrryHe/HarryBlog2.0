import Link from "next/link";
import type { PostSummary } from "@/lib/content/posts";

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
    <article className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-[0.8rem] py-[clamp(0.9rem,2vw,1.25rem)] min-[30rem]:grid-cols-[2.3rem_minmax(0,1fr)]">
      <span className="pt-[0.2rem] font-mono text-[0.62rem] text-dim" aria-hidden="true">
        {String((index ?? 0) + 1).padStart(2, "0")}
      </span>
      <div>
        <Link
          href={post.url}
          className="group grid grid-cols-[minmax(0,1fr)_auto] items-start gap-[0.8rem] text-inherit no-underline"
        >
          <h3 className="m-0 text-[clamp(1.08rem,2vw,1.35rem)] font-[540] leading-[1.25] tracking-[-0.025em] text-strong transition-colors duration-150 group-hover:text-primary group-focus-visible:text-primary">
            {post.title}
          </h3>
          <span
            className="translate-x-[-0.2rem] translate-y-[0.1rem] font-mono text-primary transition-transform duration-150 group-hover:translate-x-0 group-hover:translate-y-0 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0"
            aria-hidden="true"
          >
            ↗
          </span>
        </Link>
        <p className="my-[0.45rem] max-w-[44rem] leading-[1.55] text-muted">
          {post.description}
        </p>
        <div className="flex flex-wrap gap-x-[0.8rem] gap-y-[0.4rem] font-mono text-[0.62rem] tracking-[0.04em] text-dim uppercase">
          <time dateTime={post.publishedAt}>{date}</time>
          <span>{post.readingMinutes} min read</span>
          {post.tags.length > 0 && <span>{post.tags.join(" · ")}</span>}
        </div>
      </div>
    </article>
  );
}
