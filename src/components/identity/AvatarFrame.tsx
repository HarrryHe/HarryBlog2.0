import Image, { type ImageProps } from "next/image";
import styles from "./AvatarFrame.module.css";

interface AvatarFrameProps extends Omit<ImageProps, "className"> {
  className?: string;
}

export function AvatarFrame({ className, alt, ...imageProps }: AvatarFrameProps) {
  return (
    <div
      data-avatar-frame
      className={["inline-block", className].filter(Boolean).join(" ")}
    >
      <div data-avatar-visual className="relative aspect-square w-full">
        <Image
          {...imageProps}
          className="block size-full rounded-full border border-strong-border object-cover"
          alt={alt}
        />
        <span className={styles.ring} data-avatar-ring aria-hidden="true" />
      </div>
    </div>
  );
}
