// src/components/AppCard.jsx
import { useState } from "react";
import EmailGenerator from "./EmailGenerator";
import MatchScore from "./MatchScore";
import InterviewPrep from "./InterviewPrep";
import SmartBadge from "./HealthScore";
import ApplicationDetail from "./ApplicationDetail";

function AppCard({
  application,
  onDelete,
  onEdit,
  onEditOpen,
  enabledStatuses,
}) {
  const [activePanel, setActivePanel] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  function togglePanel(panelName) {
    setActivePanel((prev) => (prev === panelName ? null : panelName));
  }
  function closePanel() {
    setActivePanel(null);
  }

  function getDaysAgo() {
    const applied = new Date(application.dateApplied);
    const today = new Date();
    if (isNaN(applied.getTime())) return null;
    const days = Math.floor((today - applied) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  }

  function handleDelete(e) {
    e.stopPropagation();
    const confirmed = window.confirm(
      `Delete ${application.company} application?`,
    );
    if (confirmed) onDelete(application.id);
  }

  function handleEditClick(e) {
    e.stopPropagation();
    onEditOpen(application);
  }

  function handleCardClick() {
    // Only open detail if no modal is already open
    if (!showDetail) setShowDetail(true);
  }

  function getDeadlineBadge() {
    if (!application.deadline) return null;
    const days = Math.ceil(
      (new Date(application.deadline) - new Date()) / (1000 * 60 * 60 * 24),
    );
    if (days > 7) return null;

    let className =
      "mt-2 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ";
    let text = "";

    if (days < 0) {
      className += "bg-red-50 text-red-500";
      text = `❌ Deadline passed ${Math.abs(days)} days ago`;
    } else if (days === 0) {
      className += "bg-red-50 text-red-600";
      text = "🚨 Deadline is TODAY!";
    } else if (days <= 3) {
      className += "bg-orange-50 text-orange-600";
      text = `⚠️ Deadline in ${days} day${days > 1 ? "s" : ""}!`;
    } else {
      className += "bg-yellow-50 text-yellow-600";
      text = `📅 Deadline in ${days} days`;
    }

    return <div className={className}>{text}</div>;
  }

  function getInterviewCountdown() {
    if (!application.interviewDate) return null;
    const interview = new Date(
      `${application.interviewDate}T${application.interviewTime || "09:00"}`,
    );
    const now = new Date();
    const diff = interview - now;
    if (diff < 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const timeText =
      days > 0
        ? `in ${days} day${days > 1 ? "s" : ""}`
        : `in ${hours} hour${hours > 1 ? "s" : ""}`;
    const timeStr = application.interviewTime
      ? ` at ${application.interviewTime}`
      : "";

    return (
      <div className="mt-2 flex items-center gap-2 bg-purple-50 border border-purple-100 px-3 py-2 rounded-xl text-xs font-semibold text-purple-700">
        🎤 Interview {timeText}
        {timeStr}
      </div>
    );
  }

  const daysAgo = getDaysAgo();

  return (
    <>
      {/* ── CARD ── */}
      <div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Top row */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {application.company[0]}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {application.company}
              </h3>
              <p className="text-sm text-gray-400 mt-0.5">{application.role}</p>
            </div>
          </div>

          {/* Smart badge + Edit + Delete */}
          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <SmartBadge
              status={application.status}
              dateApplied={application.dateApplied}
            />
            <button
              onClick={handleEditClick}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-blue-400 hover:bg-blue-50 transition-all"
              title="Edit"
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all"
              title="Delete"
            >
              🗑
            </button>
          </div>
        </div>

        {/* Date + Days ago */}
        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400">📅 Applied:</span>
            <span className="text-xs text-gray-500 font-medium">
              {application.dateApplied}
            </span>
          </div>
          {daysAgo && (
            <span className="text-xs text-gray-400 font-medium">{daysAgo}</span>
          )}
        </div>

        {/* Notes */}
        {application.notes && (
          <div className="mt-2 bg-gray-50 rounded-xl px-4 py-2.5">
            <p className="text-xs text-gray-500 leading-relaxed">
              📝 {application.notes}
            </p>
          </div>
        )}

        {/* Resume + Cover Letter badges */}
        {(application.resumeUsed || application.coverLetterUsed) && (
          <div className="mt-2 flex flex-wrap gap-2">
            {application.resumeUsed && (
              <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
                📄 {application.resumeUsed}
              </span>
            )}
            {application.coverLetterUsed && (
              <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                ✉️ {application.coverLetterUsed}
              </span>
            )}
          </div>
        )}

        {/* Job URL */}
        {application.jobUrl && (
          <div className="mt-2" onClick={(e) => e.stopPropagation()}>
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors"
            >
              🔗 View Job Posting →
            </a>
          </div>
        )}

        {/* Deadline warning */}
        {getDeadlineBadge()}

        {/* Interview countdown */}
        {getInterviewCountdown()}

        {/* Recruiter contact */}
        {application.recruiterName && (
          <div
            className="mt-2 flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs font-semibold text-gray-600">
              👤 {application.recruiterName}
            </span>
            {application.recruiterEmail && (
              <a
                href={`mailto:${application.recruiterEmail}`}
                className="text-xs text-blue-500 hover:underline"
              >
                📧 Email
              </a>
            )}
            {application.recruiterLinkedIn && (
              <a
                href={application.recruiterLinkedIn}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-500 hover:underline"
              >
                🔗 LinkedIn
              </a>
            )}
          </div>
        )}

        {/* AI Buttons */}
        <div
          className="mt-3 pt-3 border-t border-gray-50 flex flex-wrap gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <EmailGenerator
            company={application.company}
            role={application.role}
            isOpen={activePanel === "email"}
            onToggle={() => togglePanel("email")}
            onClose={closePanel}
          />
          <MatchScore
            company={application.company}
            role={application.role}
            isOpen={activePanel === "match"}
            onToggle={() => togglePanel("match")}
            onClose={closePanel}
          />
          <InterviewPrep
            company={application.company}
            role={application.role}
            isOpen={activePanel === "interview"}
            onToggle={() => togglePanel("interview")}
            onClose={closePanel}
          />
        </div>

        {/* Click hint */}
        <p className="text-xs text-gray-300 mt-3 text-center">
          Click card to view full details
        </p>
      </div>

      {/* ── DETAIL MODAL — outside card div so no stopPropagation conflict ── */}
      <ApplicationDetail
        application={application}
        show={showDetail}
        onClose={() => setShowDetail(false)}
        onEditOpen={(app) => {
          setShowDetail(false);
          onEditOpen(app);
        }}
      />
    </>
  );
}

export default AppCard;
