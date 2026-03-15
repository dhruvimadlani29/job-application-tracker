// src/App.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import AppRouter from "./router/AppRouter";
import {
  getStatuses,
  getThresholds,
  saveStatuses,
  saveThresholds,
} from "./utils/thresholds";
import { useAuth } from "./hooks/useAuth";

function App() {
  const [statuses, setStatuses] = useState(getStatuses);
  const [thresholds, setThresholds] = useState(getThresholds);
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    saveStatuses(statuses);
  }, [statuses]);
  useEffect(() => {
    saveThresholds(thresholds);
  }, [thresholds]);

  // Auth pages — no sidebar or topbar
  const AUTH_PAGES = [
    "/login",
    "/signup",
    "/verify",
    "/forgot-password",
    "/terms",
  ];
  const isAuthPage = AUTH_PAGES.includes(location.pathname);

  // Show loading spinner while checking if user is logged in
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm font-medium">
            Loading Job Application Tracker...
          </p>
        </div>
      </div>
    );
  }

  // ── AUTH PAGES LAYOUT — no sidebar, no topbar ──
  if (isAuthPage) {
    return (
      <AppRouter
        statuses={statuses}
        setStatuses={setStatuses}
        thresholds={thresholds}
        setThresholds={setThresholds}
      />
    );
  }

  // ── MAIN APP LAYOUT — with sidebar and topbar ──
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar — always visible when logged in */}
      <Sidebar user={user} onLogout={logout} />

      {/* Main content — offset by sidebar width */}
      <div className="ml-56 flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <TopBar />

        {/* Page content */}
        <div className="flex-1 p-8">
          <AppRouter
            statuses={statuses}
            setStatuses={setStatuses}
            thresholds={thresholds}
            setThresholds={setThresholds}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
