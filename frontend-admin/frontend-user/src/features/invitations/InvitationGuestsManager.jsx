import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { QRCode } from "react-qr-code";
import { IoClose, IoDownloadOutline, IoQrCodeOutline } from "react-icons/io5";
import { guestService } from "../../shared/services/guestService";
import { invitationService } from "../../shared/services/invitationService";
import { rsvpService } from "../../shared/services/rsvpService";
import { toast } from "../../shared/ui/toast";
import "./InvitationPages.css";

const emptyGuest = {
    guestName: "",
    phone: "",
    email: "",
    guestGroup: "",
    sideType: "",
    tableNumber: "",
    sendStatus: "",
    contributionStatus: "",
    totalContributed: "",
};

function currentOriginUrl(value) {
    if (!value) return "";

    const origin = typeof window === "undefined" ? "" : window.location.origin;
    if (!origin) return value;

    try {
        const url = new URL(value, origin);
        return `${origin}${url.pathname}${url.search}${url.hash}`;
    } catch {
        return value.startsWith("/") ? `${origin}${value}` : value;
    }
}

function SummaryCard({ label, value }) {
    return (
        <article className="guest-stat">
            <span>{label}</span>
            <strong>{value}</strong>
        </article>
    );
}

function toGuestPayload(form) {
    return {
        ...form,
        totalContributed: form.totalContributed === "" ? null : Number(form.totalContributed),
    };
}

export default function InvitationGuestsManager() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invitation, setInvitation] = useState(null);
    const [guests, setGuests] = useState([]);
    const [summary, setSummary] = useState(null);
    const [form, setForm] = useState(emptyGuest);
    const [editingId, setEditingId] = useState(null);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [qrGuest, setQrGuest] = useState(null);

    const loadData = useCallback(() => {
        let active = true;
        Promise.all([
            invitationService.get(id),
            guestService.listByInvitation(id),
            rsvpService.summary(id),
        ])
            .then(([invitationData, guestData, summaryData]) => {
                if (active) {
                    setInvitation(invitationData);
                    setGuests(guestData || []);
                    setSummary(summaryData);
                    setError("");
                }
            })
            .catch((err) => {
                if (active) {
                    setError(err.message || "Could not load guest data");
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
    }, [id]);

    useEffect(() => loadData(), [loadData]);

    const update = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const resetForm = () => {
        setForm(emptyGuest);
        setEditingId(null);
    };

    const submitGuest = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        try {
            if (editingId) {
                const updated = await guestService.updateForInvitation(id, editingId, toGuestPayload(form));
                setGuests((current) => current.map((guest) => guest.id === editingId ? updated : guest));
                toast("Guest updated");
            } else {
                const created = await guestService.createForInvitation(id, toGuestPayload(form));
                setGuests((current) => [created, ...current]);
                setSummary((current) => current ? { ...current, totalGuests: current.totalGuests + 1, pending: current.pending + 1 } : current);
                toast("Guest added");
            }
            resetForm();
        } catch (err) {
            setError(err.message || "Could not save guest");
        } finally {
            setSaving(false);
        }
    };

    const editGuest = (guest) => {
        setEditingId(guest.id);
        setForm({
            guestName: guest.guestName || "",
            phone: guest.phone || "",
            email: guest.email || "",
            guestGroup: guest.guestGroup || "",
            sideType: guest.sideType || "",
            tableNumber: guest.tableNumber || "",
            sendStatus: guest.sendStatus || "",
            contributionStatus: guest.contributionStatus || "",
            totalContributed: guest.totalContributed ?? "",
        });
    };

    const deleteGuest = async (guest) => {
        if (!window.confirm(`Delete "${guest.guestName}"?`)) return;
        setSaving(true);
        setError("");
        try {
            await guestService.removeFromInvitation(id, guest.id);
            setGuests((current) => current.filter((item) => item.id !== guest.id));
            toast("Guest deleted");
        } catch (err) {
            setError(err.message || "Could not delete guest");
        } finally {
            setSaving(false);
        }
    };

    const search = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        try {
            const result = await guestService.searchByInvitation(id, keyword);
            setGuests(result || []);
        } catch (err) {
            setError(err.message || "Could not search guests");
        } finally {
            setSaving(false);
        }
    };

    const openQr = (guest) => {
        const fullUrl = getFullQrUrl(guest);
        console.log("=== QR CODE DEBUG ===");
        console.log("Guest data:", guest);
        console.log("Guest qrCodeUrl:", guest.qrCodeUrl);
        console.log("Full QR URL:", fullUrl);
        console.log("===================");
        setQrGuest(guest);
    };

    const getFullQrUrl = (guest) => {
        return currentOriginUrl(guest?.qrCodeUrl);
    };

    const downloadQr = () => {
        const svg = document.querySelector(".pe-qr-code svg");
        if (!svg || !qrGuest) return;
        const data = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${qrGuest.guestName || "guest"}-qr.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast("QR Code បានទាញយក");
    };

    const copyInvite = async (guest) => {
        const inviteUrl = getFullQrUrl(guest);
        if (!inviteUrl) {
            toast("Invite link not ready");
            return;
        }
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(inviteUrl);
            } else {
                const field = document.createElement("textarea");
                field.value = inviteUrl;
                field.setAttribute("readonly", "");
                field.style.position = "fixed";
                field.style.top = "-9999px";
                document.body.appendChild(field);
                field.select();
                document.execCommand("copy");
                document.body.removeChild(field);
            }
            toast("បានចម្លងតំណភ្ជាប់");
        } catch (err) {
            toast("Could not copy link");
        }
    };

    if (loading) {
        return <div className="inv-page"><div className="inv-loading">Loading guests...</div></div>;
    }

    return (
        <div className="inv-page">
            <header className="inv-page-header">
                <div>
                    <span className="inv-eyebrow">Guest management</span>
                    <h1>{invitation?.title || "Invitation guests"}</h1>
                    <p>Manage guest records and track RSVP responses for this invitation.</p>
                </div>
                <button className="inv-secondary-btn" type="button" onClick={() => navigate("/dashboard/invitations")}>
                    Back
                </button>
            </header>

            {summary && (
                <div className="guest-stats">
                    <SummaryCard label="Total guests" value={summary.totalGuests} />
                    <SummaryCard label="Attending" value={summary.attending} />
                    <SummaryCard label="Not attending" value={summary.notAttending} />
                    <SummaryCard label="Maybe" value={summary.maybe} />
                    <SummaryCard label="Pending" value={summary.pending} />
                    <SummaryCard label="Attendee count" value={summary.totalAttendeeCount} />
                </div>
            )}

            {error && <div className="inv-error">{error}</div>}

            <section className="guest-layout">
                <form className="guest-form" onSubmit={submitGuest}>
                    <h2>{editingId ? "Edit guest" : "Add guest"}</h2>
                    <label>
                        Guest name
                        <input value={form.guestName} onChange={(event) => update("guestName", event.target.value)} required />
                    </label>
                    <label>
                        Phone
                        <input value={form.phone} onChange={(event) => update("phone", event.target.value)} />
                    </label>
                    <label>
                        Email
                        <input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} />
                    </label>
                    <div className="inv-form-grid">
                        <label>
                            Group
                            <input value={form.guestGroup} onChange={(event) => update("guestGroup", event.target.value)} />
                        </label>
                        <label>
                            Side
                            <input value={form.sideType} onChange={(event) => update("sideType", event.target.value)} />
                        </label>
                        <label>
                            Table
                            <input value={form.tableNumber} onChange={(event) => update("tableNumber", event.target.value)} />
                        </label>
                        <label>
                            Contribution
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.totalContributed}
                                onChange={(event) => update("totalContributed", event.target.value)}
                            />
                        </label>
                    </div>
                    <div className="guest-form-actions">
                        <button className="inv-primary-btn" type="submit" disabled={saving}>
                            {saving ? "Saving..." : editingId ? "Save Guest" : "Add Guest"}
                        </button>
                        {editingId && (
                            <button className="inv-secondary-btn" type="button" onClick={resetForm}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                <section className="guest-table-panel">
                    <form className="guest-search" onSubmit={search}>
                        <input
                            value={keyword}
                            onChange={(event) => setKeyword(event.target.value)}
                            placeholder="Search name, phone, or email"
                        />
                        <button type="submit" className="inv-secondary-btn" disabled={saving}>Search</button>
                    </form>

                    <div className="guest-table-wrap">
                        <table className="guest-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Contact</th>
                                    <th>Group</th>
                                    <th>Table</th>
                                    <th>QR</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {guests.map((guest) => (
                                    <tr key={guest.id}>
                                        <td>{guest.guestName}</td>
                                        <td>
                                            <span>{guest.phone || "No phone"}</span>
                                            <small>{guest.email || "No email"}</small>
                                        </td>
                                        <td>{guest.guestGroup || "None"}</td>
                                        <td>{guest.tableNumber || "None"}</td>
                                        <td>
                                            {guest.qrCodeUrl ? (
                                                <button
                                                    type="button"
                                                    onClick={() => openQr(guest)}
                                                    className="inv-icon-btn"
                                                    title="Show QR Code"
                                                >
                                                    <IoQrCodeOutline />
                                                </button>
                                            ) : "N/A"}
                                        </td>
                                        <td>
                                            <div className="guest-row-actions">
                                                <button type="button" onClick={() => editGuest(guest)}>Edit</button>
                                                <button type="button" className="danger" onClick={() => deleteGuest(guest)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {guests.length === 0 && <div className="inv-empty compact">No guests found.</div>}
                    </div>
                </section>
            </section>

            {qrGuest && (
                <div className="pe-modal-layer">
                    <section className="pe-qr-modal">
                        <button
                            type="button"
                            className="pe-modal-x"
                            onClick={() => setQrGuest(null)}
                            aria-label="Close"
                        >
                            <IoClose aria-hidden="true" />
                        </button>
                        <h2>QR Code</h2>
                        <div className="pe-qr-card">
                            <div className="pe-qr-code">
                                {qrGuest.qrCodeUrl ? (
                                    <QRCode
                                        value={getFullQrUrl(qrGuest)}
                                        size={174}
                                        level="M"
                                    />
                                ) : (
                                    <div>QR not available</div>
                                )}
                            </div>
                            <strong>{qrGuest.guestName}</strong>
                        </div>
                        <button
                            type="button"
                            className="inv-primary-btn"
                            onClick={downloadQr}
                            style={{
                                marginTop: "8px",
                                minWidth: "200px"
                            }}
                        >
                            <IoDownloadOutline aria-hidden="true" />
                            ទាញយក QR ផ្ញើរ
                        </button>
                    </section>
                </div>
            )}
        </div>
    );
}
