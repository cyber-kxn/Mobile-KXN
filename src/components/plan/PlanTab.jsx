import { useMemo, useState } from 'react'
import { Plus, X, Check, Apple } from '../Icons.jsx'
import { round } from '../../lib/utils.js'
import {
  solveGrams,
  mealTotals,
  recommendMeals,
  macroError,
} from '../../lib/mealplan.js'

// Turn a {food, grams} list into diary-entry shaped rows for logging.
function toEntries(items) {
  return items.map(({ food, grams }) => {
    const g = grams / 100
    return {
      name: food.n,
      grams,
      calories: Math.round(food.kcal * g),
      protein: round(food.p * g),
      carbs: round(food.c * g),
      fat: round(food.f * g),
    }
  })
}

/** Compact accuracy badge for how well a meal hits its target. */
function FitBadge({ error }) {
  const pct = Math.round((1 - Math.min(error, 1)) * 100)
  const cls =
    error < 0.08
      ? 'bg-brand/15 text-brand'
      : error < 0.2
      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
      : 'bg-red-500/15 text-red-500'
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls}`}>
      {pct}% fit
    </span>
  )
}

function MealCard({ items, totals, error, target, onLog }) {
  return (
    <div className="card p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold">Suggested meal</span>
        <FitBadge error={error} />
      </div>
      <ul className="mb-2 divide-y divide-slate-100 dark:divide-slate-800">
        {items.map((it) => (
          <li key={it.food.n} className="flex items-center justify-between py-1.5 text-sm">
            <span className="truncate">{it.food.n}</span>
            <span className="shrink-0 font-semibold tabular-nums">{it.grams} g</span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="tabular-nums">
          <b className="text-slate-700 dark:text-slate-200">{Math.round(totals.calories)}</b> kcal ·
          P {round(totals.protein)} · C {round(totals.carbs)} · F {round(totals.fat)}
        </span>
        <button className="btn-primary !px-3 !py-1.5 text-xs" onClick={() => onLog(items)}>
          <Plus width={14} height={14} /> Log
        </button>
      </div>
      <div className="mt-1 text-[11px] text-slate-400">
        target {Math.round(target.calories)} kcal · P {round(target.protein)} · C{' '}
        {round(target.carbs)} · F {round(target.fat)}
      </div>
    </div>
  )
}

// Inline food search that returns a picked food.
function FoodPicker({ foods, onPick }) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const matches = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return []
    return foods.filter((f) => f.n.toLowerCase().includes(s)).slice(0, 6)
  }, [q, foods])
  return (
    <div className="relative">
      <input
        className="field"
        placeholder="Add an ingredient…"
        value={q}
        autoComplete="off"
        onChange={(e) => {
          setQ(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {open && matches.length > 0 && (
        <ul className="card absolute z-20 mt-1 max-h-60 w-full overflow-auto p-1 animate-pop-in">
          {matches.map((m) => (
            <li key={m.n}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onPick(m)
                  setQ('')
                  setOpen(false)
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <span className="truncate">{m.n}</span>
                <span className="shrink-0 text-xs text-slate-400">{m.kcal} kcal/100g</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function PlanTab({ store, foods, goals, actions, dateKey, onLogged }) {
  const mp = store.mealPlan
  const [mode, setMode] = useState('recommend')
  const [seed, setSeed] = useState(0)
  const [buildFoods, setBuildFoods] = useState([])
  const [showFoods, setShowFoods] = useState(false)
  const [foodFilter, setFoodFilter] = useState('')

  // Effective daily target: explicit override, else the user's Goals.
  const daily = mp.target || goals
  const meals = mp.meals || 3
  const perMeal = {
    calories: daily.calories / meals,
    protein: daily.protein / meals,
    carbs: daily.carbs / meals,
    fat: daily.fat / meals,
  }

  const disabled = useMemo(() => new Set(mp.disabled), [mp.disabled])
  const enabledFoods = useMemo(
    () => foods.filter((f) => !disabled.has(f.n)),
    [foods, disabled]
  )

  const recs = useMemo(
    () => recommendMeals(enabledFoods, perMeal, { count: 4, seed }),
    [enabledFoods, perMeal.protein, perMeal.carbs, perMeal.fat, seed]
  )

  // Build-your-own result.
  const build = useMemo(() => {
    if (!buildFoods.length) return null
    const grams = solveGrams(buildFoods, perMeal)
    const items = buildFoods.map((food, i) => ({ food, grams: grams[i] }))
    const totals = mealTotals(items)
    return { items, totals, error: macroError(totals, perMeal) }
  }, [buildFoods, perMeal.protein, perMeal.carbs, perMeal.fat])

  function logMeal(items) {
    actions.addFoods(dateKey, toEntries(items))
    onLogged?.()
  }

  function setDaily(field, value) {
    const next = { ...daily, [field]: Math.max(0, parseFloat(value) || 0) }
    actions.setMealPlan({ target: next })
  }

  // Group foods by category for the include/exclude panel.
  const filteredFoods = foods.filter((f) =>
    f.n.toLowerCase().includes(foodFilter.trim().toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Targets */}
      <section className="card p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Plan targets
        </h2>

        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium">Meals per day</span>
          <div className="flex items-center gap-3">
            <button
              className="btn-icon !bg-slate-100 dark:!bg-slate-800"
              onClick={() => actions.setMealPlan({ meals: Math.max(1, meals - 1) })}
              aria-label="Fewer meals"
            >
              –
            </button>
            <span className="w-6 text-center text-lg font-bold tabular-nums">{meals}</span>
            <button
              className="btn-icon !bg-slate-100 dark:!bg-slate-800"
              onClick={() => actions.setMealPlan({ meals: Math.min(8, meals + 1) })}
              aria-label="More meals"
            >
              +
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            ['calories', 'Calories'],
            ['protein', 'Protein'],
            ['carbs', 'Carbs'],
            ['fat', 'Fat'],
          ].map(([f, lbl]) => (
            <div key={f}>
              <label className="label">{lbl}/day</label>
              <input
                className="field px-2 text-center tabular-nums"
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                value={Math.round(daily[f])}
                onChange={(e) => setDaily(f, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>
            Per meal: {Math.round(perMeal.calories)} kcal · P {round(perMeal.protein)} · C{' '}
            {round(perMeal.carbs)} · F {round(perMeal.fat)}
          </span>
          {mp.target && (
            <button className="font-medium text-brand" onClick={() => actions.setMealPlan({ target: null })}>
              Use Goals
            </button>
          )}
        </div>
      </section>

      {/* Mode switch */}
      <div className="inline-flex w-full rounded-xl bg-slate-100 p-1 text-sm dark:bg-slate-800">
        {[
          ['recommend', 'Recommend meals'],
          ['build', 'Build your own'],
        ].map(([m, lbl]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 rounded-lg px-3 py-2 font-semibold transition ${
              mode === m
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500'
            }`}
          >
            {lbl}
          </button>
        ))}
      </div>

      {mode === 'recommend' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              {enabledFoods.length} foods enabled
            </span>
            <button className="btn-ghost !py-1.5 text-xs" onClick={() => setSeed((s) => s + 1)}>
              ↻ Regenerate
            </button>
          </div>

          {/* Include / exclude foods */}
          <section className="card p-3">
            <button
              className="flex w-full items-center justify-between text-sm font-semibold"
              onClick={() => setShowFoods((v) => !v)}
            >
              <span>Foods to include</span>
              <span className="text-slate-400">{showFoods ? '▲' : '▼'}</span>
            </button>
            {showFoods && (
              <div className="mt-3">
                <input
                  className="field mb-2"
                  placeholder="Filter foods…"
                  value={foodFilter}
                  onChange={(e) => setFoodFilter(e.target.value)}
                />
                <div className="mb-2 flex gap-2">
                  <button
                    className="btn-ghost !py-1.5 text-xs"
                    onClick={() => actions.setMealPlan({ disabled: [] })}
                  >
                    Enable all
                  </button>
                  <button
                    className="btn-ghost !py-1.5 text-xs"
                    onClick={() => actions.setMealPlan({ disabled: foods.map((f) => f.n) })}
                  >
                    Disable all
                  </button>
                </div>
                <div className="max-h-64 space-y-0.5 overflow-auto rounded-xl border border-slate-200 p-1 dark:border-slate-800">
                  {filteredFoods.map((f) => {
                    const on = !disabled.has(f.n)
                    return (
                      <label
                        key={f.n}
                        className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={(e) => actions.toggleFoodEnabled(f.n, e.target.checked)}
                          className="h-4 w-4 accent-brand"
                        />
                        <span className="flex-1 truncate">{f.n}</span>
                        <span className="text-xs text-slate-400">{f.kcal} kcal</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            )}
          </section>

          {recs.length === 0 ? (
            <div className="card p-6 text-center text-sm text-slate-400">
              No meals fit — try enabling more foods or adjusting targets.
            </div>
          ) : (
            recs.map((r, i) => (
              <MealCard key={i} {...r} target={perMeal} onLog={logMeal} />
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <section className="card p-3">
            <label className="label">Add the ingredients for one meal</label>
            <FoodPicker
              foods={foods}
              onPick={(f) =>
                setBuildFoods((prev) =>
                  prev.some((x) => x.n === f.n) ? prev : [...prev, f]
                )
              }
            />
            {buildFoods.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {buildFoods.map((f) => (
                  <span
                    key={f.n}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm dark:bg-slate-800"
                  >
                    {f.n}
                    <button
                      onClick={() => setBuildFoods((prev) => prev.filter((x) => x.n !== f.n))}
                      aria-label={`Remove ${f.n}`}
                    >
                      <X width={14} height={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </section>

          {build ? (
            <section className="card p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold">Grams to hit your per-meal target</span>
                <FitBadge error={build.error} />
              </div>
              <ul className="mb-2 divide-y divide-slate-100 dark:divide-slate-800">
                {build.items.map((it) => (
                  <li
                    key={it.food.n}
                    className="flex items-center justify-between py-1.5 text-sm"
                  >
                    <span className="truncate">{it.food.n}</span>
                    <span className="shrink-0 font-semibold tabular-nums">{it.grams} g</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="tabular-nums">
                  <b className="text-slate-700 dark:text-slate-200">
                    {Math.round(build.totals.calories)}
                  </b>{' '}
                  kcal · P {round(build.totals.protein)} · C {round(build.totals.carbs)} · F{' '}
                  {round(build.totals.fat)}
                </span>
                <button className="btn-primary !px-3 !py-1.5 text-xs" onClick={() => logMeal(build.items)}>
                  <Plus width={14} height={14} /> Log
                </button>
              </div>
            </section>
          ) : (
            <div className="card flex flex-col items-center gap-2 p-8 text-center text-slate-400">
              <Apple width={30} height={30} />
              <p className="text-sm">
                Add 2–4 ingredients and we'll work out the grams of each to hit your target.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
