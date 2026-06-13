// Small date helpers. We key all per-day data by a local "YYYY-MM-DD" string
// so the app behaves predictably regardless of timezone.

/** Format a Date as a local YYYY-MM-DD key. */
export function toKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Parse a YYYY-MM-DD key back into a local Date (at midnight). */
export function fromKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Today's key. */
export function todayKey() {
  return toKey(new Date())
}

/** Return a new key offset by `days` from the given key. */
export function addDays(key, days) {
  const d = fromKey(key)
  d.setDate(d.getDate() + days)
  return toKey(d)
}

/** True if the key represents today. */
export function isToday(key) {
  return key === todayKey()
}

/** Human-friendly label, e.g. "Today", "Yesterday", or "Mon, Jun 9". */
export function friendlyLabel(key) {
  if (key === todayKey()) return 'Today'
  if (key === addDays(todayKey(), -1)) return 'Yesterday'
  if (key === addDays(todayKey(), 1)) return 'Tomorrow'
  return fromKey(key).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

/** Short label for compact UI (history rows etc.). */
export function shortLabel(key) {
  return fromKey(key).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
