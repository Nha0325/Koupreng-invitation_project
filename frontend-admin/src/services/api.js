const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const TOKEN_STORAGE_KEY = "koupreng_admin_access_token";
const USER_STORAGE_KEY = "koupreng_admin_user";

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof data === "object" && data !== null ? data.message : "Request failed";
    throw new Error(message);
  }

  return data;
}

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export const adminStorage = {
  getSession: () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const userValue = localStorage.getItem(USER_STORAGE_KEY);
    if (!token || !userValue) return null;
    return {
      accessToken: token,
      user: JSON.parse(userValue),
    };
  },
  saveSession: ({ accessToken, user }) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  },
  clearSession: () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  },
};

export const adminApi = {
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  listUsers: (token) =>
    request("/admin/users", {
      headers: authHeaders(token),
    }),
  updateUserRole: (token, userId, role) =>
    request(`/admin/users/${userId}/role`, {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify({ role }),
    }),
};
