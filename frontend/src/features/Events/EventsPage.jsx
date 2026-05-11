import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateEventPage from "./CreateEventPage";
import "./EventsPage.css";

/* ── Top bar ── */
function TopBar({ onCreateClick }) {
    return (
        <div className="events-topbar">
            <div className="events-topbar-brand">
                <span className="events-topbar-logo"><span>💒</span> PlanEssential</span>
                <button className="events-topbar-nav" onClick={onCreateClick}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    កម្មវិធី
                </button>
            </div>
            <div className="events-topbar-right">
                <div className="events-topbar-lang">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                    </svg>
                    ភាសាខ្មែរ
                </div>
                <div className="events-topbar-user">
                    <div className="events-topbar-avatar">ន</div>
                    ន័រ បញ្ញា
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

/* ── Right icon sidebar ── */
function RightSidebar() {
    const icons = [
        <path key="home" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
        <path key="star" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
        <path key="video" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />,
        <path key="doc" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
        <path key="plus" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />,
    ];
    return (
        <div className="events-sidebar">
            {icons.map((path, i) => (
                <div key={i} className={`events-sidebar-icon${i === 0 ? " active" : ""}`}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">{path}</svg>
                </div>
            ))}
        </div>
    );
}

/* ── Event card ── */
function EventCard({ event, onManage }) {
    return (
        <div className="event-card" onClick={() => onManage(event)}>
            <div className="event-card-img-wrap">
                {event.image ? (
                    <img src={event.image} alt={event.title} className="event-card-img" />
                ) : (
                    <div className="event-card-img-placeholder">💒</div>
                )}
                <span className="event-card-badge">Wedding</span>
            </div>
            <div className="event-card-body">
                <div className="event-card-title">{event.title}</div>
                <div className="event-card-desc">{event.description || "ពិធីមង្គលការ"}</div>
                <div className="event-card-date">
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {event.date || "May 11, 2026"} {event.time || "05:00 PM"}
                </div>
                <div className="event-card-footer">
                    <button className="event-card-manage-btn" onClick={(e) => { e.stopPropagation(); onManage(event); }}>
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        ចូលគ្រប់គ្រង
                    </button>
                    <button className="event-card-more-btn" onClick={(e) => e.stopPropagation()}>
                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Main Events Page ── */
function EventsPage() {
    const navigate = useNavigate();
    const [view, setView] = useState("list"); // "list" | "create"
    const [events, setEvents] = useState([]);

    const handleEventCreated = (newEvent) => {
        setEvents((prev) => [...prev, newEvent]);
        setView("list");
    };

    const handleManage = () => {
        navigate("/dashboard");
    };

    if (view === "create") {
        return (
            <CreateEventPage
                onBack={() => setView("list")}
                onCreated={handleEventCreated}
            />
        );
    }

    return (
        <div className="events-shell">
            <div className="events-main">
                <TopBar onCreateClick={() => setView("create")} />
                <div className="events-content">
                    {/* Welcome + create button */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
                        <div className="events-welcome">
                            <h1>សូមស្វាគមន៍!</h1>
                            <p>សូមគ្រប់គ្រងព្រឹត្តិការណ៍របស់អ្នក បង្កើតថ្មី ដើម្បីចាប់ផ្តើម។</p>
                        </div>
                        <button className="events-create-btn" onClick={() => setView("create")}>
                            + បង្កើតថ្មី
                        </button>
                    </div>

                    {/* Empty state or grid */}
                    {events.length === 0 ? (
                        <div className="events-empty">
                            <div className="events-empty-icon">
                                <svg width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2>មិនទាន់មានកម្មវិធី</h2>
                            <p>អ្នកមិនទាន់បង្កើតកម្មវិធីណាមួយនៅឡើយ។ ចាប់ផ្តើមបង្កើតកម្មវិធីដំបូងរបស់អ្នក!</p>
                            <button className="events-create-btn" onClick={() => setView("create")}>
                                + បង្កើតថ្មី
                            </button>
                        </div>
                    ) : (
                        <div className="events-grid">
                            {events.map((event, i) => (
                                <EventCard key={i} event={event} onManage={handleManage} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <RightSidebar />
        </div>
    );
}

export default EventsPage;
