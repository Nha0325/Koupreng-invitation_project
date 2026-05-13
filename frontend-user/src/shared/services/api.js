import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth Service
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
};

// Guest Service
export const guestService = {
  getGuests: () => api.get('/guests'),
  addGuest: (guest) => api.post('/guests', guest),
  updateGuest: (id, guest) => api.put(`/guests/${id}`, guest),
  deleteGuest: (id) => api.delete(`/guests/${id}`),
};

// Wedding Service
export const weddingService = {
  createWedding: (data) => api.post('/weddings', data),
  getWeddings: () => api.get('/weddings'),
  updateWedding: (id, data) => api.put(`/weddings/${id}`, data),
};

export default api;
