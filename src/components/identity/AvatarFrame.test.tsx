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
});
