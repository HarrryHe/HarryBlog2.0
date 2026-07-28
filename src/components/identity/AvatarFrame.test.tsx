import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AvatarFrame } from "./AvatarFrame";

describe("AvatarFrame", () => {
  it("renders an image with an aria-hidden technical ring", () => {
    const { container } = render(
      <AvatarFrame
        src="/brand/kito.webp"
        alt="Harry's Kito avatar"
        width={168}
        height={168}
      />
    );

    expect(screen.getByRole("img", { name: "Harry's Kito avatar" })).toBeVisible();
    expect(container.querySelector("[data-avatar-ring]")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
  });

  it("groups the image and ring in a square visual boundary", () => {
    const { container } = render(
      <AvatarFrame
        src="/brand/kito.webp"
        alt="Harry's Kito avatar"
        width={168}
        height={168}
      />
    );

    const frame = container.querySelector<HTMLElement>("[data-avatar-frame]");
    const visual = container.querySelector<HTMLElement>("[data-avatar-visual]");
    const ring = container.querySelector<HTMLElement>("[data-avatar-ring]");

    expect(frame).toContainElement(visual);
    expect(frame).toContainElement(ring);
    expect(visual).toContainElement(
      screen.getByRole("img", { name: "Harry's Kito avatar" })
    );
  });

  it("uses a static outer frame with the image inset inside it", () => {
    const { container } = render(
      <AvatarFrame
        src="/brand/kito.webp"
        alt="Harry's Kito avatar"
        width={168}
        height={168}
      />
    );

    expect(container.querySelector("[data-avatar-frame]")).toHaveClass(
      "aspect-square",
      "rounded-full"
    );
    expect(container.querySelector("[data-avatar-visual]")).toHaveClass(
      "overflow-hidden",
      "rounded-full"
    );
  });
});
