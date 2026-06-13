import { Link } from 'react-router-dom';
import type { Room } from '@/lib/types';
import { Icon } from '@/components/ui/Icon';
import { Chip, DifficultyChip } from '@/components/ui/primitives';
import { kindLabel, fmtXp } from '@/lib/cn';
import { useProgress } from '@/store/useProgress';

const kindIcon: Record<string, string> = {
  walkthrough: 'book',
  challenge: 'crosshair',
  ctf: 'flame',
  network: 'network',
};

export function RoomCard({ room }: { room: Room }) {
  const completed = useProgress((s) => s.completedRooms.includes(room.id));
  const solved = useProgress((s) => s.solved[room.id]?.length || 0);
  const totalQ = room.tasks.reduce((a, t) => a + t.questions.length, 0);

  return (
    <Link to={`/room/${room.slug}`} className="group">
      <div className="glass glass-hover flex h-full flex-col p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-violet/25 to-cyber/15 text-violet-glow">
            <Icon name={kindIcon[room.kind]} size={20} />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <DifficultyChip difficulty={room.difficulty} />
            {completed && (
              <span className="chip border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                <Icon name="check" size={12} /> Done
              </span>
            )}
          </div>
        </div>
        <h3 className="font-bold text-slate-100 transition-colors group-hover:text-violet-glow">
          {room.title}
        </h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-slate-400">{room.summary}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <Chip className="border-white/10 bg-white/5">{kindLabel[room.kind]}</Chip>
          <span className="flex items-center gap-1">
            <Icon name="bolt" size={13} className="text-cyber" /> {fmtXp(room.xp)} XP
          </span>
          <span className="flex items-center gap-1">
            <Icon name="clock" size={13} /> {room.estMinutes}m
          </span>
          {room.lab && (
            <span className="flex items-center gap-1 text-emerald-300">
              <Icon name="cpu" size={13} /> Lab
            </span>
          )}
          {solved > 0 && !completed && (
            <span className="ml-auto text-violet-glow">
              {solved}/{totalQ}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
