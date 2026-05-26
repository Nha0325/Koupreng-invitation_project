import { useState } from "react";
import "../rsvp.css";
import { addRsvp } from "../../../services/rsvpService";
import RsvpSuccess from "./RsvpSuccess";

/**
 * Reusable RSVP form. Persists responses to localStorage by targetId
 * (typically a draftId or slug).
 */
export default function RsvpForm({ targetId }) {
    const [name, setName] = useState("");
    const [count, setCount] = useState("2");
    const [attending, setAttending] = useState("yes");
    const [submitted, setSubmitted] = useState(null);

    const onSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        const entry = addRsvp(targetId, {
            name: name.trim(),
            count: Number(count),
            attending,
        });
        setSubmitted(entry);
    };

    if (submitted) {
        return <RsvpSuccess name={submitted.name} count={submitted.count} />;
    }

    return (
        <form className="rsvp-form" onSubmit={onSubmit}>
            <input
                type="text"
                placeholder="ឈ្មោះភ្ញៀវ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <select value={attending} onChange={(e) => setAttending(e.target.value)}>
                <option value="yes">ខ្ញុំនឹងចូលរួម</option>
                <option value="no">ខ្ញុំមិនអាចចូលរួមបានទេ</option>
            </select>
            <select value={count} onChange={(e) => setCount(e.target.value)}>
                <option value="1">ភ្ញៀវ ១ នាក់</option>
                <option value="2">ភ្ញៀវ ២ នាក់</option>
                <option value="3">ភ្ញៀវ ៣ នាក់</option>
                <option value="4">ភ្ញៀវ ៤ នាក់</option>
            </select>
            <button type="submit">បញ្ជាក់ការចូលរួម</button>
        </form>
    );
}
