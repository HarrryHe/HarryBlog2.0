import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/content/posts";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const posts = await getAllPosts();
  const items = posts
    .map(
      (post) => `<item>
  <title>${escapeXml(post.title)}</title>
  <link>${siteConfig.canonicalUrl}${post.url}</link>
  <guid>${siteConfig.canonicalUrl}${post.url}</guid>
  <pubDate>${new Date(`${post.publishedAt}T00:00:00Z`).toUTCString()}</pubDate>
  <description>${escapeXml(post.description)}</description>
</item>`
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Harry — Developer &amp; Writer</title>
  <link>${siteConfig.canonicalUrl}</link>
  <description>${escapeXml(siteConfig.description)}</description>
  <language>en-us</language>
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8"
    }
  });
}
