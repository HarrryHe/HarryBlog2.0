import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TechnicalSkills } from "./TechnicalSkills";

describe("TechnicalSkills", () => {
  it("renders sample programming languages as an inline full-row list", () => {
    render(<TechnicalSkills />);

    expect(screen.getByRole("list", { name: "Programming languages" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Programming languages" })).not.toBeInTheDocument();
    for (const language of ["C", "C++", "Java", "Python", "TypeScript"]) {
      expect(screen.getByText(language)).toBeVisible();
    }
  });
});
