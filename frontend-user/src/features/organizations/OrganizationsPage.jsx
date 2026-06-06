import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "../../shared/ui/toast";
import "../enterprise/EnterprisePages.css";
import organizationService from "./organizationService";

export default function OrganizationsPage() {
    const [organizations, setOrganizations] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [orgName, setOrgName] = useState("");
    const [memberEmail, setMemberEmail] = useState("");
    const [memberRole, setMemberRole] = useState("MEMBER");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const items = await organizationService.list();
            setOrganizations(items || []);
            setSelectedId((current) => current || items?.[0]?.id || "");
        } catch (err) {
            setError(err.message || "Could not load organizations");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const selected = useMemo(
        () => organizations.find((organization) => String(organization.id) === String(selectedId)),
        [organizations, selectedId],
    );

    const create = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        try {
            const organization = await organizationService.create(orgName);
            setOrgName("");
            setSelectedId(organization.id);
            toast("Organization created");
            await load();
        } catch (err) {
            setError(err.message || "Could not create organization");
        } finally {
            setSaving(false);
        }
    };

    const addMember = async (event) => {
        event.preventDefault();
        if (!selected) return;
        setSaving(true);
        setError("");
        try {
            await organizationService.addMember(selected.id, { email: memberEmail, role: memberRole });
            setMemberEmail("");
            toast("Member saved");
            await load();
        } catch (err) {
            setError(err.message || "Could not save member");
        } finally {
            setSaving(false);
        }
    };

    const removeMember = async (memberId) => {
        if (!selected) return;
        setSaving(true);
        setError("");
        try {
            await organizationService.removeMember(selected.id, memberId);
            toast("Member removed");
            await load();
        } catch (err) {
            setError(err.message || "Could not remove member");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <main className="enterprise-page"><div className="enterprise-empty">Loading organizations...</div></main>;
    }

    return (
        <main className="enterprise-page">
            <header className="enterprise-head">
                <div>
                    <span className="enterprise-eyebrow">Organizations</span>
                    <h1>Team accounts</h1>
                    <p>Foundation for planner, venue, and host team access.</p>
                </div>
            </header>

            {error && <div className="enterprise-error">{error}</div>}

            <section className="enterprise-layout">
                <div className="enterprise-panel">
                    <h2>Create organization</h2>
                    <form className="enterprise-form" onSubmit={create}>
                        <label>
                            Organization name
                            <input value={orgName} onChange={(event) => setOrgName(event.target.value)} required />
                        </label>
                        <button className="enterprise-btn" type="submit" disabled={saving}>Create</button>
                    </form>

                    <h2 style={{ marginTop: 24 }}>Your organizations</h2>
                    {organizations.length ? (
                        <div className="enterprise-form">
                            <label>
                                Organization
                                <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
                                    {organizations.map((organization) => (
                                        <option key={organization.id} value={organization.id}>{organization.name}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    ) : (
                        <div className="enterprise-empty">No organizations yet.</div>
                    )}
                </div>

                <section className="enterprise-panel">
                    {selected ? (
                        <>
                            <div className="enterprise-toolbar" style={{ justifyContent: "space-between" }}>
                                <div>
                                    <h2>{selected.name}</h2>
                                    <p className="enterprise-muted">{selected.slug}</p>
                                </div>
                                <span className="enterprise-badge good">{selected.status}</span>
                            </div>

                            <form className="enterprise-form" onSubmit={addMember} style={{ margin: "16px 0" }}>
                                <label>
                                    Member email
                                    <input type="email" value={memberEmail} onChange={(event) => setMemberEmail(event.target.value)} required />
                                </label>
                                <label>
                                    Role
                                    <select value={memberRole} onChange={(event) => setMemberRole(event.target.value)}>
                                        <option value="MEMBER">Member</option>
                                        <option value="ADMIN">Admin</option>
                                        <option value="CHECK_IN_STAFF">Check-in staff</option>
                                    </select>
                                </label>
                                <button className="enterprise-btn" type="submit" disabled={saving}>Save member</button>
                            </form>

                            <div className="enterprise-table-wrap">
                                <table className="enterprise-table">
                                    <thead><tr><th>Email</th><th>Role</th><th>Status</th><th></th></tr></thead>
                                    <tbody>
                                        {(selected.members || []).map((member) => (
                                            <tr key={member.id}>
                                                <td>{member.email}</td>
                                                <td>{member.role}</td>
                                                <td><span className={`enterprise-badge ${member.status === "ACTIVE" ? "good" : "warn"}`}>{member.status}</span></td>
                                                <td>
                                                    <button
                                                        className="enterprise-btn danger"
                                                        type="button"
                                                        disabled={saving || member.role === "OWNER"}
                                                        onClick={() => removeMember(member.id)}
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="enterprise-empty">Create an organization to manage team members.</div>
                    )}
                </section>
            </section>
        </main>
    );
}
