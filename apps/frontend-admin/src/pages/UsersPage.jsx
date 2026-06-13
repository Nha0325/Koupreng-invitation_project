import { useMemo, useState } from "react";
import { userService } from "../services/userService";
import { Loading, ErrorState, Empty } from "../components/States";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { useResource } from "../hooks/useResource";
import { formatDate } from "../lib/format";

export default function UsersPage() {
    const { data, setData, loading, error, reload } = useResource(userService.list);
    const [query, setQuery] = useState("");
    const [savingId, setSavingId] = useState(null);
    const { toast, show, clear } = useToast();

    const handleRoleChange = async (user, role) => {
        if (role === user.role) return;
        setSavingId(user.id);
        try {
            const updated = await userService.updateRole(user.id, role);
            setData((prev) => (prev || []).map((u) => (u.id === user.id ? { ...u, ...updated } : u)));
            show(`បានកែប្រែតួនាទីរបស់ ${updated.fullName || updated.email || "អ្នកប្រើ"} ✓`);
        } catch (err) {
            show(err?.message || "កែប្រែតួនាទីបរាជ័យ", "error");
            reload();
        } finally {
            setSavingId(null);
        }
    };

    const filtered = useMemo(() => {
        const users = data || [];
        const q = query.trim().toLowerCase();
        if (!q) return users;
        return users.filter((u) =>
            [u.fullName, u.email, u.phone, u.role]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(q))
        );
    }, [data, query]);

    return (
        <div>
            <div className="page-head">
                <div>
                    <h2 className="page-title">👥 គ្រប់គ្រងអ្នកប្រើប្រាស់</h2>
                    <p className="page-subtitle">មើល និងកំណត់តួនាទីអ្នកប្រើប្រាស់ទាំងអស់</p>
                </div>
            </div>

            <div className="card">
                <div className="toolbar">
                    <input
                        className="text-input"
                        placeholder="ស្វែងរកតាមឈ្មោះ អ៊ីមែល ឬ លេខទូរស័ព្ទ..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="button" className="btn btn-ghost" onClick={reload}>
                        ↻ ផ្ទុកឡើងវិញ
                    </button>
                </div>

                {loading ? (
                    <Loading />
                ) : error ? (
                    <ErrorState onRetry={reload} />
                ) : filtered.length === 0 ? (
                    <Empty label="រកមិនឃើញអ្នកប្រើប្រាស់" />
                ) : (
                    <div className="table-wrap">
                        <table className="data">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>ឈ្មោះ</th>
                                    <th>អ៊ីមែល</th>
                                    <th>ទូរស័ព្ទ</th>
                                    <th>ស្ថានភាព</th>
                                    <th>ចុះឈ្មោះ</th>
                                    <th>តួនាទី</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((u) => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td>{u.fullName || "—"}</td>
                                        <td>{u.email || "—"}</td>
                                        <td>{u.phone || "—"}</td>
                                        <td>
                                            <span className={`badge ${u.status === "ACTIVE" ? "badge-green" : "badge-gray"}`}>
                                                {u.status || "—"}
                                            </span>
                                        </td>
                                        <td>{formatDate(u.createdAt)}</td>
                                        <td>
                                            <select
                                                className="select"
                                                value={u.role}
                                                disabled={savingId === u.id}
                                                onChange={(e) => handleRoleChange(u, e.target.value)}
                                            >
                                                <option value="USER">USER</option>
                                                <option value="ADMIN">ADMIN</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Toast toast={toast} onClose={clear} />
        </div>
    );
}
