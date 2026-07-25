import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: vi.fn() }));

import { usePathname } from "next/navigation";
import { PageTransition } from "./PageTransition";

describe("PageTransition", () => {
  it("remounts its content boundary when the pathname changes", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    const { container, rerender } = render(
      <PageTransition>
        <h1>Home</h1>
      </PageTransition>
    );
    const firstBoundary = container.querySelector("[data-page-transition]");

    vi.mocked(usePathname).mockReturnValue("/about");
    rerender(
      <PageTransition>
        <h1>About</h1>
      </PageTransition>
    );

    expect(container.querySelector("[data-page-transition]")).not.toBe(firstBoundary);
  });
});
