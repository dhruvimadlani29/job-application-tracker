// src/components/settings/NotificationSettings.jsx
import { useState } from 'react'
import {
  getNotificationPermission,
  requestNotificationPermission,
  sendTestNotification,
  getNotifPrefs,
  saveNotifPrefs
} from '../../utils/notifications'

function NotificationSettings() {
  const [notifPermission, setNotifPermission] = useState(getNotificationPermission())
  const [notifPrefs, setNotifPrefs]           = useState(getNotifPrefs)
  const [saved, setSaved]                     = useState(false)

  async function handleEnable() {
    const granted = await requestNotificationPermission()
    setNotifPermission(granted ? 'granted' : 'denied')
  }

  function handlePrefChange(key, value) {
    setNotifPrefs(prev => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    saveNotifPrefs(notifPrefs)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const permissionConfig = {
    granted: { bg: 'bg-green-50 border-green-200', icon: '✅', color: 'text-green-700', subColor: 'text-green-600',
      title: 'Notifications Enabled',
      desc:  'You will receive browser notifications for the alerts you enable below' },
    denied:  { bg: 'bg-red-50 border-red-200',   icon: '❌', color: 'text-red-700',   subColor: 'text-red-600',
      title: 'Notifications Blocked',
      desc:  'Click the lock icon 🔒 in your browser address bar to re-enable' },
    default: { bg: 'bg-gray-50 border-gray-200', icon: '⏳', color: 'text-gray-700',  subColor: 'text-gray-500',
      title: 'Notifications Not Enabled',
      desc:  'Click below to enable browser notifications' },
  }

  const config = permissionConfig[notifPermission] || permissionConfig.default

  const toggleItems = [
    { key: 'deadlineEnabled',  icon: '📅', label: 'Deadline Reminders',  desc: 'Alerts before application deadlines' },
    { key: 'interviewEnabled', icon: '🎤', label: 'Interview Reminders', desc: 'Alerts before scheduled interviews'  },
    { key: 'followupEnabled',  icon: '📬', label: 'Follow-up Reminders', desc: 'Nudge to follow up after 14+ days'   },
  ]

  return (
    <div className="px-6 pb-6 border-t border-gray-50 pt-4 space-y-4">

      {/* Permission status */}
      <div className={`rounded-xl p-4 border ${config.bg}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{config.icon}</span>
          <p className={`text-sm font-bold ${config.color}`}>{config.title}</p>
        </div>
        <p className={`text-xs ${config.subColor}`}>{config.desc}</p>
      </div>

      {notifPermission === 'default' && (
        <button onClick={handleEnable}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
          🔔 Enable Notifications
        </button>
      )}

      {/* Type toggles */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
          Which notifications to receive
        </p>
        <div className="space-y-2">
          {toggleItems.map(item => (
            <div
              key={item.key}
              onClick={() => handlePrefChange(item.key, !notifPrefs[item.key])}
              className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all
                ${notifPrefs[item.key]
                  ? 'border-blue-100 bg-blue-50'
                  : 'border-gray-100 bg-gray-50 opacity-60'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-5 rounded-full transition-all relative flex-shrink-0
                  ${notifPrefs[item.key] ? 'bg-blue-500' : 'bg-gray-300'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all
                    ${notifPrefs[item.key] ? 'left-4' : 'left-0.5'}`}/>
                </div>
                <span className="text-base">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-700">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                ${notifPrefs[item.key] ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400'}`}>
                {notifPrefs[item.key] ? 'ON' : 'OFF'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Deadline warning slider */}
      {notifPrefs.deadlineEnabled && (
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-gray-600">
              📅 Warn me about deadlines how many days in advance?
            </label>
            <span className="text-sm font-bold text-blue-600">{notifPrefs.deadlineWarningDays} days</span>
          </div>
          <input type="range" min={1} max={14}
            value={notifPrefs.deadlineWarningDays}
            onChange={e => handlePrefChange('deadlineWarningDays', Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-300 mt-0.5">
            <span>1 day</span><span>14 days</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Notifications start {notifPrefs.deadlineWarningDays} days before the deadline
          </p>
        </div>
      )}

      {/* Save + Test */}
      <button onClick={handleSave}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
        {saved ? '✅ Saved!' : 'Save Notification Settings'}
      </button>

      {notifPermission === 'granted' && (
        <button onClick={sendTestNotification}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors">
          🔔 Send Test Notification
        </button>
      )}

    </div>
  )
}

export default NotificationSettings