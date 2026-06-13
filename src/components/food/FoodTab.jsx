import { Ring, Bar } from '../Progress.jsx'
import FoodForm from './FoodForm.jsx'
import FoodList from './FoodList.jsx'
import { sumFood, round } from '../../lib/utils.js'

/** Color-coded one-line verdict for the day. */
function overallStatus(totals, goals) {
  const cal = totals.calories
  const goal = goals.calories
  if (!goal) return { text: 'Set a calorie goal in Settings', cls: 'text-slate-400' }
  const pct = cal / goal
  if (pct > 1.05)
    return { text: `Over by ${round(cal - goal)} kcal`, cls: 'text-red-500' }
  if (pct >= 0.85)
    return { text: 'On track 🎯', cls: 'text-brand' }
  return { text: `${round(goal - cal)} kcal to go`, cls: 'text-amber-500' }
}

export default function FoodTab({ day, goals, actions, dateKey, foods }) {
  const totals = sumFood(day.food)
  const status = overallStatus(totals, goals)

  return (
    <div className="space-y-4">
      {/* Goal tracker */}
      <section className="card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Goal Tracker
          </h2>
          <span className={`text-sm font-semibold ${status.cls}`}>
            {status.text}
          </span>
        </div>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
          <Ring
            value={totals.calories}
            goal={goals.calories}
            label="Calories"
            unit="kcal"
          />
          <div className="grid w-full flex-1 gap-3">
            <Bar value={totals.protein} goal={goals.protein} label="Protein" color="sky" />
            <Bar value={totals.carbs} goal={goals.carbs} label="Carbs" color="amber" />
            <Bar value={totals.fat} goal={goals.fat} label="Fat" color="violet" />
          </div>
        </div>
      </section>

      {/* Overall daily total — kept visually separate from the goal view */}
      <section className="card grid grid-cols-4 divide-x divide-slate-100 p-0 dark:divide-slate-800">
        {[
          ['Calories', round(totals.calories), ''],
          ['Protein', round(totals.protein), 'g'],
          ['Carbs', round(totals.carbs), 'g'],
          ['Fat', round(totals.fat), 'g'],
        ].map(([lbl, val, unit]) => (
          <div key={lbl} className="px-2 py-3 text-center">
            <div className="text-lg font-extrabold tabular-nums sm:text-xl">
              {val}
              <span className="text-xs font-medium text-slate-400">{unit}</span>
            </div>
            <div className="text-[11px] uppercase tracking-wide text-slate-400">
              {lbl}
            </div>
          </div>
        ))}
      </section>

      <FoodForm foods={foods} onAdd={(entry) => actions.addFood(dateKey, entry)} />

      <FoodList
        food={day.food}
        onUpdate={(id, patch) => actions.updateFood(dateKey, id, patch)}
        onDelete={(id) => actions.deleteFood(dateKey, id)}
        onDuplicate={(id) => actions.duplicateFood(dateKey, id)}
      />
    </div>
  )
}
