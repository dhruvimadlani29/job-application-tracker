// src/pages/auth/VerifyPage.jsx
import { useState } from 'react'
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'

function VerifyPage() {
  const [code, setCode]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError]       = useState('')
  const [resent, setResent]     = useState(false)
  const navigate                = useNavigate()
  const [searchParams]          = useSearchParams()
  const email                   = searchParams.get('email') || ''

  async function handleVerify(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await confirmSignUp({
        username:         email,
        confirmationCode: code.trim()
      })
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

        {/* Icon */}
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
          📧
        </div>

        <h2 className="text-2xl font-bold text-gray-800 text-center mb-1">
          Check your email
        </h2>
        <p className="text-sm text-gray-400 text-center mb-2">
          We sent a 6-digit verification code to
        </p>
        <p className="text-sm font-semibold text-blue-600 text-center mb-6">
          {email}
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {/* Resent confirmation */}
        {resent && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl px-4 py-3 mb-4">
            ✅ New code sent! Check your email.
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Verification Code
            </label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              required
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors text-center text-2xl tracking-widest font-bold"
            />
          </div>

          <button
            type="submit"
            disabled={loading || code.length < 6}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            {loading ? 'Verifying...' : 'Verify Email →'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-xs text-gray-400 mb-2">Didn't receive the code?</p>
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors"
          >
            {resending ? 'Sending...' : 'Resend code'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-4">
          <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-800">
            ← Back to login
          </Link>
        </p>

      </div>
    </div>
  )
}

export default VerifyPage