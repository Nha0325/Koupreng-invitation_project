import { useCallback, useEffect, useState } from "react";
import { adminApi, adminStorage } from "./services/api";
import "./App.css";

const roleOptions = ["USER", "ADMIN"];

const App = () => {
  const [session, setSession] = useState(() => adminStorage.getSession());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadUsers = useCallback(async (token = session?.accessToken) => {
    if (!token) return;

    setIsLoading(true);
    setError("");
    try {
      const data = await adminApi.listUsers(token);
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    if (session?.accessToken) {
      const timeoutId = window.setTimeout(() => {
        loadUsers(session.accessToken);
      }, 0);
      return () => window.clearTimeout(timeoutId);
    }
    return undefined;
  }, [loadUsers, session?.accessToken]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("");
    setIsLoading(true);

    try {
      const data = await adminApi.login(email.trim(), password);
      if (data.user?.role !== "ADMIN") {
        throw new Error("This account does not have admin access.");
      }

      adminStorage.saveSession(data);
      setSession(data);
      setPassword("");
      setStatus("Signed in.");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId, role) => {
    if (!session?.accessToken) return;

    setError("");
    setStatus("");
    try {
      const updatedUser = await adminApi.updateUserRole(session.accessToken, userId, role);
      setUsers((current) => current.map((user) => (user.id === userId ? updatedUser : user)));
      setStatus("Role updated.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    adminStorage.clearSession();
    setSession(null);
    setUsers([]);
    setStatus("");
    setError("");
  };

  if (!session) {
    return (
      <main className="admin-login">
        <form className="login-panel" onSubmit={handleLogin}>
          <div>
            <p className="eyebrow">Koupreng Admin</p>
            <h1>Admin Sign In</h1>
          </div>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              required
            />
          </label>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Koupreng Admin</p>
          <h1>User Management</h1>
        </div>
        <div className="admin-actions">
          <span>{session.user.email}</span>
          <button type="button" onClick={() => loadUsers()} disabled={isLoading}>
            Refresh
          </button>
          <button type="button" className="secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {(error || status) && (
        <div className={`notice ${error ? "error" : "success"}`}>
          {error || status}
        </div>
      )}

      <section className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  <strong>{user.fullName}</strong>
                  <span>{user.email}</span>
                </td>
                <td>
                  <select
                    value={user.role}
                    onChange={(event) => handleRoleChange(user.id, event.target.value)}
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <span className={`pill ${user.enabled ? "enabled" : "disabled"}`}>
                    {user.enabled ? "Enabled" : "Disabled"}
                  </span>
                </td>
                <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {!isLoading && users.length === 0 && (
          <p className="empty-state">No users found.</p>
        )}
      </section>
    </main>
  );
};

export default App;
