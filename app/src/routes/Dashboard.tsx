import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PATHS, ROOMS, BADGES } from '@/data/catalog';
import { RoomCard } from '@/components/RoomCard';
import { Icon } from '@/components/ui/Icon';
import {
  Card,
  ProgressRing,
  Stat,
  SectionTitle,
  ProgressBar,
} from '@/components/ui/primitives';
import { useAuth } from '@/store/useAuth';
import { useProgress } from '@/store/useProgress';
import { fmtXp } from '@/lib/cn';

function levelFromXp(xp: number) {
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  const curBase = (level - 1) ** 2 * 100;
  const nextBase = level ** 2 * 100;
  const pct = (xp - curBase) / (nextBase - curBase);
  return { level, pct, toNext: nextBase - xp };
}

export function Dashboard() {
  const { user } = useAuth();
  const { xp, streak, completedRooms, earnedBadges } = useProgress();
  const { level, pct, toNext } = levelFromXp(xp);
  const featured = ROOMS.slice(0, 3);
  const continueRoom = ROOMS.find((r) => !completedRooms.includes(r.id)) || ROOMS[0];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass surface-grid relative overflow-hidden p-6"
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">Welcome back, operator</p>
            <h1 className="mt-1 text-2xl font-extrabold text-slate-100 sm:text-3xl">
              {user?.handle || 'agent'} <span className="gradient-text">// Level {level}</span>
            </h1>
            <div className="mt-4 max-w-sm">
              <div className="mb-1 flex justify-between text-xs text-slate-400">
                <span>{fmtXp(xp)} XP</span>
                <span>{fmtXp(toNext)} to level {level + 1}</span>
              </div>
              <ProgressBar value={pct} />
            </div>
            <Link to={`/room/${continueRoom.slug}`} className="btn-primary mt-5">
              <Icon name="play" size={16} /> Continue: {continueRoom.title}
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4 sm:flex sm:flex-col sm:gap-3">
            <Stat icon={<Icon name="bolt" size={18} />} label="Total XP" value={fmtXp(xp)} />
            <Stat icon={<Icon name="flame" size={18} />} label="Day streak" value={streak} />
            <Stat icon={<Icon name="check" size={18} />} label="Rooms" value={completedRooms.length} />
          </div>
        </div>
      </motion.div>

      {/* Paths */}
      <section>
        <SectionTitle
          title="Your learning paths"
          subtitle="Structured tracks from foundations to mastery"
          action={
            <Link to="/paths" className="text-sm font-medium text-violet-glow hover:underline">
              View all
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {PATHS.map((p) => {
            const roomIds = p.modules.flatMap((m) => m.roomIds);
            const done = roomIds.filter((id) => completedRooms.includes(id)).length;
            return (
              <Link key={p.id} to={`/path/${p.slug}`}>
                <div className={`glass glass-hover relative overflow-hidden bg-gradient-to-br ${p.accent} p-5`}>
                  <div className="flex items-start justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-obsidian-800/60 text-violet-glow">
                      <Icon name={p.icon} size={22} />
                    </div>
                    <ProgressRing value={roomIds.length ? done / roomIds.length : 0} label={`${done}/${roomIds.length}`} />
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-slate-100">{p.title}</h3>
                  <p className="text-sm text-slate-300/80">{p.tagline}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-slate-300/70">
                    <span className="flex items-center gap-1"><Icon name="clock" size={13} /> {p.estHours}h</span>
                    <span className="flex items-center gap-1"><Icon name="layers" size={13} /> {p.modules.length} modules</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured rooms */}
      <section>
        <SectionTitle title="Featured rooms" subtitle="Hand-picked hands-on labs" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((r) => (
            <RoomCard key={r.id} room={r} />
          ))}
        </div>
      </section>

      {/* Badges */}
      <section>
        <SectionTitle title="Achievements" action={<Link to="/profile" className="text-sm text-violet-glow hover:underline">All badges</Link>} />
        <div className="flex flex-wrap gap-3">
          {BADGES.map((b) => {
            const earned = earnedBadges.includes(b.id);
            return (
              <Card key={b.id} className={`flex w-36 flex-col items-center gap-2 text-center ${earned ? '' : 'opacity-40 grayscale'}`}>
                <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-violet/30 to-cyber/20 text-violet-glow">
                  <Icon name={b.icon} size={22} />
                </div>
                <div className="text-xs font-semibold text-slate-100">{b.name}</div>
                <div className="text-[10px] uppercase tracking-wide text-slate-500">{b.rarity}</div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
