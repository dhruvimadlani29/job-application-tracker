// src/pages/Settings.jsx
function Settings() {
  return (
    <div>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm max-w-lg">
        <h3 className="font-bold text-gray-800 mb-4">Profile Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Full Name
            </label>
            <input
              defaultValue="Dhruvi Madlani"
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              College
            </label>
            <input
              defaultValue="Algonquin College"
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Program
            </label>
            <input
              defaultValue="Web Development and Internet Applications"
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings