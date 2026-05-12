# React JSX Project Architecture

## Project Structure

```
src/
├── assets/              # Images, icons, static files
├── components/          # Reusable UI components
├── context/            # React Context for global state
├── features/           # Feature-specific modules (optional for complex features)
├── hooks/              # Custom React hooks
├── layout/             # Layout components (Sidebar, Header, Footer)
├── pages/              # Page components (one per route)
├── services/           # API calls and external services
├── utils/              # Utility functions and helpers
├── App.jsx             # Main app component with routing
├── index.css           # Global styles
└── main.jsx            # React DOM render entry point
```

## Key Principles

### 1. **Single Responsibility**
- Each file/component has one clear purpose
- Pages contain route logic, not business logic
- Services handle all API communication
- Hooks encapsulate reusable logic

### 2. **Separation of Concerns**
- **pages/** - Route handlers and page-level composition
- **components/** - Reusable UI building blocks
- **services/** - API and external data calls
- **hooks/** - Custom logic and state management
- **context/** - Global state (auth, theme, etc.)
- **utils/** - Pure functions and helpers

### 3. **No Duplication**
- Remove feature-specific page wrappers if they duplicate pages/
- Keep pages/ as the single source of truth for routes
- Use components/ for reusable UI logic

## Folder Guidelines

### pages/
- One component per route
- Named as `*Page.jsx` (e.g., EventsPage.jsx)
- Minimal logic - mostly composition
- Fetch data and pass to components
- Handle route params

### components/
- Reusable UI components
- Should be feature-agnostic
- Accept props for customization
- Include related styles

### hooks/
- Custom React hooks for logic reuse
- Examples: useEvents, useFetch, useForm
- Keep them pure and testable

### services/
- API communication
- External integrations
- Data transformation
- Error handling

### context/
- Global state (auth, theme, settings)
- Rarely needed for feature state
- Use hooks for feature-specific state

### utils/
- Pure utility functions
- Formatters, validators, constants
- No side effects

## Routing Structure

Routes are defined in `App.jsx` using React Router:

```jsx
<Route path="/events" element={<EventsPage />} />
<Route path="/events/create" element={<CreateEventPage />} />
<Route path="/events/:id" element={<EventDetailPage />} />
```

## State Management

### Local Component State
- Use `useState` for component-specific state
- Good for: form inputs, toggles, temporary UI state

### Custom Hooks
- Use custom hooks for reusable logic
- Examples: `useEvents`, `useFetch`
- Encapsulates logic and state

### Context API
- Use for truly global state
- Examples: user auth, theme, app-wide settings
- Avoid overusing for feature-specific state

### Data Fetching
- Use custom hooks wrapping services
- Services make API calls
- Hooks provide clean data and state

## Component Structure Example

```jsx
// components/EventCard.jsx
import { useNavigate } from 'react-router-dom'
import { Trash2, Edit } from 'lucide-react'
import './EventCard.css'

export default function EventCard({ event, onDelete, onEdit }) {
  const navigate = useNavigate()

  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p>{event.date}</p>
      <div className="actions">
        <button onClick={() => onEdit(event.id)}>
          <Edit size={18} />
        </button>
        <button onClick={() => onDelete(event.id)}>
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}
```

## Service Structure Example

```jsx
// services/eventService.js
const API_BASE = 'http://localhost:3000/api'

export async function getEvents() {
  const response = await fetch(`${API_BASE}/events`)
  if (!response.ok) throw new Error('Failed to fetch')
  return await response.json()
}

export async function createEvent(data) {
  const response = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create')
  return await response.json()
}
```

## Hook Structure Example

```jsx
// hooks/useEvents.js
import { useState, useCallback } from 'react'
import { getEvents, createEvent } from '../services/eventService'

export function useEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getEvents()
      setEvents(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const add = useCallback(async (eventData) => {
    const newEvent = await createEvent(eventData)
    setEvents((prev) => [...prev, newEvent])
    return newEvent
  }, [])

  return { events, loading, error, fetch, add }
}
```

## Naming Conventions

### Files
- Components: `EventCard.jsx`, `EventForm.jsx`
- Pages: `EventsPage.jsx`, `EventDetailPage.jsx`
- Hooks: `useEvents.js`, `useFetch.js`
- Services: `eventService.js`, `guestService.js`
- Utilities: `formatters.js`, `validators.js`
- Styles: `EventCard.css` (co-located with component)

### Functions/Classes
- React components: PascalCase (EventCard, EventsPage)
- Utilities/hooks: camelCase (getEvents, formatDate)
- Constants: UPPER_SNAKE_CASE (EVENT_TYPES, API_BASE)

## Best Practices

1. **Keep components small** - Single responsibility
2. **Prop drilling minimization** - Use context for deeply nested state
3. **Avoid premature optimization** - Build features first
4. **Test utilities and hooks** - They're easy to test in isolation
5. **Document complex logic** - Comments for non-obvious code
6. **Use destructuring** - Makes props clear and explicit
7. **Error handling** - Every async operation should handle errors
8. **Loading states** - Show feedback during data fetching

## Performance Tips

1. Use `useCallback` for functions passed as props
2. Use `useMemo` for expensive calculations
3. Code split pages using React.lazy (advanced)
4. Profile with React DevTools
5. Avoid creating objects/functions in render

## Scaling Guidelines

As the project grows:

1. **Add components/** - Create subdirectories by feature
   - `components/Events/EventCard.jsx`
   - `components/Events/EventForm.jsx`

2. **Add features/** - For complex feature sets
   - `features/Events/` (components, hooks, services for Events)

3. **Add store/** - If context becomes complex
   - Use Redux, Zustand, or Jotai for complex state

4. **Add tests/** - Mirror folder structure
   - `__tests__/components/EventCard.test.jsx`

## Migration Path

If moving from the old structure:

1. Keep `pages/` as single source of truth
2. Delete duplicate `features/` page wrappers
3. Move reusable logic to `hooks/`
4. Move UI to `components/`
5. Keep API calls in `services/`
