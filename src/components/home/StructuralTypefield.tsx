"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./StructuralTypefield.module.css";

const wordmark = "HARRY//HE";
const decodeGlyphs = "0123456789ABCDEF<>[]{}#";
const decodeSteps = 9;
const decodeStepDuration = 78;

function decodeFrame(step: number) {
  const resolvedThrough = Math.ceil(((step + 1) / decodeSteps) * wordmark.length);

  return Array.from(wordmark, (character, index) => {
    if (character === "/" || index < resolvedThrough) {
      return character;
    }

    return decodeGlyphs[(step * 7 + index * 11) % decodeGlyphs.length];
  }).join("");
}

export function StructuralTypefield() {
  const [decodedWordmark, setDecodedWordmark] = useState(wordmark);
  const [isDecoding, setIsDecoding] = useState(false);
  const timersRef = useRef<number[]>([]);

  const clearDecode = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const runDecode = useCallback(() => {
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    clearDecode();
    setIsDecoding(true);

    for (let step = 0; step < decodeSteps; step += 1) {
      const timer = window.setTimeout(() => {
        if (step === decodeSteps - 1) {
          setDecodedWordmark(wordmark);
          setIsDecoding(false);
          return;
        }

        setDecodedWordmark(decodeFrame(step));
      }, step * decodeStepDuration);

      timersRef.current.push(timer);
    }
  }, [clearDecode]);

  useEffect(() => {
    const introTimer = window.setTimeout(runDecode, 140);
    timersRef.current.push(introTimer);

    return clearDecode;
  }, [clearDecode, runDecode]);

  return (
    <div className={styles.field} data-wordmark-field>
      <div className={styles.wordmark}>
        <h1
          id="hero-title"
          aria-label={wordmark}
          data-wordmark-decoding={isDecoding}
        >
          <span aria-hidden="true">{decodedWordmark.slice(0, 5)}</span>
          <span className={styles.slashes} aria-hidden="true">
            {decodedWordmark.slice(5, 7)}
          </span>
          <span aria-hidden="true">{decodedWordmark.slice(7)}</span>
        </h1>
      </div>
    </div>
  );
}
