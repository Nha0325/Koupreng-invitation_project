import { useState, useRef, useEffect } from "react";
import "./VenuePicker.css";

/**
 * Popular wedding venues in Cambodia grouped by city.
 * Add more as needed.
 */
const VENUES = [
    // បាត់ដំបង
    { name: "សាលមង្គលការ ពិសិដ្ឋ", address: "ផ្លូវ ៥២០ សង្កាត់ស្វាយប៉ោ ក្រុងបាត់ដំបង", city: "បាត់ដំបង" },
    { name: "សាលមង្គលការ សុវណ្ណភូមិ", address: "ផ្លូវជាតិលេខ ៥ ក្រុងបាត់ដំបង", city: "បាត់ដំបង" },
    { name: "សាលមង្គលការ អង្គរ បាត់ដំបង", address: "ផ្លូវ ១០៣ សង្កាត់រតនៈ ក្រុងបាត់ដំបង", city: "បាត់ដំបង" },
    { name: "សាលមង្គលការ មង្គលបុរី", address: "ភូមិកំពង់ក្របី សង្កាត់ឱម៉ាល់ ក្រុងបាត់ដំបង", city: "បាត់ដំបង" },
    { name: "សាលមង្គលការ ហេង ហេង", address: "ផ្លូវ ២០៥ សង្កាត់ស្វាយប៉ org ក្រុងបាត់ដំបង", city: "បាត់ដំបង" },
    { name: "សាលមង្គលការ គីរីរម្យ", address: "ផ្លូវជាតិលេខ ៥ ក្រុងបាត់ដំបង", city: "បាត់ដំបង" },
    { name: "សាលមង្គលការ ស្រីសុភមង្គល", address: "សង្កាត់ស្លាកែត ក្រុងបាត់ដំបង", city: "បាត់ដំបង" },
    { name: "សាលមង្គលការ ប៉េអ៊ីន បាត់ដំបង", address: "ផ្លូវ ១១១ សង្កាត់រតនៈ ក្រុងបាត់ដំបង", city: "បាត់ដំបង" },

    // ភ្នំពេញ
    { name: "សាលមង្គលការ កោះពេជ្រ", address: "ផ្លូវ ៣៧៦ សង្កាត់បឹងកេងកង ភ្នំពេញ", city: "ភ្នំពេញ" },
    { name: "សាលមង្គលការ សុខាឡាយ", address: "ផ្លូវ ២១៧ សង្កាត់ទួលទំពូង ភ្នំពេញ", city: "ភ្នំពេញ" },
    { name: "សាលមង្គលការ ឌីមង់ អាយឡែន", address: "ផ្លូវកោះពេជ្រ ភ្នំពេញ", city: "ភ្នំពេញ" },
    { name: "សាលមង្គលការ រ៉ូយ៉ាល់ រ៉េស៊ីដង់", address: "ផ្លូវ ២១៤ សង្កាត់បឹងរាំង ភ្នំពេញ", city: "ភ្នំពេញ" },
    { name: "សាលមង្គលការ ហ្គោលដិន ផែលឡេស", address: "ផ្លូវ ២៧៨ សង្កាត់បឹងកេងកង ភ្នំពេញ", city: "ភ្នំពេញ" },
    { name: "សាលមង្គលការ សុភមង្គល ភ្នំពេញ", address: "ផ្លូវ ១១១ សង្កាត់ទួលស្វាយព្រៃ ភ្នំពេញ", city: "ភ្នំពេញ" },

    // សៀមរាប
    { name: "សាលមង្គលការ អង្គរ ប៉ារ៉ាឌorg", address: "ផ្លូវជាតិលេខ ៦ ក្រុងសៀមរាប", city: "សៀមរាប" },
    { name: "សាលមង្គលការ សុវណ្ណ សៀមរាប", address: "ផ្លូវ ៦០ ក្រុងសៀមរាប", city: "សៀមរាប" },
    { name: "សាលមង្គលការ រ៉ូយ៉ាល់ អង្គរ", address: "ផ្លូវជាតិលេខ ៦ ក្រុងសៀមរាប", city: "សៀមរាប" },

    // កំពង់ចាម
    { name: "សាលមង្គលការ មេគង្គ កំពង់ចាម", address: "ផ្លូវជាតិលេខ ៧ ក្រុងកំពង់ចាម", city: "កំពង់ចាម" },
    { name: "សាលមង្គលការ ពិសិដ្ឋ កំពង់ចាម", address: "សង្កាត់កំពង់ចាម ក្រុងកំពង់ចាម", city: "កំពង់ចាម" },

    // ព្រៃវែង
    { name: "សាលមង្គលការ សុភមង្គល ព្រៃវែង", address: "ផ្លូវជាតិលេខ ១ ក្រុងព្រៃវែង", city: "ព្រៃវែង" },

    // តាកែវ
    { name: "សាលមង្គលការ បុប្ផា តាកែវ", address: "ផ្លូវជាតិលេខ ២ ក្រុងដូនកែវ", city: "តាកែវ" },

    // កំពត
    { name: "សាលមង្គលការ បូកគោ កំពត", address: "ផ្លូវជាតិលេខ ៣ ក្រុងកំពត", city: "កំពត" },

    // បន្ទាយមានជ័យ
    { name: "សាលមង្គលការ មង្គលបុរី ប.ម.ជ", address: "ផ្លូវជាតិលេខ ៥ ក្រុងសិរីសោភ័ណ", city: "បន្ទាយមានជ័យ" },
    { name: "សាលមង្គលការ ពិសិដ្ឋ សិរីសោភ័ណ", address: "សង្កាត់ org ក្រុងសិរីសោភ័ណ", city: "បន្ទាយមានជ័យ" },
];

/**
 * VenuePicker — autocomplete venue input with suggestions.
 * Shows matching venues as user types.
 */
export function VenuePicker({ value, onChange, onSelect, placeholder = "សាលមង្គល..." }) {
    const [open, setOpen] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const ref = useRef();

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

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
