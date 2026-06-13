import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import { PATHS, ROOMS } from '@/data/catalog';
import { DifficultyChip } from '@/components/ui/primitives';

interface Item {
  type: 'path' | 'room';
  title: string;
  sub: string;
  to: string;
  difficulty: string;
  tags: string[];
}

export function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const nav = useNavigate();

  const items = useMemo<Item[]>(() => {
    const all: Item[] = [
      ...PATHS.map((p) => ({
        type: 'path' as const,
        title: p.title,
        sub: p.tagline,
        to: `/path/${p.slug}`,
        difficulty: p.difficulty,
        tags: [p.track],
      })),
      ...ROOMS.map((r) => ({
        type: 'room' as const,
        title: r.title,
        sub: r.summary,
        to: `/room/${r.slug}`,
        difficulty: r.difficulty,
        tags: r.tags,
      })),
    ];
    if (!q.trim()) return all.slice(0, 8);
    const t = q.toLowerCase();
    return all
      .filter(
        (i) =>
          i.title.toLowerCase().includes(t) ||
          i.sub.toLowerCase().includes(t) ||
          i.tags.some((g) => g.toLowerCase().includes(t)),
      )
      .slice(0, 12);
  }, [q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        open ? onClose() : window.dispatchEvent(new CustomEvent('nethex:openPalette'));
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const go = (to: string) => {
    onClose();
    setQ('');
    nav(to);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass w-full max-w-xl overflow-hidden p-0"
            initial={{ y: -12, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -12, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <Icon name="search" size={18} className="text-slate-400" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search rooms, paths, skills…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500"
              />
              <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">esc</kbd>
            </div>
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {items.length === 0 && (
                <div className="p-6 text-center text-sm text-slate-500">No matches.</div>
              )}
              {items.map((i) => (
                <button
                  key={i.to}
                  onClick={() => go(i.to)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-white/5"
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5 text-violet-glow">
                    <Icon name={i.type === 'path' ? 'layers' : 'terminal'} size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-slate-100">{i.title}</div>
                    <div className="truncate text-xs text-slate-400">{i.sub}</div>
                  </div>
                  <DifficultyChip difficulty={i.difficulty} />
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
