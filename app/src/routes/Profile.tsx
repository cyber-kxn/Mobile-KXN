import { BADGES, ROOMS } from '@/data/catalog';
import { Icon } from '@/components/ui/Icon';
import { Card, Stat } from '@/components/ui/primitives';
import { useAuth } from '@/store/useAuth';
import { useProgress } from '@/store/useProgress';
import { fmtXp, cn } from '@/lib/cn';

const rarityRing: Record<string, string> = {
  common: 'from-slate-400/30 to-slate-600/20',
  rare: 'from-cyber/40 to-blue-500/20',
  epic: 'from-violet/40 to-fuchsia-500/20',
  legendary: 'from-amber-400/40 to-orange-500/30',
};

export function Profile() {
  const { user, logout } = useAuth();
  const { xp, streak, completedRooms, earnedBadges, reset } = useProgress();

  return (
    <div className="space-y-6">
      <div className="glass surface-grid flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
        <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-violet to-cyber text-3xl font-extrabold text-white shadow-glow">
          {(user?.handle || 'A')[0].toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-slate-100">{user?.handle || 'operator'}</h1>
          <p className="text-sm text-slate-400">{user?.email || 'local session'}</p>
          {user?.interests && user.interests.length > 0 && (
            <div className="mt-2 flex flex-wrap justify-center gap-1.5 sm:justify-start">
              {user.interests.map((i) => (
                <span key={i} className="chip border border-white/10 bg-white/5 text-slate-300">{i}</span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-5">
          <Stat icon={<Icon name="bolt" size={18} />} label="XP" value={fmtXp(xp)} />
          <Stat icon={<Icon name="flame" size={18} />} label="Streak" value={streak} />
          <Stat icon={<Icon name="check" size={18} />} label="Rooms" value={completedRooms.length} />
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-100">Badges</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {BADGES.map((b) => {
            const earned = earnedBadges.includes(b.id);
            return (
              <Card key={b.id} className={cn('flex flex-col items-center gap-2 text-center', !earned && 'opacity-40 grayscale')}>
                <div className={cn('grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br text-white', rarityRing[b.rarity])}>
                  <Icon name={b.icon} size={24} />
                </div>
                <div className="text-xs font-semibold text-slate-100">{b.name}</div>
                <div className="text-[10px] text-slate-500">{b.description}</div>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-100">Completed rooms</h2>
        {completedRooms.length === 0 ? (
          <p className="text-sm text-slate-400">No rooms completed yet — head to a path and pop your first flag.</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {completedRooms.map((id) => {
              const r = ROOMS.find((x) => x.id === id);
              return r ? (
                <div key={id} className="glass flex items-center gap-3 p-3">
                  <Icon name="check" size={16} className="text-emerald-300" />
                  <span className="text-sm text-slate-200">{r.title}</span>
                  <span className="ml-auto text-xs text-cyber-glow">{r.xp} XP</span>
                </div>
              ) : null;
            })}
          </div>
        )}
      </section>

      <section className="glass p-4">
        <h2 className="mb-2 text-sm font-bold text-slate-100">Account</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={logout} className="btn-ghost">
            <Icon name="logout" size={16} /> Sign out
          </button>
          <button
            onClick={() => {
              if (confirm('Reset all local progress? This cannot be undone.')) reset();
            }}
            className="btn-ghost text-rose-300"
          >
            Reset progress
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Subscription tier: <span className="text-violet-glow">Operator (free)</span> · Upgrade to Apex for private networks & longer lab TTLs.
        </p>
      </section>
    </div>
  );
}
