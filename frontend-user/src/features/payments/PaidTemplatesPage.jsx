import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { paymentService } from "./paymentService";
import "./PaymentPages.css";

export default function PaidTemplatesPage() {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        paymentService.paidTemplates()
            .then((data) => {
                if (active) {
                    setTemplates(data || []);
                    setError("");
                }
            })
            .catch((err) => {
                if (active) {
                    setError(err.message || "Could not load paid templates");
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });
        return () => {
            active = false;
        };
    }, []);

    return (
        <main className="payment-page dashboard-payment-page">
            <section className="payment-hero">
                <span className="payment-eyebrow">Unlocked templates</span>
                <h1>Paid Templates</h1>
                <p>Only templates confirmed as PAID by the backend appear here.</p>
            </section>

            {loading && <div className="payment-card">Loading paid templates...</div>}
            {error && <div className="payment-error">{error}</div>}

            {!loading && templates.length === 0 && (
                <section className="payment-card payment-empty">
                    <h2>No paid templates yet</h2>
                    <p>Buy a premium template and check status after admin confirmation.</p>
                    <Link className="payment-primary-btn link-button" to="/templates">
                        Browse Templates
                    </Link>
                </section>
            )}

            <div className="paid-template-grid">
                {templates.map((template) => (
                    <article className="payment-card paid-template-card" key={`${template.templateId}-${template.createdAt}`}>
                        <span className="payment-status paid">PAID</span>
                        <h2>{template.templateName || `Template #${template.templateId}`}</h2>
                        <p>{template.accessType}</p>
                        {template.createdAt && <small>Unlocked {new Date(template.createdAt).toLocaleString()}</small>}
                        <Link to={`/create/wedding?template=${template.templateId}`} className="payment-secondary-btn link-button">
                            Use Template
                        </Link>
                    </article>
                ))}
            </div>
        </main>
    );
}
