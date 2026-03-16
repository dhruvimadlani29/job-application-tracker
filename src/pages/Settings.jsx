// src/pages/Settings.jsx
import { useState } from 'react'
import { saveStatuses, saveThresholds } from '../utils/thresholds'
import { useAuth } from '../hooks/useAuth'
import StatusVisibility    from '../components/settings/StatusVisibility'
import BadgeThresholds     from '../components/settings/BadgeThresholds'
import ProfileSettings     from '../components/settings/ProfileSettings'
import NotificationSettings from '../components/settings/NotificationSettings'
import ContactForm         from '../components/settings/ContactForm'

function Settings({ statuses, setStatuses, thresholds, setThresholds }) {

  const { user } = useAuth()

  const [savedThresh, setSavedThresh]   = useState(false)
  const [savedStatus, setSavedStatus]   = useState(false)

  const [expanded, setExpanded] = useState({
    status:        true,
    threshold:     true,
    profile:       true,
    notifications: true,
    contact:       false,
  })

  function toggleSection(key) {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function handleSaveStatuses() {
    saveStatuses(statuses)
    setSavedStatus(true)
    setTimeout(() => setSavedStatus(false), 2000)
  }

  function handleSaveThresholds() {
    if (thresholds.followUpMax <= thresholds.justAppliedMax) {
      alert('"Follow Up" days must be greater than "Just Applied" days!')
      return
    }
    saveThresholds(thresholds)
    setSavedThresh(true)
    setTimeout(() => setSavedThresh(false), 2000)
  }

  // ── Reusable section header ──
  function SectionHeader({ sectionKey, icon, title, subtitle, saved }) {
    return (
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors rounded-t-2xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-lg flex-shrink-0">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-gray-800">{title}</p>
              {saved && (
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  ✅ Saved
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          </div>
        </div>
        <span className={`text-gray-400 text-lg transition-transform duration-200 ${expanded[sectionKey] ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>
    )
  }

  return (
    <div>
      <p className="text-sm text-gray-400 mb-6">
        Customize your CoopTracker experience — changes apply instantly across the app.
      </p>

      <div className="grid grid-cols-2 gap-6 items-start">

        {/* ══ LEFT COLUMN ══ */}
        <div className="flex flex-col gap-6">

          {/* Status Visibility */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <SectionHeader
              sectionKey="status" icon="📋"
              title="Status Visibility"
              subtitle={`${statuses.filter(s => s.enabled).length} visible · ${statuses.filter(s => !s.enabled).length} hidden`}
              saved={savedStatus}
            />
            {expanded.status && (
              <>
                <StatusVisibility statuses={statuses} setStatuses={setStatuses} />
                <div className="px-6 pb-6">
                  <button onClick={handleSaveStatuses}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
                    {savedStatus ? '✅ Saved!' : 'Save Status Settings'}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <SectionHeader
              sectionKey="notifications" icon="🔔"
              title="Notifications"
              subtitle="Deadline, interview and follow-up reminders"
              saved={false}
            />
            {expanded.notifications && <NotificationSettings />}
          </div>

        </div>

        {/* ══ RIGHT COLUMN ══ */}
        <div className="flex flex-col gap-6">

          {/* Badge Thresholds */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <SectionHeader
              sectionKey="threshold" icon="🎯"
              title="Badge Thresholds"
              subtitle="Control when Applied badges change"
              saved={savedThresh}
            />
            {expanded.threshold && (
              <>
                <BadgeThresholds thresholds={thresholds} setThresholds={setThresholds} />
                <div className="px-6 pb-6">
                  <button onClick={handleSaveThresholds}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
                    {savedThresh ? '✅ Saved!' : 'Save Threshold Settings'}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Profile */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <SectionHeader
              sectionKey="profile" icon="👤"
              title="Profile Settings"
              subtitle="Your personal information"
              saved={false}
            />
            {expanded.profile && <ProfileSettings user={user} />}
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <SectionHeader
              sectionKey="contact" icon="✉️"
              title="Contact Us"
              subtitle="Questions, feedback or bug reports"
              saved={false}
            />
            {expanded.contact && <ContactForm />}
          </div>

        </div>

      </div>
    </div>
  )
}

export default Settings