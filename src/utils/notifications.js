// src/utils/notifications.js

// ── Timezone safe date parser ──
// Parses a YYYY-MM-DD string as LOCAL noon to avoid UTC timezone shifts
export function parseLocalDate(dateStr) {
  if (!dateStr) return null
  // Adding T12:00:00 makes it noon local time — never shifts to previous day
  const d = new Date(`${dateStr}T12:00:00`)
  return isNaN(d.getTime()) ? null : d
}

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

export function getNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported'
  return Notification.permission
}

function showNotification(title, body) {
  if (Notification.permission !== 'granted') return
  new Notification(title, { body, icon: '/favicon.ico' })
}

export function checkAndNotify(applications) {
  if (Notification.permission !== 'granted') return
  if (!applications || applications.length === 0) return

  const today    = new Date()
  today.setHours(12, 0, 0, 0)  // compare at noon to avoid timezone issues

  const notified = JSON.parse(localStorage.getItem('notifiedToday') || '{}')
  const todayKey = today.toDateString()

  if (notified.date !== todayKey) {
    localStorage.setItem('notifiedToday', JSON.stringify({ date: todayKey }))
  }

  const fresh = JSON.parse(localStorage.getItem('notifiedToday') || '{}')

  applications.forEach(app => {

    // ── DEADLINE ──
    if (app.deadline) {
      const deadlineDate = parseLocalDate(app.deadline)
      if (!deadlineDate) return

      const days = Math.ceil((deadlineDate - today) / (1000*60*60*24))
      const key  = `deadline_${app.id}`

      if (!fresh[key]) {
        if (days === 0) {
          showNotification(`🚨 Deadline TODAY — ${app.company}`,
            `Application for ${app.role} is due today!`)
          fresh[key] = true
        } else if (days === 1) {
          showNotification(`⚠️ Deadline Tomorrow — ${app.company}`,
            `Application for ${app.role} is due tomorrow!`)
          fresh[key] = true
        } else if (days <= 3 && days > 1) {
          showNotification(`📅 Deadline in ${days} days — ${app.company}`,
            `${app.role} application closes in ${days} days`)
          fresh[key] = true
        }
      }
    }

    // ── INTERVIEW ──
    if (app.interviewDate) {
      const interview = new Date(`${app.interviewDate}T${app.interviewTime || '12:00'}`)
      const diffHours = (interview - new Date()) / (1000*60*60)
      const key       = `interview_${app.id}`

      if (!fresh[key]) {
        if (diffHours > 0 && diffHours <= 24) {
          showNotification(`🎤 Interview TODAY — ${app.company}`,
            `Interview for ${app.role}${app.interviewTime ? ` at ${app.interviewTime}` : ''}. Good luck!`)
          fresh[key] = true
        } else if (diffHours > 24 && diffHours <= 48) {
          showNotification(`🎤 Interview Tomorrow — ${app.company}`,
            `Prepare for your ${app.role} interview tomorrow!`)
          fresh[key] = true
        }
      }
    }

    // ── FOLLOW-UP ──
    if (app.status === 'Applied' && app.dateApplied) {
      const applied  = parseLocalDate(app.dateApplied)
      if (!applied) return
      const diffDays = Math.floor((today - applied) / (1000*60*60*24))
      const key      = `followup_${app.id}`

      if (!fresh[key] && diffDays === 14) {
        showNotification(`📬 Time to Follow Up — ${app.company}`,
          `It's been 2 weeks since you applied for ${app.role}!`)
        fresh[key] = true
      }
    }

  })

  localStorage.setItem('notifiedToday', JSON.stringify({ ...fresh, date: todayKey }))
}

export function sendTestNotification() {
  if (!('Notification' in window)) {
    alert('Your browser does not support notifications!')
    return
  }
  if (Notification.permission !== 'granted') {
    alert(`Notifications not enabled. Status: ${Notification.permission}`)
    return
  }
  try {
    new Notification('🎯 Job Application Tracker Test', {
      body: 'Notifications are working! You will get reminders for deadlines and interviews.',
    })
  } catch (err) {
    alert(`Error: ${err.message}`)
  }
}


const DEFAULT_NOTIF_PREFS = {
  deadlineEnabled:  true,
  interviewEnabled: true,
  followupEnabled:  true,
  deadlineWarningDays: 7,  // how many days before deadline to start notifying
}

export function getNotifPrefs() {
  const saved = localStorage.getItem('notifPrefs')
  return saved ? JSON.parse(saved) : DEFAULT_NOTIF_PREFS
}

export function saveNotifPrefs(prefs) {
  localStorage.setItem('notifPrefs', JSON.stringify(prefs))
}