/**
 * កំណត់ចំណាំ: hook
 * ឯកសារ: src/shared/hooks/useImageSlider.js
 */
import { useState, useEffect } from "react";

export function useImageSlider(totalImages, interval = 3000) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (totalImages <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % totalImages);
        }, interval);
        return () => clearInterval(timer);
    }, [totalImages, interval]);

    return { currentIndex };
}
