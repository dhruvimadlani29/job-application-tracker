// src/components/settings/BadgeThresholds.jsx
function BadgeThresholds({ thresholds, setThresholds }) {

  function handleChange(e) {
    setThresholds({ ...thresholds, [e.target.name]: Number(e.target.value) })
  }

  return (
    <div className="px-6 pb-6 border-t border-gray-50 dark:border-gray-700">

      {/* Live preview */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mt-4 mb-5">
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">
          Live Preview
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400
              border border-green-200 dark:border-green-800 text-xs font-bold px-3 py-1.5 rounded-full">
              🟢 Just Applied
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              day 0 – {thresholds.justAppliedMax}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400
              border border-yellow-200 dark:border-yellow-800 text-xs font-bold px-3 py-1.5 rounded-full">
              🟡 Follow Up
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              day {thresholds.justAppliedMax + 1} – {thresholds.followUpMax}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400
              border border-slate-200 dark:border-slate-600 text-xs font-bold px-3 py-1.5 rounded-full">
              🌫 Gone Cold
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              day {thresholds.followUpMax + 1}+
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-5">

        {/* Just Applied */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-gray-600 dark:text-gray-300">
              🟢 Just Applied — up to
            </label>
            <span className="text-sm font-bold text-green-600 dark:text-green-400">
              {thresholds.justAppliedMax} days
            </span>
          </div>
          <input type="range" name="justAppliedMax"
            min={1} max={14}
            value={thresholds.justAppliedMax}
            onChange={handleChange}
            className="w-full accent-green-500"
          />
          <div className="flex justify-between text-xs text-gray-300 dark:text-gray-600 mt-0.5">
            <span>1 day</span><span>14 days</span>
          </div>
        </div>

        {/* Follow Up */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-gray-600 dark:text-gray-300">
              🟡 Follow Up — up to
            </label>
            <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
              {thresholds.followUpMax} days
            </span>
          </div>
          <input type="range" name="followUpMax"
            min={thresholds.justAppliedMax + 1} max={60}
            value={thresholds.followUpMax}
            onChange={handleChange}
            className="w-full accent-yellow-500"
          />
          <div className="flex justify-between text-xs text-gray-300 dark:text-gray-600 mt-0.5">
            <span>{thresholds.justAppliedMax + 1} days</span><span>60 days</span>
          </div>
        </div>

        {/* Gone Cold */}
        <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-gray-600 dark:text-gray-300">🌫 Gone Cold</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Auto calculated</p>
            </div>
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
              {thresholds.followUpMax + 1}+ days
            </span>
          </div>
        </div>

      </div>

    </div>
  )
}

export default BadgeThresholds