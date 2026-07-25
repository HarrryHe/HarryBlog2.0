import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ArchiveOverview } from "./ArchiveOverview";

describe("ArchiveOverview", () => {
  it("keeps the archive title focused without supporting copy", () => {
    render(<ArchiveOverview groups={[]} />);

    expect(screen.getByRole("heading", { level: 1, name: "All Notes" })).toBeVisible();
    expect(
      screen.queryByText(/Technical notes, project lessons, and experiments by date/i)
    ).not.toBeInTheDocument();
  });
});
