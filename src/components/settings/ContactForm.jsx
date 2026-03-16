// src/components/settings/ContactForm.jsx
import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { useAuth } from '../../hooks/useAuth'

function ContactForm() {
  const { user } = useAuth()

  const [formData, setFormData] = useState({ subject: 'General Question', message: '' })
  const [status, setStatus]     = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    if (!formData.message.trim()) {
      alert('Please write a message before sending!')
      return
    }
    setStatus('sending')
    setErrorMsg('')
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name:  user?.name  || 'CoopTracker User',
          from_email: user?.email || 'unknown@email.com',
          subject:    formData.subject,
          message:    formData.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      setStatus('success')
      setFormData({ subject: 'General Question', message: '' })
      setTimeout(() => setStatus('idle'), 4000)
    } catch (err) {
      console.error('EmailJS error:', err)
      setStatus('error')
      setErrorMsg('Failed to send. Please try again or email us directly.')
    }
  }

  const inputClass = `mt-1 w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3
    text-sm outline-none focus:border-blue-400 transition-colors
    bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
    placeholder:text-gray-400 dark:placeholder:text-gray-500`

  const labelClass = "text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide"

  return (
    <div className="px-6 pb-6 border-t border-gray-50 dark:border-gray-700 pt-4">

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4">
        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
          Have a question about CoopTracker, found a bug, or want to suggest a feature?
          Fill out the form below and we will get back to you as soon as possible.
        </p>
      </div>

      {/* Success */}
      {status === 'success' && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800
          rounded-xl p-4 mb-4 flex items-center gap-3">
          <span className="text-xl">✅</span>
          <div>
            <p className="text-sm font-bold text-green-700 dark:text-green-400">Message sent successfully!</p>
            <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">
              We received your message and will get back to you at {user?.email}
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
          rounded-xl p-4 mb-4 flex items-center gap-3">
          <span className="text-xl">❌</span>
          <div>
            <p className="text-sm font-bold text-red-700 dark:text-red-400">Failed to send</p>
            <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      <div className="space-y-3">

        {/* Sending as */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600
            flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-xs font-bold text-gray-600 dark:text-gray-300">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{user?.email || ''}</p>
          </div>
          <span className="ml-auto text-xs text-gray-400 dark:text-gray-500
            bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
            Sending as you
          </span>
        </div>

        {/* Subject */}
        <div>
          <label className={labelClass}>Subject</label>
          <select name="subject" value={formData.subject} onChange={handleChange}
            className={inputClass}>
            <option>General Question</option>
            <option>Bug Report</option>
            <option>Feature Request</option>
            <option>Terms of Service Inquiry</option>
            <option>Account Issue</option>
            <option>Other</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label className={labelClass}>Message</label>
          <textarea name="message" value={formData.message} onChange={handleChange}
            placeholder="Describe your question or issue in detail..."
            rows={4} className={`${inputClass} resize-none`}/>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right">
            {formData.message.length} characters
          </p>
        </div>

      </div>

      {/* Send */}
      <button
        onClick={handleSubmit}
        disabled={status === 'sending' || status === 'success'}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50
          text-white font-semibold py-3 rounded-xl text-sm transition-colors
          flex items-center justify-center gap-2"
      >
        {status === 'sending' ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
            Sending...
          </>
        ) : status === 'success' ? '✅ Message Sent!'
          : '✉️ Send Message'}
      </button>

      {/* Direct email */}
      <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-3">
        You can also email us directly at{' '}
        <a href="mailto:dhruvimadlani2902@gmail.com"
          className="text-blue-500 dark:text-blue-400 hover:text-blue-700 font-semibold">
          dhruvimadlani2902@gmail.com
        </a>
      </p>

    </div>
  )
}

export default ContactForm