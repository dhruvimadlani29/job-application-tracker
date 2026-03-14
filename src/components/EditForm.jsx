// src/components/EditForm.jsx
import { useState } from "react";
import { getEnabledStatuses } from "../utils/thresholds";

function EditForm({ application, onSave, enabledStatuses }) {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    company: application.company,
    role: application.role,
    status: application.status,
    dateApplied: application.dateApplied,
    notes: application.notes || "",
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSave() {
    if (!formData.company || !formData.role) {
      alert("Company and Role cannot be empty!");
      return;
    }
    onSave(application.id, formData);
    setShow(false);
  }

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-blue-400 hover:bg-blue-50 transition-all"
        title="Edit application"
      >
        ✏️
      </button>

      {show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShow(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <p className="text-base font-bold text-gray-800">
                ✏️ Edit Application
              </p>
              <button
                onClick={() => setShow(false)}
                className="text-gray-300 hover:text-gray-600 text-xl font-bold leading-none"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Company Name
                </label>
                <input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Job Title
                </label>
                <input
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors"
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
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 bg-white transition-colors"
                >
                  {(enabledStatuses || []).map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Date Applied
                </label>
                <input
                  name="dateApplied"
                  type="date"
                  value={formData.dateApplied}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors"
                />
              </div>

              {/* Notes field — new! */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Referral from John, HR contact is Sarah, coding test required..."
                  rows={3}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShow(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EditForm;
