// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react'
import AppCard from '../components/AppCard'

function Dashboard() {

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('coopApplications')
    return saved ? JSON.parse(saved) : [
      { id: 1, company: 'Shopify', role: 'Frontend Developer Co-op',
        status: 'Applied', dateApplied: 'Feb 22, 2026' },
      { id: 2, company: 'Klarna', role: 'Backend Developer Co-op',
        status: 'Interview', dateApplied: 'Mar 1, 2026' },
      { id: 3, company: 'TD Bank', role: 'Full Stack Developer Co-op',
        status: 'Applied', dateApplied: 'Feb 28, 2026' },
    ]
  })

  const [showForm, setShowForm]     = useState(false)
  const [editingId, setEditingId]   = useState(null)  // tracks which app is being edited
  const [formData, setFormData]     = useState({
    company: '', role: '', status: 'Applied', dateApplied: ''
  })

  useEffect(() => {
    localStorage.setItem('coopApplications', JSON.stringify(applications))
  }, [applications])

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Opens a blank form for adding
  function handleAddNew() {
    setEditingId(null)
    setFormData({ company: '', role: '', status: 'Applied', dateApplied: '' })
    setShowForm(true)
  }

  // Opens form pre-filled with existing application data
 function handleEdit(id, formData) {
  setApplications(applications.map(app =>
    app.id === id
      ? { ...app, ...formData }
      : app
  ))
}

  function handleSubmit() {
    if (!formData.company || !formData.role) {
      alert('Please fill in Company and Role!')
      return
    }

    if (editingId) {
      // EDIT MODE — update the existing application
      setApplications(applications.map(app =>
        app.id === editingId
          ? { ...app, ...formData }  // merge new formData into existing app
          : app                       // leave others unchanged
      ))
    } else {
      // ADD MODE — create a brand new application
      const newApp = {
        id: Date.now(),
        company:     formData.company,
        role:        formData.role,
        status:      formData.status,
        dateApplied: formData.dateApplied || 'Today'
      }
      setApplications([...applications, newApp])
    }

    // Reset everything
    setFormData({ company: '', role: '', status: 'Applied', dateApplied: '' })
    setEditingId(null)
    setShowForm(false)
  }

  function handleDelete(id) {
    setApplications(applications.filter(app => app.id !== id))
  }

  function handleCancel() {
    setShowForm(false)
    setEditingId(null)
    setFormData({ company: '', role: '', status: 'Applied', dateApplied: '' })
  }

  const totalApplied   = applications.length
  const totalInterview = applications.filter(a => a.status === 'Interview').length
  const totalOffer     = applications.filter(a => a.status === 'Offer').length
  const totalRejected  = applications.filter(a => a.status === 'Rejected').length

  return (
    <div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label:'Total Applied',  value: totalApplied,   color:'text-blue-600'   },
          { label:'Interviews',     value: totalInterview, color:'text-purple-600' },
          { label:'Offers',         value: totalOffer,     color:'text-green-600'  },
          { label:'Rejected',       value: totalRejected,  color:'text-red-400'    },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl transition-colors text-sm"
        >
          + Add Application
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 mb-6">

          {/* Form title changes based on mode */}
          <h2 className="text-base font-bold text-gray-800 mb-4">
            {editingId ? '✏️ Edit Application' : '➕ New Application'}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Company Name *</label>
              <input
                name="company" value={formData.company} onChange={handleChange}
                placeholder="e.g. Shopify"
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Job Title *</label>
              <input
                name="role" value={formData.role} onChange={handleChange}
                placeholder="e.g. Frontend Developer Co-op"
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Status</label>
              <select
                name="status" value={formData.status} onChange={handleChange}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 bg-white transition-colors"
              >
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Date Applied</label>
              <input
                name="dateApplied" value={formData.dateApplied} onChange={handleChange}
                type="date"
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
              {editingId ? 'Save Changes' : 'Save Application'}
            </button>
            <button onClick={handleCancel}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
              Cancel
            </button>
          </div>

        </div>
      )}

      {/* Application Cards */}
      <div className="flex flex-col gap-4">
        {applications.map(app => (
          <AppCard
            key={app.id}
            application={app}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>

    </div>
  )
}

export default Dashboard