import { AvatarFrame } from "@/components/identity/AvatarFrame";
import { StructuralTypefield } from "./StructuralTypefield";
import { TypewriterLine } from "./TypewriterLine";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.intro}>
        <AvatarFrame
          className={styles.avatarFrame}
          src="/brand/kito.webp"
          alt="Harry's Kito avatar"
          data-kito-avatar="true"
          width={168}
          height={168}
          priority
          sizes="(max-width: 700px) 76px, 112px"
        />

        <div className={styles.copy}>
          <StructuralTypefield />
          <p className={styles.identity}>Jiacheng He / HarrryHe</p>
          <p className={styles.lede}>
            I turn ideas into working software and write about the systems, decisions, and
            lessons gathered along the way.
          </p>
          <TypewriterLine text="self.learning()" />
        </div>
      </div>
    </section>
  );
}
