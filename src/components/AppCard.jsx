// src/components/AppCard.jsx
function AppCard({ application }) {

  // This function picks the right color for each status
  function getStatusStyle(status) {
    if (status === 'Interview') 
      return 'bg-purple-100 text-purple-700'
    if (status === 'Offer')     
      return 'bg-green-100 text-green-700'
    if (status === 'Rejected')  
      return 'bg-red-100 text-red-700'
    return 'bg-blue-100 text-blue-700' // default = Applied
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer">

      <div className="flex justify-between items-start">

        {/* Left side — company info */}
        <div className="flex items-center gap-4">

          {/* Company Logo Circle */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
            {application.company[0]}
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {application.company}
            </h3>
            <p className="text-sm text-gray-400 mt-0.5">
              {application.role}
            </p>
          </div>
        </div>

        {/* Right side — status badge */}
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${getStatusStyle(application.status)}`}>
          {application.status}
        </span>

      </div>

      {/* Bottom — date */}
      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-1">
        <span className="text-xs text-gray-400">📅 Applied:</span>
        <span className="text-xs text-gray-500 font-medium">{application.dateApplied}</span>
      </div>

    </div>
  )
}

export default AppCard