"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import styles from "./GitHubActivity.module.css";

const loadingClassName =
  "grid min-h-20 place-items-center font-mono text-[0.68rem] tracking-[0.04em] text-dim";

const GitHubCalendar = dynamic(
  () => import("react-github-calendar").then((module) => module.GitHubCalendar),
  {
    ssr: false,
    loading: () => <div className={loadingClassName}>Loading contribution history…</div>
  }
);

interface GitHubActivityProps {
  username: string;
}

export function GitHubActivity({ username }: GitHubActivityProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      const mediaQuery = window.matchMedia("(max-width: 44rem)");
      const updateWidth = () => setIsNarrow(mediaQuery.matches);
      updateWidth();
      mediaQuery.addEventListener("change", updateWidth);

      return () => mediaQuery.removeEventListener("change", updateWidth);
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      const fallbackTimer = window.setTimeout(() => setShouldLoad(true), 0);
      return () => window.clearTimeout(fallbackTimer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="mx-auto mt-[clamp(2.5rem,6vw,3.75rem)] w-[calc(100%-var(--page-gutter)*2)] max-w-[var(--content-width)]"
      aria-label="GitHub activity"
    >
      <header className="mb-[0.9rem] flex flex-col items-start justify-between gap-3 border-b border-strong-border pb-3 min-[38rem]:flex-row min-[38rem]:items-end min-[38rem]:gap-4">
        <div>
          <h2
            id="github-activity-title"
            className="m-0 text-[clamp(1.35rem,3vw,1.9rem)] font-[540] tracking-[-0.035em] text-strong"
          >
            GitHub activity
          </h2>
        </div>
        <a
          className="shrink-0 font-mono text-[0.66rem] tracking-[0.06em] text-dim no-underline uppercase transition-colors duration-150 hover:text-primary focus-visible:text-primary"
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View profile <span aria-hidden="true">↗</span>
        </a>
      </header>

      <div
        className={`${styles.calendarFrame} min-h-32 overflow-x-auto py-[clamp(0.65rem,1.8vw,0.9rem)] [scrollbar-color:var(--border-strong)_transparent]`}
      >
        {shouldLoad ? (
          <GitHubCalendar
            username={username}
            colorScheme="dark"
            blockMargin={4}
            blockRadius={2}
            blockSize={isNarrow ? 10 : 12}
            fontSize={12}
            theme={{
              dark: ["#242424", "#343434", "#496354", "#4d9375", "#6394bf"]
            }}
            transformData={(activities) =>
              isNarrow ? activities.slice(-182) : activities
            }
            labels={{
              totalCount: "{{count}} contributions in {{year}}",
              legend: { less: "Less", more: "More" }
            }}
            errorMessage="Contribution data is unavailable right now. Visit GitHub for the live profile."
          />
        ) : (
          <div className={loadingClassName}>Contribution history loads on approach.</div>
        )}
      </div>
    </section>
  );
}
