// src/pages/auth/VerifyPage.jsx
import { useState } from 'react'
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'

function VerifyPage() {
  const [code, setCode]           = useState('')
  const [loading, setLoading]     = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError]         = useState('')
  const [resent, setResent]       = useState(false)
  const navigate                  = useNavigate()
  const [searchParams]            = useSearchParams()
  const email                     = searchParams.get('email') || ''

  async function handleVerify(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await confirmSignUp({ username: email, confirmationCode: code.trim() })
      navigate('/login?verified=true')
    } catch (err) {
      if (err.name === 'CodeMismatchException') {
        setError('Incorrect code. Please check your email and try again.')
      } else if (err.name === 'ExpiredCodeException') {
        setError('Code has expired. Please request a new one below.')
      } else {
        setError(err.message || 'Something went wrong.')
      }
    }
    setLoading(false)
  }

  async function handleResend() {
    setResending(true)
    setError('')
    try {
      await resendSignUpCode({ username: email })
      setResent(true)
      setTimeout(() => setResent(false), 5000)
    } catch (err) {
      setError(err.message || 'Could not resend code.')
    }
    setResending(false)
  }

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

        {/* Icon */}
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl
          flex items-center justify-center text-3xl mx-auto mb-4">
          📧
        </div>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-1">
          Check your email
        </h2>
        <p className="text-sm text-gray-400 text-center mb-2">
          We sent a 6-digit verification code to
        </p>
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 text-center mb-6">
          {email}
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
            text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {/* Resent */}
        {resent && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800
            text-green-600 dark:text-green-400 text-sm rounded-xl px-4 py-3 mb-4">
            ✅ New code sent! Check your email.
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
              Verification Code
            </label>
            <input
              type="text" value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6} required
              className="mt-1 w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3
                text-sm outline-none focus:border-blue-400 transition-colors text-center text-2xl
                tracking-widest font-bold bg-white dark:bg-gray-700
                text-gray-800 dark:text-gray-100"
            />
          </div>

          <button type="submit" disabled={loading || code.length < 6}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50
              text-white font-semibold py-3 rounded-xl transition-colors text-sm">
            {loading ? 'Verifying...' : 'Verify Email →'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-xs text-gray-400 mb-2">Didn't receive the code?</p>
          <button onClick={handleResend} disabled={resending}
            className="text-sm font-semibold text-blue-500 dark:text-blue-400
              hover:text-blue-700 transition-colors">
            {resending ? 'Sending...' : 'Resend code'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-4">
          <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800">
            ← Back to login
          </Link>
        </p>

      </div>
    </div>
  )
}

export default VerifyPage