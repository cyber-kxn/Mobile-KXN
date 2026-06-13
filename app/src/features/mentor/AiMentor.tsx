import { useState, useRef, useEffect } from 'react';
import type { Room, Task } from '@/lib/types';
import { Icon } from '@/components/ui/Icon';
import { askMentor, type MentorMessage, type MentorMode } from './mentor';

export function AiMentor({ room, task }: { room: Room; task?: Task }) {
  const [messages, setMessages] = useState<MentorMessage[]>([
    {
      role: 'assistant',
      content: `I'm your NETHEX mentor for **${room.title}**. Ask for a hint, an explanation of a concept, or a quick quiz — I keep guidance to the current room only.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  async function run(mode: MentorMode, text?: string) {
    if (busy) return;
    setBusy(true);
    const history = [...messages];
    if (text) setMessages((m) => [...m, { role: 'user', content: text }]);
    const reply = await askMentor(mode, room, history, task, text);
    setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    setBusy(false);
  }

  function submit() {
    const t = input.trim();
    if (!t) return;
    setInput('');
    run('hint', t);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex gap-2 border-b border-white/[0.06] px-3 py-2.5">
        {(['hint', 'explain', 'quiz'] as MentorMode[]).map((m) => (
          <button
            key={m}
            onClick={() => run(m)}
            disabled={busy}
            className="chip border border-violet/30 bg-violet/10 capitalize text-violet-glow hover:bg-violet/20 disabled:opacity-40"
          >
            <Icon name={m === 'hint' ? 'bolt' : m === 'explain' ? 'book' : 'star'} size={13} /> {m}
          </button>
        ))}
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div
              className={
                msg.role === 'user'
                  ? 'max-w-[85%] rounded-2xl rounded-br-sm bg-violet/20 px-3 py-2 text-sm text-slate-100'
                  : 'max-w-[90%] rounded-2xl rounded-bl-sm border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-slate-200'
              }
            >
              {msg.role === 'assistant' && (
                <div className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-cyber-glow">
                  <Icon name="sparkles" size={12} /> Mentor
                </div>
              )}
              <div className="whitespace-pre-wrap leading-relaxed">{renderMd(msg.content)}</div>
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-2 w-2 animate-pulse-glow rounded-full bg-violet" /> thinking…
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-white/[0.06] p-2.5 pb-safe">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Ask the mentor…"
          className="input py-2"
        />
        <button onClick={submit} disabled={busy} className="btn-primary px-3 py-2">
          <Icon name="send" size={16} />
        </button>
      </div>
    </div>
  );
}

// Tiny inline markdown: **bold** only, keeps bundle lean.
function renderMd(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? (
      <strong key={i} className="text-slate-100">
        {p.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}
