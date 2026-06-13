import { useCallback, useEffect, useState } from "react";
import { toast } from "../../shared/ui/toast";
import "../enterprise/EnterprisePages.css";
import subscriptionService from "./subscriptionService";

function money(amount, currency = "USD") {
    const value = Number(amount || 0);
    if (value === 0) return "Free";
    return new Intl.NumberFormat("en", { style: "currency", currency }).format(value);
}

function features(plan) {
    return [
        plan.premiumTemplatesEnabled && "Premium templates",
        plan.qrInvitationsEnabled && "QR invitations",
        plan.qrCheckInEnabled && "QR check-in",
        plan.seatingEnabled && "Table and seat management",
        plan.advancedAnalyticsEnabled && "Advanced analytics",
        plan.teamMembersEnabled && "Team members",
        plan.aiAssistantEnabled && "AI writing assistant",
    ].filter(Boolean);
}

export default function SubscriptionPackagesPage() {
    const [packages, setPackages] = useState([]);
    const [current, setCurrent] = useState(null);
    const [history, setHistory] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const [plans, currentPlan, subscriptionHistory] = await Promise.all([
                subscriptionService.packages(),
                subscriptionService.current(),
                subscriptionService.history(),
            ]);
            setPackages(plans || []);
            setCurrent(currentPlan || null);
            setHistory(subscriptionHistory || []);
        } catch (err) {
            setError(err.message || "Could not load packages");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const purchase = async (plan) => {
        setSavingId(plan.id);
        setError("");
        setMessage("");
        try {
            const response = await subscriptionService.purchase(plan.id);
            setMessage(response.message || "Subscription request created.");
            toast(response.active ? "Subscription activated" : "Payment instructions created");
            await load();
        } catch (err) {
            setError(err.message || "Could not purchase package");
        } finally {
            setSavingId(null);
        }
    };

    if (loading) {
        return <main className="enterprise-page"><div className="enterprise-empty">Loading packages...</div></main>;
    }

    return (
        <main className="enterprise-page">
            <header className="enterprise-head">
                <div>
                    <span className="enterprise-eyebrow">Packages</span>
                    <h1>Subscription packages</h1>
                    <p>Choose the package that unlocks invitation operations for your events.</p>
                </div>
            </header>

            {message && <div className="enterprise-message">{message}</div>}
            {error && <div className="enterprise-error">{error}</div>}

            {current && (
                <section className="enterprise-panel" style={{ marginBottom: 18 }}>
                    <h2>Current subscription</h2>
                    <p>
                        <strong>{current.packagePlan?.packageName}</strong>
                        {" "}
                        <span className="enterprise-badge good">{current.status}</span>
                    </p>
                    <p className="enterprise-muted">
                        {current.endDate ? `Ends ${new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(current.endDate))}` : "No fixed end date"}
                    </p>
                </section>
            )}

            <section className="enterprise-grid">
                {packages.map((plan) => (
                    <article key={plan.id} className="enterprise-panel enterprise-plan">
                        <div>
                            <span className="enterprise-eyebrow">{plan.code}</span>
                            <h2>{plan.packageName}</h2>
                            <p className="enterprise-muted">{plan.description || "Package plan"}</p>
                        </div>
                        <div className="enterprise-price">{money(plan.price, plan.currency)}</div>
                        <ul className="enterprise-list">
                            <li>{plan.maxInvitations ?? "Unlimited"} invitations</li>
                            <li>{plan.maxGuestsPerInvitation ?? plan.maxGuests ?? "Unlimited"} guests per invitation</li>
                            <li>{plan.maxTeamMembers ?? 1} team members</li>
                            {features(plan).map((feature) => <li key={feature}>{feature}</li>)}
                        </ul>
                        <button className="enterprise-btn" type="button" disabled={savingId === plan.id} onClick={() => purchase(plan)}>
                            {savingId === plan.id ? "Processing..." : Number(plan.price || 0) > 0 ? "Create payment order" : "Activate"}
                        </button>
                    </article>
                ))}
            </section>

            <section className="enterprise-panel" style={{ marginTop: 18 }}>
                <h2>Subscription history</h2>
                {history.length ? (
                    <div className="enterprise-table-wrap">
                        <table className="enterprise-table">
                            <thead>
                                <tr><th>Package</th><th>Status</th><th>Amount</th><th>Order</th><th>Note</th></tr>
                            </thead>
                            <tbody>
                                {history.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.packagePlan?.packageName || "Package"}</td>
                                        <td><span className={`enterprise-badge ${item.active ? "good" : "warn"}`}>{item.status}</span></td>
                                        <td>{money(item.amount, item.currency)}</td>
                                        <td>{item.orderCode || "—"}</td>
                                        <td>{item.paymentNote || item.message || "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="enterprise-empty">No subscriptions yet.</div>
                )}
            </section>
        </main>
    );
}
