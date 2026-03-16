// src/components/NotificationBanner.jsx
import { useState, useEffect } from 'react'
import {
  requestNotificationPermission,
  getNotificationPermission,
  checkAndNotify
} from '../utils/notifications'

function NotificationBanner({ applications }) {

  const [permission, setPermission] = useState(getNotificationPermission())
  const [dismissed, setDismissed]   = useState(
    localStorage.getItem('notificationBannerDismissed') === 'true'
  )

  useEffect(() => {
    if (permission === 'granted') {
      checkAndNotify(applications)
    }
  }, [applications, permission])

  async function handleEnable() {
    const granted = await requestNotificationPermission()
    setPermission(granted ? 'granted' : 'denied')
    if (granted) checkAndNotify(applications)
  }

  function handleDismiss() {
    setDismissed(true)
    localStorage.setItem('notificationBannerDismissed', 'true')
  }

  if (permission === 'granted')     return null
  if (permission === 'denied')      return null
  if (permission === 'unsupported') return null
  if (dismissed)                    return null

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20
      border border-blue-200 dark:border-blue-800
      rounded-2xl px-5 py-4 mb-6 flex items-center justify-between gap-4">

      <div className="flex items-center gap-3">
        <span className="text-2xl flex-shrink-0">🔔</span>
        <div>
          <p className="text-sm font-bold text-blue-800 dark:text-blue-300">
            Enable Notifications
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
            Get reminders for upcoming deadlines, interviews, and follow-up suggestions
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleEnable}
          className="bg-blue-600 hover:bg-blue-700 text-white
            font-semibold text-xs px-4 py-2 rounded-xl transition-colors"
        >
          Enable
        </button>
        <button
          onClick={handleDismiss}
          className="bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600
            border border-gray-200 dark:border-gray-600
            text-gray-500 dark:text-gray-300
            font-semibold text-xs px-4 py-2 rounded-xl transition-colors"
        >
          Not Now
        </button>
      </div>

    </div>
  )
}

export default NotificationBanner