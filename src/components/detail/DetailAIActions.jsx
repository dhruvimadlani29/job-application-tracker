// src/components/detail/DetailAIActions.jsx
import { useState } from 'react'
import EmailGenerator from '../EmailGenerator'
import MatchScore     from '../MatchScore'
import InterviewPrep  from '../InterviewPrep'

function DetailAIActions({ application }) {
  const [activePanel, setActivePanel] = useState(null)

  function togglePanel(name) {
    setActivePanel(prev => prev === name ? null : name)
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50
      dark:from-indigo-900/20 dark:to-purple-900/20
      border border-indigo-100 dark:border-indigo-800 rounded-xl p-4">

      <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-3">
        🤖 AI Actions
      </p>

      <div className="flex flex-wrap gap-2">
        <EmailGenerator
          company={application.company}
          role={application.role}
          isOpen={activePanel === 'email'}
          onToggle={() => togglePanel('email')}
          onClose={() => setActivePanel(null)}
        />
        <MatchScore
          company={application.company}
          role={application.role}
          isOpen={activePanel === 'match'}
          onToggle={() => togglePanel('match')}
          onClose={() => setActivePanel(null)}
        />
        <InterviewPrep
          company={application.company}
          role={application.role}
          isOpen={activePanel === 'interview'}
          onToggle={() => togglePanel('interview')}
          onClose={() => setActivePanel(null)}
        />
      </div>

    </div>
  )
}

export default DetailAIActions