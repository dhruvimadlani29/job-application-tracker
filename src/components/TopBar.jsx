// src/components/TopBar.jsx
import { useLocation } from 'react-router-dom'
import { pageTitles } from '../router/navItems'
import NotificationCenter from './notifications/NotificationCenter'

function TopBar() {
  const location = useLocation()
  const title    = pageTitles[location.pathname] || 'CoopTracker'

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric'
  })

  return (
    <div className="bg-white border-b border-gray-100 px-8 py-4 sticky top-0 z-10 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        <p className="text-xs text-gray-400 mt-0.5">{today}</p>
      </div>
      <NotificationCenter />
    </div>
  )
}

export default TopBar