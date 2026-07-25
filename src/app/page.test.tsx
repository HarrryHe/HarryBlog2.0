import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/home/Hero", () => ({
  Hero: () => <div data-home-section="hero" />
}));

vi.mock("@/components/home/GitHubActivity", () => ({
  GitHubActivity: () => <div data-home-section="github" />
}));

vi.mock("@/components/home/LatestPosts", () => ({
  LatestPosts: () => <div data-home-section="latest" />
}));

vi.mock("@/lib/content/posts", () => ({
  getAllPosts: vi.fn().mockResolvedValue([])
}));

import HomePage from "./page";

describe("HomePage", () => {
  it("places GitHub activity before the latest notes", async () => {
    const { container } = render(await HomePage());
    const github = container.querySelector('[data-home-section="github"]');
    const latest = container.querySelector('[data-home-section="latest"]');

    expect(github).not.toBeNull();
    expect(latest).not.toBeNull();
    expect(github?.compareDocumentPosition(latest as Node)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
  });
});
