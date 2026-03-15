// src/utils/storage.js
import { getCurrentUser } from 'aws-amplify/auth'

// Get current user ID safely
export async function getUserId() {
  try {
    const user = await getCurrentUser()
    return user.userId
  } catch {
    return 'guest'
  }
}

// Get a user-specific localStorage key
// e.g. 'coopApplications' → 'coopApplications_abc123'
export function getUserKey(key, userId) {
  return `${key}_${userId}`
}

// Read from user-specific localStorage
export function getUserData(key, userId, fallback = []) {
  if (!userId) return fallback
  const saved = localStorage.getItem(getUserKey(key, userId))
  return saved ? JSON.parse(saved) : fallback
}

// Write to user-specific localStorage
export function setUserData(key, userId, data) {
  if (!userId) return
  localStorage.setItem(getUserKey(key, userId), JSON.stringify(data))
}

// Remove user-specific localStorage key
export function removeUserData(key, userId) {
  if (!userId) return
  localStorage.removeItem(getUserKey(key, userId))
}