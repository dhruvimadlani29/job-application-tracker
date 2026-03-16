// src/components/MobileSidebar.jsx
import { useEffect } from 'react'
import { NavLink }   from 'react-router-dom'
import navItems      from '../router/navItems'

function MobileSidebar({ open, onClose, user, onLogout }) {

  // Close on escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  // Prevent body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else      document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden
          ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Slide-in panel */}
      <div className={`fixed top-0 left-0 h-full w-64 z-50 bg-white dark:bg-gray-800
        shadow-2xl flex flex-col transition-transform duration-300 ease-out lg:hidden
        ${open ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5
          border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600
              flex items-center justify-center text-white text-lg">
              🎯
            </div>
            <span className="font-bold text-gray-800 dark:text-gray-100">CoopTracker</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center
              text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">
            Menu
          </p>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200'}`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600
              flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={() => { onClose(); onLogout() }}
            className="w-full flex items-center justify-center gap-2
              bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/30
              hover:text-red-600 dark:hover:text-red-400
              text-gray-500 dark:text-gray-400 font-semibold text-xs py-2 rounded-xl transition-all"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>

      </div>
    </>
  )
}

export default MobileSidebar