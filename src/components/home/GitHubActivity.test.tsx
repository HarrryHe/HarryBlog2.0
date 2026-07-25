import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-github-calendar", () => ({
  GitHubCalendar: () => <div>Contribution calendar ready</div>
}));

import { GitHubActivity } from "./GitHubActivity";

describe("GitHubActivity", () => {
  it("keeps a direct profile fallback and loads the calendar without IntersectionObserver", async () => {
    render(<GitHubActivity username="HarrryHe" />);

    expect(screen.getByRole("region", { name: /GitHub activity/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "GitHub activity" })).toBeInTheDocument();
    expect(screen.queryByText(/Work, made visible/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view profile/i })).toHaveAttribute(
      "href",
      "https://github.com/HarrryHe"
    );
    await waitFor(() => {
      expect(screen.getByText("Contribution calendar ready")).toBeInTheDocument();
    });
  });
});
