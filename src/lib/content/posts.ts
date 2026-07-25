import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import yaml from "js-yaml";
import readingTime from "reading-time";
import { z } from "zod";

const isoDate = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value),
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use an ISO date in YYYY-MM-DD format")
    .refine((value) => {
      const [year, month, day] = value.split("-").map(Number);
      const date = new Date(Date.UTC(year, month - 1, day));
      return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
      );
    }, "Use a real calendar date")
);

export const postFrontmatterSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  publishedAt: isoDate,
  updatedAt: isoDate.optional(),
  tags: z.array(z.string().trim().min(1)).default([]),
  draft: z.boolean().default(false),
  toc: z.boolean().default(true)
});

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;

export interface PostDocument extends PostFrontmatter {
  slug: string;
  url: `/posts/${string}`;
  readingMinutes: number;
  body: string;
}

export type PostSummary = Omit<PostDocument, "body">;

export interface ArchiveYear {
  year: string;
  posts: PostSummary[];
}

interface GetAllPostsOptions {
  includeDrafts?: boolean;
}

const postsDirectory = path.join(process.cwd(), "src", "content", "posts");

export function parsePostSource(fileName: string, source: string): PostDocument {
  const { data, content } = matter(source, {
    engines: {
      yaml: (value) =>
        yaml.load(value, { schema: yaml.JSON_SCHEMA }) as Record<string, unknown>
    }
  });
  const frontmatter = postFrontmatterSchema.parse(data);
  const slug = fileName.replace(/\.mdx?$/, "");

  return {
    ...frontmatter,
    slug,
    url: `/posts/${slug}`,
    readingMinutes: Math.max(1, Math.ceil(readingTime(content).minutes)),
    body: content
  };
}

export function filterAndSortPosts(
  posts: PostDocument[],
  includeDrafts = false
): PostDocument[] {
  return posts
    .filter((post) => includeDrafts || !post.draft)
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
}

export async function getAllPosts({
  includeDrafts = false
}: GetAllPostsOptions = {}): Promise<PostDocument[]> {
  let fileNames: string[];

  try {
    fileNames = (await readdir(postsDirectory)).filter((fileName) =>
      /\.mdx?$/.test(fileName)
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }

  const posts = await Promise.all(
    fileNames.map(async (fileName) =>
      parsePostSource(
        fileName,
        await readFile(
          path.join(process.cwd(), "src", "content", "posts", fileName),
          "utf8"
        )
      )
    )
  );

  const slugs = new Set<string>();
  for (const post of posts) {
    if (slugs.has(post.slug)) {
      throw new Error(`Duplicate post slug: ${post.slug}`);
    }
    slugs.add(post.slug);
  }

  return filterAndSortPosts(posts, includeDrafts);
}

export function groupPostsByYear(posts: PostSummary[]): ArchiveYear[] {
  const groups = new Map<string, PostSummary[]>();

  for (const post of posts) {
    const year = post.publishedAt.slice(0, 4);
    groups.set(year, [...(groups.get(year) ?? []), post]);
  }

  return [...groups.entries()]
    .sort(([left], [right]) => right.localeCompare(left))
    .map(([year, yearPosts]) => ({ year, posts: yearPosts }));
}
