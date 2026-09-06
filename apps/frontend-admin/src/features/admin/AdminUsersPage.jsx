import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loading, ErrorState, Empty } from "../../components/States";
import Toast from "../../components/Toast";
import { useResource } from "../../hooks/useResource";
import { useToast } from "../../hooks/useToast";
import { formatDate } from "../../lib/format";
import adminManagementService from "./adminManagementService";
import "./AdminFeature.css";

export default function AdminUsersPage() {
  const { data, setData, loading, error, reload } = useResource(adminManagementService.users);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState(null);
  const { toast, show, clear } = useToast();

  const users = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data || [])
      .filter((user) => {
        const role = String(user?.role || "").toUpperCase();
        return role !== "ADMIN" && role !== "ROLE_ADMIN";
      })
      .filter((user) => {
        if (!q) return true;
        return [user.fullName, user.email, user.phone, user.role, user.status]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q));
      });
  }, [data, query]);

  const updateUser = async (user, action, value) => {
    const label = user.fullName || user.email || `#${user.id}`;
    if (action !== "role" && !window.confirm(`${action} ${label}?`)) return;
    setBusyId(user.id);
    try {
      let updated;
      if (action === "activate") updated = await adminManagementService.activateUser(user.id);
      if (action === "deactivate") updated = await adminManagementService.deactivateUser(user.id);
      if (action === "role") updated = await adminManagementService.updateUserRole(user.id, value);
      setData((current) => (current || []).map((item) => (item.id === user.id ? updated : item)));
      show("User updated successfully");
    } catch (err) {
      show(err?.message || "User update failed", "error");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 className="page-title">Users</h2>
          <p className="page-subtitle">Search, inspect, activate, and deactivate users.</p>
        </div>
      </div>

      <section className="card">
        <div className="toolbar">
          <input className="text-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users..." />
          <button type="button" className="btn btn-ghost" onClick={reload}>Refresh</button>
        </div>

        {loading ? <Loading /> : error ? <ErrorState onRetry={reload} /> : users.length === 0 ? <Empty /> : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Email</th><th>Status</th><th>Joined</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td><Link className="btn btn-ghost btn-sm" to={`/users/${user.id}`}>{user.fullName || "—"}</Link></td>
                    <td>{user.email || user.phone || "—"}</td>
                    <td><span className={`badge ${user.active ? "badge-green" : "badge-gray"}`}>{user.status}</span></td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <div className="row-actions">
                        {user.active ? (
                          <button type="button" className="btn btn-danger btn-sm" disabled={busyId === user.id} onClick={() => updateUser(user, "deactivate")}>Deactivate</button>
                        ) : (
                          <button type="button" className="btn btn-primary btn-sm" disabled={busyId === user.id} onClick={() => updateUser(user, "activate")}>Activate</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <Toast toast={toast} onClose={clear} />
    </div>
  );
}
