import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { useContext } from "react";
import {
    ThemeContext,
    ThemeProvider,
    THEME_STORAGE_KEY,
} from "./ThemeContext";
import useTheme from "./useTheme";

/**
 * Test harness exposing the ThemeContext value to the DOM so assertions can
 * inspect mode/toggle/setMode without indirection through a hook.
 */
function ContextProbe() {
    const theme = useContext(ThemeContext);
    if (!theme) return <div data-testid="probe">no-context</div>;
    return (
        <div data-testid="probe">
            <span data-testid="mode">{theme.mode}</span>
            <button
                type="button"
                data-testid="toggle"
                onClick={() => theme.toggle()}
            >
                toggle
            </button>
            <button
                type="button"
                data-testid="set-dark"
                onClick={() => theme.setMode("dark")}
            >
                set-dark
            </button>
            <button
                type="button"
                data-testid="set-light"
                onClick={() => theme.setMode("light")}
            >
                set-light
            </button>
            <button
                type="button"
                data-testid="set-bogus"
                onClick={() => theme.setMode("neon")}
            >
                set-bogus
            </button>
        </div>
    );
}

describe("app/theme/ThemeContext", () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.removeAttribute("data-theme");
    });

    afterEach(() => {
        localStorage.clear();
        document.documentElement.removeAttribute("data-theme");
    });

    describe("initial mount", () => {
        it("defaults to 'light' when no value is persisted", () => {
            render(
                <ThemeProvider>
                    <ContextProbe />
                </ThemeProvider>,
            );

            expect(screen.getByTestId("mode").textContent).toBe("light");
            expect(document.documentElement.getAttribute("data-theme")).toBe(
                "light",
            );
            expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
        });

        it("hydrates from localStorage when a valid mode is present", () => {
            localStorage.setItem(THEME_STORAGE_KEY, "dark");

            render(
                <ThemeProvider>
                    <ContextProbe />
                </ThemeProvider>,
            );

            expect(screen.getByTestId("mode").textContent).toBe("dark");
            expect(document.documentElement.getAttribute("data-theme")).toBe(
                "dark",
            );
        });

        it("falls back to 'light' when the persisted value is invalid", () => {
            localStorage.setItem(THEME_STORAGE_KEY, "neon");

            render(
                <ThemeProvider>
                    <ContextProbe />
                </ThemeProvider>,
            );

            expect(screen.getByTestId("mode").textContent).toBe("light");
            expect(document.documentElement.getAttribute("data-theme")).toBe(
                "light",
            );
        });
    });

    describe("toggle()", () => {
        it("flips between light and dark and persists each step", () => {
            render(
                <ThemeProvider>
                    <ContextProbe />
                </ThemeProvider>,
            );

            act(() => {
                screen.getByTestId("toggle").click();
            });
            expect(screen.getByTestId("mode").textContent).toBe("dark");
            expect(document.documentElement.getAttribute("data-theme")).toBe(
                "dark",
            );
            expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");

            act(() => {
                screen.getByTestId("toggle").click();
            });
            expect(screen.getByTestId("mode").textContent).toBe("light");
            expect(document.documentElement.getAttribute("data-theme")).toBe(
                "light",
            );
            expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
        });

        it("two toggles return to the original mode (involution)", () => {
            localStorage.setItem(THEME_STORAGE_KEY, "dark");

            render(
                <ThemeProvider>
                    <ContextProbe />
                </ThemeProvider>,
            );

            const initial = screen.getByTestId("mode").textContent;
            act(() => {
                screen.getByTestId("toggle").click();
            });
            act(() => {
                screen.getByTestId("toggle").click();
            });

            expect(screen.getByTestId("mode").textContent).toBe(initial);
        });
    });

    describe("setMode()", () => {
        it("sets a valid mode explicitly and persists it", () => {
            render(
                <ThemeProvider>
                    <ContextProbe />
                </ThemeProvider>,
            );

            act(() => {
                screen.getByTestId("set-dark").click();
            });
            expect(screen.getByTestId("mode").textContent).toBe("dark");
            expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");

            act(() => {
                screen.getByTestId("set-light").click();
            });
            expect(screen.getByTestId("mode").textContent).toBe("light");
            expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
        });

        it("ignores invalid modes", () => {
            render(
                <ThemeProvider>
                    <ContextProbe />
                </ThemeProvider>,
            );

            act(() => {
                screen.getByTestId("set-bogus").click();
            });

            expect(screen.getByTestId("mode").textContent).toBe("light");
            expect(document.documentElement.getAttribute("data-theme")).toBe(
                "light",
            );
        });
    });

    describe("useTheme()", () => {
        it("returns the context value when wrapped in <ThemeProvider>", () => {
            function HookProbe() {
                const theme = useTheme();
                return (
                    <div>
                        <span data-testid="hook-mode">{theme.mode}</span>
                        <button
                            type="button"
                            data-testid="hook-toggle"
                            onClick={theme.toggle}
                        >
                            toggle
                        </button>
                    </div>
                );
            }

            render(
                <ThemeProvider>
                    <HookProbe />
                </ThemeProvider>,
            );

            expect(screen.getByTestId("hook-mode").textContent).toBe("light");

            act(() => {
                screen.getByTestId("hook-toggle").click();
            });
            expect(screen.getByTestId("hook-mode").textContent).toBe("dark");
        });

        it("returns a safe default when used outside a provider (does not throw)", () => {
            function Bare() {
                const theme = useTheme();
                return (
                    <div>
                        <span data-testid="bare-mode">{theme.mode}</span>
                        <span data-testid="bare-toggle-type">
                            {typeof theme.toggle}
                        </span>
                        <span data-testid="bare-set-type">
                            {typeof theme.setMode}
                        </span>
                    </div>
                );
            }

            expect(() => render(<Bare />)).not.toThrow();
            expect(screen.getByTestId("bare-mode").textContent).toBe("light");
            expect(screen.getByTestId("bare-toggle-type").textContent).toBe(
                "function",
            );
            expect(screen.getByTestId("bare-set-type").textContent).toBe(
                "function",
            );
        });
    });
});
