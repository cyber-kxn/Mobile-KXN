import { useMemo } from 'react'
import { toKey, addDays, todayKey, shortLabel, friendlyLabel } from '../../lib/date.js'
import { sumFood, round, clamp } from '../../lib/utils.js'
import { Apple, Dumbbell, ChevronRight } from '../Icons.jsx'

const WEEKS = 18

/** Build a column-major grid (weeks × 7 days) ending today. */
function buildGrid() {
  const cells = []
  const total = WEEKS * 7
  // Align so the last column ends on today; start from the most recent Sunday-back window.
  const start = addDays(todayKey(), -(total - 1))
  for (let i = 0; i < total; i++) {
    cells.push(addDays(start, i))
  }
  return cells
}

function intensityClass(level) {
  // 0..4 scale.
  return [
    'bg-slate-100 dark:bg-slate-800',
    'bg-brand-100 dark:bg-brand-700/40',
    'bg-brand-500/40 dark:bg-brand-600/60',
    'bg-brand-500/70 dark:bg-brand-500/80',
    'bg-brand-600 dark:bg-brand-500',
  ][level]
}

export default function HistoryTab({ store, goals, onSelectDay }) {
  const cells = useMemo(buildGrid, [])

  // Logged days (anything with food or training), most recent first.
  const loggedDays = useMemo(() => {
    return Object.entries(store.days)
      .filter(([, d]) => d.food?.length || d.training?.length || d.notes)
      .map(([key, d]) => ({ key, ...d, totals: sumFood(d.food) }))
      .sort((a, b) => (a.key < b.key ? 1 : -1))
  }, [store.days])

  function levelFor(key) {
    const day = store.days[key]
    if (!day) return 0
    const cals = sumFood(day.food).calories
    const hasTraining = day.training?.length > 0
    if (!cals && !hasTraining) return 0
    if (!cals && hasTraining) return 1
    const ratio = goals.calories ? cals / goals.calories : 0
    return clamp(Math.ceil(ratio * 3), 1, 4)
  }

  return (
    <div className="space-y-4">
      {/* Heatmap */}
      <section className="card p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Activity — last {WEEKS} weeks
        </h2>
        <div className="overflow-x-auto pb-1">
          <div
            className="grid grid-flow-col gap-1"
            style={{ gridTemplateRows: 'repeat(7, minmax(0, 1fr))' }}
          >
            {cells.map((key) => {
              const future = key > todayKey()
              const level = future ? 0 : levelFor(key)
              return (
                <button
                  key={key}
                  disabled={future}
                  onClick={() => onSelectDay(key)}
                  title={`${shortLabel(key)} — ${round(sumFood(store.days[key]?.food || []).calories)} kcal`}
                  className={`h-4 w-4 rounded-sm ${future ? 'opacity-0' : intensityClass(level)} transition hover:ring-2 hover:ring-brand/50`}
                  aria-label={shortLabel(key)}
                />
              )
            })}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-end gap-1 text-xs text-slate-400">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className={`h-3 w-3 rounded-sm ${intensityClass(l)}`} />
          ))}
          <span>More</span>
        </div>
      </section>

      {/* Logged days list */}
      <section className="space-y-2">
        <h2 className="px-1 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Logged days
        </h2>
        {loggedDays.length === 0 ? (
          <div className="card p-8 text-center text-sm text-slate-400">
            No history yet — start logging on the Food or Training tabs.
          </div>
        ) : (
          <ul className="card divide-y divide-slate-100 dark:divide-slate-800">
            {loggedDays.map((d) => (
              <li key={d.key}>
                <button
                  onClick={() => onSelectDay(d.key)}
                  className="flex w-full items-center gap-3 p-3 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{friendlyLabel(d.key)}</div>
                    <div className="text-xs text-slate-400">{shortLabel(d.key)}</div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Apple width={14} height={14} />
                      {round(d.totals.calories)} kcal
                    </span>
                    <span className="flex items-center gap-1">
                      <Dumbbell width={14} height={14} />
                      {d.training?.length || 0}
                    </span>
                  </div>
                  <ChevronRight width={16} height={16} className="text-slate-300" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
