import { useState } from "react";

/**
 * useToggle
 * គ្រប់គ្រង boolean state ដូចជា show/hide password
 *
 * @param {boolean} initial - តម្លៃដំបូង (default: false)
 * @returns {[boolean, () => void]} - [value, toggle]
 *
 * @example
 * const [showPassword, togglePassword] = useToggle();
 */
export function useToggle(initial = false) {
    const [value, setValue] = useState(initial);
    const toggle = () => setValue((v) => !v);
    return [value, toggle];
}
