// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import AppCard from "../components/AppCard";
import WeeklySummary from "../components/WeeklySummary";
import ApplicationModal from "../components/ApplicationModal";

function Dashboard({ statuses, thresholds }) {
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

  const [showModal, setShowModal] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    localStorage.setItem("coopApplications", JSON.stringify(applications));
  }, [applications]);

  // ── Counts ──
  const enabledStatuses =
    statuses?.filter((s) => s.enabled).map((s) => s.key) || [];

  const colorMap = {
    Applied: {
      color: "text-blue-500",
      bg: "bg-white",
      border: "border-blue-200",
      dot: "bg-blue-500",
    },
    "Under Review": {
      color: "text-sky-600",
      bg: "bg-white",
      border: "border-sky-200",
      dot: "bg-sky-600",
    },
    "Phone Screen": {
      color: "text-purple-600",
      bg: "bg-white",
      border: "border-purple-200",
      dot: "bg-purple-600",
    },
    "Technical Test": {
      color: "text-amber-600",
      bg: "bg-white",
      border: "border-amber-200",
      dot: "bg-amber-600",
    },
    Interview: {
      color: "text-orange-600",
      bg: "bg-white",
      border: "border-orange-200",
      dot: "bg-orange-600",
    },
    "Awaiting Decision": {
      color: "text-indigo-600",
      bg: "bg-white",
      border: "border-indigo-200",
      dot: "bg-indigo-600",
    },
    "Follow-Up Sent": {
      color: "text-cyan-600",
      bg: "bg-white",
      border: "border-cyan-200",
      dot: "bg-cyan-600",
    },
    "Offer Received": {
      color: "text-green-600",
      bg: "bg-white",
      border: "border-green-200",
      dot: "bg-green-600",
    },
    Rejected: {
      color: "text-red-500",
      bg: "bg-white",
      border: "border-red-200",
      dot: "bg-red-500",
    },
    Ghosted: {
      color: "text-gray-400",
      bg: "bg-white",
      border: "border-gray-200",
      dot: "bg-gray-400",
    },
  };

  const statBoxes = [
    {
      label: "Total",
      key: "All",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      dot: "bg-blue-600",
    },
    ...enabledStatuses.map((status) => ({
      label: status,
      key: status,
      ...(colorMap[status] || {
        color: "text-gray-600",
        bg: "bg-white",
        border: "border-gray-200",
        dot: "bg-gray-600",
      }),
    })),
  ];

  const counts = {
    All: applications.length,
    ...enabledStatuses.reduce((acc, status) => {
      acc[status] = applications.filter((a) => a.status === status).length;
      return acc;
    }, {}),
  };

  // ── Filtered list ──
  const filteredApplications = applications
    .filter((app) => filterStatus === "All" || app.status === filterStatus)
    .filter((app) =>
      app.company.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  // ── Handlers ──
  function handleAddNew() {
    setEditingApp(null);
    setShowModal(true);
  }

  function handleEdit(id, formData) {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, ...formData } : app,
      ),
    );
  }

  function handleEditOpen(application) {
    setEditingApp(application);
    setShowModal(true);
  }

  function handleModalSubmit(formData) {
    if (editingApp) {
      setApplications(
        applications.map((app) =>
          app.id === editingApp.id ? { ...app, ...formData } : app,
        ),
      );
    } else {
      setApplications([
        ...applications,
        {
          id: Date.now(),
          company: formData.company,
          role: formData.role,
          status: formData.status,
          dateApplied: formData.dateApplied || "Today",
          notes: formData.notes || "",
          resumeUsed: formData.resumeUsed || "",
          coverLetterUsed: formData.coverLetterUsed || "",
          jobUrl: formData.jobUrl || "",
          deadline: formData.deadline || "",
          interviewDate: formData.interviewDate || "",
          interviewTime: formData.interviewTime || "",
          recruiterName: formData.recruiterName || "",
          recruiterEmail: formData.recruiterEmail || "",
          recruiterLinkedIn: formData.recruiterLinkedIn || "",
        },
      ]);
    }
    setShowModal(false);
    setEditingApp(null);
  }

  function handleDelete(id) {
    setApplications(applications.filter((app) => app.id !== id));
  }

  return (
    <div>
      {/* ── AI WEEKLY SUMMARY ── */}
      <WeeklySummary applications={applications} />

      {/* ── STAT BOXES ── */}
      <div className="grid grid-cols-3 gap-3 mb-8 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11">
        {statBoxes.map((stat) => {
          const isActive = filterStatus === stat.key;
          return (
            <div
              key={stat.key}
              onClick={() =>
                setFilterStatus(filterStatus === stat.key ? "All" : stat.key)
              }
              className={`rounded-2xl p-4 border-2 cursor-pointer transition-all duration-150
                hover:shadow-md hover:-translate-y-0.5
                ${
                  isActive
                    ? `${stat.bg} ${stat.border} shadow-sm`
                    : "bg-white border-gray-100 hover:border-gray-200"
                }`}
            >
              <p className="text-xs text-gray-400 font-semibold truncate">
                {stat.label}
              </p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
                {counts[stat.key]}
              </p>
              {isActive && (
                <div className={`w-1.5 h-1.5 rounded-full mt-2 ${stat.dot}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── FILTER LABEL + SEARCH + ADD ── */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          {filterStatus !== "All" ? (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-1.5">
              <span className="text-xs font-semibold text-blue-700">
                Filtering: {filterStatus}
              </span>
              <button
                onClick={() => setFilterStatus("All")}
                className="text-blue-400 hover:text-blue-700 font-bold text-sm leading-none"
              >
                ✕
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              Showing all {counts.All} applications
            </p>
          )}
        </div>

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

      {/* ── APPLICATION CARDS ── */}
      <div className="flex flex-col gap-4">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">🔍</div>
            <p className="font-semibold text-gray-500">No applications found</p>
            <p className="text-sm mt-1">
              {filterStatus !== "All"
                ? `No applications with status "${filterStatus}"`
                : "Add your first application using the button above"}
            </p>
            {filterStatus !== "All" && (
              <button
                onClick={() => setFilterStatus("All")}
                className="mt-4 text-xs font-semibold text-blue-500 hover:text-blue-700 underline"
              >
                Clear filter
              </button>
            )}
          </div>
        ) : (
          filteredApplications.map((app) => (
            <AppCard
              key={app.id}
              application={app}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onEditOpen={handleEditOpen}
              enabledStatuses={enabledStatuses}
            />
          ))
        )}
      </div>

      {/* ── APPLICATION MODAL ── */}
      <ApplicationModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingApp(null);
        }}
        onSubmit={handleModalSubmit}
        editingApp={editingApp}
        statuses={statuses}
      />
    </div>
  );
}

export default Dashboard;
