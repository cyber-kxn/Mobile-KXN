import { useMemo, useRef, useState } from 'react'
import { Plus } from '../Icons.jsx'
import { scaleFood } from '../../lib/foods.js'
import { toNonNegNumber } from '../../lib/utils.js'

const EMPTY = { name: '', grams: '', calories: '', protein: '', carbs: '', fat: '' }

/**
 * Quick-add food form.
 *
 * Two ways to log:
 *  1. Pick a food from the index → type grams → macros are computed for you
 *     (and stay editable).
 *  2. Type any free-text name and enter the macros manually.
 *
 * `foods` is the merged per-100g index (built-ins + the user's custom foods).
 */
export default function FoodForm({ foods, onAdd }) {
  const [values, setValues] = useState(EMPTY)
  const [per100, setPer100] = useState(null) // selected food profile, if any
  const [showSuggest, setShowSuggest] = useState(false)
  const nameRef = useRef(null)
  const gramsRef = useRef(null)

  const suggestions = useMemo(() => {
    const q = values.name.trim().toLowerCase()
    if (!q) return []
    return foods.filter((f) => f.n.toLowerCase().includes(q)).slice(0, 6)
  }, [values.name, foods])

  function set(field, value) {
    setValues((v) => ({ ...v, [field]: value }))
  }

  // Picking a food: remember its per-100g profile, default to 100 g (or keep
  // whatever grams are already typed), and compute the macros.
  function applyFood(food) {
    const grams = values.grams && toNonNegNumber(values.grams) > 0 ? values.grams : '100'
    const scaled = scaleFood(food, grams)
    setPer100(food)
    setValues({
      name: food.n,
      grams,
      calories: String(scaled.calories),
      protein: String(scaled.protein),
      carbs: String(scaled.carbs),
      fat: String(scaled.fat),
    })
    setShowSuggest(false)
    // Jump to grams so they can immediately set the amount.
    setTimeout(() => {
      gramsRef.current?.focus()
      gramsRef.current?.select()
    }, 0)
  }

  // Changing grams re-scales macros from the selected food profile.
  function onGrams(value) {
    if (per100) {
      const scaled = scaleFood(per100, value)
      setValues((v) => ({
        ...v,
        grams: value,
        calories: String(scaled.calories),
        protein: String(scaled.protein),
        carbs: String(scaled.carbs),
        fat: String(scaled.fat),
      }))
    } else {
      set('grams', value)
    }
  }

  function reset() {
    setValues(EMPTY)
    setPer100(null)
    setShowSuggest(false)
  }

  function submit(e) {
    e.preventDefault()
    const name = values.name.trim()
    if (!name) {
      nameRef.current?.focus()
      return
    }
    const grams = toNonNegNumber(values.grams)
    onAdd({
      name,
      calories: toNonNegNumber(values.calories),
      protein: toNonNegNumber(values.protein),
      carbs: toNonNegNumber(values.carbs),
      fat: toNonNegNumber(values.fat),
      ...(grams > 0 ? { grams } : {}),
    })
    reset()
    nameRef.current?.focus()
  }

  return (
    <form onSubmit={submit} className="card p-3 sm:p-4">
      <div className="flex gap-2">
        {/* Name + food index autocomplete */}
        <div className="relative flex-1">
          <label htmlFor="food-name" className="label">
            Add food
          </label>
          <input
            id="food-name"
            ref={nameRef}
            className="field"
            placeholder="Search foods or type your own…"
            value={values.name}
            autoComplete="off"
            onChange={(e) => {
              set('name', e.target.value)
              setPer100(null) // typing a new name detaches any picked food
              setShowSuggest(true)
            }}
            onFocus={() => setShowSuggest(true)}
            onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
          />
          {showSuggest && suggestions.length > 0 && (
            <ul className="card absolute z-20 mt-1 max-h-60 w-full overflow-auto p-1 animate-pop-in">
              {suggestions.map((s) => (
                <li key={s.n}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyFood(s)}
                    className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <span className="truncate">{s.n}</span>
                    <span className="shrink-0 tabular-nums text-xs text-slate-400">
                      {s.kcal} kcal · {s.p}p /100g
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Grams */}
        <div className="w-20 shrink-0">
          <label htmlFor="food-grams" className="label">
            Grams
          </label>
          <input
            id="food-grams"
            ref={gramsRef}
            className="field px-2 text-center tabular-nums"
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            placeholder="g"
            value={values.grams}
            onChange={(e) => onGrams(e.target.value)}
          />
        </div>
      </div>

      {per100 && (
        <p className="mt-2 text-xs text-slate-400">
          Using <span className="font-medium text-slate-500 dark:text-slate-300">{per100.n}</span>{' '}
          ({per100.kcal} kcal per 100 g) — macros update with grams, still editable.
        </p>
      )}

      <div className="mt-3 grid grid-cols-4 gap-2">
        {[
          ['calories', 'Calories'],
          ['protein', 'Protein'],
          ['carbs', 'Carbs'],
          ['fat', 'Fat'],
        ].map(([field, lbl]) => (
          <div key={field}>
            <label htmlFor={`food-${field}`} className="label">
              {lbl}
            </label>
            <input
              id={`food-${field}`}
              className="field px-2 text-center tabular-nums"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              placeholder="0"
              value={values[field]}
              onChange={(e) => {
                // Manual macro edits detach the food link so grams won't override.
                setPer100(null)
                set(field, e.target.value)
              }}
            />
          </div>
        ))}
      </div>

      <button type="submit" className="btn-primary mt-3 w-full">
        <Plus width={18} height={18} /> Add entry
      </button>
    </form>
  )
}
