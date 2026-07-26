import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AvatarFrame } from "./AvatarFrame";
import styles from "./AvatarFrame.module.css";

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

    expect(frame).toContainElement(visual);
    expect(visual).toContainElement(
      screen.getByRole("img", { name: "Harry's Kito avatar" })
    );
    expect(visual).toContainElement(container.querySelector("[data-avatar-ring]"));
  });

  it("keeps the ring hover-state selector on its visual frame", () => {
    const { container } = render(
      <AvatarFrame
        src="/brand/kito.webp"
        alt="Harry's Kito avatar"
        width={168}
        height={168}
      />
    );

    expect(container.querySelector("[data-avatar-frame]")).toHaveClass(styles.frame);
  });
});
