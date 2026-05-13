import { useState, useCallback } from "react";
import api from "../services/api";

function useEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /* ── Fetch all events ── */
    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/events");
            setEvents(data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    /* ── Create event ── */
    const addEvent = useCallback(async (eventData) => {
        try {
            const { data } = await api.post("/events", eventData);
            setEvents((prev) => [...prev, data]);
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            setError(msg);
            throw new Error(msg);
        }
    }, []);

    /* ── Update event ── */
    const modifyEvent = useCallback(async (id, eventData) => {
        try {
            const { data } = await api.put(`/events/${id}`, eventData);
            setEvents((prev) => prev.map((e) => (e.id === id ? data : e)));
            return data;
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            setError(msg);
            throw new Error(msg);
        }
    }, []);

    /* ── Delete event ── */
    const removeEvent = useCallback(async (id) => {
        try {
            await api.delete(`/events/${id}`);
            setEvents((prev) => prev.filter((e) => e.id !== id));
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            setError(msg);
            throw new Error(msg);
        }
    }, []);

    /* ── Clear error ── */
    const clearError = useCallback(() => setError(null), []);

    return {
        events,
        loading,
        error,
        fetchEvents,
        addEvent,
        modifyEvent,
        removeEvent,
        clearError,
    };
}

export default useEvents;
