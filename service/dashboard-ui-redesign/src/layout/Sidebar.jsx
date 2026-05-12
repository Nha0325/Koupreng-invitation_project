import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, Home, Calendar, DollarSign, Users, Gift, Settings, Zap } from 'lucide-react'
import './Sidebar.css'

const navGroups = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', href: '/', icon: Home },
    ],
  },
  {
    title: 'Planning',
    items: [
      { label: 'Events', href: '/events', icon: Calendar },
      { label: 'Guests', href: '/guests', icon: Users },
      { label: 'Templates', href: '/templates', icon: Zap },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Expenses', href: '/expenses', icon: DollarSign },
      { label: 'Wedding Gift', href: '/wedding-gift', icon: Gift },
    ],
  },
]

const Sidebar = () => {
  const location = useLocation()
  const [expanded, setExpanded] = useState(new Set(['Main', 'Planning', 'Management']))

  const toggleGroup = (title) => {
    const newExpanded = new Set(expanded)
    if (newExpanded.has(title)) {
      newExpanded.delete(title)
    } else {
      newExpanded.add(title)
    }
    setExpanded(newExpanded)
  }

  const isActive = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>Wedding Planner</h1>
      </div>

      <nav className="sidebar-nav">
        {navGroups.map((group) => (
          <div key={group.title} className="nav-group">
            <button
              onClick={() => toggleGroup(group.title)}
              className="nav-group-header"
            >
              <span>{group.title}</span>
              <ChevronDown
                size={16}
                className={expanded.has(group.title) ? 'rotate-0' : '-rotate-90'}
              />
            </button>
            {expanded.has(group.title) && (
              <div className="nav-group-items">
                {group.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Link to="/settings" className={`nav-item ${isActive('/settings') ? 'active' : ''}`}>
          <Settings size={18} />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar;
