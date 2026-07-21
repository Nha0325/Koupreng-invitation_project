import { Children, isValidElement } from "react";
import { describe, expect, it } from "vitest";

import AppRouter from "./router";

function routePaths(element, result = []) {
  if (!isValidElement(element)) return result;
  if (typeof element.props.path === "string") result.push(element.props.path);
  Children.forEach(element.props.children, (child) => routePaths(child, result));
  return result;
}

const EXPECTED_PATHS = [
  "/templates/:id/preview", "/create/wedding", "/create/wedding/:draftId",
  "/event/:draftId/manage", "/event/:draftId", "/preview/:draftId",
  "/payments/:orderCode/status", "/payments/success", "/payments/return",
  "/payments/cancel", "/w/:slug", "/i/:slug", "/", "/templates",
  "/templates/:templateId/checkout", "/templates/:id", "/pricing", "/venues",
  "/login", "/register", "/forgot-password", "/reset-password", "/dashboard",
  "/dashboard/events", "/dashboard/invitations", "/dashboard/invitations/new",
  "/dashboard/invitations/:id/edit", "/dashboard/invitations/:id/preview",
  "/dashboard/invitations/:id/guests", "/dashboard/invitations/:id/delivery",
  "/dashboard/invitations/:id/media", "/dashboard/invitations/:id/budget",
  "/dashboard/invitations/:id/check-in", "/dashboard/invitations/:id/seating",
  "/dashboard/templates/paid", "/dashboard/profile", "/dashboard/change-password",
  "/dashboard/notifications", "/dashboard/packages", "/dashboard/payments",
  "/dashboard/payments/:orderCode", "/guests", "/event/list", "/events",
  "/expenses", "/gift", "/gifts", "/templates/browse", "/templates/browse/:id",
  "/profile", "*",
];

describe("the authoritative user router", () => {
  it("registers every public, auth, builder, host, payment and fallback route", () => {
    expect(routePaths(AppRouter())).toEqual(EXPECTED_PATHS);
    expect(new Set(EXPECTED_PATHS).size).toBe(EXPECTED_PATHS.length);
  });
});
