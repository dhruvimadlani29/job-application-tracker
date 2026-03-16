// src/components/settings/StatusVisibility.jsx

function StatusVisibility({ statuses, setStatuses }) {
  const enabledCount  = statuses.filter(s => s.enabled).length
  const disabledCount = statuses.filter(s => !s.enabled).length

  function toggleStatus(key) {
    const enabledCount = statuses.filter(s => s.enabled).length
    const thisStatus   = statuses.find(s => s.key === key)
    if (thisStatus.enabled && enabledCount === 1) {
      alert('You must keep at least one status enabled!')
      return
    }
    setStatuses(statuses.map(s =>
      s.key === key ? { ...s, enabled: !s.enabled } : s
    ))
  }

  return (
    <div className="px-6 pb-6 border-t border-gray-50">

      {/* Summary row */}
      <div className="flex items-center justify-between py-3 mb-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"/>
            <span className="text-xs font-semibold text-gray-600">{enabledCount} visible</span>
          </div>
          <div className="w-px h-3 bg-gray-200"/>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-300"/>
            <span className="text-xs font-semibold text-gray-400">{disabledCount} hidden</span>
          </div>
        </div>
        <button
          onClick={() => setStatuses(statuses.map(s => ({ ...s, enabled: true })))}
          className="text-xs text-blue-500 hover:text-blue-700 font-semibold"
        >
          Enable All
        </button>
      </div>

      {/* Toggle list */}
      <div className="space-y-2">
        {statuses.map(status => (
          <div
            key={status.key}
            onClick={() => toggleStatus(status.key)}
            className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all
              ${status.enabled
                ? 'border-blue-100 bg-blue-50 hover:border-blue-200'
                : 'border-gray-100 bg-gray-50 hover:border-gray-200 opacity-60'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-5 rounded-full transition-all relative flex-shrink-0
                ${status.enabled ? 'bg-blue-500' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all
                  ${status.enabled ? 'left-4' : 'left-0.5'}`}/>
              </div>
              <span className="text-base">{status.icon}</span>
              <span className={`text-sm font-semibold ${status.enabled ? 'text-gray-800' : 'text-gray-400'}`}>
                {status.label}
              </span>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full
              ${status.enabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400'}`}>
              {status.enabled ? 'Visible' : 'Hidden'}
            </span>
          </div>
        ))}
      </div>

    </div>
  )
}

export default StatusVisibility