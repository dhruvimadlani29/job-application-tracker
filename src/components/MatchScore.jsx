// src/components/MatchScore.jsx
import { useState } from 'react'

function MatchScore({ company, role }) {
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult]                 = useState('')
  const [loading, setLoading]               = useState(false)
  const [show, setShow]                     = useState(false)

  async function analyzeMatch() {
    // Don't run if job description is empty
    if (!jobDescription.trim()) {
      alert('Please paste the job description first!')
      return
    }

    setLoading(true)
    setResult('')

    // This is YOUR real resume summary
    // Update this with your actual skills and experience!
    const myResume = `
      Name: Dhruvi Madlani
      Program: Web Development and Internet Applications, Algonquin College
      Skills: HTML, CSS, JavaScript, React.js, Node.js, Git, GitHub
      Projects: Co-op Application Tracker (React, Groq AI, Tailwind CSS)
      Currently learning: AWS, REST APIs, databases
    `

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 500,
          messages: [{
            role: 'user',
            content: `You are a resume expert. Compare this resume to the job description below.

RESUME:
${myResume}

JOB DESCRIPTION FOR ${role} at ${company}:
${jobDescription}

Give me:
1. A match percentage score out of 100
2. List of 3 skills from the job that match my resume (label as MATCHED)
3. List of 3 important skills from the job missing from my resume (label as MISSING)
4. One short sentence of advice to improve my match score

Keep the entire response under 150 words. Be specific and helpful.`
          }]
        })
      })

      if (!response.ok) {
        const err = await response.json()
        setResult(`Error: ${err.error?.message || 'Something went wrong'}`)
        setLoading(false)
        return
      }

      const data = await response.json()
      setResult(data.choices[0].message.content)

    } catch (err) {
      setResult('Network error — check your internet connection.')
    }

    setLoading(false)
  }

  return (
    <div className="mt-2">

      {/* Toggle Button */}
      <button
        onClick={() => setShow(!show)}
        className="bg-green-100 hover:bg-green-200 text-green-700 font-semibold text-xs px-4 py-2 rounded-lg transition-colors"
      >
        📊 {show ? 'Hide Match Score' : 'Check Resume Match'}
      </button>

      {/* Match Score Panel */}
      {show && (
        <div className="mt-3 bg-green-50 border border-green-100 rounded-xl p-4">

          <p className="text-xs font-bold text-green-600 uppercase tracking-wide mb-2">
            📊 Resume Match Scorer
          </p>

          {/* Job Description Input */}
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here and AI will tell you how well your resume matches it..."
            className="w-full text-sm border border-green-200 rounded-xl p-3 outline-none focus:border-green-400 transition-colors resize-none bg-white"
            rows={4}
          />

          {/* Analyze Button */}
          <button
            onClick={analyzeMatch}
            className="mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors"
          >
            {loading ? 'Analyzing...' : '🔍 Analyze My Match'}
          </button>

          {/* Loading Spinner */}
          {loading && (
            <div className="flex items-center gap-2 text-green-600 text-sm mt-3">
              <div className="w-4 h-4 border-2 border-green-300 border-t-green-600 rounded-full animate-spin"/>
              AI is analyzing your resume match...
            </div>
          )}

          {/* Result */}
          {!loading && result && (
            <div className="mt-3 bg-white border border-green-100 rounded-xl p-4">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                {result}
              </pre>
            </div>
          )}

        </div>
      )}

    </div>
  )
}

export default MatchScore