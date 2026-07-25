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
    <ul className={styles.list} aria-label="Programming languages">
      {skills.map((skill) => (
        <li key={skill.label}>
          <span>{skill.label}</span>
          <span className={styles.track} aria-hidden="true">
            <span
              className={styles.fill}
              style={{ "--skill-fill": skill.fill } as CSSProperties}
            />
          </span>
        </li>
      ))}
    </ul>
  );
}
