import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SiteHeader } from "./SiteHeader";

vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  usePathname: () => "/archive"
}));

describe("SiteHeader", () => {
  it("exposes the approved navigation and external GitHub semantics", () => {
    render(<SiteHeader />);

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "Archive" })).toHaveAttribute(
      "href",
      "/archive"
    );
    expect(screen.getByRole("link", { name: /GitHub/i })).toHaveAttribute(
      "href",
      "https://github.com/HarrryHe"
    );
    expect(screen.getByRole("link", { name: /GitHub/i })).toHaveAttribute(
      "rel",
      expect.stringContaining("noopener")
    );
  });

  it("opens from the menu button and closes with Escape", () => {
    render(<SiteHeader />);
    const menuButton = screen.getByRole("button", { name: /menu/i });

    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(menuButton).toHaveFocus();
  });

  it("marks the current internal route for assistive technology", () => {
    render(<SiteHeader />);

    expect(screen.getByRole("link", { name: "Archive" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute(
      "aria-current"
    );
  });
});
