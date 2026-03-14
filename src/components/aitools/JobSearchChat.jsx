// src/components/aitools/JobSearchChat.jsx
import { useState } from 'react'
import { GROQ_URL, AI_MODEL } from './callAI'

function JobSearchChat() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    text: "Hi! 👋 I'm your co-op job search coach. Ask me anything — interview tips, how to negotiate, what to put on your resume, how to follow up, or anything else about your co-op search!"
  }])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)

  async function sendMessage() {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)

    try {
      const history = messages.map(m => ({
        role:    m.role === 'assistant' ? 'assistant' : 'user',
        content: m.text
      }))

      const response = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type':  'application/json',
        },
        body: JSON.stringify({
          model:      AI_MODEL,
          max_tokens: 400,
          messages: [
            {
              role:    'system',
              content: `You are a helpful co-op job search coach for college students in Canada, 
              specifically Algonquin College students in Ottawa. 
              Give practical, specific, actionable advice about job searching, interviews, 
              resumes, networking, and co-op applications.
              Keep responses concise — under 150 words. Be friendly and encouraging.`
            },
            ...history,
            { role: 'user', content: userMsg }
          ]
        })
      })

      const data  = await response.json()
      const reply = data.choices[0].message.content
      setMessages(prev => [...prev, { role: 'assistant', text: reply }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: `Error: ${e.message}` }])
    }

    setLoading(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const suggestions = [
    "How do I follow up after an interview?",
    "What should I wear to a co-op interview?",
    "How many jobs should I apply to per week?",
    "How do I negotiate a co-op offer?",
  ]

  return (
    <div>

      {/* Chat messages */}
      <div className="bg-gray-50 rounded-xl p-4 h-64 overflow-y-auto flex flex-col gap-3 mb-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed
              ${msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestion chips — only show at start */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="text-xs bg-orange-50 hover:bg-orange-100 text-orange-600 font-semibold px-3 py-1.5 rounded-full transition-colors border border-orange-200"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your co-op search... (Enter to send)"
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          Send
        </button>
      </div>

    </div>
  )
}

export default JobSearchChat