// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"/>
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Logged in → show the page
  return children
}

export default ProtectedRoute