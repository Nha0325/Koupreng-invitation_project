// Mock API calls - replace with actual API endpoints
const API_BASE = 'http://localhost:3000/api'

export async function getEvents() {
  try {
    const response = await fetch(`${API_BASE}/events`)
    if (!response.ok) throw new Error('Failed to fetch events')
    return await response.json()
  } catch (error) {
    console.error('Error fetching events:', error)
    return []
  }
}

export async function createEvent(eventData) {
  const response = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
  })
  if (!response.ok) throw new Error('Failed to create event')
  return await response.json()
}

export async function updateEvent(id, eventData) {
  const response = await fetch(`${API_BASE}/events/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
  })
  if (!response.ok) throw new Error('Failed to update event')
  return await response.json()
}

export async function deleteEvent(id) {
  const response = await fetch(`${API_BASE}/events/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete event')
}
