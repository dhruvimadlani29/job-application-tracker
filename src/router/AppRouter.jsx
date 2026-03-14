// src/router/AppRouter.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import AITools   from '../pages/AITools'
import Resumes   from '../pages/Resumes'
import Analytics from '../pages/Analytics'
import Settings  from '../pages/Settings'

function AppRouter({ statuses, setStatuses, thresholds, setThresholds }) {
  return (
    <Routes>

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/dashboard" element={
        <Dashboard
          statuses={statuses}
          thresholds={thresholds}
        />
      }/>

      <Route path="/aitools"   element={<AITools />} />
      <Route path="/resumes"   element={<Resumes />} />
      <Route path="/analytics" element={<Analytics />} />

      <Route path="/settings" element={
        <Settings
          statuses={statuses}
          setStatuses={setStatuses}
          thresholds={thresholds}
          setThresholds={setThresholds}
        />
      }/>

      {/* Catch all unknown URLs */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />

    </Routes>
  )
}

export default AppRouter