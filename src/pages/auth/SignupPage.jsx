// src/pages/auth/SignupPage.jsx
import { useState } from 'react'
import { signUp } from 'aws-amplify/auth'
import { useNavigate, Link } from 'react-router-dom'

function SignupPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const navigate              = useNavigate()

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function validatePassword(password) {
    if (password.length < 8)            return 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(password))        return 'Password must contain at least one uppercase letter'
    if (!/[a-z]/.test(password))        return 'Password must contain at least one lowercase letter'
    if (!/[0-9]/.test(password))        return 'Password must contain at least one number'
    if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!')
      return
    }
    const passwordError = validatePassword(formData.password)
    if (passwordError) { setError(passwordError); return }

    setLoading(true)
    try {
      await signUp({
        username: formData.email,
        password: formData.password,
        options: {
          userAttributes: { email: formData.email, name: formData.name }
        }
      })
      navigate(`/verify?email=${encodeURIComponent(formData.email)}`)
    } catch (err) {
      if (err.name === 'UsernameExistsException') {
        setError('An account with this email already exists. Please sign in.')
      } else if (err.name === 'InvalidPasswordException') {
        setError('Password does not meet the requirements below.')
      } else {
        setError(err.message || 'Something went wrong. Please try again.')
      }
    }
    setLoading(false)
  }

  const passwordChecks = [
    { check: formData.password.length >= 8,           text: 'At least 8 characters'        },
    { check: /[A-Z]/.test(formData.password),         text: 'One uppercase letter (A-Z)'   },
    { check: /[a-z]/.test(formData.password),         text: 'One lowercase letter (a-z)'   },
    { check: /[0-9]/.test(formData.password),         text: 'One number (0-9)'              },
    { check: /[^A-Za-z0-9]/.test(formData.password),  text: 'One special character (!@#$)' },
  ]

  const inputClass = `mt-1 w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5
    text-sm outline-none focus:border-blue-400 transition-colors
    bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
    placeholder:text-gray-400 dark:placeholder:text-gray-500`

  const labelClass = "text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
      flex items-center justify-center p-4">
      <div className="w-full max-w-5xl flex rounded-3xl shadow-2xl overflow-hidden
        bg-white dark:bg-gray-800">

        {/* Left panel */}
        <div className="hidden lg:flex w-2/5 bg-gradient-to-br from-blue-600 to-indigo-700
          p-10 flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white text-xl">
                🎯
              </div>
              <span className="font-bold text-white text-lg">CoopTracker</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
              Land your co-op faster
            </h1>
            <p className="text-blue-100 text-sm leading-relaxed mb-8">
              Track every application, prep for interviews with AI, and never miss a deadline again.
            </p>
            {[
              { icon: '🤖', text: 'AI-powered email and cover letter generator' },
              { icon: '📊', text: 'Resume match scoring for every job posting'  },
              { icon: '🔔', text: 'Smart deadline and interview reminders'       },
              { icon: '📈', text: 'Analytics to track your application progress' },
            ].map(f => (
              <div key={f.text} className="flex items-start gap-3 mb-4">
                <span className="text-xl flex-shrink-0">{f.icon}</span>
                <p className="text-blue-100 text-sm">{f.text}</p>
              </div>
            ))}
          </div>
          <p className="text-blue-200 text-xs">Built for Algonquin College students 🎓</p>
        </div>

        {/* Right panel */}
        <div className="flex-1 p-8 lg:p-10 flex flex-col justify-center">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600
              flex items-center justify-center text-white">🎯</div>
            <span className="font-bold text-gray-800 dark:text-gray-100">CoopTracker</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            Create your account 🚀
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800">
              Sign in
            </Link>
          </p>

          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
              text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4 max-sm:grid-cols-1">

              <div>
                <label className={labelClass}>Full Name</label>
                <input name="name" type="text" value={formData.name}
                  onChange={handleChange} placeholder="e.g. Dhruvi Madlani"
                  required className={inputClass}/>
              </div>

              <div>
                <label className={labelClass}>Email Address</label>
                <input name="email" type="email" value={formData.email}
                  onChange={handleChange} placeholder="you@algonquincollege.com"
                  required className={inputClass}/>
              </div>

              <div>
                <label className={labelClass}>Password</label>
                <input name="password" type="password" value={formData.password}
                  onChange={handleChange} placeholder="Create a strong password"
                  required className={inputClass}/>
              </div>

              <div>
                <label className={labelClass}>Confirm Password</label>
                <input name="confirmPassword" type="password" value={formData.confirmPassword}
                  onChange={handleChange} placeholder="Re-enter your password"
                  required className={inputClass}/>
              </div>

            </div>

            {/* Password requirements */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 mb-4">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-2">
                Password requirements:
              </p>
              <div className="grid grid-cols-2 gap-1">
                {passwordChecks.map(req => (
                  <div key={req.text} className="flex items-center gap-1.5">
                    <span className={`text-xs transition-colors ${req.check ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`}>
                      {req.check ? '✅' : '○'}
                    </span>
                    <span className={`text-xs transition-colors ${req.check ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50
                text-white font-semibold py-3 rounded-xl transition-colors text-sm">
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
            By creating an account you agree to our{' '}
            <Link to="/terms" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 font-semibold">
              Terms of Service
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default SignupPage