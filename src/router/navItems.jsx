// src/router/navItems.js
const navItems = [
  { path: '/dashboard', icon: '📋', label: 'Applications' },
  { path: '/aitools',   icon: '🤖', label: 'AI Tools'     },
  { path: '/resumes',   icon: '📄', label: 'Resumes'      },
  { path: '/analytics', icon: '📊', label: 'Analytics'    },
  { path: '/settings',  icon: '⚙️', label: 'Settings'     },
]

export const pageTitles = {
  '/dashboard': 'My Applications',
  '/aitools':   'AI Tools',
  '/resumes':   'My Resumes',
  '/analytics': 'Analytics',
  '/settings':  'Settings',
}

export default navItems