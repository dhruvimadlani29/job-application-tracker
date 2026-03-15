// src/components/detail/DetailDocuments.jsx
function DetailDocuments({ application }) {
  const hasDocs = application.resumeUsed || application.coverLetterUsed;

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
        📄 Documents Used
      </p>
      {hasDocs ? (
        <div className="flex gap-2 flex-wrap">
          {application.resumeUsed && (
            <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold px-3 py-2 rounded-xl">
              📄 {application.resumeUsed}
            </span>
          )}
          {application.coverLetterUsed && (
            <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold px-3 py-2 rounded-xl">
              ✉️ {application.coverLetterUsed}
            </span>
          )}
        </div>
      ) : (
        <p className="text-xs text-gray-400">
          No documents linked — click Edit to add
        </p>
      )}
    </div>
  );
}

export default DetailDocuments;
