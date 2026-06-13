import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PATHS, getRoomById } from '@/data/catalog';
import { Icon } from '@/components/ui/Icon';
import { useProgress } from '@/store/useProgress';
import { cn } from '@/lib/cn';

// Visual skill-tree: paths as columns, rooms as connected nodes.
export function Roadmap() {
  const completedRooms = useProgress((s) => s.completedRooms);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100">Skill roadmap</h1>
        <p className="text-slate-400">Your path from initiate to apex operator. Unlock nodes as you complete rooms.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {PATHS.map((path) => {
          const rooms = path.modules.flatMap((m) =>
            m.roomIds.map((id) => getRoomById(id)).filter(Boolean),
          );
          return (
            <div key={path.id} className={`glass bg-gradient-to-br ${path.accent} p-5`}>
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-obsidian-800/60 text-violet-glow">
                  <Icon name={path.icon} size={20} />
                </div>
                <h2 className="font-bold text-slate-100">{path.title}</h2>
              </div>

              <div className="relative pl-6">
                {/* spine */}
                <div className="absolute bottom-3 left-[11px] top-3 w-0.5 bg-gradient-to-b from-violet/60 to-cyber/40" />
                <div className="space-y-3">
                  {rooms.map((r, idx) => {
                    const done = r && completedRooms.includes(r.id);
                    const prev = idx === 0 || (rooms[idx - 1] && completedRooms.includes(rooms[idx - 1]!.id));
                    const locked = !done && !prev && idx > 0;
                    return (
                      <motion.div
                        key={r!.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="relative"
                      >
                        <span
                          className={cn(
                            'absolute -left-[22px] top-3 grid h-5 w-5 place-items-center rounded-full border-2 text-[10px]',
                            done
                              ? 'border-emerald-400 bg-emerald-500/30 text-emerald-200'
                              : locked
                                ? 'border-white/20 bg-obsidian-700 text-slate-600'
                                : 'border-violet bg-violet/30 text-violet-glow animate-pulse-glow',
                          )}
                        >
                          {done ? '✓' : locked ? '' : '●'}
                        </span>
                        <Link
                          to={`/room/${r!.slug}`}
                          className={cn(
                            'flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 transition-colors',
                            locked
                              ? 'border-white/[0.04] bg-white/[0.01] opacity-60'
                              : 'border-white/[0.06] bg-white/[0.03] hover:border-violet/40',
                          )}
                        >
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-slate-100">{r!.title}</div>
                            <div className="text-[11px] text-slate-400">{r!.difficulty} · {r!.xp} XP</div>
                          </div>
                          {locked ? (
                            <Icon name="lock" size={15} className="text-slate-600" />
                          ) : (
                            <Icon name="chevron" size={15} className="text-slate-500" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
