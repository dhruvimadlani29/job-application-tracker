// src/components/TopBar.jsx
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { pageTitles } from '../router/navItems'
import NotificationCenter from './notifications/NotificationCenter'
import DarkModeToggle     from './DarkModeToggle'
import MobileSidebar      from './MobileSidebar'
import { useAuth }        from '../hooks/useAuth'

function TopBar({ isDark, onToggleDark }) {
  const location           = useLocation()
  const title              = pageTitles[location.pathname] || 'CoopTracker'
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout }   = useAuth()

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <>
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700
        px-8 max-sm:px-4 py-4 sticky top-0 z-10 flex items-center justify-between
        transition-colors duration-200">

        {/* Left — hamburger (mobile) + title */}
        <div className="flex items-center gap-3">

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center
              text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            <div className="flex flex-col gap-1.5">
              <div className="w-5 h-0.5 bg-gray-600 dark:bg-gray-300 rounded-full"/>
              <div className="w-5 h-0.5 bg-gray-600 dark:bg-gray-300 rounded-full"/>
              <div className="w-5 h-0.5 bg-gray-600 dark:bg-gray-300 rounded-full"/>
            </div>
          </button>

          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100
              max-sm:text-base">{title}</h1>
            <p className="text-xs text-gray-400 mt-0.5 max-sm:hidden">{today}</p>
          </div>
        </div>

        {/* Right — dark mode toggle + bell */}
        <div className="flex items-center gap-3">
          <DarkModeToggle isDark={isDark} onToggle={onToggleDark} />
          <NotificationCenter />
        </div>

      </div>

      {/* Mobile sidebar overlay */}
      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        user={user}
        onLogout={logout}
      />
    </>
  )
}

export default TopBar