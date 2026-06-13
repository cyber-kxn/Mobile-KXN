import { useState, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getRoom } from '@/data/catalog';
import type { Task, QuestionAnswer } from '@/lib/types';
import { Icon } from '@/components/ui/Icon';
import { DifficultyChip, Chip } from '@/components/ui/primitives';
import { kindLabel, fmtXp, cn } from '@/lib/cn';
import { useProgress } from '@/store/useProgress';
import { Terminal, type TerminalHandle } from '@/features/terminal/Terminal';
import { KeyBar } from '@/features/terminal/KeyBar';
import { HelperRail } from '@/features/terminal/HelperRail';
import { AiMentor } from '@/features/mentor/AiMentor';
import { LabTimer } from '@/features/lab/LabTimer';
import { deployLab, destroyLab, validateFlag, type LabSession } from '@/features/lab/lab';

type RightTab = 'terminal' | 'mentor' | 'rail';
type ConnState = 'idle' | 'connecting' | 'connected' | 'simulated' | 'closed';

export function RoomView() {
  const { slug } = useParams();
  const room = slug ? getRoom(slug) : undefined;
  const termRef = useRef<TerminalHandle>(null);
  const [tab, setTab] = useState<RightTab>('terminal');
  const [activeTask, setActiveTask] = useState(0);
  const [lab, setLab] = useState<LabSession | null>(null);
  const [deploying, setDeploying] = useState(false);
  const [conn, setConn] = useState<ConnState>('idle');
  const [mobilePane, setMobilePane] = useState<'brief' | 'console'>('brief');

  const solved = useProgress((s) => s.solved);
  const totalQ = useMemo(
    () => room?.tasks.reduce((a, t) => a + t.questions.length, 0) ?? 0,
    [room],
  );

  if (!room) {
    return (
      <div className="py-20 text-center text-slate-400">
        Room not found. <Link to="/paths" className="text-violet-glow">Browse rooms</Link>
      </div>
    );
  }

  const solvedHere = solved[room.id]?.length || 0;

  async function onDeploy() {
    if (!room?.lab) return;
    setDeploying(true);
    const session = await deployLab(room.lab);
    setLab(session);
    setDeploying(false);
    setTab('terminal');
    setMobilePane('console');
  }

  async function onDestroy() {
    if (lab) await destroyLab(lab.sessionId);
    setLab(null);
    setConn('idle');
  }

  const connBadge = {
    idle: { c: 'text-slate-500', t: 'no session' },
    connecting: { c: 'text-amber-300', t: 'connecting' },
    connected: { c: 'text-emerald-300', t: 'live PTY' },
    simulated: { c: 'text-cyber-glow', t: 'simulated' },
    closed: { c: 'text-rose-300', t: 'closed' },
  }[conn];

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col lg:h-screen">
      {/* Header */}
      <header className="flex flex-wrap items-center gap-3 border-b border-white/[0.06] bg-obsidian-800/70 px-4 py-3 backdrop-blur-xl">
        <Link to="/paths" className="text-slate-400 hover:text-slate-200">
          <Icon name="chevron" size={18} className="rotate-180" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate font-bold text-slate-100">{room.title}</h1>
            <DifficultyChip difficulty={room.difficulty} />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{kindLabel[room.kind]}</span>·
            <span className="flex items-center gap-1"><Icon name="bolt" size={12} className="text-cyber" /> {fmtXp(room.xp)} XP</span>·
            <span>{solvedHere}/{totalQ} solved</span>
          </div>
        </div>

        {room.lab && (
          <div className="flex items-center gap-2">
            <span className={cn('chip border border-white/10 bg-white/5', connBadge.c)}>
              <span className="h-1.5 w-1.5 rounded-full bg-current" /> {connBadge.t}
            </span>
            {lab && <LabTimer expiresAt={lab.expiresAt} />}
            {lab ? (
              <button onClick={onDestroy} className="btn-ghost px-3 py-1.5 text-rose-300">
                <Icon name="close" size={14} /> Terminate
              </button>
            ) : (
              <button onClick={onDeploy} disabled={deploying} className="btn-cyan px-3 py-1.5">
                <Icon name="cpu" size={15} /> {deploying ? 'Provisioning…' : 'Deploy lab'}
              </button>
            )}
          </div>
        )}
      </header>

      {/* Mobile pane switch */}
      <div className="flex border-b border-white/[0.06] lg:hidden">
        {(['brief', 'console'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setMobilePane(p)}
            className={cn(
              'flex-1 py-2.5 text-sm font-medium capitalize',
              mobilePane === p ? 'border-b-2 border-violet text-violet-glow' : 'text-slate-400',
            )}
          >
            {p === 'brief' ? 'Tasks' : 'Console'}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        {/* Left: tasks & questions */}
        <div
          className={cn(
            'min-h-0 flex-1 overflow-y-auto p-4 lg:max-w-[46%] lg:border-r lg:border-white/[0.06]',
            mobilePane === 'console' && 'hidden lg:block',
          )}
        >
          <TaskNav room={room} active={activeTask} onSelect={setActiveTask} solved={solved[room.id] || []} />
          <TaskPanel
            task={room.tasks[activeTask]}
            roomId={room.id}
            onInsert={(c) => {
              termRef.current?.insert(c);
              setMobilePane('console');
              setTab('terminal');
            }}
          />
        </div>

        {/* Right: console */}
        <div className={cn('flex min-h-0 flex-1 flex-col', mobilePane === 'brief' && 'hidden lg:flex')}>
          <div className="flex items-center gap-1 border-b border-white/[0.06] bg-obsidian-700/40 px-2 py-1.5">
            {(['terminal', 'mentor', 'rail'] as RightTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                  tab === t ? 'bg-violet/15 text-violet-glow' : 'text-slate-400 hover:text-slate-200',
                )}
              >
                <Icon name={t === 'terminal' ? 'terminal' : t === 'mentor' ? 'sparkles' : 'book'} size={14} />
                {t === 'rail' ? 'Helper' : t}
              </button>
            ))}
          </div>

          {/* Keep terminal mounted; toggle visibility so the session survives tab switches */}
          <div className={cn('flex min-h-0 flex-1 flex-col', tab !== 'terminal' && 'hidden')}>
            <div className="min-h-0 flex-1 bg-obsidian-900 p-2">
              <Terminal
                ref={termRef}
                sessionId={lab?.sessionId}
                host={room.lab?.nodes.find((n) => n.role !== 'attacker')?.hostname}
                onStatus={(s) => setConn(s)}
              />
            </div>
            <KeyBar termRef={termRef} />
          </div>
          {tab === 'mentor' && (
            <div className="min-h-0 flex-1">
              <AiMentor room={room} task={room.tasks[activeTask]} />
            </div>
          )}
          {tab === 'rail' && (
            <div className="min-h-0 flex-1">
              <HelperRail room={room} task={room.tasks[activeTask]} termRef={termRef} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TaskNav({
  room,
  active,
  onSelect,
  solved,
}: {
  room: ReturnType<typeof getRoom>;
  active: number;
  onSelect: (i: number) => void;
  solved: string[];
}) {
  if (!room) return null;
  return (
    <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
      {room.tasks.map((t, i) => {
        const done = t.questions.every((q) => solved.includes(q.id));
        return (
          <button
            key={t.id}
            onClick={() => onSelect(i)}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors',
              active === i
                ? 'border-violet/50 bg-violet/15 text-slate-100'
                : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-slate-200',
            )}
          >
            <span
              className={cn(
                'grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold',
                done ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-slate-300',
              )}
            >
              {done ? '✓' : i + 1}
            </span>
            <span className="max-w-[10rem] truncate">{t.title}</span>
          </button>
        );
      })}
    </div>
  );
}

function TaskPanel({
  task,
  roomId,
  onInsert,
}: {
  task: Task;
  roomId: string;
  onInsert: (cmd: string) => void;
}) {
  return (
    <motion.div key={task.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      <article className="prose-invert max-w-none">
        <MarkdownLite body={task.body} onInsert={onInsert} />
      </article>

      <div className="mt-5 space-y-3">
        {task.questions.map((q) => (
          <QuestionItem key={q.id} q={q} roomId={roomId} />
        ))}
      </div>
    </motion.div>
  );
}

function QuestionItem({ q, roomId }: { q: QuestionAnswer; roomId: string }) {
  const solveQuestion = useProgress((s) => s.solveQuestion);
  const isSolved = useProgress((s) => s.solved[roomId]?.includes(q.id) ?? false);
  const [val, setVal] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [state, setState] = useState<'idle' | 'wrong' | 'checking'>('idle');

  async function submit() {
    if (q.kind === 'no-answer') {
      solveQuestion(roomId, q.id, q.points);
      return;
    }
    if (!val.trim()) return;
    setState('checking');
    const res = await validateFlag(roomId, q.id, val);
    if (res.correct) {
      solveQuestion(roomId, q.id, q.points);
      setState('idle');
    } else {
      setState('wrong');
      setTimeout(() => setState('idle'), 1200);
    }
  }

  return (
    <div
      className={cn(
        'rounded-xl border p-4 transition-colors',
        isSolved ? 'border-emerald-500/30 bg-emerald-500/[0.06]' : 'border-white/10 bg-white/[0.02]',
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <p className="text-sm text-slate-200">{q.prompt}</p>
        <Chip className="shrink-0 border-cyber/20 bg-cyber/10 text-cyber-glow">+{q.points}</Chip>
      </div>

      {isSolved ? (
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-300">
          <Icon name="check" size={16} /> Solved
        </div>
      ) : (
        <>
          {q.kind === 'no-answer' ? (
            <button onClick={submit} className="btn-primary py-2 text-sm">
              <Icon name="check" size={15} /> Mark complete
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                value={val}
                onChange={(e) => setVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder={q.kind === 'flag' ? 'NETHEX{…}' : q.kind === 'numeric' ? 'number' : 'answer'}
                className={cn('input py-2 font-mono', state === 'wrong' && 'border-rose-500/60 ring-rose-500/20')}
              />
              <button onClick={submit} disabled={state === 'checking'} className="btn-primary px-3 py-2">
                {state === 'checking' ? '…' : <Icon name="check" size={16} />}
              </button>
            </div>
          )}
          <div className="mt-2 flex items-center gap-3 text-xs">
            {state === 'wrong' && <span className="text-rose-300">Not quite — try again.</span>}
            {q.hint && (
              <button onClick={() => setShowHint((s) => !s)} className="text-violet-glow hover:underline">
                {showHint ? 'Hide hint' : 'Show hint'}
              </button>
            )}
          </div>
          {showHint && q.hint && (
            <div className="mt-2 rounded-lg border border-violet/20 bg-violet/[0.06] px-3 py-2 text-xs text-slate-300">
              💡 {q.hint}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Lightweight markdown renderer for task briefs (headings, code, bold, lists).
function MarkdownLite({ body, onInsert }: { body: string; onInsert: (cmd: string) => void }) {
  const lines = body.split('\n');
  const out: React.ReactNode[] = [];
  let inCode = false;
  let code: string[] = [];

  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (inCode) {
        const snippet = code.join('\n');
        out.push(
          <div key={`c${i}`} className="group relative my-3">
            <pre className="overflow-x-auto rounded-xl border border-white/10 bg-obsidian-900 p-3 font-mono text-xs text-cyber-glow">
              {snippet}
            </pre>
            <button
              onClick={() => onInsert(snippet)}
              className="absolute right-2 top-2 rounded-md bg-white/10 px-2 py-1 text-[10px] text-slate-300 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Icon name="send" size={12} className="inline" /> run
            </button>
          </div>,
        );
        code = [];
      }
      inCode = !inCode;
      return;
    }
    if (inCode) {
      code.push(line);
      return;
    }
    if (line.startsWith('## ')) out.push(<h3 key={i} className="mb-1 mt-4 text-base font-bold text-slate-100">{line.slice(3)}</h3>);
    else if (line.startsWith('# ')) out.push(<h2 key={i} className="mb-2 mt-4 text-lg font-bold text-slate-100">{line.slice(2)}</h2>);
    else if (line.startsWith('> ')) out.push(<blockquote key={i} className="my-2 border-l-2 border-violet/50 pl-3 text-sm italic text-slate-400">{inline(line.slice(2))}</blockquote>);
    else if (line.startsWith('- ')) out.push(<li key={i} className="ml-5 list-disc text-sm text-slate-300">{inline(line.slice(2))}</li>);
    else if (line.trim() === '') out.push(<div key={i} className="h-2" />);
    else out.push(<p key={i} className="text-sm leading-relaxed text-slate-300">{inline(line)}</p>);
  });
  return <>{out}</>;
}

function inline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i} className="text-slate-100">{p.slice(2, -2)}</strong>;
    if (p.startsWith('`') && p.endsWith('`')) return <code key={i} className="rounded bg-white/10 px-1 py-0.5 font-mono text-xs text-cyber-glow">{p.slice(1, -1)}</code>;
    return <span key={i}>{p}</span>;
  });
}
