import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LatestPosts } from "./LatestPosts";

describe("LatestPosts", () => {
  it("uses a compact empty state without decorative counters", () => {
    render(<LatestPosts posts={[]} />);

    expect(screen.getByRole("heading", { name: "Latest notes" })).toBeVisible();
    expect(screen.queryByText("[000]")).not.toBeInTheDocument();
  });
});
