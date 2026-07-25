import Image, { type ImageProps } from "next/image";
import styles from "./AvatarFrame.module.css";

interface AvatarFrameProps extends Omit<ImageProps, "className"> {
  className?: string;
}

export function AvatarFrame({ className, alt, ...imageProps }: AvatarFrameProps) {
  return (
    <div className={[styles.frame, className].filter(Boolean).join(" ")}>
      <Image {...imageProps} className={styles.image} alt={alt} />
      <span className={styles.ring} data-avatar-ring aria-hidden="true" />
    </div>
  );
}
