// src/components/AppCard.jsx
import { useState } from 'react'
import EmailGenerator from './EmailGenerator'
import MatchScore from './MatchScore'
import InterviewPrep from './InterviewPrep'
import SmartBadge from './HealthScore'

function AppCard({ application, onDelete, onEdit, onEditOpen, enabledStatuses }) {

  const [activePanel, setActivePanel] = useState(null)

  function togglePanel(panelName) {
    setActivePanel(prev => prev === panelName ? null : panelName)
  }
  function closePanel() { setActivePanel(null) }

  function getDaysAgo() {
    const applied = new Date(application.dateApplied)
    const today   = new Date()
    if (isNaN(applied.getTime())) return null
    const days = Math.floor((today - applied) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return '1 day ago'
    return `${days} days ago`
  }

  function handleDelete() {
    const confirmed = window.confirm(`Delete ${application.company} application?`)
    if (confirmed) onDelete(application.id)
  }

  const daysAgo = getDaysAgo()

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200">

      {/* Top row */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {application.company[0]}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{application.company}</h3>
            <p className="text-sm text-gray-400 mt-0.5">{application.role}</p>
          </div>
        </div>

        {/* Smart badge + Edit + Delete */}
        <div className="flex items-center gap-1">
          <SmartBadge
            status={application.status}
            dateApplied={application.dateApplied}
          />
          <button
            onClick={() => onEditOpen(application)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-blue-400 hover:bg-blue-50 transition-all"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all"
            title="Delete"
          >
            🗑
          </button>
        </div>
      </div>

      {/* Date + Days ago */}
      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400">📅 Applied:</span>
          <span className="text-xs text-gray-500 font-medium">{application.dateApplied}</span>
        </div>
        {daysAgo && (
          <span className="text-xs text-gray-400 font-medium">{daysAgo}</span>
        )}
      </div>

      {/* Notes */}
      {application.notes && (
        <div className="mt-2 bg-gray-50 rounded-xl px-4 py-2.5">
          <p className="text-xs text-gray-500 leading-relaxed">📝 {application.notes}</p>
        </div>
      )}

      {/* Resume + Cover Letter badges */}
      {(application.resumeUsed || application.coverLetterUsed) && (
        <div className="mt-2 flex flex-wrap gap-2">
          {application.resumeUsed && (
            <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
              📄 {application.resumeUsed}
            </span>
          )}
          {application.coverLetterUsed && (
            <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
              ✉️ {application.coverLetterUsed}
            </span>
          )}
        </div>
      )}

      {/* AI Buttons */}
      <div className="mt-3 pt-3 border-t border-gray-50 flex flex-wrap gap-2">
        <EmailGenerator
          company={application.company} role={application.role}
          isOpen={activePanel === 'email'}
          onToggle={() => togglePanel('email')} onClose={closePanel}
        />
        <MatchScore
          company={application.company} role={application.role}
          isOpen={activePanel === 'match'}
          onToggle={() => togglePanel('match')} onClose={closePanel}
        />
        <InterviewPrep
          company={application.company} role={application.role}
          isOpen={activePanel === 'interview'}
          onToggle={() => togglePanel('interview')} onClose={closePanel}
        />
      </div>

    </div>
  )
}

export default AppCard