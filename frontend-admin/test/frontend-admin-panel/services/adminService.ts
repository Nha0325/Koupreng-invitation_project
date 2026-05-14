import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
  },
};

// Invitations Services
export const invitationService = {
  getAll: async () => {
    const response = await apiClient.get("/invitations");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/invitations/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post("/invitations", data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/invitations/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/invitations/${id}`);
    return response.data;
  },
};

// Users Services
export const userService = {
  getAll: async () => {
    const response = await apiClient.get("/users");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post("/users", data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
};

// Templates Services
export const templateService = {
  getAll: async () => {
    const response = await apiClient.get("/templates");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/templates/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post("/templates", data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/templates/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/templates/${id}`);
    return response.data;
  },
};

// Dashboard Services
export const dashboardService = {
  getStats: async () => {
    const response = await apiClient.get("/dashboard/stats");
    return response.data;
  },

  getCharts: async () => {
    const response = await apiClient.get("/dashboard/charts");
    return response.data;
  },
};

export default apiClient;
