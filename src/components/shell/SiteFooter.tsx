import Image from "next/image";
import { siteConfig } from "@/config/site";
import styles from "./SiteFooter.module.css";

const iconFiles: Record<string, string> = {
  GitHub: "github.svg",
  LinkedIn: "linkedin.svg",
  LeetCode: "leetcode.svg",
  Bilibili: "bilibili.svg",
  Email: "email.svg",
  RSS: "rss.svg"
};

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <p className={styles.mark}>HARRY//HE</p>
          <p className={styles.motto}>
            每一段旅行都有终点 <span aria-hidden="true">·</span>{" "}
            <span>Every journey has its destination.</span>
          </p>
        </div>

        <nav className={styles.links} aria-label="Profile links">
          {siteConfig.socialLinks.map((link) => {
            const external = link.href.startsWith("http");
            return (
              <a
                key={link.label}
                href={link.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
              >
                <Image
                  src={`/icons/${iconFiles[link.label]}`}
                  alt=""
                  aria-hidden="true"
                  width={15}
                  height={15}
                />
                {link.label}
              </a>
            );
          })}
        </nav>
      </div>

      <div className={styles.legal}>
        <span>© {new Date().getFullYear()} Jiacheng He</span>
        <span>Built with React, TypeScript, and Markdown.</span>
      </div>
    </footer>
  );
}
