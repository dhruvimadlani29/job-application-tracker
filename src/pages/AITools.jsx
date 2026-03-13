// src/pages/AITools.jsx
function AITools() {
  return (
    <div>
      <p className="text-sm text-gray-400 mb-6">
        All AI features are powered by Groq LLaMA — completely free.
      </p>
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon:'✉️', title:'Follow-Up Email',
            desc:'Generate a personalized follow-up email for any application in seconds.',
            color:'purple' },
          { icon:'📊', title:'Resume Match Score',
            desc:'Paste a job description and see exactly how well your resume matches it.',
            color:'green' },
          { icon:'🎤', title:'Interview Prep',
            desc:'Get 6 role-specific interview questions with tips before any interview.',
            color:'orange' },
        ].map(tool => (
          <div key={tool.title}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
            <div className="text-3xl mb-3">{tool.icon}</div>
            <h3 className="font-bold text-gray-800 mb-2">{tool.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{tool.desc}</p>
            <p className="text-xs text-blue-500 font-semibold mt-4">
              Available on every application card →
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AITools