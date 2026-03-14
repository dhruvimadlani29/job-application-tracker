// src/components/ApplicationModal.jsx
import { useState, useEffect } from 'react'

function ApplicationModal({ show, onClose, onSubmit, editingApp, statuses }) {

  const availableResumes      = JSON.parse(localStorage.getItem('coopResumes') || '[]')
  const availableCoverLetters = JSON.parse(localStorage.getItem('coopCoverLetters') || '[]')

  const defaultResume      = availableResumes.find(r => r.isDefault)
  const defaultCoverLetter = availableCoverLetters.find(c => c.isDefault)

  const emptyForm = {
    company:         '',
    role:            '',
    status:          statuses?.filter(s => s.enabled)[0]?.key || 'Applied',
    dateApplied:     '',
    notes:           '',
    resumeUsed:      defaultResume?.name      || '',
    coverLetterUsed: defaultCoverLetter?.name || '',
  }

  const [formData, setFormData] = useState(emptyForm)

  // When modal opens — fill with existing data (edit) or empty (add)
  useEffect(() => {
    if (show) {
      setFormData(editingApp ? {
        company:         editingApp.company,
        role:            editingApp.role,
        status:          editingApp.status,
        dateApplied:     editingApp.dateApplied,
        notes:           editingApp.notes           || '',
        resumeUsed:      editingApp.resumeUsed      || '',
        coverLetterUsed: editingApp.coverLetterUsed || '',
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-[680px] mx-4">

        {/* ── MODAL HEADER ── */}
        <div className="flex justify-between items-center px-7 py-5 border-b border-gray-100">
          <div>
            <p className="text-lg font-bold text-gray-800">
              {editingApp ? '✏️ Edit Application' : '➕ Add New Application'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {editingApp
                ? 'Update the details for this application'
                : 'Fill in the details for your new co-op application'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-all text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* ── MODAL BODY ── */}
        <div className="px-7 py-6">
          <div className="grid grid-cols-2 gap-4">

            {/* Company Name */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Company Name *
              </label>
              <input
                name="company" value={formData.company} onChange={handleChange}
                placeholder="e.g. Shopify"
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
              />
            </div>

            {/* Job Title */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Job Title *
              </label>
              <input
                name="role" value={formData.role} onChange={handleChange}
                placeholder="e.g. Frontend Developer Co-op"
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
              />
            </div>

            {/* Status */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Status
              </label>
              <select
                name="status" value={formData.status} onChange={handleChange}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 bg-white transition-colors"
              >
                {enabledStatuses.map(s => (
                  <option key={s.key}>{s.key}</option>
                ))}
              </select>
            </div>

            {/* Date Applied */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Date Applied
              </label>
              <input
                name="dateApplied" value={formData.dateApplied} onChange={handleChange}
                type="date"
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
              />
            </div>

            {/* Resume Used */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Resume Used
              </label>
              <select
                name="resumeUsed" value={formData.resumeUsed} onChange={handleChange}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 bg-white transition-colors"
              >
                <option value="">— None selected —</option>
                {availableResumes.map(r => (
                  <option key={r.id} value={r.name}>
                    {r.name}{r.isDefault ? ' ⭐' : ''}
                  </option>
                ))}
              </select>
              {availableResumes.length === 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  No resumes yet — add them in the Resumes page
                </p>
              )}
            </div>

            {/* Cover Letter Used */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Cover Letter Used
              </label>
              <select
                name="coverLetterUsed" value={formData.coverLetterUsed} onChange={handleChange}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 bg-white transition-colors"
              >
                <option value="">— None selected —</option>
                {availableCoverLetters.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.name}{c.isDefault ? ' ⭐' : ''}
                  </option>
                ))}
              </select>
              {availableCoverLetters.length === 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  No cover letters yet — add them in the Resumes page
                </p>
              )}
            </div>

            {/* Notes — full width */}
            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Notes
              </label>
              <textarea
                name="notes" value={formData.notes} onChange={handleChange}
                placeholder="e.g. Referral from John, HR contact is Sarah, coding test required..."
                rows={3}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors resize-none"
              />
            </div>

          </div>
        </div>

        {/* ── MODAL FOOTER ── */}
        <div className="flex gap-3 px-7 py-5 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            {editingApp ? 'Save Changes' : 'Add Application'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  )
}

export default ApplicationModal