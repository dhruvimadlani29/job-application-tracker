// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react'
import { getCurrentUser } from 'aws-amplify/auth'
import AppCard from '../components/AppCard'
import WeeklySummary from '../components/WeeklySummary'
import ApplicationModal from '../components/ApplicationModal'
import NotificationBanner from '../components/NotificationBanner'
import { exportApplicationsPDF } from '../utils/exportPDF'
import { getUserData, setUserData } from '../utils/storage'

function Dashboard({ statuses, thresholds }) {

  const [userId, setUserId]             = useState(null)
  const [applications, setApplications] = useState([])
  const [showModal, setShowModal]       = useState(false)
  const [editingApp, setEditingApp]     = useState(null)
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchQuery, setSearchQuery]   = useState('')

  // ── Get current user ID ──
  useEffect(() => {
    getCurrentUser()
      .then(u => setUserId(u.userId))
      .catch(() => setUserId('guest'))
  }, [])

  // ── Load applications when userId ready ──
  useEffect(() => {
    if (!userId) return
    const saved = getUserData('coopApplications', userId, [])
    setApplications(saved)
  }, [userId])

  // ── Save applications whenever they change ──
  useEffect(() => {
    if (!userId) return
    setUserData('coopApplications', userId, applications)
  }, [applications, userId])

  // ── Color map ──
  const colorMap = {
    'Applied':           { color: 'text-blue-500',   bg: 'bg-white dark:bg-gray-800', border: 'border-blue-200',   dot: 'bg-blue-500'   },
    'Under Review':      { color: 'text-sky-600',    bg: 'bg-white dark:bg-gray-800', border: 'border-sky-200',    dot: 'bg-sky-600'    },
    'Phone Screen':      { color: 'text-purple-600', bg: 'bg-white dark:bg-gray-800', border: 'border-purple-200', dot: 'bg-purple-600' },
    'Technical Test':    { color: 'text-amber-600',  bg: 'bg-white dark:bg-gray-800', border: 'border-amber-200',  dot: 'bg-amber-600'  },
    'Interview':         { color: 'text-orange-600', bg: 'bg-white dark:bg-gray-800', border: 'border-orange-200', dot: 'bg-orange-600' },
    'Awaiting Decision': { color: 'text-indigo-600', bg: 'bg-white dark:bg-gray-800', border: 'border-indigo-200', dot: 'bg-indigo-600' },
    'Follow-Up Sent':    { color: 'text-cyan-600',   bg: 'bg-white dark:bg-gray-800', border: 'border-cyan-200',   dot: 'bg-cyan-600'   },
    'Offer Received':    { color: 'text-green-600',  bg: 'bg-white dark:bg-gray-800', border: 'border-green-200',  dot: 'bg-green-600'  },
    'Rejected':          { color: 'text-red-500',    bg: 'bg-white dark:bg-gray-800', border: 'border-red-200',    dot: 'bg-red-500'    },
    'Ghosted':           { color: 'text-gray-400',   bg: 'bg-white dark:bg-gray-800', border: 'border-gray-200',   dot: 'bg-gray-400'   },
  }

  const enabledStatuses = statuses?.filter(s => s.enabled).map(s => s.key) || []

  const statBoxes = [
    { label: 'Total', key: 'All', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/30', border: 'border-blue-200', dot: 'bg-blue-600' },
    ...enabledStatuses.map(status => ({
      label: status, key: status,
      ...(colorMap[status] || { color: 'text-gray-600', bg: 'bg-white dark:bg-gray-800', border: 'border-gray-200', dot: 'bg-gray-600' })
    }))
  ]

  const counts = {
    All: applications.length,
    ...enabledStatuses.reduce((acc, status) => {
      acc[status] = applications.filter(a => a.status === status).length
      return acc
    }, {})
  }

  // ── Filtered list ──
  const filteredApplications = applications
    .filter(app => filterStatus === 'All' || app.status === filterStatus)
    .filter(app => app.company.toLowerCase().includes(searchQuery.toLowerCase()))

  // ── Handlers ──
  function handleAddNew() {
    setEditingApp(null)
    setShowModal(true)
  }

  function handleEditOpen(application) {
    setEditingApp(application)
    setShowModal(true)
  }

  function handleModalSubmit(formData) {
    if (editingApp) {
      setApplications(applications.map(app =>
        app.id === editingApp.id ? { ...app, ...formData } : app
      ))
    } else {
      setApplications([...applications, {
        id:                Date.now(),
        company:           formData.company,
        role:              formData.role,
        status:            formData.status,
        dateApplied:       formData.dateApplied       || 'Today',
        notes:             formData.notes             || '',
        resumeUsed:        formData.resumeUsed        || '',
        coverLetterUsed:   formData.coverLetterUsed   || '',
        jobUrl:            formData.jobUrl            || '',
        deadline:          formData.deadline          || '',
        interviewDate:     formData.interviewDate     || '',
        interviewTime:     formData.interviewTime     || '',
        recruiterName:     formData.recruiterName     || '',
        recruiterEmail:    formData.recruiterEmail    || '',
        recruiterLinkedIn: formData.recruiterLinkedIn || '',
      }])
    }
    setShowModal(false)
    setEditingApp(null)
  }

  function handleDelete(id) {
    setApplications(applications.filter(app => app.id !== id))
  }

  function handleEdit(id, formData) {
    setApplications(applications.map(app =>
      app.id === id ? { ...app, ...formData } : app
    ))
  }

  return (
    <div>

      {/* ── AI WEEKLY SUMMARY ── */}
      <WeeklySummary applications={applications} />

      {/* ── NOTIFICATION BANNER ── */}
      <NotificationBanner applications={applications} />

      {/* ── STAT BOXES ── */}
      <div className="grid grid-cols-3 gap-3 mb-8 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11">
        {statBoxes.map(stat => {
          const isActive = filterStatus === stat.key
          return (
            <div
              key={stat.key}
              onClick={() => setFilterStatus(filterStatus === stat.key ? 'All' : stat.key)}
              className={`rounded-2xl p-4 border-2 cursor-pointer transition-all duration-150
                hover:shadow-md hover:-translate-y-0.5
                ${isActive
                  ? `${stat.bg} ${stat.border} shadow-sm`
                  : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-gray-200'}`}
            >
              <p className="text-xs text-gray-400 font-semibold truncate">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{counts[stat.key] ?? 0}</p>
              {isActive && <div className={`w-1.5 h-1.5 rounded-full mt-2 ${stat.dot}`}/>}
            </div>
          )
        })}
      </div>

      {/* ── FILTER + SEARCH + EXPORT + ADD ── */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          {filterStatus !== 'All' ? (
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 rounded-xl px-3 py-1.5">
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                Filtering: {filterStatus}
              </span>
              <button
                onClick={() => setFilterStatus('All')}
                className="text-blue-400 hover:text-blue-700 font-bold text-sm leading-none"
              >
                ✕
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Showing all {counts.All} applications
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="text"
            placeholder="🔍  Search company..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-sm
              outline-none focus:border-blue-400 transition-colors
              bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
              placeholder:text-gray-400 dark:placeholder:text-gray-500 w-44"
          />
          <button
            onClick={() => exportApplicationsPDF(applications)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2
              rounded-xl transition-colors text-sm whitespace-nowrap"
          >
            📥 Export PDF
          </button>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2
              rounded-xl transition-colors text-sm whitespace-nowrap"
          >
            + Add Application
          </button>
        </div>
      </div>

      {/* ── APPLICATION CARDS ── */}
      <div className="flex flex-col gap-4">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500">
            <div className="text-5xl mb-3">🔍</div>
            <p className="font-semibold text-gray-500 dark:text-gray-400">No applications found</p>
            <p className="text-sm mt-1">
              {filterStatus !== 'All'
                ? `No applications with status "${filterStatus}"`
                : 'Add your first application using the button above'}
            </p>
            {filterStatus !== 'All' && (
              <button
                onClick={() => setFilterStatus('All')}
                className="mt-4 text-xs font-semibold text-blue-500 hover:text-blue-700 underline"
              >
                Clear filter
              </button>
            )}
          </div>
        ) : filteredApplications.map(app => (
          <AppCard
            key={app.id}
            application={app}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onEditOpen={handleEditOpen}
            enabledStatuses={enabledStatuses}
          />
        ))}
      </div>

      {/* ── APPLICATION MODAL ── */}
      <ApplicationModal
        show={showModal}
        onClose={() => { setShowModal(false); setEditingApp(null) }}
        onSubmit={handleModalSubmit}
        editingApp={editingApp}
        statuses={statuses}
        userId={userId}
      />

    </div>
  )
}

export default Dashboard