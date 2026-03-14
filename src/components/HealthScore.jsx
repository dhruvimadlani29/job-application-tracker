// src/components/HealthScore.jsx
import { useState } from 'react'
import { getThresholds } from '../utils/thresholds'

function SmartBadge({ status, dateApplied }) {
  const [showTooltip, setShowTooltip] = useState(false)

  function getBadge() {
    if (status === 'Offer Received') {
      return {
        label: '🎉 Offer!',
        color: 'bg-green-100 text-green-700 border border-green-200',
        tip: 'Congratulations — you received an offer!'
      }
    }
    if (status === 'Interview') {
      return {
        label: '🔥 Interview',
        color: 'bg-orange-100 text-orange-700 border border-orange-200',
        tip: 'Interview scheduled — prepare well!'
      }
    }
    if (status === 'Technical Test') {
      return {
        label: '🟠 Tech Test',
        color: 'bg-amber-100 text-amber-700 border border-amber-200',
        tip: 'Coding assessment received — time to practice!'
      }
    }
    if (status === 'Phone Screen') {
      return {
        label: '📞 Phone Screen',
        color: 'bg-purple-100 text-purple-700 border border-purple-200',
        tip: 'Phone screen scheduled — research the company!'
      }
    }
    if (status === 'Awaiting Decision') {
      return {
        label: '⏳ Awaiting',
        color: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
        tip: 'Interview done — waiting for their decision.'
      }
    }
    if (status === 'Under Review') {
      return {
        label: '🔵 Under Review',
        color: 'bg-blue-100 text-blue-700 border border-blue-200',
        tip: 'Company confirmed they are reviewing your application.'
      }
    }
    if (status === 'Follow-Up Sent') {
      return {
        label: '📬 Followed Up',
        color: 'bg-cyan-100 text-cyan-700 border border-cyan-200',
        tip: 'You sent a follow-up — give them a few more days.'
      }
    }
    if (status === 'Rejected') {
      return {
        label: '❌ Rejected',
        color: 'bg-red-100 text-red-500 border border-red-200',
        tip: 'Application rejected — learn from it and move on!'
      }
    }
    if (status === 'Ghosted') {
      return {
        label: '👻 Ghosted',
        color: 'bg-gray-100 text-gray-500 border border-gray-200',
        tip: 'No response for weeks — company likely moved on.'
      }
    }

    // Applied — use USER'S custom thresholds
    const { justAppliedMax, followUpMax } = getThresholds()
    const applied  = new Date(dateApplied)
    const today    = new Date()

    if (isNaN(applied.getTime())) {
      return {
        label: '🟢 Just Applied',
        color: 'bg-green-100 text-green-700 border border-green-200',
        tip: `Recently applied — wait ${justAppliedMax} days before following up.`
      }
    }

    const diffDays = Math.floor((today - applied) / (1000 * 60 * 60 * 24))

    if (diffDays <= justAppliedMax) {
      return {
        label: '🟢 Just Applied',
        color: 'bg-green-100 text-green-700 border border-green-200',
        tip: `Applied ${diffDays} day${diffDays === 1 ? '' : 's'} ago. You set "Just Applied" as 0–${justAppliedMax} days — too early to follow up!`
      }
    } else if (diffDays <= followUpMax) {
      return {
        label: '🟡 Follow Up',
        color: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
        tip: `Applied ${diffDays} days ago. You set "Follow Up" as ${justAppliedMax + 1}–${followUpMax} days — time to send a follow-up email!`
      }
    } else {
      return {
        label: '🌫 Gone Cold',
        color: 'bg-slate-100 text-slate-500 border border-slate-200',
        tip: `Applied ${diffDays} days ago. You set "Gone Cold" as ${followUpMax + 1}+ days — consider marking as Ghosted.`
      }
    }
  }

  const badge    = getBadge()
  const { justAppliedMax, followUpMax } = getThresholds()

  return (
    <div className="relative">

      <span
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`text-xs font-bold px-3 py-1.5 rounded-full cursor-help transition-all ${badge.color}`}
      >
        {badge.label}
      </span>

      {showTooltip && (
        <div className="absolute bottom-9 left-0 z-50 bg-gray-800 text-white text-xs rounded-xl px-3 py-2.5 w-64 shadow-xl">

          {/* Why THIS badge */}
          <p className="leading-relaxed text-white/90">{badge.tip}</p>

          <div className="border-t border-white/20 my-2"/>

          {/* User's current custom rules */}
          <p className="font-bold text-white/60 uppercase tracking-wide mb-1.5">
            Your Current Rules
          </p>
          <div className="space-y-1 text-white/80">
            <p>🟢 Just Applied — day 0 to {justAppliedMax}</p>
            <p>🟡 Follow Up — day {justAppliedMax + 1} to {followUpMax}</p>
            <p>🌫 Gone Cold — day {followUpMax + 1}+</p>
          </div>

          <div className="border-t border-white/20 my-2"/>

          {/* Fixed statuses */}
          <p className="font-bold text-white/60 uppercase tracking-wide mb-1.5">
            Fixed Statuses
          </p>
          <div className="space-y-0.5 text-white/80">
            <p>📞 Phone Screen — call scheduled</p>
            <p>🟠 Tech Test — assessment received</p>
            <p>🔥 Interview — interview scheduled</p>
            <p>⏳ Awaiting — post interview wait</p>
            <p>📬 Followed Up — you reached out</p>
            <p>🎉 Offer! — you got it!</p>
            <p>❌ Rejected — not selected</p>
            <p>👻 Ghosted — no response ever</p>
          </div>

          <div className="border-t border-white/20 mt-2 pt-2">
            <p className="text-white/50 italic">
              Change your thresholds in Settings →
            </p>
          </div>

          <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-gray-800 rotate-45"/>
        </div>
      )}

    </div>
  )
}

export default SmartBadge