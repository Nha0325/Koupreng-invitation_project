import { useState, useEffect } from "react";

/**
 * useImageSlider
 * គ្រប់គ្រង index រូបភាព slider ដោយស្វ័យប្រវត្តិ
 *
 * @param {number} totalImages - ចំនួនរូបភាពសរុប
 * @param {number} interval - ពេលវេលា (ms) រវាងការប្តូររូបភាព (default: 3000)
 * @returns {{ currentIndex: number }}
 */
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
