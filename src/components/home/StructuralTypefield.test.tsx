import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StructuralTypefield } from "./StructuralTypefield";

describe("StructuralTypefield", () => {
  afterEach(() => vi.useRealTimers());

  it("finishes a slower decode as the clean wordmark without replaying on hover", () => {
    vi.useFakeTimers();
    const { container, getByRole } = render(<StructuralTypefield />);

    expect(getByRole("heading", { level: 1, name: "HARRY//HE" })).toBeVisible();

    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(getByRole("heading", { level: 1, name: "HARRY//HE" })).toHaveAttribute(
      "data-wordmark-decoding",
      "true"
    );

    act(() => {
      vi.advanceTimersByTime(400);
    });

    const heading = getByRole("heading", { level: 1, name: "HARRY//HE" });
    expect(heading).toHaveAttribute("data-wordmark-decoding", "false");
    expect(heading).toHaveTextContent("HARRY//HE");

    fireEvent.pointerEnter(container.querySelector("[data-wordmark-field]") as Element, {
      pointerType: "mouse"
    });

    expect(heading).toHaveAttribute("data-wordmark-decoding", "false");
  });
});
