import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PostHeader } from "./PostHeader";

describe("PostHeader", () => {
  it("provides a link back to the archive", () => {
    render(
      <PostHeader
        post={{
          title: "Test note",
          description: "A test post.",
          publishedAt: "2026-07-24",
          tags: [],
          draft: false,
          toc: false,
          slug: "test-note",
          url: "/posts/test-note",
          readingMinutes: 1,
          body: "Test"
        }}
      />
    );

    expect(screen.getByRole("link", { name: /archive/i })).toHaveAttribute(
      "href",
      "/archive"
    );
  });
});
