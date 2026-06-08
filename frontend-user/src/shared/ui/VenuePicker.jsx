import { useState, useRef } from "react";
import { useClickOutside } from "../hooks/useClickOutside";
import { VENUES } from "../../features/wedding-builder/data/venues";
import "./VenuePicker.css";

/**
 * VenuePicker — autocomplete venue input with suggestions.
 * Shows matching venues as user types.
 * Venue data is sourced from features/wedding-builder/data/venues.js.
 */
export function VenuePicker({ value, onChange, onSelect, placeholder = "សាលមង្គល..." }) {
    const [open, setOpen] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const ref = useRef();

    useClickOutside(ref, () => setOpen(false));

    const handleChange = (inputValue) => {
        onChange(inputValue);

        if (inputValue.trim().length === 0) {
            setSuggestions([]);
            setOpen(false);
            return;
        }

        const query = inputValue.toLowerCase();
        const matches = VENUES.filter(
            (v) =>
                v.name.toLowerCase().includes(query) ||
                v.city.toLowerCase().includes(query) ||
                v.address.toLowerCase().includes(query)
        ).slice(0, 8);

        setSuggestions(matches);
        setOpen(matches.length > 0);
    };

    const handleSelect = (venue) => {
        onSelect(venue);
        setOpen(false);
    };

    return (
        <div className="vp-wrap" ref={ref}>
            <div className={`vp-input-wrap${open ? " open" : ""}`}>
                <svg className="vp-icon" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                    type="text"
                    className="vp-input"
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                    onFocus={() => {
                        if (value.trim()) handleChange(value);
                    }}
                    placeholder={placeholder}
                />
            </div>

            {open && (
                <div className="vp-dropdown">
                    {suggestions.map((venue) => (
                        <button
                            key={`${venue.city}-${venue.name}`}
                            type="button"
                            className="vp-suggestion"
                            onClick={() => handleSelect(venue)}
                        >
                            <div className="vp-suggestion-icon">
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div className="vp-suggestion-text">
                                <span className="vp-suggestion-name">{venue.name}</span>
                                <span className="vp-suggestion-addr">{venue.address}</span>
                            </div>
                            <span className="vp-suggestion-city">{venue.city}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default VenuePicker;
