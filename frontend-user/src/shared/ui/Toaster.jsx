import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Lightweight toast system.
 *
 * Exports:
 *   - `<Toaster />`     — default-exported renderer that mounts a portal-less
 *                         container in the bottom-right corner of the viewport
 *                         and animates toasts in/out with framer-motion. It
 *                         supplies a `ToastContext` so descendants can call
 *                         `useToast().push(...)`.
 *   - `useToast()`      — context hook returning `{ toasts, push, dismiss }`.
 *   - `toast(...)`      — module-level convenience that dispatches a
 *                         `koupreng:toast` window event the renderer listens
 *                         for. This lets services (e.g. the auth-expired
 *                         handler) raise a toast without needing to be inside
 *                         the React tree.
 *
 * Behavior matches the design's "Toaster" entry in the Shared UI table:
 *   - default 4s timeout per toast
 *   - max 4 visible toasts (oldest is dropped on overflow)
 *   - rendered as glass cards in the bottom-right corner
 */

const DEFAULT_DURATION_MS = 4000;
const MAX_VISIBLE = 4;
const TOAST_EVENT = "koupreng:toast";

const ToastContext = createContext(null);

let nextId = 1;
const genId = () => `t-${nextId++}-${Date.now()}`;

/**
 * Module-level helper: dispatch a `CustomEvent` that the active `<Toaster />`
 * picks up. Falls through to a no-op outside the browser (e.g. SSR / tests
 * without a window).
 */
// eslint-disable-next-line react-refresh/only-export-components
export function toast(message, options = {}) {
    if (typeof window === "undefined") return;
    const detail = {
        id: options.id ?? genId(),
        message,
        variant: options.variant ?? "info",
        duration: options.duration ?? DEFAULT_DURATION_MS,
    };
    window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail }));
}

/**
 * Hook for components inside the `<Toaster />` provider tree. When called
 * outside the provider it returns a stub whose `push` simply forwards to
 * the module-level `toast()` so accidental mis-use still works.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
    const ctx = useContext(ToastContext);
    if (ctx) return ctx;
    return {
        toasts: [],
        push: (message, options) => toast(message, options),
        dismiss: () => { },
    };
}

const variantStyle = (variant) => {
    switch (variant) {
        case "success":
            return { borderColor: "rgba(34, 197, 94, 0.4)" };
        case "error":
            return { borderColor: "rgba(239, 68, 68, 0.45)" };
        case "warning":
            return { borderColor: "rgba(234, 179, 8, 0.45)" };
        default:
            return {};
    }
};

const Toaster = () => {
    const [toasts, setToasts] = useState([]);
    const timersRef = useRef(new Map());

    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        const timer = timersRef.current.get(id);
        if (timer) {
            clearTimeout(timer);
            timersRef.current.delete(id);
        }
    }, []);

    const push = useCallback(
        (message, options = {}) => {
            const id = options.id ?? genId();
            const next = {
                id,
                message,
                variant: options.variant ?? "info",
                duration: options.duration ?? DEFAULT_DURATION_MS,
            };
            setToasts((prev) => {
                const merged = [...prev, next];
                // Trim oldest when over the visible cap.
                if (merged.length > MAX_VISIBLE) {
                    const dropped = merged.slice(0, merged.length - MAX_VISIBLE);
                    dropped.forEach((d) => {
                        const timer = timersRef.current.get(d.id);
                        if (timer) {
                            clearTimeout(timer);
                            timersRef.current.delete(d.id);
                        }
                    });
                    return merged.slice(-MAX_VISIBLE);
                }
                return merged;
            });

            const timer = setTimeout(() => dismiss(id), next.duration);
            timersRef.current.set(id, timer);
            return id;
        },
        [dismiss],
    );

    // Listen for module-level `toast(...)` calls.
    useEffect(() => {
        const onEvent = (e) => {
            const { message, ...rest } = e.detail ?? {};
            if (message === undefined) return;
            push(message, rest);
        };
        window.addEventListener(TOAST_EVENT, onEvent);
        return () => window.removeEventListener(TOAST_EVENT, onEvent);
    }, [push]);

    // Clear pending timers on unmount.
    useEffect(() => {
        const timers = timersRef.current;
        return () => {
            timers.forEach((t) => clearTimeout(t));
            timers.clear();
        };
    }, []);

    const value = useMemo(
        () => ({ toasts, push, dismiss }),
        [toasts, push, dismiss],
    );

    return (
        <ToastContext.Provider value={value}>
            <div
                aria-live="polite"
                aria-atomic="false"
                style={{
                    position: "fixed",
                    right: "1.25rem",
                    bottom: "1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem",
                    alignItems: "flex-end",
                    zIndex: 1000,
                    pointerEvents: "none",
                }}
            >
                <AnimatePresence initial={false}>
                    {toasts.map((t) => (
                        <motion.div
                            key={t.id}
                            role="status"
                            className="glass"
                            initial={{ opacity: 0, y: 16, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                            style={{
                                pointerEvents: "auto",
                                minWidth: 240,
                                maxWidth: 360,
                                padding: "0.85rem 1rem",
                                borderRadius: "var(--radius-md, 14px)",
                                color: "var(--color-text)",
                                fontFamily: "var(--font-body)",
                                fontSize: "0.92rem",
                                lineHeight: 1.4,
                                ...variantStyle(t.variant),
                            }}
                            onClick={() => dismiss(t.id)}
                        >
                            {t.message}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export { Toaster };
export default Toaster;
