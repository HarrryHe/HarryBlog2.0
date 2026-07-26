import Image from "next/image";
import { siteConfig } from "@/config/site";

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
    <footer className="mx-auto mt-[clamp(3rem,7vw,5rem)] w-[calc(100%-var(--page-gutter)*2)] max-w-[var(--shell-width)] border-t border-strong-border pt-6 pb-[1.1rem]">
      <div className="grid grid-cols-1 items-start gap-8 min-[48rem]:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <p className="m-0 font-mono text-[0.78rem] font-bold tracking-[0.08em] text-strong">
            HARRY//HE
          </p>
          <p className="mt-2 mb-0 text-[0.8rem] text-muted">
            每一段旅行都有终点 <span aria-hidden="true">·</span>{" "}
            <span>Every journey has its destination.</span>
          </p>
        </div>

        <nav
          className="grid grid-cols-2 gap-x-5 gap-y-[0.55rem] min-[48rem]:grid-cols-3"
          aria-label="Profile links"
        >
          {siteConfig.socialLinks.map((link) => {
            const external = link.href.startsWith("http");
            return (
              <a
                key={link.label}
                href={link.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 font-mono text-[0.68rem] text-muted no-underline uppercase transition-colors duration-150 hover:text-primary focus-visible:text-primary"
              >
                <Image
                  src={`/icons/${iconFiles[link.label]}`}
                  alt=""
                  aria-hidden="true"
                  width={15}
                  height={15}
                  className="h-[0.85rem] w-[0.85rem] opacity-70 [filter:invert(86%)_sepia(8%)_saturate(569%)_hue-rotate(190deg)]"
                />
                {link.label}
              </a>
            );
          })}
        </nav>
      </div>

      <div className="mt-[1.35rem] flex flex-col items-start gap-4 border-t border-subtle pt-[0.85rem] font-mono text-[0.62rem] tracking-[0.04em] text-dim uppercase min-[30rem]:flex-row min-[30rem]:justify-between">
        <span>© {new Date().getFullYear()} Jiacheng He</span>
        <span>Built with React, TypeScript, and Markdown.</span>
      </div>
    </footer>
  );
}
