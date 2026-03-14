// src/components/aitools/ResultBox.jsx
function ResultBox({ result, loading, loadingText, onCopy, copied }) {
  if (!result && !loading) return null

  return (
    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
      {loading ? (
        <div className="flex items-center gap-2 text-blue-600 text-sm">
          <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"/>
          {loadingText}
        </div>
      ) : (
        <>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed max-h-72 overflow-y-auto">
            {result}
          </pre>
          <button
            onClick={onCopy}
            className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            {copied ? '✅ Copied!' : '📋 Copy to clipboard'}
          </button>
        </>
      )}
    </div>
  )
}

export default ResultBox