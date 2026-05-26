import { Link, useNavigate } from "react-router-dom";
import { getTemplateById } from "../templates/data/templatesData";
import { listDrafts } from "../../services/weddingStorage";
import "./EventsPage.css";

function getTitle(draft) {
    const groom = draft?.couple?.groom;
    const bride = draft?.couple?.bride;

    if (groom || bride) {
        return `${groom || "កូនកំលោះ"} & ${bride || "កូនក្រមុំ"}`;
    }

    return "សន្លឹកការថ្មី";
}

function EventCard({ draft, onManage }) {
    const template = getTemplateById(draft.templateId);

    return (
        <article className="event-card" onClick={() => onManage(draft)}>
            <div className="event-card-img-wrap">
                <img src={template.image} alt={template.name} className="event-card-img" />
                <span className="event-card-badge">{draft.publishedAt ? "Published" : "Draft"}</span>
            </div>
            <div className="event-card-body">
                <div className="event-card-title">{getTitle(draft)}</div>
                <div className="event-card-desc">{template.name} / {template.style}</div>
                <div className="event-card-date">
                    {draft.event?.date || "មិនទាន់បំពេញថ្ងៃ"} {draft.event?.receptionTime || ""}
                </div>
                <div className="event-card-footer">
                    <button
                        className="event-card-manage-btn"
                        onClick={(event) => {
                            event.stopPropagation();
                            onManage(draft);
                        }}
                    >
                        ចូលគ្រប់គ្រង
                    </button>
                    <Link
                        to={`/preview/${draft.id}`}
                        className="event-card-preview-btn"
                        onClick={(event) => event.stopPropagation()}
                    >
                        Preview
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default function EventsPage() {
    const navigate = useNavigate();
    const drafts = listDrafts();

    const handleManage = (draft) => {
        navigate(`/create/wedding/${draft.id}`);
    };

    return (
        <main className="events-page">
            <header className="events-page-header">
                <div>
                    <span>Koupreng invitations</span>
                    <h1>កម្មវិធីសន្លឹកការរបស់អ្នក</h1>
                    <p>ទិន្នន័យនេះអានពី wedding draft storage ដូចគ្នានឹង dashboard និង builder។</p>
                </div>
                <Link to="/templates" className="events-create-btn">
                    + ជ្រើសរើសគំរូ
                </Link>
            </header>

            {drafts.length === 0 ? (
                <section className="events-empty">
                    <div className="events-empty-icon">គូព្រេង</div>
                    <h2>មិនទាន់មានកម្មវិធី</h2>
                    <p>ចាប់ផ្តើមពីគំរូសន្លឹកការ ដើម្បីបង្កើតកម្មវិធីដំបូង។</p>
                    <Link to="/templates" className="events-create-btn">
                        + ជ្រើសរើសគំរូ
                    </Link>
                </section>
            ) : (
                <section className="events-grid">
                    {drafts.map((draft) => (
                        <EventCard key={draft.id} draft={draft} onManage={handleManage} />
                    ))}
                </section>
            )}
        </main>
    );
}
