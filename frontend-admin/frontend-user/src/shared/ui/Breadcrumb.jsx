import { Link } from "react-router-dom";
import "./Breadcrumb.css";

export function Breadcrumb({ items }) {
    return (
        <nav className="kp-breadcrumb" aria-label="Breadcrumb">
            <ol className="kp-breadcrumb-list">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={`${item.label}-${index}`} className="kp-breadcrumb-item">
                            {item.to && !isLast ? (
                                <Link to={item.to} className="kp-breadcrumb-link">
                                    {item.label}
                                </Link>
                            ) : (
                                <span
                                    className="kp-breadcrumb-current"
                                    aria-current={isLast ? "page" : undefined}
                                >
                                    {item.label}
                                </span>
                            )}

                            {!isLast && (
                                <span className="kp-breadcrumb-separator" aria-hidden="true">
                                    ›
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
