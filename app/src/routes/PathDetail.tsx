import { useParams, Link } from 'react-router-dom';
import { getPath, getRoomById } from '@/data/catalog';
import { RoomCard } from '@/components/RoomCard';
import { Icon } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/primitives';
import { useProgress } from '@/store/useProgress';

export function PathDetail() {
  const { slug } = useParams();
  const path = slug ? getPath(slug) : undefined;
  const completedRooms = useProgress((s) => s.completedRooms);

  if (!path) {
    return (
      <div className="py-20 text-center text-slate-400">
        Path not found. <Link to="/paths" className="text-violet-glow">Back to paths</Link>
      </div>
    );
  }

  const allRoomIds = path.modules.flatMap((m) => m.roomIds);
  const done = allRoomIds.filter((id) => completedRooms.includes(id)).length;

  return (
    <div className="space-y-8">
      <Link to="/paths" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200">
        <Icon name="chevron" size={14} className="rotate-180" /> Paths
      </Link>

      <div className={`glass surface-grid bg-gradient-to-br ${path.accent} p-6`}>
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-obsidian-800/60 text-violet-glow">
            <Icon name={path.icon} size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100">{path.title}</h1>
            <p className="text-slate-300/80">{path.tagline}</p>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm text-slate-300/80">{path.description}</p>
        <div className="mt-4 max-w-md">
          <div className="mb-1 flex justify-between text-xs text-slate-300/70">
            <span>{done}/{allRoomIds.length} rooms complete</span>
            <span>{path.estHours}h · {path.difficulty}</span>
          </div>
          <ProgressBar value={allRoomIds.length ? done / allRoomIds.length : 0} />
        </div>
      </div>

      {path.modules.map((m, i) => (
        <section key={m.id}>
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-violet/15 font-mono text-sm font-bold text-violet-glow">
              {i + 1}
            </div>
            <div>
              <h2 className="font-bold text-slate-100">{m.title}</h2>
              <p className="text-sm text-slate-400">{m.summary}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {m.roomIds.map((id) => {
              const r = getRoomById(id);
              return r ? <RoomCard key={id} room={r} /> : null;
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
