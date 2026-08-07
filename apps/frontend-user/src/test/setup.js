import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

afterEach(() => {
  if (typeof window !== "undefined") {
    try {
      window.localStorage?.clear();
      window.sessionStorage?.clear();
    } catch {
      // Storage access blocked or unavailable
    }
  }
});

