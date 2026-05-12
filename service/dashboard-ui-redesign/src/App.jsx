import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './layout/Layout'
import DashboardPage from './pages/Dashboard/DashboardPage'
import EventsPage from './pages/Events/EventsPage'
import CreateEventPage from './pages/Events/CreateEventPage'
import ExpensesPage from './pages/Expenses/ExpensesPage'
import GuestsPage from './pages/Guests/GuestsPage'
import TemplatesPage from './pages/Templates/TemplatesPage'
import WeddingGiftPage from './pages/WeddingGift/WeddingGiftPage'
import SettingsPage from './pages/Settings/SettingsPage'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          
          {/* Events Routes */}
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/create" element={<CreateEventPage />} />
          <Route path="/events/:id" element={<EventsPage />} />
          
          {/* Expenses Routes */}
          <Route path="/expenses" element={<ExpensesPage />} />
          
          {/* Guests Routes */}
          <Route path="/guests" element={<GuestsPage />} />
          
          {/* Templates Routes */}
          <Route path="/templates" element={<TemplatesPage />} />
          
          {/* Wedding Gift Routes */}
          <Route path="/wedding-gift" element={<WeddingGiftPage />} />
          
          {/* Settings Routes */}
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App;
