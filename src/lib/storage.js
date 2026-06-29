import { emptyStore } from './defaults.js'

const STORAGE_KEY = 'kxn-data'

/**
 * Load the full store from localStorage, falling back to a fresh store if
 * nothing is saved or the data is corrupt. We defensively merge against the
 * empty shape so older/partial saves keep working after upgrades.
 */
export function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStore()
    const parsed = JSON.parse(raw)
    return normalize(parsed)
  } catch (err) {
    console.warn('Failed to load store, starting fresh:', err)
    return emptyStore()
  }
}

/** Persist the full store. */
export function saveStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch (err) {
    console.error('Failed to save store:', err)
  }
}

/** Ensure a parsed object has every field we expect. */
export function normalize(data) {
  const base = emptyStore()
  if (!data || typeof data !== 'object') return base
  return {
    version: data.version ?? base.version,
    goals: { ...base.goals, ...(data.goals || {}) },
    // De-duplicate the library while preserving order.
    library: dedupe([...(data.library || []), ...base.library]),
    foods: Array.isArray(data.foods) ? data.foods : [],
    mealPlan: { ...base.mealPlan, ...(data.mealPlan || {}) },
    days: data.days && typeof data.days === 'object' ? data.days : {},
  }
}

function dedupe(arr) {
  const seen = new Set()
  const out = []
  for (const item of arr) {
    const key = String(item).trim()
    const lower = key.toLowerCase()
    if (!key || seen.has(lower)) continue
    seen.add(lower)
    out.push(key)
  }
  return out
}

/** Serialize the store to a downloadable JSON blob and trigger a download. */
export function exportStore(store) {
  const blob = new Blob([JSON.stringify(store, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `kxn-backup-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/** Read + parse + validate an imported JSON file. Returns a normalized store. */
export function importFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        resolve(normalize(parsed))
      } catch (err) {
        reject(new Error('That file is not valid KXN backup JSON.'))
      }
    }
    reader.onerror = () => reject(new Error('Could not read the file.'))
    reader.readAsText(file)
  })
}
