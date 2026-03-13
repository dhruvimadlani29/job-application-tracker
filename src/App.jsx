// src/App.jsx
import { useState } from 'react'
import Dashboard  from './pages/Dashboard'
import AITools    from './pages/AITools'
import Resumes    from './pages/Resumes'
import Analytics  from './pages/Analytics'
import Settings   from './pages/Settings'

function App() {

  const [activePage, setActivePage] = useState('dashboard')

  const navItems = [
    { id:'dashboard', icon:'📋', label:'Applications' },
    { id:'aitools',   icon:'🤖', label:'AI Tools'     },
    { id:'resumes',   icon:'📄', label:'Resumes'       },
    { id:'stats',     icon:'📊', label:'Analytics'     },
    { id:'settings',  icon:'⚙️', label:'Settings'      },
  ]

  const pageTitles = {
    dashboard: 'My Applications',
    aitools:   'AI Tools',
    resumes:   'My Resumes',
    stats:     'Analytics',
    settings:  'Settings',
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── SIDEBAR ── */}
      <div className="w-56 bg-white border-r border-gray-100 flex flex-col fixed h-full z-20">

        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg">
              🎯
            </div>
            <span className="font-bold text-gray-800">CoopTracker</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">
            Menu
          </p>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left w-full
                ${activePage === item.id
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Info */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              D
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-800 truncate">Dhruvi Madlani</p>
              <p className="text-xs text-gray-400 truncate">Algonquin College</p>
            </div>
          </div>
        </div>

      </div>

      {/* ── MAIN AREA ── */}
      <div className="ml-56 flex-1 flex flex-col">

        {/* Top Bar */}
        <div className="bg-white border-b border-gray-100 px-8 py-4 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-800">{pageTitles[activePage]}</h1>
          <p className="text-xs text-gray-400 mt-0.5">Friday, March 13, 2026</p>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-8">
          {activePage === 'dashboard' && <Dashboard />}
          {activePage === 'aitools'   && <AITools />}
          {activePage === 'resumes'   && <Resumes />}
          {activePage === 'stats'     && <Analytics applications={[]} />}
          {activePage === 'settings'  && <Settings />}
        </div>

      </div>

    </div>
  )
}

export default App