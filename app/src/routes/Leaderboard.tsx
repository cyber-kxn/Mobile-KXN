import { LEADERBOARD } from '@/data/catalog';
import { Icon } from '@/components/ui/Icon';
import { useAuth } from '@/store/useAuth';
import { useProgress } from '@/store/useProgress';
import { cn, fmtXp } from '@/lib/cn';

export function Leaderboard() {
  const { user } = useAuth();
  const { xp, streak } = useProgress();

  const me = {
    rank: LEADERBOARD.length + 1,
    handle: user?.handle || 'you',
    xp,
    streak,
    country: '🌐',
    isMe: true,
  };
  const rows = [...LEADERBOARD.map((r) => ({ ...r, isMe: false })), me];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100">Global leaderboard</h1>
        <p className="text-slate-400">This season's top operators across the range.</p>
      </div>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-3">
        {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((p, i) => {
          const place = i === 1 ? 1 : i === 0 ? 2 : 3;
          const h = place === 1 ? 'h-32' : place === 2 ? 'h-24' : 'h-20';
          return (
            <div key={p.handle} className="flex flex-col items-center justify-end">
              <div className="mb-2 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-violet/40 to-cyber/30 text-lg font-bold text-white">
                {p.handle[0].toUpperCase()}
              </div>
              <div className="text-sm font-semibold text-slate-100">{p.handle}</div>
              <div className="text-xs text-cyber-glow">{fmtXp(p.xp)} XP</div>
              <div className={cn('mt-2 flex w-full items-start justify-center rounded-t-xl bg-gradient-to-b pt-2 font-mono text-2xl font-extrabold', h, place === 1 ? 'from-amber-400/30 to-transparent text-amber-300' : place === 2 ? 'from-slate-300/20 to-transparent text-slate-300' : 'from-orange-500/20 to-transparent text-orange-300')}>
                {place}
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="glass overflow-hidden p-0">
        {rows.map((r) => (
          <div
            key={r.handle + r.rank}
            className={cn(
              'flex items-center gap-3 border-b border-white/[0.04] px-4 py-3 last:border-0',
              r.isMe && 'bg-violet/10',
            )}
          >
            <div className={cn('w-6 text-center font-mono text-sm font-bold', r.rank <= 3 ? 'text-amber-300' : 'text-slate-500')}>
              {r.rank}
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-sm font-bold text-slate-200">
              {r.handle[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                {r.handle} {r.isMe && <span className="chip border border-violet/40 bg-violet/15 text-violet-glow">you</span>}
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Icon name="flame" size={12} className="text-amber-400" /> {r.streak}d streak
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-cyber-glow">{fmtXp(r.xp)}</div>
              <div className="text-[10px] uppercase text-slate-500">XP</div>
            </div>
            <span className="text-lg">{r.country}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
