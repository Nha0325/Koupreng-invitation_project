import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop — scrolls the window to the top on every route change.
 * Must be placed inside <Router>.
 */
export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
