import Image, { type ImageProps } from "next/image";

interface AvatarFrameProps extends Omit<ImageProps, "className"> {
  className?: string;
}

export function AvatarFrame({ className, alt, ...imageProps }: AvatarFrameProps) {
  return (
    <div
      data-avatar-frame
      className={[
        "relative inline-grid aspect-square place-items-center rounded-full p-[0.2rem]",
        className
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div data-avatar-visual className="size-full overflow-hidden rounded-full">
        <Image
          {...imageProps}
          className="block size-full object-cover"
          alt={alt}
        />
      </div>
      <span
        className="pointer-events-none absolute inset-0 rounded-full border border-secondary opacity-70"
        data-avatar-ring
        aria-hidden="true"
      />
    </div>
  );
}
