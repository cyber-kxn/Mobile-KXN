import { useMemo, useRef, useState } from 'react'
import { Plus, X } from '../Icons.jsx'
import { toNonNegNumber } from '../../lib/utils.js'
import { getExerciseInfo } from '../../lib/exercises.js'
import ExerciseInfo from './ExerciseInfo.jsx'

const emptySet = () => ({ reps: '', weight: '' })

/**
 * Add an exercise in one of two modes:
 *  - "detailed": name + one or more sets (reps × weight)
 *  - "quick":    name only (cardio, mobility, "did this")
 * The name field autocompletes from the user's exercise library.
 */
export default function ExerciseForm({ library, onAdd }) {
  const [mode, setMode] = useState('detailed')
  const [name, setName] = useState('')
  const [sets, setSets] = useState([emptySet()])
  const [note, setNote] = useState('')
  const [showSuggest, setShowSuggest] = useState(false)
  const nameRef = useRef(null)

  const [showInfo, setShowInfo] = useState(false)

  const suggestions = useMemo(() => {
    const q = name.trim().toLowerCase()
    if (!q) return []
    return library
      .filter((e) => e.toLowerCase().includes(q) && e.toLowerCase() !== q)
      .slice(0, 6)
  }, [name, library])

  // Live exercise info for whatever is currently typed.
  const info = useMemo(() => getExerciseInfo(name), [name])

  function updateSet(i, field, value) {
    setSets((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)))
  }
  function addSet() {
    setSets((prev) => [...prev, emptySet()])
  }
  function removeSet(i) {
    setSets((prev) => (prev.length === 1 ? prev : prev.filter((_, idx) => idx !== i)))
  }

  function reset() {
    setName('')
    setSets([emptySet()])
    setNote('')
    setShowSuggest(false)
  }

  function submit(e) {
    e.preventDefault()
    const clean = name.trim()
    if (!clean) {
      nameRef.current?.focus()
      return
    }
    const exercise = { name: clean, mode, note: note.trim() }
    if (mode === 'detailed') {
      // Keep only sets the user actually filled in.
      exercise.sets = sets
        .filter((s) => s.reps !== '' || s.weight !== '')
        .map((s) => ({ reps: toNonNegNumber(s.reps), weight: toNonNegNumber(s.weight) }))
    } else {
      exercise.sets = []
    }
    onAdd(exercise)
    reset()
    nameRef.current?.focus()
  }

  return (
    <form onSubmit={submit} className="card p-3 sm:p-4">
      {/* Mode toggle */}
      <div className="mb-3 inline-flex rounded-xl bg-slate-100 p-1 text-sm dark:bg-slate-800">
        {[
          ['detailed', 'Detailed'],
          ['quick', 'Quick (title only)'],
        ].map(([m, lbl]) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-lg px-3 py-1.5 font-medium transition ${
              mode === m
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500'
            }`}
          >
            {lbl}
          </button>
        ))}
      </div>

      {/* Name + autocomplete */}
      <div className="relative">
        <label htmlFor="ex-name" className="label">
          Exercise
        </label>
        <input
          id="ex-name"
          ref={nameRef}
          className="field"
          placeholder="e.g. Bench Press"
          value={name}
          autoComplete="off"
          onChange={(e) => {
            setName(e.target.value)
            setShowSuggest(true)
          }}
          onFocus={() => setShowSuggest(true)}
          onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
        />
        {showSuggest && suggestions.length > 0 && (
          <ul className="card absolute z-20 mt-1 max-h-60 w-full overflow-auto p-1 animate-pop-in">
            {suggestions.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setName(s)
                    setShowSuggest(false)
                    nameRef.current?.focus()
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Live exercise info */}
      {info && (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowInfo((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-medium text-brand"
          >
            <span className="grid h-4 w-4 place-items-center rounded-full border border-brand text-[10px] font-bold">
              i
            </span>
            {showInfo ? 'Hide' : 'Show'} info — {info.name}: {info.primary.join(', ')}
          </button>
          {showInfo && (
            <div className="mt-2">
              <ExerciseInfo info={info} />
            </div>
          )}
        </div>
      )}

      {/* Sets (detailed only) */}
      {mode === 'detailed' && (
        <div className="mt-3 space-y-2">
          <div className="grid grid-cols-[1.5rem,1fr,1fr,2rem] items-center gap-2 px-1 text-xs font-medium text-slate-400">
            <span>#</span>
            <span>Reps</span>
            <span>Weight</span>
            <span />
          </div>
          {sets.map((s, i) => (
            <div key={i} className="grid grid-cols-[1.5rem,1fr,1fr,2rem] items-center gap-2">
              <span className="text-center text-sm text-slate-400">{i + 1}</span>
              <input
                className="field px-2 text-center tabular-nums"
                type="number"
                min="0"
                step="any"
                inputMode="numeric"
                placeholder="reps"
                aria-label={`Set ${i + 1} reps`}
                value={s.reps}
                onChange={(e) => updateSet(i, 'reps', e.target.value)}
              />
              <input
                className="field px-2 text-center tabular-nums"
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                placeholder="kg/lb"
                aria-label={`Set ${i + 1} weight`}
                value={s.weight}
                onChange={(e) => updateSet(i, 'weight', e.target.value)}
              />
              <button
                type="button"
                className="btn-icon mx-auto hover:!text-red-500"
                onClick={() => removeSet(i)}
                aria-label={`Remove set ${i + 1}`}
              >
                <X width={16} height={16} />
              </button>
            </div>
          ))}
          <button type="button" className="btn-ghost w-full" onClick={addSet}>
            <Plus width={16} height={16} /> Add set
          </button>
        </div>
      )}

      <input
        className="field mt-3"
        placeholder="Notes (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button type="submit" className="btn-primary mt-3 w-full">
        <Plus width={18} height={18} /> Add exercise
      </button>
    </form>
  )
}
