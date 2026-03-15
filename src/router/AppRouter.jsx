// src/router/AppRouter.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard        from '../pages/Dashboard'
import AITools          from '../pages/AITools'
import Resumes          from '../pages/Resumes'
import Analytics        from '../pages/Analytics'
import Settings         from '../pages/Settings'
import LoginPage        from '../pages/auth/LoginPage'
import SignupPage       from '../pages/auth/SignupPage'
import VerifyPage       from '../pages/auth/VerifyPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import ProtectedRoute   from '../components/ProtectedRoute'
import TermsPage from '../pages/TermsPage'

function AppRouter({ statuses, setStatuses, thresholds, setThresholds }) {
  return (
    <Routes>

      {/* ── PUBLIC ROUTES — no login needed ── */}
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/signup"          element={<SignupPage />} />
      <Route path="/verify"          element={<VerifyPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/terms"           element={<TermsPage />} />

      {/* ── PROTECTED ROUTES — must be logged in ── */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard statuses={statuses} thresholds={thresholds} />
        </ProtectedRoute>
      }/>

      <Route path="/aitools" element={
        <ProtectedRoute><AITools /></ProtectedRoute>
      }/>

      <Route path="/resumes" element={
        <ProtectedRoute><Resumes /></ProtectedRoute>
      }/>

      <Route path="/analytics" element={
        <ProtectedRoute><Analytics /></ProtectedRoute>
      }/>

      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings
            statuses={statuses}
            setStatuses={setStatuses}
            thresholds={thresholds}
            setThresholds={setThresholds}
          />
        </ProtectedRoute>
      }/>

      {/* Redirect root → login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Catch all unknown URLs */}
      <Route path="*" element={<Navigate to="/login" replace />} />

      <Route path="/terms"           element={<TermsPage />} />
    </Routes>
  )
}

export default AppRouter