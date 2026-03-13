// src/components/EmailGenerator.jsx
import { useState } from "react";

function EmailGenerator({ company, role }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);

 async function generateEmail() {
    setShow(true)
    setLoading(true)
    setEmail('')

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 300,
          messages: [
            {
              role: 'user',
              content: `Write a short professional follow-up email for a co-op job application.
                        Company: ${company}
                        Role: ${role}
                        Keep it under 80 words. Sound friendly, confident and professional.
                        Include a subject line at the top.`
            }
          ]
        })
      })

      // This shows us the real error if something goes wrong
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Groq error:', errorData)
        setEmail(`Error: ${errorData.error?.message || 'Unknown error'}`)
        setLoading(false)
        return
      }

      const data = await response.json()
      setEmail(data.choices[0].message.content)

    } catch (err) {
      console.error('Network error:', err)
      setEmail('Network error — make sure you are connected to the internet.')
    }

    setLoading(false)
  }

  function copyEmail() {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-3">
      {/* Button to trigger AI */}
      <button
        onClick={generateEmail}
        className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold text-xs px-4 py-2 rounded-lg transition-colors"
      >
        🤖 Generate Follow-Up Email
      </button>

      {/* This box only shows after button is clicked */}
      {show && (
        <div className="mt-3 bg-purple-50 border border-purple-100 rounded-xl p-4">
          {/* Loading state */}
          {loading && (
            <div className="flex items-center gap-2 text-purple-600 text-sm">
              <div className="w-4 h-4 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
              AI is writing your email...
            </div>
          )}

          {/* Email result */}
          {!loading && email && (
            <>
              <p className="text-xs font-bold text-purple-500 uppercase tracking-wide mb-2">
                ✨ AI Generated Email
              </p>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                {email}
              </pre>

              {/* Copy button */}
              <button
                onClick={copyEmail}
                className="mt-3 text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors"
              >
                {copied ? "✅ Copied!" : "📋 Copy to clipboard"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default EmailGenerator;
