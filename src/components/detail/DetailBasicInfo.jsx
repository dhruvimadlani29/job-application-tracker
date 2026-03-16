// src/components/detail/DetailBasicInfo.jsx
function DetailBasicInfo({ application }) {

  const daysAgo = () => {
    const applied = new Date(application.dateApplied)
    if (isNaN(applied.getTime())) return null
    return Math.floor((new Date() - applied) / (1000 * 60 * 60 * 24))
  }

  const days = daysAgo()

  const sectionClass = "bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"
  const labelClass   = "text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3"
  const keyClass     = "text-xs text-gray-400 dark:text-gray-500 flex-shrink-0"
  const valueClass   = "text-xs font-semibold text-gray-800 dark:text-gray-200 text-right"

  return (
    <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">

      {/* Basic Info */}
      <div className={sectionClass}>
        <p className={labelClass}>📋 Application Info</p>
        <div className="space-y-2">
          {[
            { label: 'Company',      value: application.company              },
            { label: 'Role',         value: application.role                 },
            { label: 'Status',       value: application.status               },
            { label: 'Date Applied', value: application.dateApplied || '—'   },
            { label: 'Days Since',
              value: days !== null ? `${days} day${days !== 1 ? 's' : ''} ago` : '—' },
          ].map(item => (
            <div key={item.label} className="flex justify-between items-start gap-2">
              <span className={keyClass}>{item.label}</span>
              <span className={valueClass}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Job URL */}
      <div className={sectionClass}>
        <p className={labelClass}>🔗 Job Posting</p>
        {application.jobUrl ? (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 break-all mb-3 leading-relaxed">
              {application.jobUrl}
            </p>
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700
                text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors"
            >
              Open Job Posting →
            </a>
          </div>
        ) : (
          <p className="text-xs text-gray-400 dark:text-gray-500">No job URL saved</p>
        )}
      </div>

    </div>
  )
}

export default DetailBasicInfo