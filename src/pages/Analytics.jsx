// src/pages/Analytics.jsx
import { useState, useEffect } from 'react'

function Analytics() {

  // Read applications directly from localStorage
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('coopApplications')
    return saved ? JSON.parse(saved) : []
  })

  // Recalculate counts
  const totalApplied   = applications.length
  const totalInterview = applications.filter(a => a.status === 'Interview').length
  const totalOffer     = applications.filter(a => a.status === 'Offer Received').length
  const totalRejected  = applications.filter(a => a.status === 'Rejected').length
  const totalGhosted   = applications.filter(a => a.status === 'Ghosted').length
  const totalActive    = applications.filter(a =>
    !['Rejected', 'Ghosted'].includes(a.status)
  ).length

  const stats = [
    { label: 'Applied',   count: applications.filter(a => a.status === 'Applied').length,           color: 'bg-blue-400'   },
    { label: 'Interview', count: totalInterview,                                                     color: 'bg-orange-400' },
    { label: 'Offer',     count: totalOffer,                                                         color: 'bg-green-400'  },
    { label: 'Rejected',  count: totalRejected,                                                      color: 'bg-red-400'    },
    { label: 'Ghosted',   count: totalGhosted,                                                       color: 'bg-gray-400'   },
  ]

  return (
    <div>
      <p className="text-sm text-gray-400 mb-6">
        Your co-op application statistics at a glance.
      </p>

      {/* Quick stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Applications', value: totalApplied,   color: 'text-blue-600'   },
          { label: 'Active Applications', value: totalActive,   color: 'text-green-600'  },
          { label: 'Interview Rate',
            value: totalApplied > 0 ? `${Math.round((totalInterview / totalApplied) * 100)}%` : '0%',
            color: 'text-purple-600' },
          { label: 'Offer Rate',
            value: totalApplied > 0 ? `${Math.round((totalOffer / totalApplied) * 100)}%` : '0%',
            color: 'text-green-600' },
          { label: 'Rejection Rate',
            value: totalApplied > 0 ? `${Math.round((totalRejected / totalApplied) * 100)}%` : '0%',
            color: 'text-red-500' },
          { label: 'Ghosted',
            value: totalGhosted,
            color: 'text-gray-500' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4">Applications by Status</h3>
          {totalApplied === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              No applications yet — add some from the Dashboard!
            </p>
          ) : (
            stats.map(item => (
              <div key={item.label} className="flex items-center gap-3 mb-3">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${item.color}`}/>
                <span className="text-sm text-gray-600 w-20">{item.label}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${item.color}`}
                    style={{ width: `${(item.count / totalApplied) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-700 w-4">{item.count}</span>
              </div>
            ))
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4">Conversion Funnel</h3>
          {totalApplied === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              No applications yet — add some from the Dashboard!
            </p>
          ) : (
            <div className="space-y-3">
              {[
                { label: 'Applied → Phone Screen',
                  value: applications.filter(a => a.status === 'Phone Screen').length,
                  color: 'text-purple-600' },
                { label: 'Applied → Interview',
                  value: totalInterview,
                  color: 'text-orange-600' },
                { label: 'Applied → Offer',
                  value: totalOffer,
                  color: 'text-green-600' },
                { label: 'No Response (Cold)',
                  value: applications.filter(a => ['Ghosted'].includes(a.status)).length,
                  color: 'text-gray-500' },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-500">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${item.color}`}>{item.value}</span>
                    <span className="text-xs text-gray-400">
                      ({totalApplied > 0 ? Math.round((item.value / totalApplied) * 100) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Analytics