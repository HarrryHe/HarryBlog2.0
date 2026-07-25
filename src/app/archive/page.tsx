import type { Metadata } from "next";
import { ArchiveOverview } from "@/components/blog/ArchiveOverview";
import { getAllPosts, groupPostsByYear } from "@/lib/content/posts";

export const metadata: Metadata = {
  title: "Archive",
  description: "All published notes by Jiacheng (Harry) He, grouped by year.",
  alternates: { canonical: "/archive" }
};

export default async function ArchivePage() {
  const groups = groupPostsByYear(await getAllPosts());

  return <ArchiveOverview groups={groups} />;
}
