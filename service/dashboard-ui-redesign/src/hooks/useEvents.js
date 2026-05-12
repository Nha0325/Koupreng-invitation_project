import { useState, useCallback } from 'react'
import { getEvents, createEvent, updateEvent, deleteEvent } from '../services/eventService'

export function useEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getEvents()
      setEvents(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const addEvent = useCallback(async (eventData) => {
    try {
      const newEvent = await createEvent(eventData)
      setEvents((prev) => [...prev, newEvent])
      return newEvent
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const modifyEvent = useCallback(async (id, eventData) => {
    try {
      const updated = await updateEvent(id, eventData)
      setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)))
      return updated
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const removeEvent = useCallback(async (id) => {
    try {
      await deleteEvent(id)
      setEvents((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  return {
    events,
    loading,
    error,
    fetchEvents,
    addEvent,
    modifyEvent,
    removeEvent,
  }
}
