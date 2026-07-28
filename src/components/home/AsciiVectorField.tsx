"use client";

import { useEffect, useRef } from "react";
import styles from "./AsciiVectorField.module.css";
import { sampleAsciiFieldCell, type AsciiFieldSample } from "./AsciiVectorFieldModel";

const FRAME_INTERVAL = 1000 / 30;

type Palette = Record<AsciiFieldSample["tone"], string>;

interface GridMetrics {
  cellWidth: number;
  cellHeight: number;
  fontSize: number;
}

const gridMetrics: Record<"compact" | "default", GridMetrics> = {
  compact: {
    cellWidth: 15,
    cellHeight: 18,
    fontSize: 9
  },
  default: {
    cellWidth: 12,
    cellHeight: 15,
    fontSize: 10
  }
};

function colorFromToken(name: string, fallback: string) {
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
  );
}

export function AsciiVectorField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    let context: CanvasRenderingContext2D | null = null;

    try {
      context = canvas.getContext("2d");
    } catch {
      return;
    }

    if (!context) {
      return;
    }

    const palette: Palette = {
      blue: colorFromToken("--accent-secondary", "#6394bf"),
      green: colorFromToken("--accent-primary", "#4d9375"),
      warm: colorFromToken("--accent-warm", "#e6cc77"),
      neutral: colorFromToken("--text-dim", "#6d756d")
    };
    const monoFont =
      getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() ||
      "monospace";
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactQuery = window.matchMedia("(max-width: 38rem)");
    let reducedMotion = reducedMotionQuery.matches;
    let compact = compactQuery.matches;
    let width = 0;
    let height = 0;
    let animationFrame: number | undefined;
    let lastFrame = 0;
    let pageVisible = !document.hidden;
    let inViewport = true;

    const isActive = () => pageVisible && inViewport;

    const isInViewport = () => {
      const bounds = canvas.getBoundingClientRect();
      return bounds.bottom >= -160 && bounds.top <= window.innerHeight + 160;
    };

    inViewport = isInViewport();

    const draw = (time: number) => {
      if (!context || width === 0 || height === 0) {
        return;
      }

      const metrics = compact ? gridMetrics.compact : gridMetrics.default;
      const columnCount = Math.max(1, Math.ceil(width / metrics.cellWidth) + 1);
      const rowCount = Math.max(1, Math.floor(height / metrics.cellHeight));

      context.clearRect(0, 0, width, height);
      context.font = `${metrics.fontSize}px ${monoFont}`;
      context.textAlign = "center";
      context.textBaseline = "middle";

      for (let row = 0; row < rowCount; row += 1) {
        for (let column = 0; column < columnCount; column += 1) {
          const sample = sampleAsciiFieldCell({
            column,
            row,
            x: column * metrics.cellWidth + metrics.cellWidth / 2,
            y: row * metrics.cellHeight + metrics.cellHeight / 2,
            width,
            height,
            time,
            compact
          });

          if (!sample) {
            continue;
          }

          context.globalAlpha = sample.alpha;
          context.fillStyle = palette[sample.tone];
          context.fillText(sample.glyph, sample.x, sample.y);
        }
      }

      context.globalAlpha = 1;
    };

    const stop = () => {
      if (animationFrame !== undefined) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = undefined;
      }
    };

    const animate = (timestamp: number) => {
      animationFrame = undefined;

      if (!isActive() || reducedMotion) {
        return;
      }

      if (timestamp - lastFrame >= FRAME_INTERVAL) {
        draw(timestamp / 1000);
        lastFrame = timestamp;
      }

      animationFrame = window.requestAnimationFrame(animate);
    };

    const start = () => {
      if (!reducedMotion && isActive() && animationFrame === undefined) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(bounds.width, 1);
      height = Math.max(bounds.height, 1);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.5);

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.imageSmoothingEnabled = false;
      if (isActive()) {
        draw(reducedMotion ? 0 : performance.now() / 1000);
      }
    };

    const updatePreferences = () => {
      reducedMotion = reducedMotionQuery.matches;
      compact = compactQuery.matches;
      stop();
      resize();
      if (isActive()) {
        start();
      }
    };

    const updateVisibility = () => {
      pageVisible = !document.hidden;
      if (isActive()) {
        draw(reducedMotion ? 0 : performance.now() / 1000);
        start();
      } else {
        stop();
      }
    };

    const updateViewportFallback = () => {
      inViewport = isInViewport();

      if (isActive()) {
        draw(reducedMotion ? 0 : performance.now() / 1000);
        start();
      } else {
        stop();
      }
    };

    const intersectionObserver =
      typeof IntersectionObserver === "undefined"
        ? undefined
        : new IntersectionObserver(
            ([entry]) => {
              inViewport = entry.isIntersecting;

              if (isActive()) {
                draw(reducedMotion ? 0 : performance.now() / 1000);
                start();
              } else {
                stop();
              }
            },
            { rootMargin: "160px" }
          );

    const updateWindowResize = () => {
      resize();

      if (!intersectionObserver) {
        updateViewportFallback();
      }
    };

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(() => updateWindowResize());

    resizeObserver?.observe(canvas);
    intersectionObserver?.observe(canvas);
    window.addEventListener("resize", updateWindowResize);
    if (!intersectionObserver) {
      inViewport = isInViewport();
      window.addEventListener("scroll", updateViewportFallback, { passive: true });
    }
    reducedMotionQuery.addEventListener("change", updatePreferences);
    compactQuery.addEventListener("change", updatePreferences);
    document.addEventListener("visibilitychange", updateVisibility);
    resize();
    start();

    return () => {
      stop();
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      window.removeEventListener("resize", updateWindowResize);
      window.removeEventListener("scroll", updateViewportFallback);
      reducedMotionQuery.removeEventListener("change", updatePreferences);
      compactQuery.removeEventListener("change", updatePreferences);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  return (
    <div className={styles.field} aria-hidden="true">
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        data-intro-field
        aria-hidden="true"
      />
    </div>
  );
}
