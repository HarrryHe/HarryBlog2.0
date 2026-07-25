"use client";

import { useEffect, useState } from "react";
import styles from "./TypewriterLine.module.css";

interface TypewriterLineProps {
  text: string;
  interval?: number;
  reducedMotion?: boolean;
}

function usePrefersReducedMotion() {
  const [isReduced, setIsReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setIsReduced(mediaQuery.matches);

    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return isReduced;
}

export function TypewriterLine({
  text,
  interval = 55,
  reducedMotion
}: TypewriterLineProps) {
  const systemPrefersReducedMotion = usePrefersReducedMotion();
  const shouldReduceMotion = reducedMotion ?? systemPrefersReducedMotion;
  const [characterCount, setCharacterCount] = useState(
    shouldReduceMotion ? text.length : 0
  );
  const visibleCharacterCount = shouldReduceMotion ? text.length : characterCount;

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    const timer = window.setInterval(() => {
      setCharacterCount((count) => {
        if (count >= text.length) {
          window.clearInterval(timer);
          return count;
        }
        return count + 1;
      });
    }, interval);

    return () => window.clearInterval(timer);
  }, [interval, shouldReduceMotion, text]);

  return (
    <span className={styles.line}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" data-testid="typewriter-visual">
        {text.slice(0, visibleCharacterCount)}
        <span className={styles.cursor}>_</span>
      </span>
    </span>
  );
}
