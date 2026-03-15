// src/components/detail/DetailHeader.jsx
import SmartBadge from "../HealthScore";

function DetailHeader({ application, onClose, onEditOpen }) {
  return (
    <div className="flex justify-between items-start px-7 py-5 border-b border-gray-100 bg-white rounded-t-2xl">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          {application.company[0]}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            {application.company}
          </h2>
          <p className="text-sm text-gray-400">{application.role}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <SmartBadge
          status={application.status}
          dateApplied={application.dateApplied}
        />
        <button
          onClick={() => {
            onClose();
            onEditOpen(application);
          }}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors"
        >
          ✏️ Edit
        </button>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-all text-lg font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default DetailHeader;
