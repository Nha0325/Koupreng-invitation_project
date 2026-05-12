import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const CreateEventPage = () => {
  const navigate = useNavigate()

  return (
    <div className="page">
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="btn btn-ghost">
          <ArrowLeft size={18} />
          Back
        </button>
        <h1>Create Event</h1>
      </div>
      <div className="form-container">
        {/* Event form will go here */}
        <p>Event creation form</p>
      </div>
    </div>
  )
}

export default CreateEventPage;
