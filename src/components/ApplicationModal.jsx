// src/components/ApplicationModal.jsx
import { useState, useEffect } from "react";

function ApplicationModal({ show, onClose, onSubmit, editingApp, statuses }) {
  const availableResumes = JSON.parse(
    localStorage.getItem("coopResumes") || "[]",
  );
  const availableCoverLetters = JSON.parse(
    localStorage.getItem("coopCoverLetters") || "[]",
  );
  const defaultResume = availableResumes.find((r) => r.isDefault);
  const defaultCoverLetter = availableCoverLetters.find((c) => c.isDefault);

  const emptyForm = {
    company: "",
    role: "",
    status: statuses?.filter((s) => s.enabled)[0]?.key || "Applied",
    dateApplied: "",
    notes: "",
    resumeUsed: defaultResume?.name || "",
    coverLetterUsed: defaultCoverLetter?.name || "",
    // Phase 1 new fields
    jobUrl: "",
    deadline: "",
    interviewDate: "",
    interviewTime: "",
    recruiterName: "",
    recruiterEmail: "",
    recruiterLinkedIn: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    if (show) {
      setActiveTab("basic");
      setFormData(
        editingApp
          ? {
              company: editingApp.company || "",
              role: editingApp.role || "",
              status: editingApp.status || "",
              dateApplied: editingApp.dateApplied || "",
              notes: editingApp.notes || "",
              resumeUsed: editingApp.resumeUsed || "",
              coverLetterUsed: editingApp.coverLetterUsed || "",
              jobUrl: editingApp.jobUrl || "",
              deadline: editingApp.deadline || "",
              interviewDate: editingApp.interviewDate || "",
              interviewTime: editingApp.interviewTime || "",
              recruiterName: editingApp.recruiterName || "",
              recruiterEmail: editingApp.recruiterEmail || "",
              recruiterLinkedIn: editingApp.recruiterLinkedIn || "",
            }
          : emptyForm,
      );
    }
  }, [show, editingApp]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit() {
    if (!formData.company.trim() || !formData.role.trim()) {
      alert("Please fill in Company Name and Job Title!");
      return;
    }
    onSubmit(formData);
  }

  if (!show) return null;

  const enabledStatuses = statuses?.filter((s) => s.enabled) || [];

  const tabs = [
    { key: "basic", label: "📋 Basic" },
    { key: "docs", label: "📄 Documents" },
    { key: "schedule", label: "📅 Schedule" },
    { key: "contact", label: "👤 Contact" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-[680px] mx-4">
        {/* ── HEADER ── */}
        <div className="flex justify-between items-center px-7 py-5 border-b border-gray-100">
          <div>
            <p className="text-lg font-bold text-gray-800">
              {editingApp ? "✏️ Edit Application" : "➕ Add New Application"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {editingApp
                ? "Update the details for this application"
                : "Fill in the details for your new co-op application"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-all text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-1 px-7 pt-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all
                ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── BODY ── */}
        <div className="px-7 py-5">
          {/* ── BASIC TAB ── */}
          {activeTab === "basic" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Company Name *
                </label>
                <input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Shopify"
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Job Title *
                </label>
                <input
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g. Frontend Developer Co-op"
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 bg-white transition-colors"
                >
                  {enabledStatuses.map((s) => (
                    <option key={s.key}>{s.key}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Date Applied
                </label>
                <input
                  name="dateApplied"
                  value={formData.dateApplied}
                  onChange={handleChange}
                  type="date"
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Job Posting URL
                </label>
                <input
                  name="jobUrl"
                  value={formData.jobUrl}
                  onChange={handleChange}
                  placeholder="e.g. https://shopify.com/careers/..."
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Referral from John, coding test required, found on LinkedIn..."
                  rows={3}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors resize-none"
                />
              </div>
            </div>
          )}

          {/* ── DOCUMENTS TAB ── */}
          {activeTab === "docs" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Resume Used
                </label>
                <select
                  name="resumeUsed"
                  value={formData.resumeUsed}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 bg-white transition-colors"
                >
                  <option value="">— None selected —</option>
                  {availableResumes.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name}
                      {r.isDefault ? " ⭐" : ""}
                    </option>
                  ))}
                </select>
                {availableResumes.length === 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    No resumes yet — add them in the Resumes page
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Cover Letter Used
                </label>
                <select
                  name="coverLetterUsed"
                  value={formData.coverLetterUsed}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 bg-white transition-colors"
                >
                  <option value="">— None selected —</option>
                  {availableCoverLetters.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                      {c.isDefault ? " ⭐" : ""}
                    </option>
                  ))}
                </select>
                {availableCoverLetters.length === 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    No cover letters yet — add them in the Resumes page
                  </p>
                )}
              </div>

              {/* Preview of selected docs */}
              {(formData.resumeUsed || formData.coverLetterUsed) && (
                <div className="col-span-2 bg-blue-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-blue-600 mb-2">
                    📎 Documents attached to this application
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {formData.resumeUsed && (
                      <span className="bg-white border border-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                        📄 {formData.resumeUsed}
                      </span>
                    )}
                    {formData.coverLetterUsed && (
                      <span className="bg-white border border-blue-100 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                        ✉️ {formData.coverLetterUsed}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── SCHEDULE TAB ── */}
          {activeTab === "schedule" && (
            <div className="grid grid-cols-2 gap-4">
              {/* Deadline */}
              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Application Deadline
                </label>
                <input
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  type="date"
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
                />
                {formData.deadline && (
                  <p className="text-xs mt-1 font-semibold">
                    {(() => {
                      const days = Math.ceil(
                        (new Date(formData.deadline) - new Date()) /
                          (1000 * 60 * 60 * 24),
                      );
                      if (days < 0)
                        return (
                          <span className="text-red-500">
                            ❌ Deadline passed {Math.abs(days)} days ago
                          </span>
                        );
                      if (days === 0)
                        return (
                          <span className="text-red-500">
                            🚨 Deadline is TODAY!
                          </span>
                        );
                      if (days <= 3)
                        return (
                          <span className="text-orange-500">
                            ⚠️ {days} day{days > 1 ? "s" : ""} left — apply
                            soon!
                          </span>
                        );
                      return (
                        <span className="text-green-600">
                          ✅ {days} days until deadline
                        </span>
                      );
                    })()}
                  </p>
                )}
              </div>

              {/* Interview date + time */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Interview Date
                </label>
                <input
                  name="interviewDate"
                  value={formData.interviewDate}
                  onChange={handleChange}
                  type="date"
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Interview Time
                </label>
                <input
                  name="interviewTime"
                  value={formData.interviewTime}
                  onChange={handleChange}
                  type="time"
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
                />
              </div>

              {/* Interview countdown */}
              {formData.interviewDate && (
                <div className="col-span-2 bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-orange-600 mb-1">
                    🎤 Interview Countdown
                  </p>
                  <p className="text-sm font-semibold text-orange-700">
                    {(() => {
                      const interview = new Date(
                        `${formData.interviewDate}T${formData.interviewTime || "09:00"}`,
                      );
                      const now = new Date();
                      const diff = interview - now;
                      if (diff < 0) return "Interview has passed";
                      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                      const hours = Math.floor(
                        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
                      );
                      const minutes = Math.floor(
                        (diff % (1000 * 60 * 60)) / (1000 * 60),
                      );
                      if (days > 0)
                        return `${days} day${days > 1 ? "s" : ""} and ${hours} hour${hours > 1 ? "s" : ""} away`;
                      if (hours > 0)
                        return `${hours} hour${hours > 1 ? "s" : ""} and ${minutes} minute${minutes > 1 ? "s" : ""} away — prepare now!`;
                      return `${minutes} minute${minutes > 1 ? "s" : ""} away — you've got this! 🚀`;
                    })()}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── CONTACT TAB ── */}
          {activeTab === "contact" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <div className="bg-blue-50 rounded-xl p-4 mb-2">
                  <p className="text-xs font-bold text-blue-600 mb-1">
                    👤 Why track recruiter contacts?
                  </p>
                  <p className="text-xs text-blue-700">
                    Having the recruiter's direct contact lets you follow up
                    personally, reference them in your cover letter, and build a
                    real connection.
                  </p>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Recruiter / Contact Name
                </label>
                <input
                  name="recruiterName"
                  value={formData.recruiterName}
                  onChange={handleChange}
                  placeholder="e.g. Sarah Johnson"
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Recruiter Email
                </label>
                <input
                  name="recruiterEmail"
                  value={formData.recruiterEmail}
                  onChange={handleChange}
                  placeholder="e.g. sarah@shopify.com"
                  type="email"
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  LinkedIn Profile URL
                </label>
                <input
                  name="recruiterLinkedIn"
                  value={formData.recruiterLinkedIn}
                  onChange={handleChange}
                  placeholder="e.g. https://linkedin.com/in/sarahjohnson"
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
                />
              </div>

              {/* Contact summary */}
              {(formData.recruiterName || formData.recruiterEmail) && (
                <div className="col-span-2 bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-gray-500 mb-2">
                    Contact Summary
                  </p>
                  {formData.recruiterName && (
                    <p className="text-sm text-gray-700">
                      👤 {formData.recruiterName}
                    </p>
                  )}
                  {formData.recruiterEmail && (
                    <p className="text-sm text-gray-700">
                      📧 {formData.recruiterEmail}
                    </p>
                  )}
                  {formData.recruiterLinkedIn && (
                    <a
                      href={formData.recruiterLinkedIn}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      🔗 View LinkedIn
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        <div className="flex gap-3 px-7 py-5 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            {editingApp ? "Save Changes" : "Add Application"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApplicationModal;
