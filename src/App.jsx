// src/App.jsx
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar    from './components/Sidebar'
import TopBar     from './components/TopBar'
import AppRouter  from './router/AppRouter'
import { getStatuses, getThresholds, saveStatuses, saveThresholds } from './utils/thresholds'
import { useAuth }     from './hooks/useAuth'
import { useDarkMode } from './hooks/useDarkMode'

function App() {
  const [statuses, setStatuses]     = useState(getStatuses)
  const [thresholds, setThresholds] = useState(getThresholds)
  const { user, loading, logout }   = useAuth()
  const { isDark, toggle }          = useDarkMode()
  const location                    = useLocation()

  useEffect(() => { saveStatuses(statuses)     }, [statuses])
  useEffect(() => { saveThresholds(thresholds) }, [thresholds])

  const AUTH_PAGES = ['/login', '/signup', '/verify', '/forgot-password', '/terms']
  const isAuthPage = AUTH_PAGES.includes(location.pathname)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"/>
          <p className="text-gray-400 text-sm font-medium">Loading CoopTracker...</p>
        </div>
      </div>
    )
  }

  if (isAuthPage) {
    return (
      <AppRouter
        statuses={statuses} setStatuses={setStatuses}
        thresholds={thresholds} setThresholds={setThresholds}
      />
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">

      {/* Sidebar */}
      <Sidebar user={user} onLogout={logout} />

      {/* Main content */}
      <div className="ml-56 flex-1 flex flex-col min-h-screen
        max-lg:ml-0 max-lg:mb-16">

        <TopBar isDark={isDark} onToggleDark={toggle} />

        <div className="flex-1 p-8 max-sm:p-4">
          <AppRouter
            statuses={statuses} setStatuses={setStatuses}
            thresholds={thresholds} setThresholds={setThresholds}
          />
        </div>

      </div>

    </div>
  )
}

export default App