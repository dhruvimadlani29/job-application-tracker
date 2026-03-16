// src/components/aitools/CoverLetterTool.jsx
import { useState } from 'react'
import ResultBox from './ResultBox'
import { callAI } from './callAI'

function CoverLetterTool() {
  const [form, setForm]       = useState({ company: '', role: '', jd: '', skills: '' })
  const [result, setResult]   = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied]   = useState(false)

  async function generate() {
    if (!form.company || !form.role) {
      alert('Please fill in Company and Role!')
      return
    }
    setLoading(true)
    setResult('')
    try {
      const res = await callAI(`
        Write a professional cover letter for a co-op student applying to ${form.role} at ${form.company}.
        
        Job Description highlights: ${form.jd || 'Not provided'}
        Student skills: ${form.skills || 'React, JavaScript, Node.js, Git'}
        
        Requirements:
        - 3 short paragraphs
        - Opening: why this company specifically
        - Middle: 2-3 relevant skills with brief examples
        - Closing: enthusiasm and call to action
        - Professional but personable tone
        - Under 250 words
        - Do NOT include [brackets] or placeholder text
      `, 600)
      setResult(res)
    } catch (e) {
      setResult(`Error: ${e.message}`)
    }
    setLoading(false)
  }

  function copy() {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Company *</label>
          <input
            value={form.company}
            onChange={e => setForm({ ...form, company: e.target.value })}
            placeholder="e.g. Klarna"
            className="mt-1 w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5
  text-sm outline-none focus:border-blue-400 transition-colors
  bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
  placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Role *</label>
          <input
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            placeholder="e.g. Backend Developer Co-op"
            className="mt-1 w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5
  text-sm outline-none focus:border-blue-400 transition-colors
  bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
  placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
        <div className="col-span-2">
          <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Your Key Skills</label>
          <input
            value={form.skills}
            onChange={e => setForm({ ...form, skills: e.target.value })}
            placeholder="e.g. React, Node.js, AWS, Git, REST APIs"
            className="mt-1 w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5
  text-sm outline-none focus:border-blue-400 transition-colors
  bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
  placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
        <div className="col-span-2">
          <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
            Job Description (optional but recommended)
          </label>
          <textarea
            value={form.jd}
            onChange={e => setForm({ ...form, jd: e.target.value })}
            placeholder="Paste the job description here for a more tailored cover letter..."
            rows={3}
className="mt-1 w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5
  text-sm outline-none focus:border-blue-400 transition-colors
  bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
  placeholder:text-gray-400 dark:placeholder:text-gray-500"          />
        </div>
      </div>

      <button
        onClick={generate}
        disabled={loading}
        className="mt-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
      >
        {loading ? 'Generating...' : '📝 Generate Cover Letter'}
      </button>

      <ResultBox
        result={result} loading={loading}
        loadingText="Writing your cover letter..."
        onCopy={copy} copied={copied}
      />
    </div>
  )
}

export default CoverLetterTool