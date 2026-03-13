// src/components/InterviewPrep.jsx
import { useState } from 'react'

function InterviewPrep({ company, role }) {
  const [questions, setQuestions] = useState('')
  const [loading, setLoading]     = useState(false)
  const [show, setShow]           = useState(false)

  async function generateQuestions() {
    setShow(true)
    setLoading(true)
    setQuestions('')

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
            content: `Generate interview preparation questions for a co-op student.
                      Company: ${company}
                      Role: ${role}
                      
                      Give exactly 6 questions in this format:
                      - 2 Technical questions specific to the role
                      - 2 Behavioural questions (start with "Tell me about a time...")
                      - 1 Company-specific question about ${company}
                      - 1 Question about the student's goals and why co-op

                      After each question add a short tip in brackets on how to answer it.
                      Keep the whole response under 250 words.`
          }]
        })
      })

      if (!response.ok) {
        const err = await response.json()
        setQuestions(`Error: ${err.error?.message || 'Something went wrong'}`)
        setLoading(false)
        return
      }

      const data = await response.json()
      setQuestions(data.choices[0].message.content)

    } catch (err) {
      setQuestions('Network error — check your internet connection.')
    }

    setLoading(false)
  }

  return (
    <div className="mt-2">

      {/* Button */}
      <button
        onClick={generateQuestions}
        className="bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold text-xs px-4 py-2 rounded-lg transition-colors"
      >
        🎤 {show && questions ? 'Regenerate Questions' : 'Prep Interview Questions'}
      </button>

      {/* Questions Panel */}
      {show && (
        <div className="mt-3 bg-orange-50 border border-orange-100 rounded-xl p-4">

          <p className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-3">
            🎤 Interview Prep — {company}
          </p>

          {/* Loading */}
          {loading && (
            <div className="flex items-center gap-2 text-orange-600 text-sm">
              <div className="w-4 h-4 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin"/>
              AI is generating your interview questions...
            </div>
          )}

          {/* Questions Result */}
          {!loading && questions && (
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
              {questions}
            </pre>
          )}

        </div>
      )}

    </div>
  )
}

export default InterviewPrep