import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TypewriterLine } from "./TypewriterLine";

describe("TypewriterLine", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("types once while exposing a complete static phrase to assistive technology", () => {
    vi.useFakeTimers();
    render(<TypewriterLine text="self.learning()" interval={20} />);

    expect(screen.getByTestId("typewriter-visual")).toHaveTextContent("_");
    expect(screen.getByText("self.learning()", { selector: ".sr-only" })).toBeVisible();

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.getByTestId("typewriter-visual")).toHaveTextContent("self.learning()");
  });

  it("shows the finished phrase immediately when motion is reduced", () => {
    render(<TypewriterLine text="self.learning()" reducedMotion />);

    expect(screen.getByTestId("typewriter-visual")).toHaveTextContent("self.learning()");
  });

  it("honors the operating system reduced-motion preference", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn()
      }))
    );

    render(<TypewriterLine text="self.learning()" />);

    expect(screen.getByTestId("typewriter-visual")).toHaveTextContent("self.learning()");
  });
});
