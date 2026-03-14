// src/pages/Resumes.jsx
import { useState, useEffect } from 'react'

const TAG_OPTIONS = ['General', 'Frontend', 'Backend', 'Full Stack', 'Data', 'Cloud', 'Other']
const TAG_COLORS  = {
  General:      'bg-gray-100 text-gray-600',
  Frontend:     'bg-blue-100 text-blue-600',
  Backend:      'bg-purple-100 text-purple-600',
  'Full Stack':  'bg-indigo-100 text-indigo-600',
  Data:         'bg-green-100 text-green-600',
  Cloud:        'bg-sky-100 text-sky-600',
  Other:        'bg-orange-100 text-orange-600',
}

function Resumes() {

  const [resumes, setResumes] = useState(() => {
    const saved = localStorage.getItem('coopResumes')
    return saved ? JSON.parse(saved) : []
  })

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData]   = useState({
    name: '', tag: 'General', description: '', isDefault: false
  })

  useEffect(() => {
    localStorage.setItem('coopResumes', JSON.stringify(resumes))
  }, [resumes])

  function handleChange(e) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  function openAddModal() {
    setEditingId(null)
    setFormData({ name: '', tag: 'General', description: '', isDefault: false })
    setShowModal(true)
  }

  function openEditModal(resume) {
    setEditingId(resume.id)
    setFormData({
      name:        resume.name,
      tag:         resume.tag,
      description: resume.description,
      isDefault:   resume.isDefault
    })
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingId(null)
    setFormData({ name: '', tag: 'General', description: '', isDefault: false })
  }

  function handleSubmit() {
    if (!formData.name.trim()) {
      alert('Please enter a resume name!')
      return
    }

    if (editingId) {
      // Edit mode
      setResumes(resumes.map(r =>
        r.id === editingId
          ? { ...r, ...formData }
          : formData.isDefault ? { ...r, isDefault: false } : r
      ))
    } else {
      // Add mode
      const newResume = {
        id:          Date.now(),
        name:        formData.name,
        tag:         formData.tag,
        description: formData.description,
        isDefault:   formData.isDefault,
        createdAt:   new Date().toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        }),
      }
      if (formData.isDefault) {
        setResumes(prev => [
          ...prev.map(r => ({ ...r, isDefault: false })),
          newResume
        ])
      } else {
        setResumes(prev => [...prev, newResume])
      }
    }

    closeModal()
  }

  function handleDelete(id) {
    const confirmed = window.confirm('Delete this resume version?')
    if (confirmed) setResumes(resumes.filter(r => r.id !== id))
  }

  function handleSetDefault(id) {
    setResumes(resumes.map(r => ({ ...r, isDefault: r.id === id })))
  }

  const defaultResume = resumes.find(r => r.isDefault)

  return (
    <div>

      {/* ── HEADER BANNER ── */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-75 mb-1">
              Resume Manager
            </p>
            <h2 className="text-lg font-bold mb-1">
              Keep track of all your resume versions
            </h2>
            <p className="text-sm opacity-80">
              Different jobs need different resumes. Tag each version and track which one you used.
            </p>
            {defaultResume && (
              <div className="mt-3 bg-white/20 rounded-xl px-3 py-2 inline-flex items-center gap-2">
                <span className="text-xs font-bold">⭐ Default:</span>
                <span className="text-xs">{defaultResume.name}</span>
              </div>
            )}
          </div>
          <button
            onClick={openAddModal}
            className="flex-shrink-0 ml-4 bg-white/20 hover:bg-white/30 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all border border-white/20 whitespace-nowrap"
          >
            + Add Resume
          </button>
        </div>
      </div>

      {/* ── AWS NOTICE ── */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-6 flex items-start gap-3">
        <span className="text-xl flex-shrink-0">☁️</span>
        <div>
          <p className="text-sm font-bold text-amber-700">File Upload Coming in Week 3</p>
          <p className="text-xs text-amber-600 mt-0.5">
            Currently track resume versions by name and tag. Real PDF uploads will be added when we connect AWS S3.
          </p>
        </div>
      </div>

      {/* ── RESUME CARDS ── */}
      {resumes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-3">📄</div>
          <p className="font-semibold text-gray-500">No resume versions yet</p>
          <p className="text-sm text-gray-400 mt-1 mb-5">
            Add your first resume version to start tracking
          </p>
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
          >
            + Add Your First Resume
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {resumes.map(resume => (
            <div
              key={resume.id}
              className={`bg-white rounded-2xl border-2 p-6 shadow-sm transition-all
                ${resume.isDefault
                  ? 'border-blue-200 shadow-blue-50'
                  : 'border-gray-100 hover:border-gray-200'}`}
            >
              {/* Top row */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📄</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-800 text-sm">{resume.name}</h3>
                      {resume.isDefault && (
                        <span className="text-xs font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                          ⭐ Default
                        </span>
                      )}
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${TAG_COLORS[resume.tag] || TAG_COLORS.Other}`}>
                      {resume.tag}
                    </span>
                  </div>
                </div>

                {/* Edit + Delete */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(resume)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-blue-400 hover:bg-blue-50 transition-all"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all"
                  >
                    🗑
                  </button>
                </div>
              </div>

              {/* Description */}
              {resume.description && (
                <p className="text-xs text-gray-500 leading-relaxed mb-3 bg-gray-50 rounded-xl p-3">
                  {resume.description}
                </p>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-400">Added {resume.createdAt}</p>
                {!resume.isDefault && (
                  <button
                    onClick={() => handleSetDefault(resume.id)}
                    className="text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    Set as Default →
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ── MODAL — Add / Edit ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[480px] mx-4 max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-5">
              <p className="text-base font-bold text-gray-800">
                {editingId ? '✏️ Edit Resume Version' : '➕ Add Resume Version'}
              </p>
              <button
                onClick={closeModal}
                className="text-gray-300 hover:text-gray-600 text-xl font-bold leading-none transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-4">

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Resume Name *
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Resume_Frontend_v3"
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Tag / Type
                </label>
                <select
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 bg-white transition-colors"
                >
                  {TAG_OPTIONS.map(tag => (
                    <option key={tag}>{tag}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Description / Notes
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g. Tailored for frontend roles — highlights React and Tailwind. Used for Shopify and Klarna applications."
                  rows={3}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors resize-none"
                />
              </div>

              {/* Default toggle */}
              <div
                onClick={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                  ${formData.isDefault
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}
              >
                <div className={`w-10 h-6 rounded-full transition-all relative flex-shrink-0
                  ${formData.isDefault ? 'bg-blue-500' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all
                    ${formData.isDefault ? 'left-5' : 'left-1'}`}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Set as Default Resume</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Suggested first when adding new applications
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
              >
                {editingId ? 'Save Changes' : 'Add Resume'}
              </button>
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default Resumes