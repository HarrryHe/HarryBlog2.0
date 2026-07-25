"use client";

import { useState } from "react";
import styles from "./CopyButton.module.css";

export function CopyButton({ code }: { code: string }) {
  const [status, setStatus] = useState("Copy");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("Copied");
      window.setTimeout(() => setStatus("Copy"), 1600);
    } catch {
      setStatus("Unavailable");
    }
  };

  return (
    <button className={styles.button} type="button" onClick={copy}>
      <span aria-hidden="true">{status}</span>
      <span className="sr-only" aria-live="polite">
        {status === "Copied" ? "Code copied" : status}
      </span>
    </button>
  );
}
