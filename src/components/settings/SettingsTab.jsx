import { useRef, useState } from 'react'
import { Trash, Edit, Check, X, Download, Upload, Sun, Moon } from '../Icons.jsx'
import { exportStore, importFromFile } from '../../lib/storage.js'
import { emptyStore, DEFAULT_GOALS } from '../../lib/defaults.js'
import { toNonNegNumber } from '../../lib/utils.js'

function GoalInput({ id, label, unit, value, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label} ({unit})
      </label>
      <input
        id={id}
        className="field tabular-nums"
        type="number"
        min="0"
        step="any"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

function LibraryItem({ name, onRename, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(name)
  return (
    <li className="flex items-center gap-2 p-2.5">
      {editing ? (
        <>
          <input
            className="field flex-1 py-1.5"
            value={draft}
            autoFocus
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onRename(draft)
                setEditing(false)
              }
            }}
          />
          <button
            className="btn-icon"
            onClick={() => {
              onRename(draft)
              setEditing(false)
            }}
            aria-label="Save name"
          >
            <Check width={16} height={16} />
          </button>
          <button
            className="btn-icon"
            onClick={() => {
              setDraft(name)
              setEditing(false)
            }}
            aria-label="Cancel"
          >
            <X width={16} height={16} />
          </button>
        </>
      ) : (
        <>
          <span className="flex-1 text-sm">{name}</span>
          <button className="btn-icon" onClick={() => setEditing(true)} aria-label={`Rename ${name}`}>
            <Edit width={15} height={15} />
          </button>
          <button
            className="btn-icon hover:!text-red-500"
            onClick={onDelete}
            aria-label={`Delete ${name}`}
          >
            <Trash width={15} height={15} />
          </button>
        </>
      )}
    </li>
  )
}

export default function SettingsTab({ store, actions, theme }) {
  const [goals, setLocalGoals] = useState(store.goals)
  const [libFilter, setLibFilter] = useState('')
  const [msg, setMsg] = useState('')
  const fileRef = useRef(null)

  function saveGoals() {
    actions.setGoals({
      calories: toNonNegNumber(goals.calories),
      protein: toNonNegNumber(goals.protein),
      carbs: toNonNegNumber(goals.carbs),
      fat: toNonNegNumber(goals.fat),
    })
    flash('Goals saved ✓')
  }

  function flash(text) {
    setMsg(text)
    setTimeout(() => setMsg(''), 2000)
  }

  async function onImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const next = await importFromFile(file)
      if (!confirm('Importing will replace all current data. Continue?')) return
      actions.replaceStore(next)
      setLocalGoals(next.goals)
      flash('Backup imported ✓')
    } catch (err) {
      alert(err.message)
    } finally {
      e.target.value = ''
    }
  }

  function resetAll() {
    if (!confirm('Delete ALL data and start fresh? This cannot be undone.')) return
    const fresh = emptyStore()
    actions.replaceStore(fresh)
    setLocalGoals(fresh.goals)
    flash('All data reset')
  }

  const filteredLib = store.library.filter((e) =>
    e.toLowerCase().includes(libFilter.trim().toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Daily goals */}
      <section className="card p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Daily Goals
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <GoalInput id="g-cal" label="Calories" unit="kcal" value={goals.calories}
            onChange={(v) => setLocalGoals({ ...goals, calories: v })} />
          <GoalInput id="g-pro" label="Protein" unit="g" value={goals.protein}
            onChange={(v) => setLocalGoals({ ...goals, protein: v })} />
          <GoalInput id="g-carb" label="Carbs" unit="g" value={goals.carbs}
            onChange={(v) => setLocalGoals({ ...goals, carbs: v })} />
          <GoalInput id="g-fat" label="Fat" unit="g" value={goals.fat}
            onChange={(v) => setLocalGoals({ ...goals, fat: v })} />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button className="btn-primary" onClick={saveGoals}>
            Save goals
          </button>
          <button
            className="btn-ghost"
            onClick={() => setLocalGoals({ ...DEFAULT_GOALS })}
          >
            Reset defaults
          </button>
        </div>
      </section>

      {/* Appearance */}
      <section className="card flex items-center justify-between p-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Appearance
          </h2>
          <p className="text-sm text-slate-500">
            {theme.dark ? 'Dark mode' : 'Light mode'}
          </p>
        </div>
        <button className="btn-ghost" onClick={theme.toggle}>
          {theme.dark ? <Sun width={16} height={16} /> : <Moon width={16} height={16} />}
          {theme.dark ? 'Light' : 'Dark'}
        </button>
      </section>

      {/* Exercise library */}
      <section className="card p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Exercise Library ({store.library.length})
        </h2>
        <input
          className="field mb-2"
          placeholder="Filter exercises…"
          value={libFilter}
          onChange={(e) => setLibFilter(e.target.value)}
        />
        <ul className="max-h-72 divide-y divide-slate-100 overflow-auto rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {filteredLib.length === 0 ? (
            <li className="p-3 text-center text-sm text-slate-400">No matches.</li>
          ) : (
            filteredLib.map((name) => (
              <LibraryItem
                key={name}
                name={name}
                onRename={(n) => actions.renameLibraryItem(name, n)}
                onDelete={() => actions.deleteLibraryItem(name)}
              />
            ))
          )}
        </ul>
      </section>

      {/* Data */}
      <section className="card p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Backup & Data
        </h2>
        <div className="flex flex-wrap gap-2">
          <button className="btn-ghost" onClick={() => exportStore(store)}>
            <Download width={16} height={16} /> Export JSON
          </button>
          <button className="btn-ghost" onClick={() => fileRef.current?.click()}>
            <Upload width={16} height={16} /> Import JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={onImport}
          />
          <button
            className="btn bg-red-500 text-white hover:bg-red-600"
            onClick={resetAll}
          >
            <Trash width={16} height={16} /> Reset all
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          All data lives in your browser (localStorage). Export regularly to keep a backup.
        </p>
      </section>

      {msg && (
        <div className="fixed inset-x-0 bottom-24 z-50 mx-auto w-fit rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg animate-pop-in dark:bg-white dark:text-slate-900">
          {msg}
        </div>
      )}
    </div>
  )
}
