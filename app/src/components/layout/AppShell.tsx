import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';
import { useAuth } from '@/store/useAuth';
import { useProgress } from '@/store/useProgress';
import { SearchPalette } from '@/components/SearchPalette';

const NAV = [
  { to: '/', icon: 'home', label: 'Dashboard', end: true },
  { to: '/paths', icon: 'layers', label: 'Paths' },
  { to: '/roadmap', icon: 'map', label: 'Roadmap' },
  { to: '/leaderboard', icon: 'trophy', label: 'Leaderboard' },
  { to: '/profile', icon: 'user', label: 'Profile' },
];

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-1">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet to-cyber shadow-glow">
        <span className="font-mono text-sm font-extrabold text-white">N</span>
      </div>
      <div className="leading-none">
        <div className="text-base font-extrabold tracking-tight text-slate-100">NETHEX</div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-violet-glow">cyber range</div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { user, logout } = useAuth();
  const { xp, streak } = useProgress();
  const loc = useLocation();
  const isRoom = loc.pathname.startsWith('/room/');

  useEffect(() => {
    const open = () => setPaletteOpen(true);
    window.addEventListener('nethex:openPalette', open);
    return () => window.removeEventListener('nethex:openPalette', open);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/[0.06] bg-obsidian-700/40 p-4 backdrop-blur-xl lg:flex">
        <div className="mb-6">
          <Brand />
        </div>
        <button
          onClick={() => setPaletteOpen(true)}
          className="mb-5 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-400 hover:border-violet/40"
        >
          <Icon name="search" size={16} />
          Search
          <kbd className="ml-auto rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
        </button>
        <nav className="flex flex-col gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-violet/15 text-violet-glow shadow-glow'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
                )
              }
            >
              <Icon name={n.icon} size={18} />
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-3">
          <div className="glass flex items-center justify-around p-3">
            <div className="text-center">
              <div className="text-sm font-bold text-cyber-glow">{xp.toLocaleString()}</div>
              <div className="text-[10px] uppercase tracking-wide text-slate-500">XP</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-1 text-center">
              <Icon name="flame" size={16} className="text-amber-400" />
              <div>
                <div className="text-sm font-bold text-amber-300">{streak}</div>
                <div className="text-[10px] uppercase tracking-wide text-slate-500">streak</div>
              </div>
            </div>
          </div>
          {user && (
            <button
              onClick={logout}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-500 hover:text-rose-300"
            >
              <Icon name="logout" size={16} /> Sign out
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.06] bg-obsidian-800/80 px-4 py-3 pt-safe backdrop-blur-xl lg:hidden">
          <Brand />
          <div className="flex items-center gap-2">
            <span className="chip border border-amber-500/20 bg-amber-500/10 text-amber-300">
              <Icon name="flame" size={13} /> {streak}
            </span>
            <button
              onClick={() => setPaletteOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300"
            >
              <Icon name="search" size={18} />
            </button>
          </div>
        </header>

        <main className={cn('flex-1', isRoom ? '' : 'mx-auto w-full max-w-6xl px-4 py-6 pb-28 lg:pb-8')}>
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-white/[0.06] bg-obsidian-800/90 px-2 pb-safe pt-2 backdrop-blur-xl lg:hidden">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cn(
                  'flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-[10px] font-medium transition-colors',
                  isActive ? 'text-violet-glow' : 'text-slate-500',
                )
              }
            >
              <Icon name={n.icon} size={20} />
              {n.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <SearchPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
