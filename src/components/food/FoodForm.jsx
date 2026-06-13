import { useMemo, useRef, useState } from 'react'
import { Plus } from '../Icons.jsx'
import { COMMON_FOODS } from '../../lib/defaults.js'
import { toNonNegNumber } from '../../lib/utils.js'

const EMPTY = { name: '', calories: '', protein: '', carbs: '', fat: '' }

/**
 * Quick-add food form. Typing a name surfaces matching common foods; choosing
 * one pre-fills all macros (still fully editable). Submitting keeps focus on
 * the name field so several items can be added rapidly.
 */
export default function FoodForm({ onAdd }) {
  const [values, setValues] = useState(EMPTY)
  const [showSuggest, setShowSuggest] = useState(false)
  const nameRef = useRef(null)

  const suggestions = useMemo(() => {
    const q = values.name.trim().toLowerCase()
    if (!q) return []
    return COMMON_FOODS.filter((f) => f.name.toLowerCase().includes(q)).slice(0, 6)
  }, [values.name])

  function set(field, value) {
    setValues((v) => ({ ...v, [field]: value }))
  }

  function applySuggestion(s) {
    setValues({
      name: s.name,
      calories: String(s.calories),
      protein: String(s.protein),
      carbs: String(s.carbs),
      fat: String(s.fat),
    })
    setShowSuggest(false)
    nameRef.current?.focus()
  }

  function submit(e) {
    e.preventDefault()
    const name = values.name.trim()
    if (!name) {
      nameRef.current?.focus()
      return
    }
    onAdd({
      name,
      calories: toNonNegNumber(values.calories),
      protein: toNonNegNumber(values.protein),
      carbs: toNonNegNumber(values.carbs),
      fat: toNonNegNumber(values.fat),
    })
    setValues(EMPTY)
    setShowSuggest(false)
    nameRef.current?.focus()
  }

  return (
    <form onSubmit={submit} className="card p-3 sm:p-4">
      <div className="relative">
        <label htmlFor="food-name" className="label">
          Add food
        </label>
        <input
          id="food-name"
          ref={nameRef}
          className="field"
          placeholder="e.g. Chicken & rice"
          value={values.name}
          autoComplete="off"
          onChange={(e) => {
            set('name', e.target.value)
            setShowSuggest(true)
          }}
          onFocus={() => setShowSuggest(true)}
          onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
        />
        {showSuggest && suggestions.length > 0 && (
          <ul className="card absolute z-20 mt-1 max-h-60 w-full overflow-auto p-1 animate-pop-in">
            {suggestions.map((s) => (
              <li key={s.name}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applySuggestion(s)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <span>{s.name}</span>
                  <span className="tabular-nums text-xs text-slate-400">
                    {s.calories} kcal · {s.protein}p
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

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
              onChange={(e) => set(field, e.target.value)}
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
