import { expect, test } from "@playwright/test";

const routeGroups = [
  {
    app: "user",
    baseUrl: "http://127.0.0.1:4173",
    routes: [
      "/",
      "/templates",
      "/templates/royal/preview",
      "/templates/royal/checkout",
      "/dashboard/events",
      "/dashboard/profile",
      "/dashboard/change-password",
      "/dashboard/notifications",
      "/dashboard/packages",
      "/dashboard/payments",
      "/dashboard/invitations/1/budget",
      "/dashboard/invitations/1/check-in",
      "/dashboard/invitations/1/seating",
      "/i/demo-invitation",
      "/i/demo-invitation?token=demo-token",
    ],
  },
  {
    app: "admin",
    baseUrl: "http://127.0.0.1:4174",
    routes: [
      "/login",
      "/dashboard",
      "/users",
      "/templates",
      "/invitations",
      "/reports",
      "/system-logs",
    ],
  },
];

for (const group of routeGroups) {
  for (const routePath of group.routes) {
    test(`${group.app} route shell renders: ${routePath}`, async ({ page }) => {
      await page.route(/\/(api|telegram)\//, (route) => route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ message: "Controlled route-smoke response" }),
      }));
      const response = await page.goto(`${group.baseUrl}${routePath}`);
      expect(response?.status()).toBeLessThan(400);
      await expect(page.locator("#root")).not.toBeEmpty();
      await expect(page.locator("#root > *").first()).toBeAttached();
    });
  }
}
