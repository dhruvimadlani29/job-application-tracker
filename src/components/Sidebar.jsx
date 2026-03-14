// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import navItems from '../router/navItems'

function Sidebar() {
  return (
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
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
              ${isActive
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
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
  )
}

export default Sidebar