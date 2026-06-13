import type { Room, Task } from '@/lib/types';
import type { TerminalHandle } from './Terminal';
import { Icon } from '@/components/ui/Icon';

const CHEATS: { title: string; items: { cmd: string; desc: string }[] }[] = [
  {
    title: 'Enumeration',
    items: [
      { cmd: 'ls -la', desc: 'list all files w/ perms' },
      { cmd: 'find / -perm -4000 2>/dev/null', desc: 'find SUID binaries' },
      { cmd: 'cat /etc/passwd', desc: 'enumerate users' },
      { cmd: 'sudo -l', desc: 'check sudo rights' },
    ],
  },
  {
    title: 'Network',
    items: [
      { cmd: 'nmap -sC -sV target', desc: 'service + script scan' },
      { cmd: 'nc -lvnp 4444', desc: 'listener for reverse shell' },
      { cmd: 'curl -s http://target/', desc: 'fetch a page' },
    ],
  },
];

export function HelperRail({
  room,
  task,
  termRef,
}: {
  room: Room;
  task?: Task;
  termRef: React.RefObject<TerminalHandle>;
}) {
  const insert = (cmd: string) => termRef.current?.insert(cmd);

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-3">
      {task?.suggestedCommands && task.suggestedCommands.length > 0 && (
        <section>
          <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-violet-glow">
            <Icon name="bolt" size={14} /> Suggested for this task
          </h4>
          <div className="space-y-1.5">
            {task.suggestedCommands.map((s) => (
              <button
                key={s.cmd}
                onClick={() => insert(s.cmd)}
                className="group flex w-full items-center justify-between gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-left hover:border-violet/40"
              >
                <div className="min-w-0">
                  <div className="truncate font-mono text-xs text-cyber-glow">{s.cmd}</div>
                  <div className="text-[10px] text-slate-500">{s.label}</div>
                </div>
                <Icon name="send" size={14} className="shrink-0 text-slate-500 group-hover:text-violet-glow" />
              </button>
            ))}
          </div>
        </section>
      )}

      <section>
        <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <Icon name="book" size={14} /> Cheat sheets
        </h4>
        <div className="space-y-3">
          {CHEATS.map((c) => (
            <div key={c.title}>
              <div className="mb-1 text-[11px] font-semibold text-slate-300">{c.title}</div>
              <div className="space-y-1">
                {c.items.map((it) => (
                  <button
                    key={it.cmd}
                    onClick={() => insert(it.cmd)}
                    className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left hover:bg-white/5"
                    title={it.desc}
                  >
                    <code className="truncate font-mono text-[11px] text-slate-300">{it.cmd}</code>
                    <span className="shrink-0 text-[10px] text-slate-500">{it.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-auto rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs text-slate-400">
        <div className="mb-1 font-semibold text-slate-300">Room: {room.title}</div>
        Tags: {room.tags.join(', ')}
      </section>
    </div>
  );
}
