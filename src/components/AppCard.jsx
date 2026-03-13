// src/components/AppCard.jsx
// This component receives 'application' data as a prop
// and displays it as a card on the dashboard

function AppCard({ application }) {
  return (
    <div className='bg-white rounded-xl shadow p-5 border border-gray-100 hover:shadow-md transition-all'>

      {/* Company Name and Role */}
      <div className='flex justify-between items-start mb-3'>
        <div>
          <h3 className='text-lg font-bold text-gray-800'>{application.company}</h3>
          <p className='text-sm text-gray-500'>{application.role}</p>
        </div>

        {/* Status Badge */}
        <span className='bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full'>
          {application.status}
        </span>
      </div>

      {/* Date Applied */}
      <p className='text-xs text-gray-400'>Applied: {application.dateApplied}</p>

    </div>
  );
}

export default AppCard;
