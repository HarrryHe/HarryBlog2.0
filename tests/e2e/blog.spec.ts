import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("home presents the core identity, activity, and latest notes", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "HARRY//HE" })).toBeVisible();
  await expect(page.getByAltText("Harry's Kito avatar")).toBeVisible();
  await expect(page.getByText("self.learning()")).toBeVisible();
  await expect(page.getByRole("region", { name: "GitHub activity" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Latest notes" })).toBeVisible();
  await expect(page.getByText("No published notes yet.")).toBeVisible();
});

test("primary navigation reaches the authored pages", async ({ page }) => {
  await page.goto("/");

  const menuButton = page.getByRole("button", { name: "Toggle menu" });
  if (await menuButton.isVisible()) {
    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  }

  await page.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("About");

  if (await menuButton.isVisible()) {
    await menuButton.click();
  }

  await page.getByRole("link", { name: "Archive", exact: true }).click();
  await expect(page).toHaveURL(/\/archive$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("All Notes");
});

test("home has no serious automated accessibility violations", async ({ page }) => {
  await page.goto("/");
  await page.emulateMedia({ reducedMotion: "reduce" });

  const results = await new AxeBuilder({ page }).analyze();
  const seriousViolations = results.violations.filter(({ impact }) =>
    ["serious", "critical"].includes(impact ?? "")
  );

  expect(seriousViolations).toEqual([]);
});

test("skip link moves keyboard focus to main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");

  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});
