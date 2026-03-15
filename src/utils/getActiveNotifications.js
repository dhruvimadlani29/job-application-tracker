// src/utils/getActiveNotifications.js
import { parseLocalDate } from './notifications'
import { getNotifPrefs } from './notifications'

export function getActiveNotifications(applications) {
  if (!applications || applications.length === 0) return []

  const prefs = getNotifPrefs()
  const notifications = []
  const today = new Date()
  today.setHours(12, 0, 0, 0)

  applications.forEach(app => {

    // ── DEADLINE NOTIFICATIONS ──
    if (prefs.deadlineEnabled && app.deadline) {
      const deadline = parseLocalDate(app.deadline)
      if (!deadline) return
      const days = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))

      // Only notify within user's chosen warning window
      if (days <= prefs.deadlineWarningDays) {
        if (days < 0) {
          notifications.push({
            id:      `deadline_${app.id}`,
            type:    'deadline',
            urgency: 'critical',
            icon:    '❌',
            title:   `Deadline Passed — ${app.company}`,
            message: `${app.role} deadline was ${Math.abs(days)} day${Math.abs(days) > 1 ? 's' : ''} ago`,
            company: app.company,
            appId:   app.id,
          })
        } else if (days === 0) {
          notifications.push({
            id:      `deadline_${app.id}`,
            type:    'deadline',
            urgency: 'critical',
            icon:    '🚨',
            title:   `Deadline TODAY — ${app.company}`,
            message: `${app.role} application is due today!`,
            company: app.company,
            appId:   app.id,
          })
        } else if (days === 1) {
          notifications.push({
            id:      `deadline_${app.id}`,
            type:    'deadline',
            urgency: 'critical',
            icon:    '⚠️',
            title:   `Deadline Tomorrow — ${app.company}`,
            message: `${app.role} closes tomorrow!`,
            company: app.company,
            appId:   app.id,
          })
        } else if (days <= 3) {
          notifications.push({
            id:      `deadline_${app.id}`,
            type:    'deadline',
            urgency: 'warning',
            icon:    '⚠️',
            title:   `Deadline in ${days} days — ${app.company}`,
            message: `${app.role} closes in ${days} days`,
            company: app.company,
            appId:   app.id,
          })
        } else {
          notifications.push({
            id:      `deadline_${app.id}`,
            type:    'deadline',
            urgency: 'info',
            icon:    '📅',
            title:   `Deadline in ${days} days — ${app.company}`,
            message: `${app.role} closes in ${days} days`,
            company: app.company,
            appId:   app.id,
          })
        }
      }
    }

    // ── INTERVIEW NOTIFICATIONS ──
    if (prefs.interviewEnabled && app.interviewDate) {
      const interview = new Date(`${app.interviewDate}T${app.interviewTime || '12:00'}`)
      const diffHours = (interview - new Date()) / (1000 * 60 * 60)
      const diffDays  = Math.floor(diffHours / 24)

      if (diffHours > 0 && diffHours <= 24) {
        notifications.push({
          id:      `interview_${app.id}`,
          type:    'interview',
          urgency: 'critical',
          icon:    '🎤',
          title:   `Interview TODAY — ${app.company}`,
          message: `${app.role}${app.interviewTime ? ` at ${app.interviewTime}` : ''} — prepare now!`,
          company: app.company,
          appId:   app.id,
        })
      } else if (diffHours > 24 && diffHours <= 48) {
        notifications.push({
          id:      `interview_${app.id}`,
          type:    'interview',
          urgency: 'warning',
          icon:    '🎤',
          title:   `Interview Tomorrow — ${app.company}`,
          message: `${app.role}${app.interviewTime ? ` at ${app.interviewTime}` : ''} — start preparing!`,
          company: app.company,
          appId:   app.id,
        })
      } else if (diffDays <= 7 && diffHours > 0) {
        notifications.push({
          id:      `interview_${app.id}`,
          type:    'interview',
          urgency: 'info',
          icon:    '📆',
          title:   `Interview in ${diffDays} days — ${app.company}`,
          message: `${app.role}${app.interviewTime ? ` at ${app.interviewTime}` : ''}`,
          company: app.company,
          appId:   app.id,
        })
      }
    }

    // ── FOLLOW-UP NOTIFICATIONS ──
    if (prefs.followupEnabled && app.status === 'Applied' && app.dateApplied) {
      const applied  = parseLocalDate(app.dateApplied)
      if (!applied) return
      const diffDays = Math.floor((today - applied) / (1000 * 60 * 60 * 24))

      if (diffDays >= 14 && diffDays < 21) {
        notifications.push({
          id:      `followup_${app.id}`,
          type:    'followup',
          urgency: 'warning',
          icon:    '📬',
          title:   `Follow Up — ${app.company}`,
          message: `${diffDays} days since you applied for ${app.role} — send a follow-up!`,
          company: app.company,
          appId:   app.id,
        })
      } else if (diffDays >= 21) {
        notifications.push({
          id:      `followup_${app.id}`,
          type:    'followup',
          urgency: 'info',
          icon:    '🌫️',
          title:   `Going Cold — ${app.company}`,
          message: `${diffDays} days since applying for ${app.role} — consider marking as Ghosted`,
          company: app.company,
          appId:   app.id,
        })
      }
    }

  })

  // Sort by urgency
  const urgencyOrder = { critical: 0, warning: 1, info: 2 }
  return notifications.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency])
}