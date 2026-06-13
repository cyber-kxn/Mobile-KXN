import type { ReactNode } from 'react';
import { cn, difficultyColor } from '@/lib/cn';

export function Card({
  className,
  children,
  hover,
}: {
  className?: string;
  children: ReactNode;
  hover?: boolean;
}) {
  return (
    <div className={cn('glass p-4', hover && 'glass-hover cursor-pointer', className)}>
      {children}
    </div>
  );
}

export function Chip({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn('chip border', className || 'border-white/10 bg-white/5 text-slate-300')}>
      {children}
    </span>
  );
}

export function DifficultyChip({ difficulty }: { difficulty: string }) {
  return (
    <span className={cn('chip border capitalize', difficultyColor[difficulty])}>
      {difficulty}
    </span>
  );
}

export function ProgressRing({
  value,
  size = 56,
  stroke = 5,
  label,
}: {
  value: number; // 0..1
  size?: number;
  stroke?: number;
  label?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.max(0, Math.min(1, value)));
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#ring)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute text-xs font-bold text-slate-100">{label}</span>
    </div>
  );
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-white/5', className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-violet to-cyber transition-all duration-700"
        style={{ width: `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%` }}
      />
    </div>
  );
}

export function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-violet-glow">{icon}</div>
      <div>
        <div className="text-lg font-bold leading-none text-slate-100">{value}</div>
        <div className="text-xs text-slate-400">{label}</div>
      </div>
    </div>
  );
}

export function SectionTitle({
  title,
  action,
  subtitle,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-lg font-bold text-slate-100">{title}</h2>
        {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyHint({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-400">
      {children}
    </div>
  );
}
