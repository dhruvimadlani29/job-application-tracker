// src/pages/auth/ForgotPasswordPage.jsx
import { useState } from 'react'
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth'
import { useNavigate, Link } from 'react-router-dom'

function ForgotPasswordPage() {
  const [step, setStep]         = useState('request')
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

  const inputClass = `mt-1 w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3
    text-sm outline-none focus:border-blue-400 transition-colors
    bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
    placeholder:text-gray-400 dark:placeholder:text-gray-500`

  const labelClass = "text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100
      dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-8">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600
            flex items-center justify-center text-white text-xl">🎯</div>
          <div>
            <h1 className="font-bold text-gray-800 dark:text-gray-100 text-lg">CoopTracker</h1>
            <p className="text-xs text-gray-400">Algonquin College</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
            text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {/* Step 1 — Request Code */}
        {step === 'request' && (
          <>
            <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/30 rounded-2xl
              flex items-center justify-center text-3xl mx-auto mb-4">
              🔑
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-1">
              Forgot password?
            </h2>
            <p className="text-sm text-gray-400 text-center mb-6">
              Enter your email and we will send you a reset code
            </p>
            <form onSubmit={handleRequestCode} className="space-y-4">
              <div>
                <label className={labelClass}>Email Address</label>
                <input type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@algonquincollege.com"
                  required className={inputClass}/>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50
                  text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                {loading ? 'Sending...' : 'Send Reset Code →'}
              </button>
            </form>
          </>
        )}

        {/* Step 2 — Reset Password */}
        {step === 'reset' && (
          <>
            <div className="w-16 h-16 bg-green-50 dark:bg-green-900/30 rounded-2xl
              flex items-center justify-center text-3xl mx-auto mb-4">
              📧
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-1">
              Check your email
            </h2>
            <p className="text-sm text-gray-400 text-center mb-6">
              Enter the code sent to{' '}
              <span className="font-semibold text-blue-600 dark:text-blue-400">{email}</span>{' '}
              and your new password
            </p>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className={labelClass}>Reset Code</label>
                <input name="code" type="text" value={formData.code}
                  onChange={handleChange} placeholder="6-digit code from email"
                  maxLength={6} required
                  className={`${inputClass} text-center text-xl tracking-widest font-bold`}/>
              </div>
              <div>
                <label className={labelClass}>New Password</label>
                <input name="password" type="password" value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 8 chars, uppercase, number, symbol"
                  required className={inputClass}/>
              </div>
              <div>
                <label className={labelClass}>Confirm New Password</label>
                <input name="confirmPassword" type="password" value={formData.confirmPassword}
                  onChange={handleChange} placeholder="Re-enter new password"
                  required className={inputClass}/>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50
                  text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                {loading ? 'Resetting...' : 'Reset Password →'}
              </button>
            </form>
          </>
        )}

        <p className="text-center text-sm text-gray-400 mt-6">
          <Link to="/login"
            className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800">
            ← Back to login
          </Link>
        </p>

      </div>
    </div>
  )
}

export default ForgotPasswordPage