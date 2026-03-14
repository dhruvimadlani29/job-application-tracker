import { useState } from 'react'
import ColdEmailTool       from '../components/aitools/ColdEmailTool'
import CoverLetterTool     from '../components/aitools/CoverLetterTool'
import ResumeSummaryTool   from '../components/aitools/ResumeSummaryTool'
import JobSearchChat       from '../components/aitools/JobSearchChat'
import CompanyResearchTool from '../components/aitools/CompanyResearchTool'

const TOOLS = [
  {
    id:          'cold-email',
    icon:        '✉️',
    title:       'Cold Email Generator',
    description: 'Write a professional outreach email to a company you haven\'t applied to yet',
    color:       'bg-blue-50 border-blue-200',
    iconBg:      'bg-blue-100',
    component:   <ColdEmailTool />
  },
  {
    id:          'cover-letter',
    icon:        '📝',
    title:       'Cover Letter Generator',
    description: 'Generate a tailored cover letter from a job description in seconds',
    color:       'bg-purple-50 border-purple-200',
    iconBg:      'bg-purple-100',
    component:   <CoverLetterTool />
  },
  {
    id:          'resume-summary',
    icon:        '✨',
    title:       'Resume Summary Writer',
    description: 'Get 3 different AI-written resume summary options tailored to your skills',
    color:       'bg-green-50 border-green-200',
    iconBg:      'bg-green-100',
    component:   <ResumeSummaryTool />
  },
  {
    id:          'chat',
    icon:        '💬',
    title:       'Job Search Coach',
    description: 'Chat with AI about anything — interviews, salary, follow-ups, resume tips',
    color:       'bg-orange-50 border-orange-200',
    iconBg:      'bg-orange-100',
    component:   <JobSearchChat />
  },
  {
    id:          'research',
    icon:        '🔍',
    title:       'Company & Role Research',
    description: 'Get a full research brief on any company and role before applying or interviewing',
    color:       'bg-indigo-50 border-indigo-200',
    iconBg:      'bg-indigo-100',
    component:   <CompanyResearchTool />
  },
]

function AITools() {
  const [activeTool, setActiveTool] = useState(null)
  const active = TOOLS.find(t => t.id === activeTool)

  return (
    <div>

      {/* ── HEADER ── */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-6 text-white">
        <p className="text-xs font-bold uppercase tracking-wider opacity-75 mb-1">
          AI Workspace
        </p>
        <h2 className="text-lg font-bold mb-1">Your Personal Job Search AI</h2>
        <p className="text-sm opacity-80">
          5 powerful AI tools to help you stand out, prepare better, and land your co-op faster.
          All powered by Groq LLaMA — completely free.
        </p>
      </div>

      {/* ── TOOL GRID ── */}
      {!activeTool && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {TOOLS.map(tool => (
            <div
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`border-2 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${tool.color}`}
            >
              <div className={`w-11 h-11 rounded-xl ${tool.iconBg} flex items-center justify-center text-2xl mb-3`}>
                {tool.icon}
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{tool.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{tool.description}</p>
              <p className="text-xs font-semibold text-blue-500 mt-3">Open Tool →</p>
            </div>
          ))}
        </div>
      )}

      {/* ── ACTIVE TOOL ── */}
      {activeTool && active && (
        <div>

          {/* Back button */}
          <button
            onClick={() => setActiveTool(null)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors mb-5"
          >
            ← Back to AI Tools
          </button>

          {/* Tool card */}
          <div className={`border-2 rounded-2xl p-6 ${active.color}`}>
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-11 h-11 rounded-xl ${active.iconBg} flex items-center justify-center text-2xl flex-shrink-0`}>
                {active.icon}
              </div>
              <div>
                <h2 className="font-bold text-gray-800">{active.title}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{active.description}</p>
              </div>
            </div>

            {active.component}
          </div>

          {/* Other tools quick access */}
          <div className="mt-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
              Other Tools
            </p>
            <div className="flex gap-3 flex-wrap">
              {TOOLS.filter(t => t.id !== activeTool).map(tool => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className="flex items-center gap-2 bg-white border border-gray-200 hover:border-blue-300 hover:text-blue-600 text-gray-600 text-xs font-semibold px-4 py-2 rounded-xl transition-all"
                >
                  {tool.icon} {tool.title}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  )
}

export default AITools