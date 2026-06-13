import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PATHS, ROOMS } from '@/data/catalog';
import { RoomCard } from '@/components/RoomCard';
import { Icon } from '@/components/ui/Icon';
import { ProgressRing, SectionTitle } from '@/components/ui/primitives';
import { useProgress } from '@/store/useProgress';
import { cn } from '@/lib/cn';
import type { Track } from '@/lib/types';

const TRACKS: { id: Track | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'foundations', label: 'Foundations' },
  { id: 'offensive', label: 'Offensive' },
  { id: 'web', label: 'Web' },
  { id: 'active-directory', label: 'Active Dir' },
  { id: 'defensive', label: 'Defensive' },
  { id: 'dfir', label: 'DFIR' },
  { id: 'ai-security', label: 'AI Security' },
  { id: 'cloud', label: 'Cloud' },
  { id: 'privesc', label: 'PrivEsc' },
];

export function Paths() {
  const [track, setTrack] = useState<Track | 'all'>('all');
  const completedRooms = useProgress((s) => s.completedRooms);

  const rooms = track === 'all' ? ROOMS : ROOMS.filter((r) => r.track === track);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100">Explore</h1>
        <p className="text-slate-400">Paths, modules and rooms across the full discipline.</p>
      </div>

      <section>
        <SectionTitle title="Learning paths" />
        <div className="grid gap-4 md:grid-cols-2">
          {PATHS.map((p) => {
            const roomIds = p.modules.flatMap((m) => m.roomIds);
            const done = roomIds.filter((id) => completedRooms.includes(id)).length;
            return (
              <Link key={p.id} to={`/path/${p.slug}`} className="group">
                <div className={`glass glass-hover flex items-center gap-4 bg-gradient-to-br ${p.accent} p-5`}>
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-obsidian-800/60 text-violet-glow">
                    <Icon name={p.icon} size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-100 group-hover:text-violet-glow">{p.title}</h3>
                    <p className="truncate text-sm text-slate-300/80">{p.description}</p>
                  </div>
                  <ProgressRing value={roomIds.length ? done / roomIds.length : 0} size={48} label={`${done}/${roomIds.length}`} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <SectionTitle title="All rooms" subtitle={`${rooms.length} rooms`} />
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          {TRACKS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTrack(t.id)}
              className={cn(
                'chip shrink-0 border transition-colors',
                track === t.id
                  ? 'border-violet/50 bg-violet/15 text-violet-glow'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:text-slate-200',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((r) => (
            <RoomCard key={r.id} room={r} />
          ))}
        </div>
      </section>
    </div>
  );
}
