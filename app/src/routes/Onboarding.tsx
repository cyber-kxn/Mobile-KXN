import { useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';

const INTERESTS = [
  { id: 'offensive', label: 'Offensive / Red Team', icon: 'crosshair' },
  { id: 'defensive', label: 'Defensive / Blue Team', icon: 'shield' },
  { id: 'web', label: 'Web Exploitation', icon: 'globe' },
  { id: 'dfir', label: 'Forensics & IR', icon: 'search' },
  { id: 'cloud', label: 'Cloud Security', icon: 'layers' },
  { id: 'ai-security', label: 'AI / LLM Security', icon: 'sparkles' },
];

const LEVELS = ['Complete beginner', 'Some experience', 'Working professional', 'Seasoned operator'];

export function Onboarding() {
  const { completeOnboarding } = useAuth();
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<string[]>([]);
  const [level, setLevel] = useState<string | null>(null);

  const toggle = (id: string) =>
    setPicks((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-violet/20 blur-[100px]" />
      <div className="glass relative w-full max-w-lg p-6">
        <div className="mb-6 flex gap-1.5">
          {[0, 1].map((s) => (
            <div key={s} className={cn('h-1 flex-1 rounded-full', s <= step ? 'bg-violet' : 'bg-white/10')} />
          ))}
        </div>

        {step === 0 ? (
          <>
            <h2 className="text-xl font-extrabold text-slate-100">What pulls you in?</h2>
            <p className="mb-4 text-sm text-slate-400">Pick the tracks you want to focus on. We'll tune your roadmap.</p>
            <div className="grid grid-cols-2 gap-3">
              {INTERESTS.map((i) => (
                <button
                  key={i.id}
                  onClick={() => toggle(i.id)}
                  className={cn(
                    'flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all',
                    picks.includes(i.id)
                      ? 'border-violet/60 bg-violet/15 shadow-glow'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20',
                  )}
                >
                  <Icon name={i.icon} size={22} className={picks.includes(i.id) ? 'text-violet-glow' : 'text-slate-400'} />
                  <span className="text-sm font-semibold text-slate-100">{i.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} disabled={picks.length === 0} className="btn-primary mt-6 w-full">
              Continue <Icon name="chevron" size={16} />
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-extrabold text-slate-100">Where are you starting?</h2>
            <p className="mb-4 text-sm text-slate-400">Be honest — it only changes where we drop you in.</p>
            <div className="space-y-2">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all',
                    level === l ? 'border-violet/60 bg-violet/15 text-slate-100' : 'border-white/10 bg-white/[0.02] text-slate-300',
                  )}
                >
                  {l}
                  {level === l && <Icon name="check" size={16} className="text-violet-glow" />}
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setStep(0)} className="btn-ghost">Back</button>
              <button onClick={() => completeOnboarding([...picks, ...(level ? [level] : [])])} disabled={!level} className="btn-primary flex-1">
                Enter NETHEX <Icon name="play" size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
