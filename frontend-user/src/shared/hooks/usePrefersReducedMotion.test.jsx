import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Minimal MediaQueryList stub that records add/remove listener calls and lets
 * the test fire a synthetic 'change' event to flip the matches value.
 */
function createMqlStub(initialMatches) {
    let matches = initialMatches;
    const listeners = new Set();

    const mql = {
        get matches() {
            return matches;
        },
        media: "(prefers-reduced-motion: reduce)",
        addEventListener: vi.fn((event, handler) => {
            if (event === "change") listeners.add(handler);
        }),
        removeEventListener: vi.fn((event, handler) => {
            if (event === "change") listeners.delete(handler);
        }),
        // Test-only helper to simulate the OS toggling the setting.
        _emit(next) {
            matches = next;
            for (const handler of listeners) {
                handler({ matches: next });
            }
        },
        _listenerCount() {
            return listeners.size;
        },
    };

    return mql;
}

describe("usePrefersReducedMotion", () => {
    let mql;
    let originalMatchMedia;

    beforeEach(() => {
        mql = createMqlStub(false);
        originalMatchMedia = window.matchMedia;
        window.matchMedia = vi.fn(() => mql);
    });

    afterEach(() => {
        window.matchMedia = originalMatchMedia;
        vi.restoreAllMocks();
    });

    it("returns the current matches value on mount", () => {
        mql = createMqlStub(true);
        window.matchMedia = vi.fn(() => mql);

        const { result } = renderHook(() => usePrefersReducedMotion());

        expect(result.current).toBe(true);
    });

    it("updates when the media query change handler fires", () => {
        const { result } = renderHook(() => usePrefersReducedMotion());

        expect(result.current).toBe(false);

        act(() => {
            mql._emit(true);
        });

        expect(result.current).toBe(true);

        act(() => {
            mql._emit(false);
        });

        expect(result.current).toBe(false);
    });

    it("removes its change listener on unmount", () => {
        const { unmount } = renderHook(() => usePrefersReducedMotion());

        expect(mql._listenerCount()).toBe(1);

        unmount();

        expect(mql._listenerCount()).toBe(0);
        expect(mql.removeEventListener).toHaveBeenCalledWith("change", expect.any(Function));
    });
});
