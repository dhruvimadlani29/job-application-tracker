// src/pages/auth/LoginPage.jsx
import { useState } from 'react'
import { signIn } from 'aws-amplify/auth'
import { useNavigate, Link } from 'react-router-dom'

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [remember, setRemember] = useState(false)
  const navigate                = useNavigate()

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn({
        username: formData.email,
        password: formData.password,
      })

      if (result.isSignedIn) {
        navigate('/dashboard')
      } else if (result.nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
        navigate(`/verify?email=${encodeURIComponent(formData.email)}`)
      }

    } catch (err) {
      console.error(err)
      if (err.name === 'UserNotFoundException' || err.name === 'NotAuthorizedException') {
        setError('Incorrect email or password. Please try again.')
      } else if (err.name === 'UserNotConfirmedException') {
        navigate(`/verify?email=${encodeURIComponent(formData.email)}`)
      } else {
        setError(err.message || 'Something went wrong. Please try again.')
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl">
            🎯
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-lg">Job Application Tracker</h1>
            <p className="text-xs text-gray-400">Algonquin College</p>
          </div>
        </div>

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome back 👋</h2>
        <p className="text-sm text-gray-400 mb-6">Sign in to manage your co-op applications</p>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@algonquincollege.com"
              required
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-blue-500 hover:text-blue-700 font-semibold"
              >
                Forgot password?
              </Link>
            </div>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
            />
          </div>

          {/* Remember me */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setRemember(!remember)}
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all
              ${remember ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
              {remember && <span className="text-white text-xs">✓</span>}
            </div>
            <span className="text-sm text-gray-600">Remember me</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-100"/>
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-100"/>
        </div>

        {/* Google Sign In — coming soon */}
        <button
          disabled
          className="w-full border border-gray-200 text-gray-400 font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 cursor-not-allowed"
        >
          <span>🔵</span> Continue with Google (coming soon)
        </button>

        {/* Sign up link */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 font-semibold hover:text-blue-800">
            Sign up free
          </Link>
        </p>

      </div>
    </div>
  )
}

export default LoginPage