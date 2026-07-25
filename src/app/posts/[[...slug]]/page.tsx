import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { BlogPosting, WithContext } from "schema-dts";
import { ArchiveOverview } from "@/components/blog/ArchiveOverview";
import { GiscusComments } from "@/components/blog/GiscusComments";
import { MarkdownContent } from "@/components/blog/MarkdownContent";
import { PostHeader } from "@/components/blog/PostHeader";
import { PostNavigation } from "@/components/blog/PostNavigation";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { siteConfig } from "@/config/site";
import { extractHeadings } from "@/lib/content/headings";
import { getAllPosts, groupPostsByYear } from "@/lib/content/posts";

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return [{ slug: [] }, ...posts.map((post) => ({ slug: [post.slug] }))];
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (!slug) {
    return {
      title: "Posts",
      description: "All published notes by Jiacheng (Harry) He.",
      alternates: { canonical: "/archive" },
      robots: { index: false, follow: true }
    };
  }

  if (slug.length !== 1) {
    return {};
  }

  const post = (await getAllPosts()).find((entry) => entry.slug === slug[0]);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: post.url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: post.url,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      images: [{ url: "/brand/og-default.png", width: 1200, height: 630 }]
    }
  };
}

export default async function PostPage({
  params
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const posts = await getAllPosts();

  if (!slug) {
    return <ArchiveOverview groups={groupPostsByYear(posts)} />;
  }

  if (slug.length !== 1) {
    notFound();
  }

  const index = posts.findIndex((entry) => entry.slug === slug[0]);

  if (index < 0) {
    notFound();
  }

  const post = posts[index];
  const headings = post.toc ? extractHeadings(post.body) : [];
  const schema: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    url: `${siteConfig.canonicalUrl}${post.url}`,
    author: {
      "@type": "Person",
      name: siteConfig.displayName,
      url: siteConfig.canonicalUrl
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <PostHeader post={post} />
      <div className="article-grid">
        <TableOfContents headings={headings} />
        <article className="prose">
          <MarkdownContent source={post.body} />
        </article>
      </div>
      <PostNavigation newer={posts[index - 1]} older={posts[index + 1]} />
      <GiscusComments />
    </>
  );
}
