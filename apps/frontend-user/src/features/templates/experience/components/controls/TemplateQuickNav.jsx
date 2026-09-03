import { templateIcons } from "../../config/templateIcons";

const NAV_ITEMS = [
    { section: "schedule", label: "កម្មវិធី", icon: templateIcons.schedule },
    { section: "venue", label: "ទីតាំង", icon: templateIcons.venue },
    { section: "gallery", label: "រូបភាព", icon: templateIcons.gallery },
    { section: "footer", label: "អរគុណ", icon: templateIcons.thank },
];


export default function TemplateQuickNav({ enabledSections, onNavigate }) {
    const items = NAV_ITEMS.filter(({ section }) => {
        if (section === "footer") return true;
        const key = section === "venue" ? "map" : section;
        return enabledSections?.[key] !== false;
    });

    return (
        <nav
            className="tx-quick-nav"
            aria-label="រុករកសន្លឹកការ"
            style={{ "--tx-quick-nav-count": items.length }}
        >
            {items.map(({ section, label, icon: Icon }) => (
                <button
                    key={section}
                    type="button"
                    className="tx-quick-nav__item"
                    onClick={() => onNavigate(section)}
                    title={label}
                >
                    <Icon aria-hidden="true" />
                    <span>{label}</span>
                </button>
            ))}
        </nav>
    );
}
