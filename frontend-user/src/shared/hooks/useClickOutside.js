import { useEffect } from "react";

/**
 * useClickOutside — fires onOutside when user clicks outside ref element.
 * Attach ref to the container you want to monitor.
 */
export function useClickOutside(ref, onOutside) {
    useEffect(() => {
        function handler(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                onOutside(event);
            }
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [ref, onOutside]);
}

export default useClickOutside;
