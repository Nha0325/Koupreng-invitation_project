import { expect, test } from "@playwright/test";

test("public landing and template catalog render real content", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#root")).not.toBeEmpty();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.goto("/templates");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator('a[href*="/templates/"]').first()).toBeVisible();
});

test("user protected route redirects to the login form with next", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard$/);
  await expect(page.locator('input[type="password"]')).toBeVisible();
  await expect(page.getByRole("button", { name: /ចូល|login/i })).toBeVisible();
});

test("public invitation route fails gracefully without a backend", async ({ page }) => {
  await page.route("**/api/**", (route) => route.fulfill({
    status: 404,
    contentType: "application/json",
    body: JSON.stringify({ message: "Not found" }),
  }));
  await page.goto("/w/nonexistent-smoke-invitation");
  await expect(page.locator("#root")).not.toBeEmpty();
  await expect(page.getByRole("heading", { name: "Invitation not available" })).toBeVisible();
});

test("admin login renders and protected routes redirect", async ({ page }) => {
  await page.goto("http://127.0.0.1:4174/users");
  await expect(page).toHaveURL(/127\.0\.0\.1:4174\/login\?next=%2Fusers$/);
  await expect(page.getByRole("heading", { name: "រដ្ឋបាលគូព្រេង" })).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
});
