import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/content/posts";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/about", "/archive"].map((route) => ({
    url: `${siteConfig.canonicalUrl}${route}`,
    changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1 : 0.7
  }));
  const postRoutes = (await getAllPosts()).map((post) => ({
    url: `${siteConfig.canonicalUrl}${post.url}`,
    lastModified: post.updatedAt ?? post.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.8
  }));

  return [...staticRoutes, ...postRoutes];
}
