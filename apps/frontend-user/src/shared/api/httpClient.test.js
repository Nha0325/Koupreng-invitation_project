import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient, ApiError } from "./httpClient";
import * as authStorage from "../storage/authStorage";

describe("httpClient 401 interceptor", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.spyOn(authStorage, "clearStoredAuth").mockImplementation(() => {});
    delete window.location;
    window.location = {
      pathname: "/dashboard",
      search: "?tab=guests",
      hash: "#rsvp",
      href: "",
    };
  });

  afterEach(() => {
    window.location = originalLocation;
    vi.restoreAllMocks();
  });

  it("handles 401 error: clears auth storage and redirects to /login with encoded return url", () => {
    const responseInterceptor = apiClient.interceptors.response.handlers[0];
    const error = {
      response: {
        status: 401,
        data: { message: "Token expired or revoked" },
      },
    };

    expect(() => responseInterceptor.rejected(error)).toThrow(ApiError);
    expect(authStorage.clearStoredAuth).toHaveBeenCalled();
    expect(window.location.href).toBe("/login?next=%2Fdashboard%3Ftab%3Dguests%23rsvp");
  });

  it("does not redirect when already on /login to prevent infinite reload loops", () => {
    window.location.pathname = "/login";
    window.location.search = "";
    window.location.hash = "";
    window.location.href = "/login";

    const responseInterceptor = apiClient.interceptors.response.handlers[0];
    const error = {
      response: {
        status: 401,
        data: { message: "Bad credentials" },
      },
    };

    expect(() => responseInterceptor.rejected(error)).toThrow(ApiError);
    expect(authStorage.clearStoredAuth).toHaveBeenCalled();
    expect(window.location.href).toBe("/login");
  });

  it("does not clear auth or redirect on non-401 error (e.g., 400 or 500)", () => {
    const responseInterceptor = apiClient.interceptors.response.handlers[0];
    const error = {
      response: {
        status: 400,
        data: { message: "Validation error" },
      },
    };

    expect(() => responseInterceptor.rejected(error)).toThrow(ApiError);
    expect(authStorage.clearStoredAuth).not.toHaveBeenCalled();
    expect(window.location.href).toBe("");
  });
});
