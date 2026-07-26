import { AvatarFrame } from "@/components/identity/AvatarFrame";
import { StructuralTypefield } from "./StructuralTypefield";
import { TypewriterLine } from "./TypewriterLine";

export function Hero() {
  return (
    <section
      className="mx-auto w-[calc(100%-var(--page-gutter)*2)] max-w-[var(--content-width)] pt-[clamp(2.25rem,5vw,4rem)]"
      aria-labelledby="hero-title"
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 min-[38rem]:items-center min-[38rem]:gap-[clamp(1rem,2.5vw,1.75rem)]">
        <AvatarFrame
          className="w-[4.75rem] shrink-0 min-[38rem]:w-[clamp(5.5rem,10vw,7rem)]"
          src="/brand/kito.webp"
          alt="Harry's Kito avatar"
          data-kito-avatar="true"
          width={168}
          height={168}
          priority
          sizes="(max-width: 700px) 76px, 112px"
        />

        <div className="min-w-0">
          <StructuralTypefield />
          <p className="mt-[0.15rem] mb-[0.65rem] font-mono text-[0.66rem] tracking-[0.06em] text-dim">
            Jiacheng He / HarrryHe
          </p>
          <p className="mb-[0.65rem] max-w-[36rem] text-[clamp(0.98rem,1.6vw,1.1rem)] leading-[1.6] text-body">
            I turn ideas into working software and write about the systems, decisions, and
            lessons gathered along the way.
          </p>
          <TypewriterLine text="self.learning()" />
        </div>
      </div>
    </section>
  );
}
