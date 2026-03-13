// src/pages/Analytics.jsx
function Analytics({ applications }) {

  const totalApplied   = applications.length
  const totalInterview = applications.filter(a => a.status === 'Interview').length
  const totalOffer     = applications.filter(a => a.status === 'Offer').length
  const totalRejected  = applications.filter(a => a.status === 'Rejected').length

  const stats = [
    { label:'Applied',   count: totalApplied - totalInterview - totalOffer - totalRejected, color:'bg-blue-400'   },
    { label:'Interview', count: totalInterview, color:'bg-purple-400' },
    { label:'Offer',     count: totalOffer,     color:'bg-green-400'  },
    { label:'Rejected',  count: totalRejected,  color:'bg-red-400'    },
  ]

  return (
    <div>
      <p className="text-sm text-gray-400 mb-6">
        Your co-op application statistics at a glance.
      </p>
      <div className="grid grid-cols-2 gap-4">

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4">Applications by Status</h3>
          {stats.map(item => (
            <div key={item.label} className="flex items-center gap-3 mb-3">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${item.color}`}/>
              <span className="text-sm text-gray-600 w-20">{item.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${item.color}`}
                  style={{ width: totalApplied > 0 ? `${(item.count / totalApplied) * 100}%` : '0%' }}
                />
              </div>
              <span className="text-sm font-bold text-gray-700 w-4">{item.count}</span>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            {[
              { label:'Total Applications', value: totalApplied, color:'text-gray-800' },
              { label:'Interview Rate',
                value: totalApplied > 0 ? `${Math.round((totalInterview/totalApplied)*100)}%` : '0%',
                color:'text-purple-600' },
              { label:'Offer Rate',
                value: totalApplied > 0 ? `${Math.round((totalOffer/totalApplied)*100)}%` : '0%',
                color:'text-green-600' },
              { label:'Active Applications', value: totalApplied - totalRejected, color:'text-blue-600' },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-500">{item.label}</span>
                <span className={`font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Analytics