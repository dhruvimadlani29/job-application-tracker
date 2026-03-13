// src/App.jsx
import { useState } from 'react'
import AppCard from './components/AppCard'

function App() {

  // useState stores your list of applications
  // Starting with the 3 fake ones — we will remove these later
  const [applications, setApplications] = useState([
    { id: 1, company: 'Shopify', role: 'Frontend Developer Co-op',
      status: 'Applied', dateApplied: 'Feb 22, 2026' },
    { id: 2, company: 'Klarna', role: 'Backend Developer Co-op',
      status: 'Interview', dateApplied: 'Mar 1, 2026' },
    { id: 3, company: 'TD Bank', role: 'Full Stack Developer Co-op',
      status: 'Applied', dateApplied: 'Feb 28, 2026' },
  ])

  // This controls whether the Add form is visible or hidden
  const [showForm, setShowForm] = useState(false)

  // This stores what the user is typing in the form
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied',
    dateApplied: ''
  })

  // This runs every time user types in any input field
  function handleChange(e) {
    setFormData({
      ...formData,           // keep all existing values
      [e.target.name]: e.target.value  // update only the field that changed
    })
  }

  // This runs when user clicks Save
  function handleSubmit() {

    // Basic check — don't save if company or role is empty
    if (!formData.company || !formData.role) {
      alert('Please fill in Company and Role!')
      return
    }

    // Create a new application object
    const newApp = {
      id: Date.now(),   // Date.now() gives a unique number like 1741836000000
      company: formData.company,
      role: formData.role,
      status: formData.status,
      dateApplied: formData.dateApplied || 'Today'
    }

    // Add it to the list
    setApplications([...applications, newApp])

    // Reset the form back to empty
    setFormData({ company: '', role: '', status: 'Applied', dateApplied: '' })

    // Hide the form
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── TOP HEADER BAR ── */}
      <div className="bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🎯 My Co-op Applications</h1>
          <p className="text-sm text-gray-400 mt-0.5">Track your co-op journey</p>
        </div>

        {/* Add Application Button */}
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          + Add Application
        </button>
      </div>

      {/* ── STATS ROW ── */}
      <div className="px-8 py-6 grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-400 font-medium">Total Applied</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{applications.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-400 font-medium">Interviews</p>
          <p className="text-3xl font-bold text-purple-600 mt-1">
            {applications.filter(a => a.status === 'Interview').length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-400 font-medium">Offers</p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            {applications.filter(a => a.status === 'Offer').length}
          </p>
        </div>
      </div>

      {/* ── ADD APPLICATION FORM (only shows when showForm is true) ── */}
      {showForm && (
        <div className="px-8 mb-6">
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">➕ Add New Application</h2>

            <div className="grid grid-cols-2 gap-4">

              {/* Company Name */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Company Name *
                </label>
                <input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
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
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g. Frontend Developer Co-op"
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
                />
              </div>

              {/* Status Dropdown */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors bg-white"
                >
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>
              </div>

              {/* Date Applied */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Date Applied
                </label>
                <input
                  name="dateApplied"
                  value={formData.dateApplied}
                  onChange={handleChange}
                  type="date"
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
                />
              </div>

            </div>

            {/* Form Buttons */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
              >
                Save Application
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── APPLICATION CARDS LIST ── */}
      <div className="px-8 pb-8 flex flex-col gap-4">
        {applications.map(app => (
          <AppCard key={app.id} application={app} />
        ))}
      </div>

    </div>
  )
}

export default App