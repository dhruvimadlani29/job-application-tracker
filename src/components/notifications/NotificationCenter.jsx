// src/components/notifications/NotificationCenter.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from 'aws-amplify/auth'
import { getUserData } from '../../utils/storage'
import { getActiveNotifications } from '../../utils/getActiveNotifications'
import NotificationItem  from './NotificationItem'
import NotificationEmpty from './NotificationEmpty'
import ApplicationDetail from '../ApplicationDetail'

function NotificationCenter() {

  const [open, setOpen]               = useState(false)
  const [applications, setApplications] = useState([])
  const [selectedApp, setSelectedApp] = useState(null)
  const [showDetail, setShowDetail]   = useState(false)

  const [dismissed, setDismissed] = useState(() =>
    JSON.parse(localStorage.getItem('dismissedNotifications') || '[]')
  )
  const [read, setRead] = useState(() =>
    JSON.parse(localStorage.getItem('readNotifications') || '[]')
  )

  const dropdownRef = useRef(null)
  const navigate    = useNavigate()

  // Load user-specific applications
  useEffect(() => {
    getCurrentUser()
      .then(u => {
        const data = getUserData('coopApplications', u.userId, [])
        setApplications(data)
      })
      .catch(() => setApplications([]))
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Reset read + dismissed every new day
  useEffect(() => {
    const lastReset = localStorage.getItem('notificationResetDate')
    const today     = new Date().toDateString()
    if (lastReset !== today) {
      localStorage.setItem('dismissedNotifications', '[]')
      localStorage.setItem('readNotifications',      '[]')
      localStorage.setItem('notificationResetDate',  today)
      setDismissed([])
      setRead([])
    }
  }, [])

  const allNotifications    = getActiveNotifications(applications)
  const activeNotifications = allNotifications.filter(n => !dismissed.includes(n.id))
  const unreadNotifications = activeNotifications.filter(n => !read.includes(n.id))
  const unreadCount         = unreadNotifications.length
  const hasUnreadCritical   = unreadNotifications.some(n => n.urgency === 'critical')

  // Mark all as read when dropdown opens
  useEffect(() => {
    if (open && activeNotifications.length > 0) {
      const unreadIds = activeNotifications
        .filter(n => !read.includes(n.id))
        .map(n => n.id)
      if (unreadIds.length > 0) {
        const updated = [...read, ...unreadIds]
        setRead(updated)
        localStorage.setItem('readNotifications', JSON.stringify(updated))
      }
    }
  }, [open])

  function dismissOne(id, e) {
    e.stopPropagation()
    const updated = [...dismissed, id]
    setDismissed(updated)
    localStorage.setItem('dismissedNotifications', JSON.stringify(updated))
  }

  function dismissAll() {
    const allIds  = activeNotifications.map(n => n.id)
    const updated = [...dismissed, ...allIds]
    setDismissed(updated)
    localStorage.setItem('dismissedNotifications', JSON.stringify(updated))
    setOpen(false)
  }

  function markAllRead() {
    const allIds  = activeNotifications.map(n => n.id)
    const updated = [...read, ...allIds]
    setRead(updated)
    localStorage.setItem('readNotifications', JSON.stringify(updated))
  }

  function handleNotificationClick(notification) {
    setOpen(false)

    if (!read.includes(notification.id)) {
      const updated = [...read, notification.id]
      setRead(updated)
      localStorage.setItem('readNotifications', JSON.stringify(updated))
    }

    const apps = applications
    const app  = apps.find(a => a.id === notification.appId)

    if (app) {
      navigate('/dashboard')
      setTimeout(() => {
        setSelectedApp(app)
        setShowDetail(true)
      }, 100)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <>
      <div className="relative" ref={dropdownRef}>

        {/* Bell button */}
        <button
          onClick={() => setOpen(!open)}
          className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all
            ${open ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
        >
          <span className={`text-lg ${unreadCount > 0 ? 'animate-bounce' : ''}`}>🔔</span>
          {unreadCount > 0 && (
            <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center
              ${hasUnreadCritical ? 'bg-red-500' : 'bg-orange-400'}`}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-11 w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">

            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800 text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
                {unreadCount === 0 && activeNotifications.length > 0 && (
                  <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full">
                    {activeNotifications.length} total
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button onClick={markAllRead}
                    className="text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors">
                    Mark all read
                  </button>
                )}
                {activeNotifications.length > 0 && (
                  <button onClick={dismissAll}
                    className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors">
                    Clear all
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {activeNotifications.length === 0
                ? <NotificationEmpty />
                : activeNotifications.map(notif => (
                    <NotificationItem
                      key={notif.id}
                      notification={notif}
                      isRead={read.includes(notif.id)}
                      onDismiss={dismissOne}
                      onClick={handleNotificationClick}
                    />
                  ))
              }
            </div>

            {activeNotifications.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-400 text-center">
                  Notifications reset daily •{' '}
                  <button
                    onClick={() => { setOpen(false); navigate('/settings') }}
                    className="text-blue-500 hover:text-blue-700 font-semibold"
                  >
                    Manage in Settings
                  </button>
                </p>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Detail modal */}
      {selectedApp && (
        <ApplicationDetail
          application={selectedApp}
          show={showDetail}
          onClose={() => { setShowDetail(false); setSelectedApp(null) }}
          onEditOpen={() => { setShowDetail(false); setSelectedApp(null) }}
        />
      )}
    </>
  )
}

export default NotificationCenter