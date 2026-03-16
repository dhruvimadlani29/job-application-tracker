// src/components/DarkModeToggle.jsx

function DarkModeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none flex-shrink-0
        ${isDark
          ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30'
          : 'bg-gray-200 hover:bg-gray-300'}`}
    >
      {/* Track labels */}
      <span className={`absolute left-1.5 top-1/2 -translate-y-1/2 text-xs font-bold transition-opacity duration-200
        ${isDark ? 'opacity-0' : 'opacity-60 text-gray-500'}`}>
        L
      </span>
      <span className={`absolute right-1.5 top-1/2 -translate-y-1/2 text-xs font-bold transition-opacity duration-200
        ${isDark ? 'opacity-80 text-indigo-200' : 'opacity-0'}`}>
        D
      </span>

      {/* Sliding circle */}
      <div className={`absolute top-0.5 w-6 h-6 rounded-full shadow-md transition-all duration-300 flex items-center justify-center
        ${isDark
          ? 'translate-x-7 bg-white'
          : 'translate-x-0.5 bg-white'}`}
      >
        {/* Inner dot */}
        <div className={`w-2 h-2 rounded-full transition-all duration-300
          ${isDark ? 'bg-indigo-600' : 'bg-gray-400'}`}
        />
      </div>
    </button>
  )
}

export default DarkModeToggle