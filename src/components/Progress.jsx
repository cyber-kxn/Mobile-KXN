import { clamp, round } from '../lib/utils.js'

// Status helpers shared by ring + bar.
// "under" = below goal, "ontrack" = within 100-105%, "over" = past the buffer.
function statusFor(value, goal) {
  if (!goal) return 'under'
  const pct = value / goal
  if (pct > 1.05) return 'over'
  if (pct >= 1.0) return 'ontrack'
  if (pct >= 0.85) return 'ontrack'
  return 'under'
}

const COLORS = {
  under: { stroke: '#10b981', text: 'text-brand', bg: 'bg-brand' },
  ontrack: { stroke: '#10b981', text: 'text-brand', bg: 'bg-brand' },
  over: { stroke: '#ef4444', text: 'text-red-500', bg: 'bg-red-500' },
}

/** Circular progress ring — used for the headline calorie figure. */
export function Ring({ value, goal, label, unit = '' }) {
  const size = 132
  const stroke = 12
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const pct = goal ? clamp(value / goal, 0, 1) : 0
  const status = statusFor(value, goal)
  const color = COLORS[status]
  const remaining = round(goal - value)

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            className="stroke-slate-200 dark:stroke-slate-800"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            stroke={color.stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - pct)}
            style={{ transition: 'stroke-dashoffset 0.4s ease, stroke 0.3s' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold tabular-nums">
            {round(value)}
          </span>
          <span className="text-xs text-slate-400">of {goal} {unit}</span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <div className="text-sm font-semibold">{label}</div>
        <div className={`text-xs font-medium ${color.text}`}>
          {remaining >= 0
            ? `${remaining} ${unit} left`
            : `${Math.abs(remaining)} ${unit} over`}
        </div>
      </div>
    </div>
  )
}

/** Horizontal progress bar — used for the macros. */
export function Bar({ value, goal, label, unit = 'g', color = 'sky' }) {
  const pct = goal ? clamp(value / goal, 0, 1) * 100 : 0
  const over = goal && value > goal * 1.05
  const remaining = round(goal - value)

  const palette = {
    sky: 'bg-sky-500',
    amber: 'bg-amber-500',
    violet: 'bg-violet-500',
  }
  const barColor = over ? 'bg-red-500' : palette[color] || 'bg-brand'

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-slate-500 dark:text-slate-400">
          {round(value)}
          <span className="text-slate-400 dark:text-slate-500">
            {' '}/ {goal}
            {unit}
          </span>
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${pct}%`, transition: 'width 0.4s ease' }}
        />
      </div>
      <div className="mt-1 text-right text-xs">
        <span className={over ? 'text-red-500' : 'text-slate-400'}>
          {remaining >= 0
            ? `${remaining}${unit} left`
            : `${Math.abs(remaining)}${unit} over`}
        </span>
      </div>
    </div>
  )
}
