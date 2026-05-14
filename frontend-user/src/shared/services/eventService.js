import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Event Service
export const eventService = {
  // Get all events for current user
  getEvents: () => api.get("/events"),

  // Get single event by ID
  getEventById: (id) => api.get(`/events/${id}`),

  // Get event by slug (for public invitation)
  getEventBySlug: (slug) => api.get(`/events/slug/${slug}`),

  // Create new event
  createEvent: (eventData) => api.post("/events", eventData),

  // Update event
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),

  // Delete event
  deleteEvent: (id) => api.delete(`/events/${id}`),

  // Upload event image
  uploadEventImage: (eventId, file) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post(`/events/${eventId}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Upload event music
  uploadEventMusic: (eventId, file) => {
    const formData = new FormData();
    formData.append("music", file);
    return api.post(`/events/${eventId}/music`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default eventService;
