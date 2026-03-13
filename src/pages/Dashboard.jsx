// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import AppCard from "../components/AppCard";
import WeeklySummary from "../components/WeeklySummary";

function Dashboard() {
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem("coopApplications");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            company: "Shopify",
            role: "Frontend Developer Co-op",
            status: "Applied",
            dateApplied: "Feb 22, 2026",
          },
          {
            id: 2,
            company: "Klarna",
            role: "Backend Developer Co-op",
            status: "Interview",
            dateApplied: "Mar 1, 2026",
          },
          {
            id: 3,
            company: "TD Bank",
            role: "Full Stack Developer Co-op",
            status: "Applied",
            dateApplied: "Feb 28, 2026",
          },
        ];
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "Applied",
    dateApplied: "",
  });

  // Auto save to localStorage every time applications changes
  useEffect(() => {
    localStorage.setItem("coopApplications", JSON.stringify(applications));
  }, [applications]);

  // Filter + Search logic
  const filteredApplications = applications
    .filter((app) => filterStatus === "All" || app.status === filterStatus)
    .filter((app) =>
      app.company.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  // Count helpers for stats and filter chips
  const totalApplied = applications.length;
  const totalInterview = applications.filter(
    (a) => a.status === "Interview",
  ).length;
  const totalOffer = applications.filter((a) => a.status === "Offer").length;
  const totalRejected = applications.filter(
    (a) => a.status === "Rejected",
  ).length;

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleAddNew() {
    setEditingId(null);
    setFormData({ company: "", role: "", status: "Applied", dateApplied: "" });
    setShowForm(true);
  }

  function handleEdit(id, formData) {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, ...formData } : app,
      ),
    );
  }

  function handleSubmit() {
    if (!formData.company || !formData.role) {
      alert("Please fill in Company and Role!");
      return;
    }

    if (editingId) {
      setApplications(
        applications.map((app) =>
          app.id === editingId ? { ...app, ...formData } : app,
        ),
      );
    } else {
      const newApp = {
        id: Date.now(),
        company: formData.company,
        role: formData.role,
        status: formData.status,
        dateApplied: formData.dateApplied || "Today",
      };
      setApplications([...applications, newApp]);
    }

    setFormData({ company: "", role: "", status: "Applied", dateApplied: "" });
    setEditingId(null);
    setShowForm(false);
  }

  function handleDelete(id) {
    setApplications(applications.filter((app) => app.id !== id));
  }

  function handleCancel() {
    setShowForm(false);
    setEditingId(null);
    setFormData({ company: "", role: "", status: "Applied", dateApplied: "" });
  }

  return (
    <div>
      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Applied",
            value: totalApplied,
            color: "text-blue-600",
          },
          {
            label: "Interviews",
            value: totalInterview,
            color: "text-purple-600",
          },
          { label: "Offers", value: totalOffer, color: "text-green-600" },
          { label: "Rejected", value: totalRejected, color: "text-red-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
          >
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
              {stat.label}
            </p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
      {/* ── AI WEEKLY SUMMARY ── */}
      <WeeklySummary applications={applications} />
      {/* ── FILTER + SEARCH + ADD ROW ── */}
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        {/* Filter Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {["All", "Applied", "Interview", "Offer", "Rejected"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all
                ${
                  filterStatus === status
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {status}
                <span className="ml-1.5 opacity-70">
                  {status === "All"
                    ? applications.length
                    : applications.filter((a) => a.status === status).length}
                </span>
              </button>
            ),
          )}
        </div>

        {/* Search + Add Button */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <input
            type="text"
            placeholder="🔍  Search company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-400 transition-colors w-48"
          />
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl transition-colors text-sm whitespace-nowrap"
          >
            + Add Application
          </button>
        </div>
      </div>

      {/* ── ADD / EDIT FORM ── */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 mb-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">
            {editingId ? "✏️ Edit Application" : "➕ New Application"}
          </h2>
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
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
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
          </div>
          <div className="flex gap-3 mt-5">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
              {editingId ? "Save Changes" : "Save Application"}
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── APPLICATION CARDS ── */}
      <div className="flex flex-col gap-4">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-semibold">No applications found</p>
            <p className="text-sm mt-1">
              Try a different filter or search term
            </p>
          </div>
        ) : (
          filteredApplications.map((app) => (
            <AppCard
              key={app.id}
              application={app}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
