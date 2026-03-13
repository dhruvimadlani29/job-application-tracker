// src/components/WeeklySummary.jsx
import { useState } from 'react'

function WeeklySummary({ applications }) {
  const [summary, setSummary]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [generated, setGenerated] = useState(false)

  async function generateSummary() {
    setLoading(true)
    setSummary('')

    // Build a simple text snapshot of current applications
    // so AI knows exactly what the user's situation is
    const appSnapshot = applications.map(app =>
      `- ${app.company} | ${app.role} | Status: ${app.status} | Applied: ${app.dateApplied}`
    ).join('\n')

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 200,
          messages: [{
            role: 'user',
            content: `You are a helpful co-op job search coach.
            
Here are a student's current co-op applications:
${appSnapshot}

Today's date is: ${new Date().toDateString()}

Give a short motivating weekly summary in 3-4 sentences:
1. Comment on their overall progress
2. Flag any applications that need attention (interviews coming, long wait times)
3. Give ONE specific action they should take today

Keep it friendly, specific, and under 80 words. 
Do NOT use bullet points — write as natural flowing sentences.`
          }]
        })
      })

      if (!response.ok) {
        const err = await response.json()
        setSummary(`Error: ${err.error?.message || 'Something went wrong'}`)
        setLoading(false)
        return
      }

      const data = await response.json()
      setSummary(data.choices[0].message.content)
      setGenerated(true)

    } catch (err) {
      setSummary('Network error — check your internet connection.')
    }

    setLoading(false)
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white">

      <div className="flex justify-between items-start">

        {/* Left — title + content */}
        <div className="flex gap-4 flex-1">
          <div className="text-3xl flex-shrink-0">🤖</div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider opacity-75 mb-1">
              AI Weekly Summary
            </p>

            {/* Before generating */}
            {!generated && !loading && (
              <p className="text-sm opacity-80">
                Get a personalized summary of your co-op search progress and what to do next.
              </p>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex items-center gap-2 text-sm opacity-90">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                AI is analyzing your applications...
              </div>
            )}

            {/* Summary result */}
            {!loading && summary && (
              <p className="text-sm leading-relaxed opacity-95">{summary}</p>
            )}
          </div>
        </div>

        {/* Right — button */}
        <button
          onClick={generateSummary}
          disabled={loading}
          className="ml-4 flex-shrink-0 bg-white/20 hover:bg-white/30 disabled:opacity-50 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all border border-white/20 whitespace-nowrap"
        >
          {loading ? 'Generating...' : generated ? '🔄 Refresh' : '✨ Generate'}
        </button>

      </div>

    </div>
  )
}

export default WeeklySummary