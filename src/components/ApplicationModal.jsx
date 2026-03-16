// src/components/ApplicationModal.jsx
import { useState, useEffect } from 'react'
import { getCurrentUser } from 'aws-amplify/auth'
import { getUserData } from '../utils/storage'

function ApplicationModal({ show, onClose, onSubmit, editingApp, statuses, userId }) {

  const [availableResumes, setAvailableResumes]           = useState([])
  const [availableCoverLetters, setAvailableCoverLetters] = useState([])

  useEffect(() => {
    getCurrentUser()
      .then(u => {
        setAvailableResumes(getUserData('coopResumes', u.userId, []))
        setAvailableCoverLetters(getUserData('coopCoverLetters', u.userId, []))
      })
      .catch(() => {})
  }, [show])

  const defaultResume      = availableResumes.find(r => r.isDefault)
  const defaultCoverLetter = availableCoverLetters.find(c => c.isDefault)

  const emptyForm = {
    company:           '',
    role:              '',
    status:            statuses?.filter(s => s.enabled)[0]?.key || 'Applied',
    dateApplied:       '',
    notes:             '',
    resumeUsed:        defaultResume?.name      || '',
    coverLetterUsed:   defaultCoverLetter?.name || '',
    jobUrl:            '',
    deadline:          '',
    interviewDate:     '',
    interviewTime:     '',
    recruiterName:     '',
    recruiterEmail:    '',
    recruiterLinkedIn: '',
  }

  const [formData, setFormData]   = useState(emptyForm)
  const [activeTab, setActiveTab] = useState('basic')

  useEffect(() => {
    if (show) {
      setActiveTab('basic')
      setFormData(editingApp ? {
        company:           editingApp.company           || '',
        role:              editingApp.role              || '',
        status:            editingApp.status            || '',
        dateApplied:       editingApp.dateApplied       || '',
        notes:             editingApp.notes             || '',
        resumeUsed:        editingApp.resumeUsed        || '',
        coverLetterUsed:   editingApp.coverLetterUsed   || '',
        jobUrl:            editingApp.jobUrl            || '',
        deadline:          editingApp.deadline          || '',
        interviewDate:     editingApp.interviewDate     || '',
        interviewTime:     editingApp.interviewTime     || '',
        recruiterName:     editingApp.recruiterName     || '',
        recruiterEmail:    editingApp.recruiterEmail    || '',
        recruiterLinkedIn: editingApp.recruiterLinkedIn || '',
      } : emptyForm)
    }
  }, [show, editingApp])

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function handleSubmit() {
    if (!formData.company.trim() || !formData.role.trim()) {
      alert('Please fill in Company Name and Job Title!')
      return
    }
    onSubmit(formData)
  }

  if (!show) return null

  const enabledStatuses = statuses?.filter(s => s.enabled) || []

  const tabs = [
    { key: 'basic',    label: '📋 Basic'     },
    { key: 'docs',     label: '📄 Documents' },
    { key: 'schedule', label: '📅 Schedule'  },
    { key: 'contact',  label: '👤 Contact'   },
  ]

  // ── Shared input class ──
  const inputClass = `mt-1 w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3
    text-sm outline-none focus:border-blue-400 transition-colors
    bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
    placeholder:text-gray-400 dark:placeholder:text-gray-500`

  const labelClass = "text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl
        w-full max-w-[680px] max-h-[90vh] overflow-y-auto
        max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0
        max-sm:rounded-b-none max-sm:max-h-[95vh]">

        {/* Header */}
        <div className="flex justify-between items-center px-7 py-5
          border-b border-gray-100 dark:border-gray-700
          sticky top-0 bg-white dark:bg-gray-800 rounded-t-2xl z-10">
          <div>
            <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
              {editingApp ? '✏️ Edit Application' : '➕ Add New Application'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {editingApp ? 'Update the details for this application' : 'Fill in the details for your new co-op application'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center
              text-gray-300 hover:text-gray-600 dark:hover:text-gray-200
              hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-7 pt-4 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all
                ${activeTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="px-7 py-5">

          {/* ── BASIC TAB ── */}
          {activeTab === 'basic' && (
            <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
              <div>
                <label className={labelClass}>Company Name *</label>
                <input name="company" value={formData.company} onChange={handleChange}
                  placeholder="e.g. Shopify" className={inputClass}/>
              </div>
              <div>
                <label className={labelClass}>Job Title *</label>
                <input name="role" value={formData.role} onChange={handleChange}
                  placeholder="e.g. Frontend Developer Co-op" className={inputClass}/>
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}
                  className={inputClass}>
                  {enabledStatuses.map(s => <option key={s.key}>{s.key}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Date Applied</label>
                <input name="dateApplied" value={formData.dateApplied} onChange={handleChange}
                  type="date" className={inputClass}/>
              </div>
              <div className="col-span-2 max-sm:col-span-1">
                <label className={labelClass}>Job Posting URL</label>
                <input name="jobUrl" value={formData.jobUrl} onChange={handleChange}
                  placeholder="e.g. https://shopify.com/careers/..." className={inputClass}/>
              </div>
              <div className="col-span-2 max-sm:col-span-1">
                <label className={labelClass}>Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange}
                  placeholder="e.g. Referral from John, coding test required..."
                  rows={3} className={`${inputClass} resize-none`}/>
              </div>
            </div>
          )}

          {/* ── DOCUMENTS TAB ── */}
          {activeTab === 'docs' && (
            <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
              <div>
                <label className={labelClass}>Resume Used</label>
                <select name="resumeUsed" value={formData.resumeUsed} onChange={handleChange}
                  className={inputClass}>
                  <option value="">— None selected —</option>
                  {availableResumes.map(r => (
                    <option key={r.id} value={r.name}>{r.name}{r.isDefault ? ' ⭐' : ''}</option>
                  ))}
                </select>
                {availableResumes.length === 0 && (
                  <p className="text-xs text-gray-400 mt-1">No resumes yet — add them in the Resumes page</p>
                )}
              </div>
              <div>
                <label className={labelClass}>Cover Letter Used</label>
                <select name="coverLetterUsed" value={formData.coverLetterUsed} onChange={handleChange}
                  className={inputClass}>
                  <option value="">— None selected —</option>
                  {availableCoverLetters.map(c => (
                    <option key={c.id} value={c.name}>{c.name}{c.isDefault ? ' ⭐' : ''}</option>
                  ))}
                </select>
                {availableCoverLetters.length === 0 && (
                  <p className="text-xs text-gray-400 mt-1">No cover letters yet — add them in the Resumes page</p>
                )}
              </div>

              {(formData.resumeUsed || formData.coverLetterUsed) && (
                <div className="col-span-2 max-sm:col-span-1 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">📎 Documents attached</p>
                  <div className="flex gap-2 flex-wrap">
                    {formData.resumeUsed && (
                      <span className="bg-white dark:bg-gray-700 border border-red-100 dark:border-red-800
                        text-red-600 dark:text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                        📄 {formData.resumeUsed}
                      </span>
                    )}
                    {formData.coverLetterUsed && (
                      <span className="bg-white dark:bg-gray-700 border border-blue-100 dark:border-blue-800
                        text-blue-600 dark:text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                        ✉️ {formData.coverLetterUsed}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── SCHEDULE TAB ── */}
          {activeTab === 'schedule' && (
            <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
              <div className="col-span-2 max-sm:col-span-1">
                <label className={labelClass}>Application Deadline</label>
                <input name="deadline" value={formData.deadline} onChange={handleChange}
                  type="date" className={inputClass}/>
                {formData.deadline && (
                  <p className="text-xs mt-1 font-semibold">
                    {(() => {
                      const deadline = new Date(`${formData.deadline}T12:00:00`)
                      const today    = new Date(); today.setHours(12,0,0,0)
                      const days     = Math.ceil((deadline - today) / (1000*60*60*24))
                      if (days < 0)  return <span className="text-red-500">❌ Deadline passed {Math.abs(days)} day{Math.abs(days)>1?'s':''} ago</span>
                      if (days === 0) return <span className="text-red-500">🚨 Deadline is TODAY!</span>
                      if (days <= 3)  return <span className="text-orange-500">⚠️ {days} day{days>1?'s':''} left!</span>
                      return <span className="text-green-600">✅ {days} days until deadline</span>
                    })()}
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>Interview Date</label>
                <input name="interviewDate" value={formData.interviewDate} onChange={handleChange}
                  type="date" className={inputClass}/>
              </div>
              <div>
                <label className={labelClass}>Interview Time</label>
                <input name="interviewTime" value={formData.interviewTime} onChange={handleChange}
                  type="time" className={inputClass}/>
              </div>

              {formData.interviewDate && (
                <div className="col-span-2 max-sm:col-span-1 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
                  <p className="text-xs font-bold text-orange-600 dark:text-orange-400 mb-1">🎤 Interview Countdown</p>
                  <p className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                    {(() => {
                      const interview = new Date(`${formData.interviewDate}T${formData.interviewTime || '09:00'}`)
                      const now       = new Date()
                      const diff      = interview - now
                      if (diff < 0) return 'Interview has passed'
                      const days    = Math.floor(diff / (1000*60*60*24))
                      const hours   = Math.floor((diff % (1000*60*60*24)) / (1000*60*60))
                      const minutes = Math.floor((diff % (1000*60*60)) / (1000*60))
                      if (days > 0)  return `${days} day${days>1?'s':''} and ${hours} hour${hours>1?'s':''} away`
                      if (hours > 0) return `${hours} hour${hours>1?'s':''} and ${minutes} min away — prepare now!`
                      return `${minutes} minute${minutes>1?'s':''} away — you've got this! 🚀`
                    })()}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── CONTACT TAB ── */}
          {activeTab === 'contact' && (
            <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
              <div className="col-span-2 max-sm:col-span-1">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-2">
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">👤 Why track recruiter contacts?</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Having the recruiter's direct contact lets you follow up personally and build a real connection.
                  </p>
                </div>
              </div>
              <div>
                <label className={labelClass}>Recruiter Name</label>
                <input name="recruiterName" value={formData.recruiterName} onChange={handleChange}
                  placeholder="e.g. Sarah Johnson" className={inputClass}/>
              </div>
              <div>
                <label className={labelClass}>Recruiter Email</label>
                <input name="recruiterEmail" value={formData.recruiterEmail} onChange={handleChange}
                  placeholder="e.g. sarah@shopify.com" type="email" className={inputClass}/>
              </div>
              <div className="col-span-2 max-sm:col-span-1">
                <label className={labelClass}>LinkedIn Profile URL</label>
                <input name="recruiterLinkedIn" value={formData.recruiterLinkedIn} onChange={handleChange}
                  placeholder="e.g. https://linkedin.com/in/sarahjohnson" className={inputClass}/>
              </div>

              {(formData.recruiterName || formData.recruiterEmail) && (
                <div className="col-span-2 max-sm:col-span-1 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">Contact Summary</p>
                  {formData.recruiterName  && <p className="text-sm text-gray-700 dark:text-gray-300">👤 {formData.recruiterName}</p>}
                  {formData.recruiterEmail && <p className="text-sm text-gray-700 dark:text-gray-300">📧 {formData.recruiterEmail}</p>}
                  {formData.recruiterLinkedIn && (
                    <a href={formData.recruiterLinkedIn} target="_blank" rel="noreferrer"
                      className="text-sm text-blue-500 hover:underline">🔗 View LinkedIn</a>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex gap-3 px-7 py-5 border-t border-gray-100 dark:border-gray-700">
          <button onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
            {editingApp ? 'Save Changes' : 'Add Application'}
          </button>
          <button onClick={onClose}
            className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
              text-gray-600 dark:text-gray-300 font-semibold py-3 rounded-xl text-sm transition-colors">
            Cancel
          </button>
        </div>

      </div>
    </div>
  )
}

export default ApplicationModal