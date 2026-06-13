import type { TerminalHandle } from './Terminal';

// On-screen key bar for special characters that are awkward on mobile/touch.
const KEYS: { label: string; send: string }[] = [
  { label: 'Esc', send: '\x1b' },
  { label: 'Tab', send: '\t' },
  { label: 'Ctrl+C', send: '\x03' },
  { label: 'Ctrl+L', send: '\x0c' },
  { label: '↑', send: '\x1b[A' },
  { label: '↓', send: '\x1b[B' },
  { label: '←', send: '\x1b[D' },
  { label: '→', send: '\x1b[C' },
  { label: '/', send: '/' },
  { label: '|', send: '|' },
  { label: '-', send: '-' },
  { label: '~', send: '~' },
  { label: '$', send: '$' },
];

export function KeyBar({ termRef }: { termRef: React.RefObject<TerminalHandle> }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto border-t border-white/[0.06] bg-obsidian-700/60 px-2 py-2">
      {KEYS.map((k) => (
        <button
          key={k.label}
          onClick={() => termRef.current?.send(k.send)}
          className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-xs text-slate-300 active:scale-95 active:bg-violet/20"
        >
          {k.label}
        </button>
      ))}
    </div>
  );
}
