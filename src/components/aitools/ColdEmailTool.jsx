// src/components/aitools/ColdEmailTool.jsx
import { useState } from 'react'
import ResultBox from './ResultBox'
import { callAI } from './callAI'

function ColdEmailTool() {
  const [form, setForm]       = useState({ company: '', role: '', reason: '' })
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
        Write a professional cold outreach email for a co-op student.
        Company: ${form.company}
        Role interested in: ${form.role}
        Why they're interested: ${form.reason || 'passionate about the company mission'}
        
        Requirements:
        - Under 120 words
        - Include a subject line
        - Friendly, confident, not desperate
        - End with a clear call to action
        - Sound like a real student, not a robot
      `)
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
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
            Company *
          </label>
          <input
            value={form.company}
            onChange={e => setForm({ ...form, company: e.target.value })}
            placeholder="e.g. Shopify"
            className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
            Role *
          </label>
          <input
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            placeholder="e.g. Frontend Developer Co-op"
            className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors"
          />
        </div>
        <div className="col-span-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
            Why this company? (optional)
          </label>
          <input
            value={form.reason}
            onChange={e => setForm({ ...form, reason: e.target.value })}
            placeholder="e.g. I love their approach to e-commerce and engineering blog"
            className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors"
          />
        </div>
      </div>

      <button
        onClick={generate}
        disabled={loading}
        className="mt-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
      >
        {loading ? 'Generating...' : '✉️ Generate Cold Email'}
      </button>

      <ResultBox
        result={result} loading={loading}
        loadingText="Writing your cold email..."
        onCopy={copy} copied={copied}
      />
    </div>
  )
}

export default ColdEmailTool