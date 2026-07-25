import type { Person, WithContext } from "schema-dts";
import { GitHubActivity } from "@/components/home/GitHubActivity";
import { Hero } from "@/components/home/Hero";
import { LatestPosts } from "@/components/home/LatestPosts";
import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/content/posts";

export default async function HomePage() {
  const posts = await getAllPosts();
  const personSchema: WithContext<Person> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.displayName,
    alternateName: siteConfig.handle,
    url: siteConfig.canonicalUrl,
    image: `${siteConfig.canonicalUrl}/brand/kito.webp`,
    sameAs: siteConfig.socialLinks
      .filter((link) => link.href.startsWith("http"))
      .map((link) => link.href)
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Hero />
      <GitHubActivity username={siteConfig.githubUsername} />
      <LatestPosts posts={posts} />
    </>
  );
}
