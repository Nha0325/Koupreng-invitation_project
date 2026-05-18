/**
 * កំណត់ចំណាំ: hook
 * ឯកសារ: src/shared/hooks/useToggle.js
 */
import { useState } from "react";

/**
 * useToggle — manage boolean state (e.g. show/hide password)
 */
export function useToggle(initial = false) {
    const [value, setValue] = useState(initial);
    const toggle = () => setValue((v) => !v);
    return [value, toggle];
}
