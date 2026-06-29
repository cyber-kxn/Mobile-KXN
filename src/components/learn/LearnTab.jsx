import { useMemo, useState } from 'react'
import { ChevronLeft } from '../Icons.jsx'
import { LEARN_ARTICLES, LEARN_CATEGORIES } from '../../lib/learn.js'

// Full article view.
function Article({ article, onBack }) {
  return (
    <div className="space-y-4">
      <button className="btn-ghost" onClick={onBack}>
        <ChevronLeft width={16} height={16} /> Back
      </button>
      <article className="card p-4">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand">
          {article.cat}
        </div>
        <h1 className="text-xl font-extrabold tracking-tight">{article.title}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{article.summary}</p>
        <div className="mt-4 space-y-4">
          {article.sections.map((s, i) => (
            <section key={i}>
              <h2 className="mb-1 font-semibold">{s.h}</h2>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{s.body}</p>
            </section>
          ))}
        </div>
      </article>
      <p className="px-1 text-center text-xs text-slate-400">
        General educational guidance — not medical or dietary advice.
      </p>
    </div>
  )
}

export default function LearnTab() {
  const [openId, setOpenId] = useState(null)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')

  const open = LEARN_ARTICLES.find((a) => a.id === openId)

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    return LEARN_ARTICLES.filter(
      (a) =>
        (cat === 'All' || a.cat === cat) &&
        (!s ||
          a.title.toLowerCase().includes(s) ||
          a.summary.toLowerCase().includes(s) ||
          a.cat.toLowerCase().includes(s))
    )
  }, [q, cat])

  if (open) return <Article article={open} onBack={() => setOpenId(null)} />

  return (
    <div className="space-y-4">
      <section className="card p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Learn</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Practical nutrition & training fundamentals.
        </p>
        <input
          className="field mt-3"
          placeholder="Search topics…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="mt-2 flex gap-2">
          {['All', ...LEARN_CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                cat === c
                  ? 'bg-brand text-white'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="card p-8 text-center text-sm text-slate-400">No topics match.</div>
      ) : (
        <ul className="card divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.map((a) => (
            <li key={a.id}>
              <button
                onClick={() => setOpenId(a.id)}
                className="flex w-full items-center gap-3 p-3 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{a.title}</div>
                  <div className="truncate text-xs text-slate-400">{a.summary}</div>
                </div>
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                  {a.cat}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
