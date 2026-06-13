import { clsx, type ClassValue } from 'clsx';

/** Tailwind-friendly className combiner. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export const difficultyColor: Record<string, string> = {
  intro: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
  easy: 'text-cyber-glow bg-cyber/10 border-cyber/20',
  medium: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
  hard: 'text-orange-300 bg-orange-500/10 border-orange-500/20',
  insane: 'text-rose-300 bg-rose-500/10 border-rose-500/20',
};

export const kindLabel: Record<string, string> = {
  walkthrough: 'Walkthrough',
  challenge: 'Challenge',
  ctf: 'CTF',
  network: 'Network',
};

export function fmtXp(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `${n}`;
}
