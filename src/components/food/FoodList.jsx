import { useState } from 'react'
import { Trash, Edit, Copy, Check, X, Apple } from '../Icons.jsx'
import { toNonNegNumber, round } from '../../lib/utils.js'

/** A single food entry — switches between a read row and an inline edit row. */
function FoodRow({ entry, onUpdate, onDelete, onDuplicate }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(entry)

  function startEdit() {
    setDraft(entry)
    setEditing(true)
  }

  function save() {
    const name = (draft.name || '').trim()
    if (!name) return
    onUpdate({
      name,
      calories: toNonNegNumber(draft.calories),
      protein: toNonNegNumber(draft.protein),
      carbs: toNonNegNumber(draft.carbs),
      fat: toNonNegNumber(draft.fat),
    })
    setEditing(false)
  }

  if (editing) {
    return (
      <li className="p-3 animate-pop-in">
        <input
          className="field mb-2"
          value={draft.name}
          autoFocus
          aria-label="Food name"
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && save()}
        />
        <div className="grid grid-cols-4 gap-2">
          {['calories', 'protein', 'carbs', 'fat'].map((f) => (
            <input
              key={f}
              className="field px-2 text-center tabular-nums"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              aria-label={f}
              value={draft[f]}
              onChange={(e) => setDraft({ ...draft, [f]: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && save()}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-end gap-2">
          <button className="btn-ghost" onClick={() => setEditing(false)}>
            <X width={16} height={16} /> Cancel
          </button>
          <button className="btn-primary" onClick={save}>
            <Check width={16} height={16} /> Save
          </button>
        </div>
      </li>
    )
  }

  return (
    <li className="group flex items-center gap-3 p-3">
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium">{entry.name}</div>
        <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {round(entry.calories)} kcal
          </span>
          <span>P {round(entry.protein)}g</span>
          <span>C {round(entry.carbs)}g</span>
          <span>F {round(entry.fat)}g</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center opacity-100 sm:opacity-60 sm:transition group-hover:sm:opacity-100">
        <button className="btn-icon" onClick={onDuplicate} aria-label="Duplicate entry" title="Duplicate">
          <Copy width={16} height={16} />
        </button>
        <button className="btn-icon" onClick={startEdit} aria-label="Edit entry" title="Edit">
          <Edit width={16} height={16} />
        </button>
        <button
          className="btn-icon hover:!text-red-500"
          onClick={onDelete}
          aria-label="Delete entry"
          title="Delete"
        >
          <Trash width={16} height={16} />
        </button>
      </div>
    </li>
  )
}

export default function FoodList({ food, onUpdate, onDelete, onDuplicate }) {
  if (food.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-2 p-8 text-center text-slate-400">
        <Apple width={32} height={32} />
        <p className="text-sm">No food logged yet. Add your first entry above.</p>
      </div>
    )
  }

  return (
    <ul className="card divide-y divide-slate-100 dark:divide-slate-800">
      {food.map((entry) => (
        <FoodRow
          key={entry.id}
          entry={entry}
          onUpdate={(patch) => onUpdate(entry.id, patch)}
          onDelete={() => onDelete(entry.id)}
          onDuplicate={() => onDuplicate(entry.id)}
        />
      ))}
    </ul>
  )
}
