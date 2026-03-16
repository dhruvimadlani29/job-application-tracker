// src/components/detail/DetailContact.jsx
function DetailContact({ application }) {
  const hasContact =
    application.recruiterName    ||
    application.recruiterEmail   ||
    application.recruiterLinkedIn

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">
        👤 Recruiter Contact
      </p>

      {hasContact ? (
        <div className="flex items-center gap-4 flex-wrap">

          {application.recruiterName && (
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40
                flex items-center justify-center
                text-blue-600 dark:text-blue-400 font-bold text-sm flex-shrink-0">
                {application.recruiterName[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                  {application.recruiterName}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Recruiter</p>
              </div>
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            {application.recruiterEmail && (
              <a
                href={`mailto:${application.recruiterEmail}`}
                className="inline-flex items-center gap-1.5
                  bg-white dark:bg-gray-700
                  border border-gray-200 dark:border-gray-600
                  hover:border-blue-300 dark:hover:border-blue-500
                  text-gray-600 dark:text-gray-300
                  hover:text-blue-600 dark:hover:text-blue-400
                  text-xs font-semibold px-3 py-2 rounded-xl transition-all"
              >
                📧 {application.recruiterEmail}
              </a>
            )}
            {application.recruiterLinkedIn && (
              <a
                href={application.recruiterLinkedIn}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5
                  bg-blue-600 hover:bg-blue-700
                  text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all"
              >
                🔗 View LinkedIn
              </a>
            )}
          </div>

        </div>
      ) : (
        <p className="text-xs text-gray-400 dark:text-gray-500">
          No contact info saved — click Edit to add
        </p>
      )}

    </div>
  )
}

export default DetailContact