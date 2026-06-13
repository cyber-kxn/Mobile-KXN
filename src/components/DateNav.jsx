import { ChevronLeft, ChevronRight } from './Icons.jsx'
import { addDays, friendlyLabel, isToday, todayKey, toKey, fromKey } from '../lib/date.js'

/** Day switcher: arrows + a native date picker + a "Today" shortcut. */
export default function DateNav({ dateKey, setDateKey }) {
  const today = isToday(dateKey)

  return (
    <div className="flex items-center justify-between gap-2">
      <button
        className="btn-icon"
        onClick={() => setDateKey(addDays(dateKey, -1))}
        aria-label="Previous day"
      >
        <ChevronLeft />
      </button>

      <div className="relative flex flex-1 items-center justify-center">
        <label className="flex cursor-pointer flex-col items-center" title="Pick a date">
          <span className="text-base font-bold leading-tight">
            {friendlyLabel(dateKey)}
          </span>
          {!today && (
            <span className="text-[11px] text-slate-400">{dateKey}</span>
          )}
          {/* Invisible native date input overlaid for tap-to-pick. */}
          <input
            type="date"
            value={dateKey}
            max={todayKey()}
            onChange={(e) => e.target.value && setDateKey(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label="Select date"
          />
        </label>
      </div>

      <button
        className="btn-icon"
        onClick={() => setDateKey(addDays(dateKey, 1))}
        disabled={today}
        aria-label="Next day"
      >
        <ChevronRight />
      </button>

      {!today && (
        <button
          className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          onClick={() => setDateKey(toKey(new Date()))}
        >
          Today
        </button>
      )}
    </div>
  )
}
