import { describe, expect, it } from "vitest";
import { filterAndSortPosts, groupPostsByYear, parsePostSource } from "./posts";

describe("parsePostSource", () => {
  it("returns validated frontmatter and computed metadata", () => {
    const source = `---
title: A typed post
description: A useful description.
publishedAt: 2026-07-24
tags:
  - TypeScript
  - Design
---

# A typed post

This is a short paragraph with enough words to calculate reading time.
`;

    const post = parsePostSource("typed-post.md", source);

    expect(post).toMatchObject({
      slug: "typed-post",
      title: "A typed post",
      description: "A useful description.",
      publishedAt: "2026-07-24",
      tags: ["TypeScript", "Design"],
      draft: false,
      toc: true,
      url: "/posts/typed-post"
    });
    expect(post.readingMinutes).toBeGreaterThanOrEqual(1);
  });

  it("rejects dates that match the pattern but are not calendar dates", () => {
    const source = `---
title: Impossible date
description: This date should not compile.
publishedAt: 2026-99-40
---
Body.
`;

    expect(() => parsePostSource("impossible.md", source)).toThrow(
      "Use a real calendar date"
    );
  });
});

describe("filterAndSortPosts", () => {
  it("returns published posts newest first and excludes drafts", () => {
    const posts = [
      parsePostSource(
        "older.md",
        `---
title: Older
description: The older article.
publishedAt: 2025-02-01
---
Older body.
`
      ),
      parsePostSource(
        "newer.md",
        `---
title: Newer
description: The newer article.
publishedAt: 2026-07-24
---
Newer body.
`
      ),
      parsePostSource(
        "draft.md",
        `---
title: Draft
description: An unpublished article.
publishedAt: 2027-01-01
draft: true
---
Draft body.
`
      )
    ];

    expect(filterAndSortPosts(posts).map((post) => post.slug)).toEqual([
      "newer",
      "older"
    ]);
  });
});

describe("groupPostsByYear", () => {
  it("groups sorted summaries under descending year labels", () => {
    const posts = [
      parsePostSource(
        "newest.md",
        `---
title: Newest
description: Newest post.
publishedAt: 2026-07-24
---
Body.
`
      ),
      parsePostSource(
        "same-year.md",
        `---
title: Same year
description: Another post.
publishedAt: 2026-01-02
---
Body.
`
      ),
      parsePostSource(
        "older.md",
        `---
title: Older
description: Older post.
publishedAt: 2025-10-03
---
Body.
`
      )
    ];

    expect(groupPostsByYear(posts)).toEqual([
      { year: "2026", posts: [posts[0], posts[1]] },
      { year: "2025", posts: [posts[2]] }
    ]);
  });
});
