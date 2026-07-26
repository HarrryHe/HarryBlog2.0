"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import styles from "./SiteHeader.module.css";

const navigationLinkClassName =
  "relative inline-flex min-h-12 items-center justify-between gap-[0.28rem] border-t border-subtle px-4 font-mono text-[0.68rem] tracking-[0.06em] text-muted no-underline uppercase transition-[color,transform] duration-150 hover:text-strong focus-visible:text-strong min-[44rem]:min-h-0 min-[44rem]:border-0 min-[44rem]:px-0";

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <header className="relative z-30 mx-auto w-[calc(100%-var(--page-gutter)*2)] max-w-[var(--shell-width)] border-b border-subtle bg-background">
      <div className="flex min-h-14 w-full items-center justify-between min-[44rem]:min-h-15">
        <Link
          className="inline-flex items-baseline gap-[0.22em] font-mono text-[0.88rem] font-bold tracking-[0.08em] text-strong no-underline"
          href="/"
          aria-label="Harry home"
        >
          <span>HARRY</span>
          <span className="font-normal text-primary" aria-hidden="true">
            {"//"}
          </span>
          <span>HE</span>
        </Link>

        <button
          ref={menuButtonRef}
          className="inline-flex min-h-10 min-w-13 items-center justify-center border-0 bg-transparent font-mono text-[0.68rem] tracking-[0.1em] text-muted min-[44rem]:hidden"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span aria-hidden="true">{isOpen ? "CLOSE" : "MENU"}</span>
        </button>

        <nav
          id="primary-navigation"
          aria-label="Primary"
          className={`${styles.navigation} absolute top-full right-0 left-0 flex -translate-y-2 flex-col items-stretch gap-0 border-b border-subtle bg-surface-raised invisible opacity-0 transition-[opacity,transform,visibility] duration-[180ms] min-[44rem]:static min-[44rem]:flex-row min-[44rem]:items-center min-[44rem]:gap-[clamp(1rem,2vw,1.8rem)] min-[44rem]:border-0 min-[44rem]:bg-transparent min-[44rem]:visible min-[44rem]:translate-y-0 min-[44rem]:opacity-100`}
          data-open={isOpen}
        >
          {siteConfig.navigation.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={navigationLinkClassName}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
                <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`${navigationLinkClassName} ${pathname === item.href ? "text-strong" : ""}`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
