import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";
import { GiscusComments } from "./GiscusComments";

describe("GiscusComments", () => {
  it("uses the preserved Discussions repository and keeps a direct fallback link", () => {
    const { container } = render(<GiscusComments />);

    expect(screen.getByRole("heading", { name: "Comments" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open discussions/i })).toHaveAttribute(
      "href",
      "https://github.com/HarrryHe/HarryBlog2.0/discussions"
    );
    expect(container.querySelector("[data-giscus-repo]")).toHaveAttribute(
      "data-giscus-repo",
      "HarrryHe/HarryBlog2.0"
    );
  });

  it("uses the configured Chat Section discussion category", () => {
    expect(siteConfig.giscus).toMatchObject({
      repo: "HarrryHe/HarryBlog2.0",
      repoId: "R_kgDOTi0NbA",
      category: "Chat Section",
      categoryId: "DIC_kwDOTi0NbM4DB6pG"
    });
  });
});
