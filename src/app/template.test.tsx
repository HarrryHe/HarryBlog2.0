import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Template from "./template";

describe("Template", () => {
  it("keeps route content inside the transition boundary", () => {
    const { container } = render(
      <Template>
        <h1>Archive</h1>
      </Template>
    );

    expect(screen.getByRole("heading", { name: "Archive" })).toBeInTheDocument();
    const transition = container.querySelector("[data-page-transition]");

    expect(transition).toBeInTheDocument();
    expect(transition).not.toHaveStyle({ opacity: "0" });
    expect(transition).not.toHaveStyle({ transform: "translateY(4px)" });
    expect(container.querySelector("[data-page-transition-trace]")).not.toBeInTheDocument();
  });
});
