// Misc tiny helpers shared across components.

/** Generate a reasonably unique id for list items. */
export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

/** Clamp a value into [min, max]. */
export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

/**
 * Coerce arbitrary input into a non-negative number.
 * Empty / invalid input becomes 0. Negative numbers are floored at 0 so the
 * UI can never record nonsense like -200 calories.
 */
export function toNonNegNumber(value) {
  const n = parseFloat(value)
  if (!isFinite(n) || n < 0) return 0
  return n
}

/** Round to at most `dp` decimals, dropping trailing zeros. */
export function round(n, dp = 1) {
  const f = Math.pow(10, dp)
  return Math.round((n + Number.EPSILON) * f) / f
}

/** Sum a day's food entries into calorie + macro totals. */
export function sumFood(food = []) {
  return food.reduce(
    (acc, f) => {
      acc.calories += Number(f.calories) || 0
      acc.protein += Number(f.protein) || 0
      acc.carbs += Number(f.carbs) || 0
      acc.fat += Number(f.fat) || 0
      return acc
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )
}
