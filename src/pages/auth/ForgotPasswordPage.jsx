// src/pages/auth/ForgotPasswordPage.jsx
import { useState } from 'react'
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth'
import { useNavigate, Link } from 'react-router-dom'

function ForgotPasswordPage() {
  const [step, setStep]         = useState('request')  // 'request' or 'reset'
  const [email, setEmail]       = useState('')
  const [formData, setFormData] = useState({ code: '', password: '', confirmPassword: '' })
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const navigate                = useNavigate()

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleRequestCode(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await resetPassword({ username: email })
      setStep('reset')
    } catch (err) {
      if (err.name === 'UserNotFoundException') {
        setError('No account found with this email.')
      } else {
        setError(err.message || 'Something went wrong.')
      }
    }
    setLoading(false)
  }

  async function handleResetPassword(e) {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!')
      return
    }
    setLoading(true)
    setError('')
    try {
      await confirmResetPassword({
        username:         email,
        confirmationCode: formData.code.trim(),
        newPassword:      formData.password,
      })
      navigate('/login?reset=true')
    } catch (err) {
      if (err.name === 'CodeMismatchException') {
        setError('Incorrect code. Please check your email.')
      } else if (err.name === 'ExpiredCodeException') {
        setError('Code expired. Please go back and request a new one.')
      } else {
        setError(err.message || 'Something went wrong.')
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

        {/* Step 1 — Request Code */}
        {step === 'request' && (
          <>
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
              🔑
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-1">
              Forgot password?
            </h2>
            <p className="text-sm text-gray-400 text-center mb-6">
              Enter your email and we will send you a reset code
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleRequestCode} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@algonquincollege.com"
                  required
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                {loading ? 'Sending...' : 'Send Reset Code →'}
              </button>
            </form>
          </>
        )}

        {/* Step 2 — Reset Password */}
        {step === 'reset' && (
          <>
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
              📧
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-1">
              Check your email
            </h2>
            <p className="text-sm text-gray-400 text-center mb-6">
              Enter the code we sent to <span className="font-semibold text-blue-600">{email}</span> and your new password
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Reset Code
                </label>
                <input
                  name="code"
                  type="text"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="6-digit code from email"
                  maxLength={6}
                  required
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors text-center text-xl tracking-widest font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  New Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 8 chars, uppercase, number, symbol"
                  required
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Confirm New Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter new password"
                  required
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                {loading ? 'Resetting...' : 'Reset Password →'}
              </button>
            </form>
          </>
        )}

        <p className="text-center text-sm text-gray-400 mt-6">
          <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-800">
            ← Back to login
          </Link>
        </p>

      </div>
    </div>
  )
}

export default ForgotPasswordPage