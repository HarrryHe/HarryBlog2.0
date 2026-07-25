"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import styles from "./PageTransition.module.css";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname ?? "root"} className={styles.transition} data-page-transition>
      {children}
    </div>
  );
}
