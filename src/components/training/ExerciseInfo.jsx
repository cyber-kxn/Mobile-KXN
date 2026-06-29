// Renders the "what does this work / how to do it" card for an exercise.

function Chips({ items, tone = 'brand' }) {
  const cls =
    tone === 'brand'
      ? 'bg-brand/15 text-brand'
      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((m) => (
        <span key={m} className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
          {m}
        </span>
      ))}
    </div>
  )
}

export default function ExerciseInfo({ info }) {
  if (!info) return null
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-800/40">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="font-semibold">{info.name}</span>
        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
          {info.category}
        </span>
        <span className="text-[11px] text-slate-400">{info.equipment}</span>
      </div>

      <div className="mb-2 space-y-1.5">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 w-16 shrink-0 text-xs font-medium text-slate-400">Primary</span>
          <Chips items={info.primary} tone="brand" />
        </div>
        {info.secondary?.length > 0 && (
          <div className="flex items-start gap-2">
            <span className="mt-0.5 w-16 shrink-0 text-xs font-medium text-slate-400">Secondary</span>
            <Chips items={info.secondary} tone="muted" />
          </div>
        )}
      </div>

      <div className="mb-2">
        <div className="mb-1 text-xs font-medium text-slate-400">How to</div>
        <ol className="list-decimal space-y-0.5 pl-5 text-slate-600 dark:text-slate-300">
          {info.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </div>

      {info.cues?.length > 0 && (
        <div>
          <div className="mb-1 text-xs font-medium text-slate-400">Form cues</div>
          <ul className="space-y-0.5 text-slate-600 dark:text-slate-300">
            {info.cues.map((c, i) => (
              <li key={i} className="flex gap-1.5">
                <span className="text-brand">•</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
