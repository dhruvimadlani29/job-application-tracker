// src/components/aitools/callAI.js
const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL    = 'llama-3.3-70b-versatile'

export async function callAI(prompt, maxTokens = 500) {
  const response = await fetch(GROQ_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      model:      MODEL,
      max_tokens: maxTokens,
      messages:   [{ role: 'user', content: prompt }]
    })
  })
  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error?.message || 'Something went wrong')
  }
  const data = await response.json()
  return data.choices[0].message.content
}

export const GROQ_URL = GROQ_API
export const AI_MODEL = MODEL