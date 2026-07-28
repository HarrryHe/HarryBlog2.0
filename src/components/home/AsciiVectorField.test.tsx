import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AsciiVectorField } from "./AsciiVectorField";

interface MockMediaQuery extends MediaQueryList {
  update(matches: boolean): void;
}

function createMediaQuery(initialMatches = false): MockMediaQuery {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const query = {
    matches: initialMatches,
    media: "",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(
      (type: string, listener: (event: MediaQueryListEvent) => void) => {
        if (type === "change") {
          listeners.add(listener);
        }
      }
    ),
    removeEventListener: vi.fn(
      (type: string, listener: (event: MediaQueryListEvent) => void) => {
        if (type === "change") {
          listeners.delete(listener);
        }
      }
    ),
    dispatchEvent: vi.fn(),
    update(matches: boolean) {
      query.matches = matches;
      listeners.forEach((listener) => listener({ matches } as MediaQueryListEvent));
    }
  };

  return query as MockMediaQuery;
}

function createCanvasContext() {
  return {
    clearRect: vi.fn(),
    setTransform: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fillText: vi.fn(),
    fillRect: vi.fn(),
    globalAlpha: 1,
    strokeStyle: "",
    fillStyle: "",
    font: "",
    lineWidth: 1,
    lineCap: "butt"
  } as unknown as CanvasRenderingContext2D;
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  Reflect.deleteProperty(document, "hidden");
});

describe("AsciiVectorField", () => {
  it("draws an offscreen column so fractional motion enters from beyond the right edge", () => {
    const reducedMotion = createMediaQuery(true);
    const compact = createMediaQuery();
    const context = createCanvasContext();

    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context);
    vi.spyOn(HTMLCanvasElement.prototype, "getBoundingClientRect").mockReturnValue({
      bottom: 300,
      height: 300,
      left: 0,
      right: 600,
      top: 0,
      width: 600
    } as DOMRect);
    vi.stubGlobal("IntersectionObserver", undefined);
    vi.stubGlobal("ResizeObserver", undefined);
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn(() => 1)
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) =>
        query.includes("prefers-reduced-motion") ? reducedMotion : compact
      )
    );

    render(<AsciiVectorField />);

    expect(
      vi
        .mocked(context.fillText)
        .mock.calls.some(([, x]) => typeof x === "number" && x > 600)
    ).toBe(true);
  });

  it("does not restart animation when the page returns while the field remains offscreen", () => {
    const reducedMotion = createMediaQuery();
    const compact = createMediaQuery();
    const context = createCanvasContext();
    const requestAnimationFrame = vi.fn(() => 1);
    let intersectionCallback: IntersectionObserverCallback | undefined;

    class MockIntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        intersectionCallback = callback;
      }

      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
      takeRecords = vi.fn(() => []);
      root = null;
      rootMargin = "0px";
      thresholds = [0];
    }

    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context);
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    vi.stubGlobal("ResizeObserver", undefined);
    vi.stubGlobal("requestAnimationFrame", requestAnimationFrame);
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) =>
        query.includes("prefers-reduced-motion") ? reducedMotion : compact
      )
    );
    Object.defineProperty(document, "hidden", { configurable: true, value: false });

    render(<AsciiVectorField />);
    intersectionCallback?.(
      [{ isIntersecting: false } as IntersectionObserverEntry],
      {} as IntersectionObserver
    );
    const callsWhileOffscreen = requestAnimationFrame.mock.calls.length;

    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
    Object.defineProperty(document, "hidden", { configurable: true, value: false });
    document.dispatchEvent(new Event("visibilitychange"));

    expect(requestAnimationFrame).toHaveBeenCalledTimes(callsWhileOffscreen);
  });

  it("tracks viewport visibility even when motion is initially reduced", () => {
    const reducedMotion = createMediaQuery(true);
    const compact = createMediaQuery();
    const createIntersectionObserver = vi.fn();
    const context = createCanvasContext();
    const requestAnimationFrame = vi.fn(() => 1);

    class MockIntersectionObserver {
      constructor() {
        createIntersectionObserver();
      }

      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
      takeRecords = vi.fn(() => []);
      root = null;
      rootMargin = "0px";
      thresholds = [0];
    }

    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context);
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    vi.stubGlobal("ResizeObserver", undefined);
    vi.stubGlobal("requestAnimationFrame", requestAnimationFrame);
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) =>
        query.includes("prefers-reduced-motion") ? reducedMotion : compact
      )
    );

    render(<AsciiVectorField />);

    expect(createIntersectionObserver).toHaveBeenCalledTimes(1);
    expect(context.clearRect).toHaveBeenCalled();
    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });

  it("rechecks viewport visibility after a layout-only resize without IntersectionObserver", () => {
    const reducedMotion = createMediaQuery();
    const compact = createMediaQuery();
    const cancelAnimationFrame = vi.fn();
    let resizeCallback: ResizeObserverCallback | undefined;
    let bounds = { bottom: 300, height: 300, left: 0, right: 600, top: 0, width: 600 };

    class MockResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        resizeCallback = callback;
      }

      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
    }

    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      createCanvasContext()
    );
    vi.spyOn(HTMLCanvasElement.prototype, "getBoundingClientRect").mockImplementation(
      () => bounds as DOMRect
    );
    vi.stubGlobal("IntersectionObserver", undefined);
    vi.stubGlobal("ResizeObserver", MockResizeObserver);
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn(() => 1)
    );
    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrame);
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) =>
        query.includes("prefers-reduced-motion") ? reducedMotion : compact
      )
    );

    render(<AsciiVectorField />);
    bounds = { bottom: -400, height: 300, left: 0, right: 600, top: -700, width: 600 };
    resizeCallback?.([], {} as ResizeObserver);

    expect(cancelAnimationFrame).toHaveBeenCalledTimes(1);
  });
});
