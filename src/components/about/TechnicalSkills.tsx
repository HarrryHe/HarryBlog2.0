import type { CSSProperties } from "react";
import styles from "./TechnicalSkills.module.css";

export interface TechnicalSkill {
  label: string;
  fill: string;
}

export const programmingLanguages: readonly TechnicalSkill[] = [
  { label: "C", fill: "82%" },
  { label: "C++", fill: "76%" },
  { label: "Java", fill: "72%" },
  { label: "Python", fill: "86%" },
  { label: "TypeScript", fill: "79%" }
] as const;

interface TechnicalSkillsProps {
  skills?: readonly TechnicalSkill[];
}

export function TechnicalSkills({ skills = programmingLanguages }: TechnicalSkillsProps) {
  return (
    <ul
      className={`${styles.list} mt-[clamp(1.5rem,4vw,2rem)] grid list-none gap-[0.55rem] p-0`}
      aria-label="Programming languages"
    >
      {skills.map((skill) => (
        <li
          key={skill.label}
          className="grid min-h-[1.7rem] grid-cols-[5.25rem_minmax(0,1fr)] items-center gap-[0.8rem] font-mono text-[0.66rem] tracking-[0.04em] text-muted min-[38rem]:grid-cols-[6.5rem_minmax(0,1fr)]"
        >
          <span>{skill.label}</span>
          <span
            className="h-[0.4rem] border border-strong-border bg-surface p-px"
            aria-hidden="true"
          >
            <span
              className={`${styles.fill} block h-full bg-primary transition-[width] duration-[180ms] ease-out`}
              style={{ "--skill-fill": skill.fill } as CSSProperties}
            />
          </span>
        </li>
      ))}
    </ul>
  );
}
