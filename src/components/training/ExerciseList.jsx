import { useState } from 'react'
import { Trash, Edit, Check, X, Plus, Dumbbell } from '../Icons.jsx'
import { toNonNegNumber, round } from '../../lib/utils.js'
import { getExerciseInfo } from '../../lib/exercises.js'
import ExerciseInfo from './ExerciseInfo.jsx'

const emptySet = () => ({ reps: '', weight: '' })

function setSummary(sets = []) {
  if (!sets.length) return null
  return sets
    .map((s) => `${round(s.reps)}×${round(s.weight)}`)
    .join('  ·  ')
}

function ExerciseRow({ exercise, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(exercise)
  const [infoOpen, setInfoOpen] = useState(false)
  const info = getExerciseInfo(exercise.name)

  function startEdit() {
    setDraft({ ...exercise, sets: exercise.sets?.length ? exercise.sets : [] })
    setEditing(true)
  }

  function save() {
    const name = (draft.name || '').trim()
    if (!name) return
    const sets = (draft.sets || [])
      .filter((s) => s.reps !== '' || s.weight !== '')
      .map((s) => ({ reps: toNonNegNumber(s.reps), weight: toNonNegNumber(s.weight) }))
    onUpdate({ ...draft, name, sets, note: (draft.note || '').trim() })
    setEditing(false)
  }

  if (editing) {
    return (
      <li className="p-3 animate-pop-in">
        <input
          className="field mb-2"
          value={draft.name}
          autoFocus
          aria-label="Exercise name"
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        />
        {draft.mode === 'detailed' && (
          <div className="space-y-2">
            {(draft.sets || []).map((s, i) => (
              <div key={i} className="grid grid-cols-[1.5rem,1fr,1fr,2rem] items-center gap-2">
                <span className="text-center text-sm text-slate-400">{i + 1}</span>
                <input
                  className="field px-2 text-center tabular-nums"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="reps"
                  aria-label={`Set ${i + 1} reps`}
                  value={s.reps}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      sets: draft.sets.map((x, idx) =>
                        idx === i ? { ...x, reps: e.target.value } : x
                      ),
                    })
                  }
                />
                <input
                  className="field px-2 text-center tabular-nums"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="weight"
                  aria-label={`Set ${i + 1} weight`}
                  value={s.weight}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      sets: draft.sets.map((x, idx) =>
                        idx === i ? { ...x, weight: e.target.value } : x
                      ),
                    })
                  }
                />
                <button
                  className="btn-icon mx-auto hover:!text-red-500"
                  onClick={() =>
                    setDraft({ ...draft, sets: draft.sets.filter((_, idx) => idx !== i) })
                  }
                  aria-label={`Remove set ${i + 1}`}
                >
                  <X width={16} height={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn-ghost w-full"
              onClick={() => setDraft({ ...draft, sets: [...(draft.sets || []), emptySet()] })}
            >
              <Plus width={16} height={16} /> Add set
            </button>
          </div>
        )}
        <input
          className="field mt-2"
          placeholder="Notes (optional)"
          value={draft.note || ''}
          onChange={(e) => setDraft({ ...draft, note: e.target.value })}
        />
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

  const summary = setSummary(exercise.sets)

  return (
    <li className="group p-3">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{exercise.name}</span>
            {exercise.mode === 'quick' && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800">
                logged
              </span>
            )}
          </div>
          {summary && (
            <div className="mt-1 text-sm tabular-nums text-slate-500 dark:text-slate-400">
              {summary}
            </div>
          )}
          {exercise.note && (
            <div className="mt-1 text-xs italic text-slate-400">{exercise.note}</div>
          )}
          {info && (
            <button
              type="button"
              onClick={() => setInfoOpen((v) => !v)}
              className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-brand"
            >
              <span className="grid h-4 w-4 place-items-center rounded-full border border-brand text-[10px] font-bold">
                i
              </span>
              {infoOpen ? 'Hide info' : 'Info'} · {info.primary.join(', ')}
            </button>
          )}
        </div>
        <div className="flex shrink-0 items-center opacity-100 sm:opacity-60 sm:transition group-hover:sm:opacity-100">
          <button className="btn-icon" onClick={startEdit} aria-label="Edit exercise" title="Edit">
            <Edit width={16} height={16} />
          </button>
          <button
            className="btn-icon hover:!text-red-500"
            onClick={onDelete}
            aria-label="Delete exercise"
            title="Delete"
          >
            <Trash width={16} height={16} />
          </button>
        </div>
      </div>
      {info && infoOpen && (
        <div className="mt-2">
          <ExerciseInfo info={info} />
        </div>
      )}
    </li>
  )
}

export default function ExerciseList({ training, onUpdate, onDelete }) {
  if (training.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-2 p-8 text-center text-slate-400">
        <Dumbbell width={32} height={32} />
        <p className="text-sm">No exercises logged yet. Add one above.</p>
      </div>
    )
  }
  return (
    <ul className="card divide-y divide-slate-100 dark:divide-slate-800">
      {training.map((ex) => (
        <ExerciseRow
          key={ex.id}
          exercise={ex}
          onUpdate={(patch) => onUpdate(ex.id, patch)}
          onDelete={() => onDelete(ex.id)}
        />
      ))}
    </ul>
  )
}
