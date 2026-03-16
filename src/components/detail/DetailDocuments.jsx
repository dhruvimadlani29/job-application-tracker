// src/components/detail/DetailDocuments.jsx
function DetailDocuments({ application }) {
  const hasDocs = application.resumeUsed || application.coverLetterUsed

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">
        📄 Documents Used
      </p>

      {hasDocs ? (
        <div className="flex gap-2 flex-wrap">
          {application.resumeUsed && (
            <span className="inline-flex items-center gap-1.5
              bg-red-50 dark:bg-red-900/20
              border border-red-100 dark:border-red-800
              text-red-600 dark:text-red-400
              text-xs font-semibold px-3 py-2 rounded-xl">
              📄 {application.resumeUsed}
            </span>
          )}
          {application.coverLetterUsed && (
            <span className="inline-flex items-center gap-1.5
              bg-blue-50 dark:bg-blue-900/20
              border border-blue-100 dark:border-blue-800
              text-blue-600 dark:text-blue-400
              text-xs font-semibold px-3 py-2 rounded-xl">
              ✉️ {application.coverLetterUsed}
            </span>
          )}
        </div>
      ) : (
        <p className="text-xs text-gray-400 dark:text-gray-500">
          No documents linked — click Edit to add
        </p>
      )}

    </div>
  )
}

export default DetailDocuments