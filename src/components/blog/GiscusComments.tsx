"use client";

import Giscus from "@giscus/react";
import { siteConfig } from "@/config/site";
import styles from "./GiscusComments.module.css";

export function GiscusComments() {
  const config = siteConfig.giscus;

  return (
    <section className={styles.section} aria-labelledby="comments-title">
      <div className={styles.header}>
        <h2 id="comments-title">Comments</h2>
        <a
          href={`https://github.com/${config.repo}/discussions`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Discussions <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div data-giscus-repo={config.repo}>
        <Giscus
          repo={config.repo}
          repoId={config.repoId}
          category={config.category}
          categoryId={config.categoryId}
          mapping="pathname"
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="bottom"
          theme="catppuccin_mocha"
          lang="en"
          loading="lazy"
        />
      </div>
    </section>
  );
}
