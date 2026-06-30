import { useMemo, useState } from 'react'
import { useStore } from './hooks/useStore.js'
import { useTheme } from './hooks/useTheme.js'
import { todayKey } from './lib/date.js'
import { mergeFoods } from './lib/foods.js'
import { sumFood } from './lib/utils.js'

import DateNav from './components/DateNav.jsx'
import FoodTab from './components/food/FoodTab.jsx'
import PlanTab from './components/plan/PlanTab.jsx'
import TrainingTab from './components/training/TrainingTab.jsx'
import HistoryTab from './components/history/HistoryTab.jsx'
import LearnTab from './components/learn/LearnTab.jsx'
import SettingsTab from './components/settings/SettingsTab.jsx'
import { Apple, Plan, Dumbbell, Book, Calendar, Settings, Sun, Moon } from './components/Icons.jsx'

const TABS = [
  { id: 'food', label: 'Food', Icon: Apple },
  { id: 'plan', label: 'Plan', Icon: Plan },
  { id: 'training', label: 'Train', Icon: Dumbbell },
  { id: 'learn', label: 'Learn', Icon: Book },
  { id: 'settings', label: 'Settings', Icon: Settings },
]

export default function App() {
  const store = useStore()
  const theme = useTheme()
  const [tab, setTab] = useState('food')
  const [dateKey, setDateKey] = useState(todayKey())
  const [toast, setToast] = useState('')

  const day = store.getDay(dateKey)
  const showDateNav = tab === 'food' || tab === 'training'

  function flash(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 1800)
  }

  // Built-in food index merged with the user's custom foods.
  const foods = useMemo(() => mergeFoods(store.store.foods), [store.store.foods])

  function selectDayFromHistory(key) {
    setDateKey(key)
    setTab('food')
  }

  return (
    <div className="mx-auto flex min-h-full max-w-2xl flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-slate-50/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand text-white">
              K
            </span>
            KXN <span className="font-medium text-slate-400">Track</span>
          </h1>
          <div className="flex items-center gap-1">
            <button
              className={`btn-icon ${tab === 'history' ? 'text-brand' : ''}`}
              onClick={() => setTab('history')}
              aria-label="History"
              title="History"
            >
              <Calendar />
            </button>
            <button
              className="btn-icon"
              onClick={theme.toggle}
              aria-label="Toggle dark mode"
              title="Toggle theme"
            >
              {theme.dark ? <Sun /> : <Moon />}
            </button>
          </div>
        </div>
        {showDateNav && (
          <div className="px-4 pb-3">
            <DateNav dateKey={dateKey} setDateKey={setDateKey} />
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 px-3 py-4 pb-28 sm:px-4">
        {tab === 'food' && (
          <FoodTab
            day={day}
            goals={store.store.goals}
            actions={store}
            dateKey={dateKey}
            foods={foods}
          />
        )}
        {tab === 'training' && (
          <TrainingTab
            day={day}
            library={store.store.library}
            actions={store}
            dateKey={dateKey}
          />
        )}
        {tab === 'plan' && (
          <PlanTab
            store={store.store}
            foods={foods}
            goals={store.store.goals}
            actions={store}
            dateKey={todayKey()}
            eaten={sumFood(store.getDay(todayKey()).food)}
            onLogged={(msg) => flash(msg || 'Logged ✓')}
          />
        )}
        {tab === 'learn' && <LearnTab />}
        {tab === 'history' && (
          <HistoryTab
            store={store.store}
            goals={store.store.goals}
            onSelectDay={selectDayFromHistory}
          />
        )}
        {tab === 'settings' && (
          <SettingsTab store={store.store} actions={store} theme={theme} foods={foods} />
        )}
      </main>

      {/* Bottom tab bar (mobile-first) */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div
          className="mx-auto grid max-w-2xl"
          style={{
            gridTemplateColumns: `repeat(${TABS.length}, 1fr)`,
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          {TABS.map(({ id, label, Icon }) => {
            const active = tab === id
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition ${
                  active
                    ? 'text-brand'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                <Icon width={22} height={22} />
                {label}
              </button>
            )
          })}
        </div>
      </nav>

      {toast && (
        <div className="fixed inset-x-0 bottom-24 z-50 mx-auto w-fit rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg animate-pop-in dark:bg-white dark:text-slate-900">
          {toast}
        </div>
      )}
    </div>
  )
}
