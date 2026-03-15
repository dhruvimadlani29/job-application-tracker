// src/components/detail/DetailSchedule.jsx
function DetailSchedule({ application }) {
function getDeadlineInfo() {
  if (!application.deadline) return null

  const deadline = new Date(`${application.deadline}T12:00:00`)
  const today    = new Date()
  today.setHours(12, 0, 0, 0)

  const days = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))

  if (days < 0)   return { text: `Deadline passed ${Math.abs(days)} day${Math.abs(days)>1?'s':''} ago`, color: 'text-red-500',    bg: 'bg-red-50'    }
  if (days === 0)  return { text: 'Deadline is TODAY!',                                                   color: 'text-red-600',    bg: 'bg-red-50'    }
  if (days <= 3)   return { text: `${days} day${days>1?'s':''} left — apply soon!`,                      color: 'text-orange-600', bg: 'bg-orange-50' }
  return               { text: `${days} days until deadline`,                                         color: 'text-green-600',  bg: 'bg-green-50'  }
}

  function getInterviewInfo() {
    if (!application.interviewDate) return null;
    const interview = new Date(
      `${application.interviewDate}T${application.interviewTime || "09:00"}`,
    );
    const diff = interview - new Date();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (diff < 0)
      return {
        text: "Interview has passed",
        color: "text-gray-500",
        bg: "bg-gray-50",
      };
    if (days > 0)
      return {
        text: `${days} day${days > 1 ? "s" : ""} and ${hours}h away`,
        color: "text-purple-600",
        bg: "bg-purple-50",
      };
    if (hours > 0)
      return {
        text: `${hours}h ${mins}min away — prepare now!`,
        color: "text-orange-600",
        bg: "bg-orange-50",
      };
    return {
      text: `${mins} minute${mins > 1 ? "s" : ""} away — you've got this! 🚀`,
      color: "text-red-600",
      bg: "bg-red-50",
    };
  }

  function formatDate(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  const deadlineInfo = getDeadlineInfo();
  const interviewInfo = getInterviewInfo();

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
        📅 Schedule
      </p>
      <div className="grid grid-cols-2 gap-4">
        {/* Deadline */}
        <div>
          <p className="text-xs text-gray-400 mb-1">Application Deadline</p>
          {application.deadline ? (
            <div>
              <p className="text-sm font-bold text-gray-800 mb-1">
                {formatDate(application.deadline)}
              </p>
              {deadlineInfo && (
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-lg ${deadlineInfo.bg} ${deadlineInfo.color}`}
                >
                  {deadlineInfo.text}
                </span>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-400">No deadline set</p>
          )}
        </div>

        {/* Interview */}
        <div>
          <p className="text-xs text-gray-400 mb-1">Interview</p>
          {application.interviewDate ? (
            <div>
              <p className="text-sm font-bold text-gray-800 mb-1">
                {formatDate(application.interviewDate)}
                {application.interviewTime && (
                  <span className="text-gray-500 font-normal text-xs">
                    {" "}
                    at {application.interviewTime}
                  </span>
                )}
              </p>
              {interviewInfo && (
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-lg ${interviewInfo.bg} ${interviewInfo.color}`}
                >
                  {interviewInfo.text}
                </span>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-400">No interview scheduled</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailSchedule;
