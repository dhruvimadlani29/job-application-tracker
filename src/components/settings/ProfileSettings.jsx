// src/components/settings/ProfileSettings.jsx
import { useState } from 'react'

function ProfileSettings({ user }) {
  const [formData, setFormData] = useState({
    name:    user?.name || '',
    college: 'Algonquin College',
    program: 'Web Development and Internet Applications',
  })
  const [saved, setSaved] = useState(false)

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputClass = `mt-1 w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3
    text-sm outline-none focus:border-blue-400 transition-colors
    bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
    placeholder:text-gray-400 dark:placeholder:text-gray-500`

  const labelClass = "text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide"

  return (
    <div className="px-6 pb-6 border-t border-gray-50 dark:border-gray-700 pt-4">

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600
          flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
          {formData.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <p className="font-bold text-gray-800 dark:text-gray-100">
            {formData.name || 'Your Name'}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{user?.email || ''}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelClass}>Full Name</label>
          <input name="name" value={formData.name} onChange={handleChange}
            placeholder="Your full name" className={inputClass}/>
        </div>
        <div>
          <label className={labelClass}>Email Address</label>
          <input value={user?.email || ''} disabled
            className="mt-1 w-full border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3
              text-sm bg-gray-50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 cursor-not-allowed"/>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Email cannot be changed here
          </p>
        </div>
        <div>
          <label className={labelClass}>College</label>
          <input name="college" value={formData.college} onChange={handleChange}
            className={inputClass}/>
        </div>
        <div>
          <label className={labelClass}>Program</label>
          <input name="program" value={formData.program} onChange={handleChange}
            className={inputClass}/>
        </div>

        <button onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold
            py-3 rounded-xl text-sm transition-colors">
          {saved ? '✅ Saved!' : 'Save Profile'}
        </button>
      </div>

    </div>
  )
}

export default ProfileSettings