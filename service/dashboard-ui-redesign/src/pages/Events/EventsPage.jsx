import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

const EventsPage = () => {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Events</h1>
        <Link to="/events/create" className="btn btn-primary">
          <Plus size={18} />
          Create Event
        </Link>
      </div>
      <p>Manage your wedding events and details.</p>
    </div>
  )
}

export default EventsPage;
