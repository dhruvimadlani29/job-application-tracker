// src/pages/Settings.jsx
import { useState } from "react";

function Settings({ statuses, setStatuses, thresholds, setThresholds }) {
  const [savedThresh, setSavedThresh] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);
  const [savedProfile, setSavedProfile] = useState(false);

  const [expanded, setExpanded] = useState({
    status: true,
    threshold: true,
    profile: true,
  });

  function toggleSection(key) {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  // ── Threshold handlers ──
  function handleThresholdChange(e) {
    setThresholds({ ...thresholds, [e.target.name]: Number(e.target.value) });
  }

  function handleSaveThresholds() {
    if (thresholds.followUpMax <= thresholds.justAppliedMax) {
      alert('"Follow Up" days must be greater than "Just Applied" days!');
      return;
    }
    setSavedThresh(true);
    setTimeout(() => setSavedThresh(false), 2000);
  }

  // ── Status handlers ──
  function toggleStatus(key) {
    const enabledCount = statuses.filter((s) => s.enabled).length;
    const thisStatus = statuses.find((s) => s.key === key);
    if (thisStatus.enabled && enabledCount === 1) {
      alert("You must keep at least one status enabled!");
      return;
    }
    // Updates App.jsx state immediately — Dashboard updates live!
    setStatuses(
      statuses.map((s) => (s.key === key ? { ...s, enabled: !s.enabled } : s)),
    );
  }

  function handleSaveStatuses() {
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  }

  const enabledCount = statuses.filter((s) => s.enabled).length;
  const disabledCount = statuses.filter((s) => !s.enabled).length;

  function SectionHeader({ sectionKey, icon, title, subtitle, saved }) {
    return (
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors rounded-t-2xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-lg flex-shrink-0">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-gray-800">{title}</p>
              {saved && (
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  ✅ Saved
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          </div>
        </div>
        <span
          className={`text-gray-400 text-lg transition-transform duration-200 ${expanded[sectionKey] ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-400 mb-6">
        Customize your CoopTracker experience — changes apply instantly across
        the app.
      </p>

      <div className="grid grid-cols-2 gap-6 items-start">
        {/* ══ LEFT — STATUS VISIBILITY ══ */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <SectionHeader
              sectionKey="status"
              icon="📋"
              title="Status Visibility"
              subtitle={`${enabledCount} visible · ${disabledCount} hidden`}
              saved={savedStatus}
            />

            {expanded.status && (
              <div className="px-6 pb-6 border-t border-gray-50">
                <div className="flex items-center justify-between py-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs font-semibold text-gray-600">
                        {enabledCount} visible
                      </span>
                    </div>
                    <div className="w-px h-3 bg-gray-200" />
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                      <span className="text-xs font-semibold text-gray-400">
                        {disabledCount} hidden
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setStatuses(
                        statuses.map((s) => ({ ...s, enabled: true })),
                      )
                    }
                    className="text-xs text-blue-500 hover:text-blue-700 font-semibold"
                  >
                    Enable All
                  </button>
                </div>

                <div className="space-y-2">
                  {statuses.map((status) => (
                    <div
                      key={status.key}
                      onClick={() => toggleStatus(status.key)}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all
                        ${
                          status.enabled
                            ? "border-blue-100 bg-blue-50 hover:border-blue-200"
                            : "border-gray-100 bg-gray-50 hover:border-gray-200 opacity-60"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-5 rounded-full transition-all relative flex-shrink-0
                          ${status.enabled ? "bg-blue-500" : "bg-gray-300"}`}
                        >
                          <div
                            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all
                            ${status.enabled ? "left-4" : "left-0.5"}`}
                          />
                        </div>
                        <span className="text-base">{status.icon}</span>
                        <span
                          className={`text-sm font-semibold ${status.enabled ? "text-gray-800" : "text-gray-400"}`}
                        >
                          {status.label}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full
                        ${status.enabled ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-400"}`}
                      >
                        {status.enabled ? "Visible" : "Hidden"}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSaveStatuses}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
                >
                  {savedStatus ? "✅ Saved!" : "Save Status Settings"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ══ RIGHT — THRESHOLDS + PROFILE ══ */}
        <div className="flex flex-col gap-6">
          {/* BADGE THRESHOLDS */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <SectionHeader
              sectionKey="threshold"
              icon="🎯"
              title="Badge Thresholds"
              subtitle="Control when Applied badges change"
              saved={savedThresh}
            />

            {expanded.threshold && (
              <div className="px-6 pb-6 border-t border-gray-50">
                {/* Live preview */}
                <div className="bg-gray-50 rounded-xl p-4 mt-4 mb-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
                    Live Preview
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="bg-green-100 text-green-700 border border-green-200 text-xs font-bold px-3 py-1.5 rounded-full">
                        🟢 Just Applied
                      </span>
                      <span className="text-xs text-gray-400">
                        day 0 – {thresholds.justAppliedMax}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="bg-yellow-100 text-yellow-700 border border-yellow-200 text-xs font-bold px-3 py-1.5 rounded-full">
                        🟡 Follow Up
                      </span>
                      <span className="text-xs text-gray-400">
                        day {thresholds.justAppliedMax + 1} –{" "}
                        {thresholds.followUpMax}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="bg-slate-100 text-slate-500 border border-slate-200 text-xs font-bold px-3 py-1.5 rounded-full">
                        🌫 Gone Cold
                      </span>
                      <span className="text-xs text-gray-400">
                        day {thresholds.followUpMax + 1}+
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-gray-600">
                        🟢 Just Applied — up to
                      </label>
                      <span className="text-sm font-bold text-green-600">
                        {thresholds.justAppliedMax} days
                      </span>
                    </div>
                    <input
                      type="range"
                      name="justAppliedMax"
                      min={1}
                      max={14}
                      value={thresholds.justAppliedMax}
                      onChange={handleThresholdChange}
                      className="w-full accent-green-500"
                    />
                    <div className="flex justify-between text-xs text-gray-300 mt-0.5">
                      <span>1 day</span>
                      <span>14 days</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-gray-600">
                        🟡 Follow Up — up to
                      </label>
                      <span className="text-sm font-bold text-yellow-600">
                        {thresholds.followUpMax} days
                      </span>
                    </div>
                    <input
                      type="range"
                      name="followUpMax"
                      min={thresholds.justAppliedMax + 1}
                      max={60}
                      value={thresholds.followUpMax}
                      onChange={handleThresholdChange}
                      className="w-full accent-yellow-500"
                    />
                    <div className="flex justify-between text-xs text-gray-300 mt-0.5">
                      <span>{thresholds.justAppliedMax + 1} days</span>
                      <span>60 days</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-gray-600">
                          🌫 Gone Cold
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Auto calculated
                        </p>
                      </div>
                      <span className="text-sm font-bold text-slate-500">
                        {thresholds.followUpMax + 1}+ days
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveThresholds}
                  className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
                >
                  {savedThresh ? "✅ Saved!" : "Save Threshold Settings"}
                </button>
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <SectionHeader
              sectionKey="profile"
              icon="👤"
              title="Profile Settings"
              subtitle="Your personal information"
              saved={savedProfile}
            />

            {expanded.profile && (
              <div className="px-6 pb-6 border-t border-gray-50 pt-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      Full Name
                    </label>
                    <input
                      defaultValue="Dhruvi Madlani"
                      className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      College
                    </label>
                    <input
                      defaultValue="Algonquin College"
                      className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      Program
                    </label>
                    <input
                      defaultValue="Web Development and Internet Applications"
                      className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setSavedProfile(true);
                      setTimeout(() => setSavedProfile(false), 2000);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
                  >
                    {savedProfile ? "✅ Saved!" : "Save Profile"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
