// src/hooks/useDarkMode.js
import { useState, useEffect } from 'react'

export function useDarkMode() {

  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) return saved === 'true'
    // Fall back to OS preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('darkMode', isDark)
  }, [isDark])

  // Listen for OS preference changes
  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) return // User has manually set preference

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    function handleChange(e) {
      setIsDark(e.matches)
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  function toggle() {
    setIsDark(prev => !prev)
  }

  function reset() {
    localStorage.removeItem('darkMode')
    setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
  }

  return { isDark, toggle, reset }
}