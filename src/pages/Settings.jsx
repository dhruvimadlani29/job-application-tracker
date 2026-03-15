// src/pages/Settings.jsx
import { useState } from "react";
import {
  getNotificationPermission,
  requestNotificationPermission,
  sendTestNotification,
  getNotifPrefs,
  saveNotifPrefs,
} from "../utils/notifications";

function Settings({ statuses, setStatuses, thresholds, setThresholds }) {
  const [savedThresh, setSavedThresh] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);
  const [savedProfile, setSavedProfile] = useState(false);

  const [expanded, setExpanded] = useState({
    status: true,
    threshold: true,
    profile: true,
    notifications: true,
  });
  const [notifPermission, setNotifPermission] = useState(
    getNotificationPermission(),
  );
  const [notifPrefs, setNotifPrefs] = useState(getNotifPrefs);
  const [savedPrefs, setSavedPrefs] = useState(false);

  function handleNotifPrefChange(key, value) {
    setNotifPrefs((prev) => ({ ...prev, [key]: value }));
  }

  function handleSaveNotifPrefs() {
    saveNotifPrefs(notifPrefs);
    setSavedPrefs(true);
    setTimeout(() => setSavedPrefs(false), 2000);
  }

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

  async function handleEnableNotifications() {
    const granted = await requestNotificationPermission();
    setNotifPermission(granted ? "granted" : "denied");
  }

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

          {/* NOTIFICATIONS */}
          {/* NOTIFICATIONS */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <SectionHeader
              sectionKey="notifications"
              icon="🔔"
              title="Notifications"
              subtitle="Deadline, interview and follow-up reminders"
              saved={savedPrefs}
            />

            {expanded.notifications && (
              <div className="px-6 pb-6 border-t border-gray-50 pt-4 space-y-4">
                {/* Permission status */}
                <div
                  className={`rounded-xl p-4 ${
                    notifPermission === "granted"
                      ? "bg-green-50 border border-green-200"
                      : notifPermission === "denied"
                        ? "bg-red-50 border border-red-200"
                        : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">
                      {notifPermission === "granted"
                        ? "✅"
                        : notifPermission === "denied"
                          ? "❌"
                          : "⏳"}
                    </span>
                    <p
                      className={`text-sm font-bold ${
                        notifPermission === "granted"
                          ? "text-green-700"
                          : notifPermission === "denied"
                            ? "text-red-700"
                            : "text-gray-700"
                      }`}
                    >
                      {notifPermission === "granted"
                        ? "Notifications Enabled"
                        : notifPermission === "denied"
                          ? "Notifications Blocked"
                          : "Notifications Not Enabled"}
                    </p>
                  </div>
                  <p
                    className={`text-xs ${
                      notifPermission === "granted"
                        ? "text-green-600"
                        : notifPermission === "denied"
                          ? "text-red-600"
                          : "text-gray-500"
                    }`}
                  >
                    {notifPermission === "granted"
                      ? "You will receive browser notifications for the alerts you enable below"
                      : notifPermission === "denied"
                        ? "Click the lock icon 🔒 in your browser address bar to re-enable"
                        : "Click below to enable browser notifications"}
                  </p>
                </div>

                {notifPermission === "default" && (
                  <button
                    onClick={handleEnableNotifications}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
                  >
                    🔔 Enable Notifications
                  </button>
                )}

                {/* ── NOTIFICATION TYPE TOGGLES ── */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                    Which notifications to receive
                  </p>
                  <div className="space-y-2">
                    {/* Deadline toggle */}
                    <div
                      onClick={() =>
                        handleNotifPrefChange(
                          "deadlineEnabled",
                          !notifPrefs.deadlineEnabled,
                        )
                      }
                      className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all
              ${
                notifPrefs.deadlineEnabled
                  ? "border-blue-100 bg-blue-50"
                  : "border-gray-100 bg-gray-50 opacity-60"
              }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-5 rounded-full transition-all relative flex-shrink-0
                ${notifPrefs.deadlineEnabled ? "bg-blue-500" : "bg-gray-300"}`}
                        >
                          <div
                            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all
                  ${notifPrefs.deadlineEnabled ? "left-4" : "left-0.5"}`}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">
                            📅 Deadline Reminders
                          </p>
                          <p className="text-xs text-gray-400">
                            Alerts before application deadlines
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full
              ${notifPrefs.deadlineEnabled ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-400"}`}
                      >
                        {notifPrefs.deadlineEnabled ? "ON" : "OFF"}
                      </span>
                    </div>

                    {/* Interview toggle */}
                    <div
                      onClick={() =>
                        handleNotifPrefChange(
                          "interviewEnabled",
                          !notifPrefs.interviewEnabled,
                        )
                      }
                      className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all
              ${
                notifPrefs.interviewEnabled
                  ? "border-blue-100 bg-blue-50"
                  : "border-gray-100 bg-gray-50 opacity-60"
              }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-5 rounded-full transition-all relative flex-shrink-0
                ${notifPrefs.interviewEnabled ? "bg-blue-500" : "bg-gray-300"}`}
                        >
                          <div
                            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all
                  ${notifPrefs.interviewEnabled ? "left-4" : "left-0.5"}`}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">
                            🎤 Interview Reminders
                          </p>
                          <p className="text-xs text-gray-400">
                            Alerts before scheduled interviews
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full
              ${notifPrefs.interviewEnabled ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-400"}`}
                      >
                        {notifPrefs.interviewEnabled ? "ON" : "OFF"}
                      </span>
                    </div>

                    {/* Follow-up toggle */}
                    <div
                      onClick={() =>
                        handleNotifPrefChange(
                          "followupEnabled",
                          !notifPrefs.followupEnabled,
                        )
                      }
                      className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all
              ${
                notifPrefs.followupEnabled
                  ? "border-blue-100 bg-blue-50"
                  : "border-gray-100 bg-gray-50 opacity-60"
              }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-5 rounded-full transition-all relative flex-shrink-0
                ${notifPrefs.followupEnabled ? "bg-blue-500" : "bg-gray-300"}`}
                        >
                          <div
                            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all
                  ${notifPrefs.followupEnabled ? "left-4" : "left-0.5"}`}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">
                            📬 Follow-up Reminders
                          </p>
                          <p className="text-xs text-gray-400">
                            Nudge to follow up after 14+ days
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full
              ${notifPrefs.followupEnabled ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-400"}`}
                      >
                        {notifPrefs.followupEnabled ? "ON" : "OFF"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── DEADLINE WARNING WINDOW SLIDER ── */}
                {notifPrefs.deadlineEnabled && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-gray-600">
                        📅 Warn me about deadlines how many days in advance?
                      </label>
                      <span className="text-sm font-bold text-blue-600">
                        {notifPrefs.deadlineWarningDays} days
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={14}
                      value={notifPrefs.deadlineWarningDays}
                      onChange={(e) =>
                        handleNotifPrefChange(
                          "deadlineWarningDays",
                          Number(e.target.value),
                        )
                      }
                      className="w-full accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-gray-300 mt-0.5">
                      <span>1 day</span>
                      <span>14 days</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      You will see deadline notifications starting{" "}
                      {notifPrefs.deadlineWarningDays} days before the deadline
                    </p>
                  </div>
                )}

                {/* Save + Test buttons */}
                <button
                  onClick={handleSaveNotifPrefs}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
                >
                  {savedPrefs ? "✅ Saved!" : "Save Notification Settings"}
                </button>

                {/* {notifPermission === "granted" && (
                  <button
                    onClick={sendTestNotification}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors"
                  >
                    🔔 Send Test Notification
                  </button>
                )} */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
