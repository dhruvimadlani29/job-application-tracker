// src/utils/thresholds.js

const DEFAULT_THRESHOLDS = {
  justAppliedMax: 7,
  followUpMax: 21,
}

const DEFAULT_STATUSES = [
  { key: 'Applied',            label: 'Applied',            icon: '🟦', enabled: true  },
  { key: 'Under Review',       label: 'Under Review',       icon: '🔵', enabled: true  },
  { key: 'Phone Screen',       label: 'Phone Screen',       icon: '📞', enabled: true  },
  { key: 'Technical Test',     label: 'Technical Test',     icon: '🟠', enabled: true  },
  { key: 'Interview',          label: 'Interview',          icon: '🎤', enabled: true  },
  { key: 'Awaiting Decision',  label: 'Awaiting Decision',  icon: '⏳', enabled: true  },
  { key: 'Follow-Up Sent',     label: 'Follow-Up Sent',     icon: '📬', enabled: true  },
  { key: 'Offer Received',     label: 'Offer Received',     icon: '🎉', enabled: true  },
  { key: 'Rejected',           label: 'Rejected',           icon: '❌', enabled: true  },
  { key: 'Ghosted',            label: 'Ghosted',            icon: '👻', enabled: true  },
]

// ── Thresholds ──
export function getThresholds() {
  const saved = localStorage.getItem('badgeThresholds')
  return saved ? JSON.parse(saved) : DEFAULT_THRESHOLDS
}

export function saveThresholds(thresholds) {
  localStorage.setItem('badgeThresholds', JSON.stringify(thresholds))
}

// ── Statuses ──
export function getStatuses() {
  const saved = localStorage.getItem('statusSettings')
  return saved ? JSON.parse(saved) : DEFAULT_STATUSES
}

export function saveStatuses(statuses) {
  localStorage.setItem('statusSettings', JSON.stringify(statuses))
}

// Returns only enabled status keys as a simple array
// Used by dropdowns and forms to know which options to show
export function getEnabledStatuses() {
  return getStatuses()
    .filter(s => s.enabled)
    .map(s => s.key)
}