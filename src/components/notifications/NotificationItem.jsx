// src/components/notifications/NotificationItem.jsx

const URGENCY_DOT = {
  critical: "bg-red-500",
  warning: "bg-orange-400",
  info: "bg-blue-400",
};

const TYPE_STYLES = {
  deadline: { pill: "bg-red-50 text-red-500", label: "📅 Deadline" },
  interview: { pill: "bg-purple-50 text-purple-600", label: "🎤 Interview" },
  followup: { pill: "bg-blue-50 text-blue-500", label: "📬 Follow-up" },
};

function NotificationItem({ notification, onDismiss, onClick, isRead }) {
  const dot = URGENCY_DOT[notification.urgency] || "bg-gray-400";
  const type = TYPE_STYLES[notification.type] || TYPE_STYLES.followup;

  return (
    <div
      onClick={() => onClick(notification)}
      className={`flex items-start gap-3 px-4 py-3 border-b
  border-gray-50 dark:border-gray-700
  hover:bg-gray-50 dark:hover:bg-gray-700/50
  cursor-pointer transition-colors group
  ${!isRead ? "bg-blue-50/40 dark:bg-blue-900/10" : "bg-white dark:bg-gray-800"}`}
    >
      {/* Unread dot — blue if unread, gray if read */}
      <div
        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 transition-all
        ${!isRead ? dot : "bg-gray-200"}`}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p
              className={`text-xs leading-tight transition-all
  ${
    !isRead
      ? "font-bold text-gray-800 dark:text-gray-100"
      : "font-medium text-gray-500 dark:text-gray-400"
  }`}
            >
              {notification.icon} {notification.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
              {notification.message}
            </p>
          </div>

          {/* Dismiss ✕ — shows on hover */}
          <button
            onClick={(e) => onDismiss(notification.id, e)}
            className="text-gray-300 hover:text-gray-600 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-sm leading-none mt-0.5"
            title="Dismiss"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-2 mt-1.5">
          {/* Type pill */}
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${type.pill}`}
          >
            {type.label}
          </span>

          {/* Unread badge */}
          {!isRead && (
            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
              New
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationItem;
