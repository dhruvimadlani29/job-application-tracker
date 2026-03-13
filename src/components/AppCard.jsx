// src/components/AppCard.jsx
import EmailGenerator from './EmailGenerator'
import MatchScore from './MatchScore'
import InterviewPrep from './InterviewPrep'

function AppCard({ application, onDelete }) {

  function getStatusStyle(status) {
    if (status === 'Interview') return 'bg-purple-100 text-purple-700'
    if (status === 'Offer')     return 'bg-green-100 text-green-700'
    if (status === 'Rejected')  return 'bg-red-100 text-red-700'
    return 'bg-blue-100 text-blue-700'
  }

  function handleDelete() {
    // Ask user to confirm before deleting
    const confirmed = window.confirm(`Delete ${application.company} application?`)
    if (confirmed) onDelete(application.id)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200">

      {/* Top row — company info + status + delete */}
      <div className="flex justify-between items-start">

        {/* Left — logo + name + role */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {application.company[0]}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{application.company}</h3>
            <p className="text-sm text-gray-400 mt-0.5">{application.role}</p>
          </div>
        </div>

        {/* Right — status badge + delete button */}
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${getStatusStyle(application.status)}`}>
            {application.status}
          </span>
          <button
            onClick={handleDelete}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all"
            title="Delete application"
          >
            🗑
          </button>
        </div>

      </div>

      {/* Date row */}
      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-1">
        <span className="text-xs text-gray-400">📅 Applied:</span>
        <span className="text-xs text-gray-500 font-medium">{application.dateApplied}</span>
      </div>

      {/* AI Buttons row — never moves */}
      <div className="mt-3 pt-3 border-t border-gray-50 flex flex-wrap gap-2">
        <EmailGenerator company={application.company} role={application.role} />
        <MatchScore     company={application.company} role={application.role} />
        <InterviewPrep  company={application.company} role={application.role} />
      </div>

    </div>
  )
}

export default AppCard