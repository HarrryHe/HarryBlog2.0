import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("uses one semantic identity heading whose visual glyphs can decode in place", () => {
    const { container } = render(<Hero />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("HARRY//HE");
    expect(screen.queryByText(/Software developer/i)).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Kito avatar/i })).toHaveAttribute(
      "data-kito-avatar",
      "true"
    );
    expect(container.querySelector("[data-avatar-ring]")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveAttribute(
      "data-wordmark-decoding",
      "false"
    );
    expect(container.querySelector("[data-wordmark-decoder]")).not.toBeInTheDocument();
  });
});
