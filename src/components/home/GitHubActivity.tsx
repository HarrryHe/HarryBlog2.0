"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import styles from "./GitHubActivity.module.css";

const GitHubCalendar = dynamic(
  () => import("react-github-calendar").then((module) => module.GitHubCalendar),
  {
    ssr: false,
    loading: () => <div className={styles.loading}>Loading contribution history…</div>
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
    <section ref={sectionRef} className={styles.section} aria-label="GitHub activity">
      <header className={styles.header}>
        <div>
          <h2 id="github-activity-title">GitHub activity</h2>
        </div>
        <a
          className={styles.profileLink}
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View profile <span aria-hidden="true">↗</span>
        </a>
      </header>

      <div className={styles.calendarFrame}>
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
          <div className={styles.loading}>Contribution history loads on approach.</div>
        )}
      </div>
    </section>
  );
}
