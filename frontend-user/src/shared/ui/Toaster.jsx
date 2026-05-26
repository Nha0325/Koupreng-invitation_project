import { useEffect, useState } from "react";

/**
 * Toaster — minimal placeholder. Replace with a richer toast lib when needed.
 */
export function Toaster() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const handler = (e) => {
            const id = Math.random().toString(36).slice(2);
            setMessages((m) => [...m, { id, text: e.detail }]);
            setTimeout(() => {
                setMessages((m) => m.filter((msg) => msg.id !== id));
            }, 3000);
        };
        window.addEventListener("toast", handler);
        return () => window.removeEventListener("toast", handler);
    }, []);

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
            {messages.map((m) => (
                <div key={m.id} className="bg-slate-800 text-white px-4 py-2 rounded shadow">
                    {m.text}
                </div>
            ))}
        </div>
    );
}

export default Toaster;
