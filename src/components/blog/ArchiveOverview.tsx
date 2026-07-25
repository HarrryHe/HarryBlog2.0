import { PostRow } from "@/components/blog/PostRow";
import type { ArchiveYear } from "@/lib/content/posts";
import styles from "./ArchiveOverview.module.css";

interface ArchiveOverviewProps {
  groups: ArchiveYear[];
}

export function ArchiveOverview({ groups }: ArchiveOverviewProps) {
  return (
    <div className="page-shell">
      <h1 className="page-title">All Notes</h1>

      {groups.length > 0 ? (
        <div className={styles.groups}>
          {groups.map((group) => (
            <section key={group.year} className={styles.group}>
              <h2>{group.year}</h2>
              <div className={styles.list}>
                {group.posts.map((post, index) => (
                  <PostRow key={post.slug} post={post} index={index} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>No published notes yet.</p>
        </div>
      )}
    </div>
  );
}
