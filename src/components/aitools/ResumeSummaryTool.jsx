// src/components/aitools/ResumeSummaryTool.jsx
import { useState } from 'react'
import ResultBox from './ResultBox'
import { callAI } from './callAI'

function ResumeSummaryTool() {
  const [form, setForm]       = useState({ program: '', skills: '', experience: '', goal: '' })
  const [result, setResult]   = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied]   = useState(false)

  async function generate() {
    if (!form.skills) {
      alert('Please enter your skills!')
      return
    }
    setLoading(true)
    setResult('')
    try {
      const res = await callAI(`
        Write 3 different resume summary/objective options for a co-op student.
        
        Program: ${form.program || 'Web Development and Internet Applications, Algonquin College'}
        Skills: ${form.skills}
        Experience: ${form.experience || 'Academic projects and coursework'}
        Career Goal: ${form.goal || 'seeking a software development co-op position'}
        
        Requirements:
        - Each summary should be 2-3 sentences
        - Start with a strong opener (not "I am a...")
        - Include 2-3 key skills naturally
        - Sound confident and specific
        - Label them Option 1, Option 2, Option 3
        - Each option should have a different angle/tone
      `, 400)
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
        <div className="col-span-2">
          <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
            Your Skills *
          </label>
          <input
            value={form.skills}
            onChange={e => setForm({ ...form, skills: e.target.value })}
            placeholder="e.g. React, JavaScript, Node.js, AWS, Git, Tailwind CSS"
            className="mt-1 w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5
  text-sm outline-none focus:border-blue-400 transition-colors
  bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
  placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
            Program / College
          </label>
          <input
            value={form.program}
            onChange={e => setForm({ ...form, program: e.target.value })}
            placeholder="e.g. Web Dev, Algonquin College"
            className="mt-1 w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5
  text-sm outline-none focus:border-blue-400 transition-colors
  bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
  placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
            Target Role
          </label>
          <input
            value={form.goal}
            onChange={e => setForm({ ...form, goal: e.target.value })}
            placeholder="e.g. Frontend Developer Co-op"
            className="mt-1 w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5
  text-sm outline-none focus:border-blue-400 transition-colors
  bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
  placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
        <div className="col-span-2">
          <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
            Experience / Projects
          </label>
          <input
            value={form.experience}
            onChange={e => setForm({ ...form, experience: e.target.value })}
            placeholder="e.g. Built Co-op Tracker app with React and AI, course projects in Node.js"
            className="mt-1 w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5
  text-sm outline-none focus:border-blue-400 transition-colors
  bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
  placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
      </div>

      <button
        onClick={generate}
        disabled={loading}
        className="mt-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
      >
        {loading ? 'Generating...' : '✨ Generate Resume Summaries'}
      </button>

      <ResultBox
        result={result} loading={loading}
        loadingText="Writing your resume summaries..."
        onCopy={copy} copied={copied}
      />
    </div>
  )
}

export default ResumeSummaryTool