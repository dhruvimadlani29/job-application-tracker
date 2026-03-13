// src/components/MatchScore.jsx
import { useState } from "react";

function MatchScore({ company, role }) {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  async function analyzeMatch() {
    if (!jobDescription.trim()) {
      alert("Please paste the job description first!");
      return;
    }

    setLoading(true);
    setResult("");

    const myResume = `
      Name: Dhruvi Madlani
      Program: Web Development and Internet Applications, Algonquin College
      Skills: HTML, CSS, JavaScript, React.js, Node.js, Git, GitHub
      Projects: Co-op Application Tracker (React, Groq AI, Tailwind CSS)
      Currently learning: AWS, REST APIs, databases
    `;

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            max_tokens: 500,
            messages: [
              {
                role: "user",
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

Keep the entire response under 150 words. Be specific and helpful.`,
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        const err = await response.json();
        setResult(`Error: ${err.error?.message || "Something went wrong"}`);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setResult(data.choices[0].message.content);
    } catch (err) {
      setResult("Network error — check your internet connection.");
    }

    setLoading(false);
  }

  function handleClose() {
    setShow(false);
    setResult("");
    setJobDescription("");
  }

  return (
    <div className="relative">
      {/* Button — never moves */}
      <button
        onClick={() => setShow(!show)}
        className="bg-green-100 hover:bg-green-200 text-green-700 font-semibold text-xs px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
      >
        📊 Check Resume Match
      </button>

      {/* Panel */}
      {show && (
        <div className="absolute left-0 top-10 z-10 w-96 bg-white border border-green-100 rounded-xl shadow-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-bold text-green-600 uppercase tracking-wide">
              📊 Resume Match Scorer
            </p>
            <button
              onClick={handleClose}
              className="text-gray-300 hover:text-gray-600 text-lg font-bold leading-none transition-colors"
            >
              ✕
            </button>
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full text-sm border border-green-200 rounded-xl p-3 outline-none focus:border-green-400 transition-colors resize-none bg-gray-50"
            rows={4}
          />

          <button
            onClick={analyzeMatch}
            className="mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors"
          >
            {loading ? "Analyzing..." : "🔍 Analyze My Match"}
          </button>

          {loading && (
            <div className="flex items-center gap-2 text-green-600 text-sm mt-3">
              <div className="w-4 h-4 border-2 border-green-300 border-t-green-600 rounded-full animate-spin" />
              Analyzing your resume match...
            </div>
          )}

          {!loading && result && (
            <div className="mt-3 bg-gray-50 rounded-xl p-3 max-h-60 overflow-y-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                {result}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MatchScore;
