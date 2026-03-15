// src/components/notifications/NotificationEmpty.jsx
function NotificationEmpty() {
  return (
    <div className="text-center py-10">
      <div className="text-4xl mb-2">✅</div>
      <p className="text-sm font-semibold text-gray-500">All caught up!</p>
      <p className="text-xs text-gray-400 mt-1">
        No pending deadlines or interviews
      </p>
    </div>
  )
}

export default NotificationEmpty