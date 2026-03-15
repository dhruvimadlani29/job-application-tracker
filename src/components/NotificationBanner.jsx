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

  // Check and fire notifications when applications load
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

  // Already granted — show nothing
  if (permission === 'granted') return null

  // Denied — show nothing (can't ask again)
  if (permission === 'denied') return null

  // Unsupported browser
  if (permission === 'unsupported') return null

  // Already dismissed
  if (dismissed) return null

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4 mb-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl flex-shrink-0">🔔</span>
        <div>
          <p className="text-sm font-bold text-blue-800">
            Enable Notifications
          </p>
          <p className="text-xs text-blue-600 mt-0.5">
            Get reminders for upcoming deadlines, interviews, and follow-up suggestions
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleEnable}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors"
        >
          Enable
        </button>
        <button
          onClick={handleDismiss}
          className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 font-semibold text-xs px-4 py-2 rounded-xl transition-colors"
        >
          Not Now
        </button>
      </div>
    </div>
  )
}

export default NotificationBanner