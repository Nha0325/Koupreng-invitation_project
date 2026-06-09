import { useEffect } from "react";

export default function Toast({ toast, onClose }) {
    useEffect(() => {
        if (!toast) return undefined;
        const id = setTimeout(onClose, 3200);
        return () => clearTimeout(id);
    }, [toast, onClose]);

    if (!toast) return null;
    return (
        <div
            className={`toast${toast.type === "error" ? " toast-error" : ""}`}
            role={toast.type === "error" ? "alert" : "status"}
            aria-live="polite"
        >
            {toast.message}
        </div>
    );
}
