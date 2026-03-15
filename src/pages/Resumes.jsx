// src/pages/Resumes.jsx
import { useState, useEffect } from 'react'
import { getCurrentUser } from 'aws-amplify/auth'
import { getUserData, setUserData } from '../utils/storage'

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

function DocumentCard({ doc, type, onEdit, onDelete, onSetDefault }) {
  const icon = type === 'resume' ? '📄' : '✉️'
  return (
    <div className={`bg-white rounded-2xl border-2 p-5 shadow-sm transition-all
      ${doc.isDefault ? 'border-blue-200 shadow-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>

      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
            ${type === 'resume' ? 'bg-red-50 border border-red-100' : 'bg-blue-50 border border-blue-100'}`}>
            <span className="text-xl">{icon}</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-gray-800 text-sm">{doc.name}</h3>
              {doc.isDefault && (
                <span className="text-xs font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                  ⭐ Default
                </span>
              )}
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block
              ${TAG_COLORS[doc.tag] || TAG_COLORS.Other}`}>
              {doc.tag}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => onEdit(doc)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-blue-400 hover:bg-blue-50 transition-all">
            ✏️
          </button>
          <button onClick={() => onDelete(doc.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all">
            🗑
          </button>
        </div>
      </div>

      {doc.description && (
        <p className="text-xs text-gray-500 leading-relaxed mb-3 bg-gray-50 rounded-xl p-3">
          {doc.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <div className="flex items-center gap-3">
          <p className="text-xs text-gray-400">Added {doc.createdAt}</p>
          {doc.usedFor && doc.usedFor.length > 0 && (
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              Used for {doc.usedFor.length} application{doc.usedFor.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        {!doc.isDefault && (
          <button onClick={() => onSetDefault(doc.id)}
            className="text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors">
            Set as Default →
          </button>
        )}
      </div>
    </div>
  )
}

function DocumentModal({ show, onClose, onSubmit, formData, setFormData, editingId, type }) {
  if (!show) return null

  const title = type === 'resume'
    ? (editingId ? '✏️ Edit Resume' : '➕ Add Resume')
    : (editingId ? '✏️ Edit Cover Letter' : '➕ Add Cover Letter')

  const placeholder     = type === 'resume' ? 'e.g. Resume_Frontend_v3'      : 'e.g. CoverLetter_Shopify_v2'
  const descPlaceholder = type === 'resume'
    ? 'e.g. Tailored for frontend roles — highlights React and Tailwind projects.'
    : 'e.g. Written specifically for Shopify — mentions their mission and commerce platform.'

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[480px] mx-4 max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-5">
          <p className="text-base font-bold text-gray-800">{title}</p>
          <button onClick={onClose}
            className="text-gray-300 hover:text-gray-600 text-xl font-bold leading-none">✕</button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Name *</label>
            <input name="name" value={formData.name} onChange={handleChange}
              placeholder={placeholder}
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"/>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Tag / Type</label>
            <select name="tag" value={formData.tag} onChange={handleChange}
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 bg-white transition-colors">
              {TAG_OPTIONS.map(tag => <option key={tag}>{tag}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Description / Notes</label>
            <textarea name="description" value={formData.description} onChange={handleChange}
              placeholder={descPlaceholder} rows={3}
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors resize-none"/>
          </div>

          <div
            onClick={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
              ${formData.isDefault ? 'border-blue-200 bg-blue-50' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}
          >
            <div className={`w-10 h-6 rounded-full transition-all relative flex-shrink-0
              ${formData.isDefault ? 'bg-blue-500' : 'bg-gray-300'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all
                ${formData.isDefault ? 'left-5' : 'left-1'}`}/>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Set as Default</p>
              <p className="text-xs text-gray-400 mt-0.5">Suggested first when adding new applications</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
            {editingId ? 'Save Changes' : `Add ${type === 'resume' ? 'Resume' : 'Cover Letter'}`}
          </button>
          <button onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 rounded-xl text-sm transition-colors">
            Cancel
          </button>
        </div>

      </div>
    </div>
  )
}

function useDocuments(storageKey) {
  const [userId, setUserId] = useState(null)
  const [docs, setDocs]     = useState([])

  useEffect(() => {
    getCurrentUser()
      .then(u => setUserId(u.userId))
      .catch(() => setUserId('guest'))
  }, [])

  useEffect(() => {
    if (!userId) return
    setDocs(getUserData(storageKey, userId, []))
  }, [userId, storageKey])

  useEffect(() => {
    if (!userId) return
    setUserData(storageKey, userId, docs)
  }, [docs, userId])

  const defaultDoc = docs.find(d => d.isDefault)

  function add(formData) {
    const newDoc = {
      id:          Date.now(),
      name:        formData.name,
      tag:         formData.tag,
      description: formData.description,
      isDefault:   formData.isDefault,
      usedFor:     [],
      createdAt:   new Date().toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      }),
    }
    if (formData.isDefault) {
      setDocs(prev => [...prev.map(d => ({ ...d, isDefault: false })), newDoc])
    } else {
      setDocs(prev => [...prev, newDoc])
    }
  }

  function edit(id, formData) {
    setDocs(prev => prev.map(d =>
      d.id === id ? { ...d, ...formData }
        : formData.isDefault ? { ...d, isDefault: false } : d
    ))
  }

  function remove(id) {
    const confirmed = window.confirm('Delete this document?')
    if (confirmed) setDocs(prev => prev.filter(d => d.id !== id))
  }

  function setDefault(id) {
    setDocs(prev => prev.map(d => ({ ...d, isDefault: d.id === id })))
  }

  return { docs, defaultDoc, add, edit, remove, setDefault }
}

function Resumes() {
  const [activeTab, setActiveTab] = useState('resumes')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData]   = useState({
    name: '', tag: 'General', description: '', isDefault: false
  })

  const resumes      = useDocuments('coopResumes')
  const coverLetters = useDocuments('coopCoverLetters')
  const active       = activeTab === 'resumes' ? resumes : coverLetters

  function openAddModal() {
    setEditingId(null)
    setFormData({ name: '', tag: 'General', description: '', isDefault: false })
    setShowModal(true)
  }

  function openEditModal(doc) {
    setEditingId(doc.id)
    setFormData({ name: doc.name, tag: doc.tag, description: doc.description, isDefault: doc.isDefault })
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingId(null)
    setFormData({ name: '', tag: 'General', description: '', isDefault: false })
  }

  function handleSubmit() {
    if (!formData.name.trim()) { alert('Please enter a name!'); return }
    if (editingId) { active.edit(editingId, formData) }
    else           { active.add(formData) }
    closeModal()
  }

  const tabs = [
    { key: 'resumes',      label: '📄 Resumes',       count: resumes.docs.length      },
    { key: 'coverLetters', label: '✉️ Cover Letters',  count: coverLetters.docs.length },
  ]

  return (
    <div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-75 mb-1">Document Manager</p>
            <h2 className="text-lg font-bold mb-1">Track your resumes and cover letters</h2>
            <p className="text-sm opacity-80">
              Always know which resume and cover letter you sent to which company.
            </p>
            <div className="flex gap-3 mt-3 flex-wrap">
              {resumes.defaultDoc && (
                <div className="bg-white/20 rounded-xl px-3 py-1.5 inline-flex items-center gap-2">
                  <span className="text-xs font-bold">📄 Default Resume:</span>
                  <span className="text-xs opacity-90">{resumes.defaultDoc.name}</span>
                </div>
              )}
              {coverLetters.defaultDoc && (
                <div className="bg-white/20 rounded-xl px-3 py-1.5 inline-flex items-center gap-2">
                  <span className="text-xs font-bold">✉️ Default Cover Letter:</span>
                  <span className="text-xs opacity-90">{coverLetters.defaultDoc.name}</span>
                </div>
              )}
            </div>
          </div>
          <button onClick={openAddModal}
            className="flex-shrink-0 ml-4 bg-white/20 hover:bg-white/30 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all border border-white/20 whitespace-nowrap">
            + Add {activeTab === 'resumes' ? 'Resume' : 'Cover Letter'}
          </button>
        </div>
      </div>

      {/* AWS Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 mb-5 flex items-center gap-3">
        <span className="text-lg flex-shrink-0">☁️</span>
        <p className="text-xs text-amber-700">
          <span className="font-bold">PDF uploads coming soon</span> — currently track documents by name and tag.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${activeTab === tab.key
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600'}`}>
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
              ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Cards */}
      {active.docs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-3">{activeTab === 'resumes' ? '📄' : '✉️'}</div>
          <p className="font-semibold text-gray-500">
            No {activeTab === 'resumes' ? 'resumes' : 'cover letters'} yet
          </p>
          <p className="text-sm text-gray-400 mt-1 mb-5">
            Add your first {activeTab === 'resumes' ? 'resume' : 'cover letter'} version to start tracking
          </p>
          <button onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
            + Add {activeTab === 'resumes' ? 'Resume' : 'Cover Letter'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {active.docs.map(doc => (
            <DocumentCard
              key={doc.id} doc={doc}
              type={activeTab === 'resumes' ? 'resume' : 'coverLetter'}
              onEdit={openEditModal}
              onDelete={active.remove}
              onSetDefault={active.setDefault}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <DocumentModal
        show={showModal} onClose={closeModal} onSubmit={handleSubmit}
        formData={formData} setFormData={setFormData}
        editingId={editingId}
        type={activeTab === 'resumes' ? 'resume' : 'coverLetter'}
      />

    </div>
  )
}

export default Resumes