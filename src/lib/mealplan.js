// Meal-planning maths: turn a set of foods + a macro target into grams.
//
// Foods use the per-100g shape from lib/foods.js: { n, kcal, p, c, f }.
// Targets are absolute grams of protein/carbs/fat (calories follow from them).

/** Per-gram macro vector for a food. */
function perGram(food) {
  return { p: food.p / 100, c: food.c / 100, f: food.f / 100, kcal: food.kcal / 100 }
}

/** Calories implied by macros (4/4/9 rule). */
export function kcalFromMacros(p, c, f) {
  return Math.round(4 * p + 4 * c + 9 * f)
}

/** Totals for a list of { food, grams }. */
export function mealTotals(items) {
  return items.reduce(
    (a, { food, grams }) => {
      const g = grams / 100
      a.calories += food.kcal * g
      a.protein += food.p * g
      a.carbs += food.c * g
      a.fat += food.f * g
      return a
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )
}

/**
 * Solve for grams of each food to best hit a macro target (protein/carbs/fat).
 *
 * This is a non-negative least squares problem (grams can't be negative, and
 * all macro coefficients are >= 0), so we use multiplicative updates — simple,
 * stable, and guaranteed non-negative. Returns grams[] aligned with `foods`.
 *
 * target = { protein, carbs, fat } in grams.
 */
export function solveGrams(foods, target, { iterations = 400 } = {}) {
  const n = foods.length
  if (!n) return []
  const A = foods.map(perGram) // per-gram macros
  const t = [target.protein || 0, target.carbs || 0, target.fat || 0]
  const rows = [
    A.map((a) => a.p),
    A.map((a) => a.c),
    A.map((a) => a.f),
  ]

  // Start from an even split of a rough total mass guess.
  let x = new Array(n).fill(100)
  const eps = 1e-9

  for (let it = 0; it < iterations; it++) {
    // Ax (3-vector)
    const Ax = rows.map((row) => row.reduce((s, v, j) => s + v * x[j], 0))
    // Multiplicative update: x_j *= (A^T t)_j / (A^T A x)_j
    for (let j = 0; j < n; j++) {
      let num = 0
      let den = 0
      for (let i = 0; i < 3; i++) {
        num += rows[i][j] * t[i]
        den += rows[i][j] * Ax[i]
      }
      x[j] = x[j] * (num / (den + eps))
      if (!isFinite(x[j]) || x[j] < 0) x[j] = 0
    }
  }
  return x.map((g) => Math.round(g))
}

/** Classify a food by its dominant macro (for building sensible combos). */
export function classifyFood(food) {
  // Low-calorie, carb-ish foods are treated as "veg" (volume/fibre).
  if (food.kcal <= 55 && food.f < 3) return 'veg'
  const kp = 4 * food.p
  const kc = 4 * food.c
  const kf = 9 * food.f
  if (kp >= kc && kp >= kf) return 'protein'
  if (kf >= kp && kf >= kc) return 'fat'
  return 'carb'
}

/** How far totals are from a target, as a normalized error (0 = perfect). */
export function macroError(totals, target) {
  const terms = [
    [totals.protein, target.protein],
    [totals.carbs, target.carbs],
    [totals.fat, target.fat],
  ]
  let err = 0
  for (const [got, want] of terms) {
    const denom = Math.max(want, 1)
    err += Math.abs(got - want) / denom
  }
  return err / terms.length
}

/**
 * Recommend meals (combos of foods) that fit a per-meal macro target.
 *
 * Builds protein+carb(+fat) combinations from the enabled foods, solves grams
 * for each, scores by macro error, and returns the best `count` distinct meals.
 */
export function recommendMeals(enabledFoods, target, { count = 4, seed = 0 } = {}) {
  const byClass = { protein: [], carb: [], fat: [], veg: [] }
  for (const f of enabledFoods) byClass[classifyFood(f)].push(f)

  // Rotate each list by the seed so "regenerate" yields fresh combos.
  const rot = (arr) => (arr.length ? arr.map((_, i) => arr[(i + seed) % arr.length]) : arr)
  const proteins = rot(byClass.protein).slice(0, 10)
  const carbs = rot(byClass.carb).slice(0, 10)
  // Fat slot uses real fat sources (oils, nuts, dairy fats) — not fatty meats —
  // so combos read sensibly rather than pairing two cuts of meat.
  const fats = rot(byClass.fat.filter((f) => f.p < 12)).slice(0, 8)

  const candidates = []
  const wantsFat = (target.fat || 0) > 12

  for (const pr of proteins.length ? proteins : [null]) {
    for (const cb of carbs.length ? carbs : [null]) {
      const bases = [[pr, cb].filter(Boolean)]
      if (wantsFat) for (const ft of fats) bases.push([pr, cb, ft].filter(Boolean))
      for (const foods of bases) {
        if (foods.length < 2) continue
        const grams = solveGrams(foods, target)
        const items = foods
          .map((food, i) => ({ food, grams: grams[i] }))
          .filter((it) => it.grams > 3) // drop negligible amounts
        if (items.length < 2) continue
        if (items.some((it) => it.grams > 600)) continue // unrealistic portion
        const totals = mealTotals(items)
        candidates.push({ items, totals, error: macroError(totals, target) })
      }
    }
  }

  candidates.sort((a, b) => a.error - b.error)

  // De-duplicate by the set of food names so suggestions feel varied.
  const seen = new Set()
  const out = []
  for (const c of candidates) {
    const key = c.items.map((it) => it.food.n).sort().join('|')
    if (seen.has(key)) continue
    seen.add(key)
    out.push(c)
    if (out.length >= count) break
  }
  return out
}
