import ExerciseForm from './ExerciseForm.jsx'
import ExerciseList from './ExerciseList.jsx'
import { Note } from '../Icons.jsx'

export default function TrainingTab({ day, library, actions, dateKey }) {
  const exerciseCount = day.training.length
  const setCount = day.training.reduce((n, e) => n + (e.sets?.length || 0), 0)

  return (
    <div className="space-y-4">
      <section className="card grid grid-cols-2 divide-x divide-slate-100 p-0 dark:divide-slate-800">
        <div className="px-2 py-3 text-center">
          <div className="text-xl font-extrabold tabular-nums">{exerciseCount}</div>
          <div className="text-[11px] uppercase tracking-wide text-slate-400">
            Exercises
          </div>
        </div>
        <div className="px-2 py-3 text-center">
          <div className="text-xl font-extrabold tabular-nums">{setCount}</div>
          <div className="text-[11px] uppercase tracking-wide text-slate-400">
            Total sets
          </div>
        </div>
      </section>

      <ExerciseForm
        library={library}
        onAdd={(ex) => actions.addExercise(dateKey, ex)}
      />

      <ExerciseList
        training={day.training}
        onUpdate={(id, patch) => actions.updateExercise(dateKey, id, patch)}
        onDelete={(id) => actions.deleteExercise(dateKey, id)}
      />

      {/* Per-day note */}
      <section className="card p-3 sm:p-4">
        <label htmlFor="day-note" className="label flex items-center gap-1.5">
          <Note width={14} height={14} /> Day notes
        </label>
        <textarea
          id="day-note"
          className="field min-h-[80px] resize-y"
          placeholder="How did training feel today? Energy, soreness, PRs…"
          value={day.notes}
          onChange={(e) => actions.setNotes(dateKey, e.target.value)}
        />
      </section>
    </div>
  )
}
