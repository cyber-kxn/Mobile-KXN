import { apiFetch } from '@/lib/api';
import type { LabProfile } from '@/lib/types';

export interface LabSession {
  sessionId: string;
  status: 'provisioning' | 'running' | 'expired';
  expiresAt: number; // epoch ms
  nodes: { hostname: string; role: string; ip: string }[];
  simulated: boolean;
}

/** Deploy a lab; falls back to a simulated session when the broker is offline. */
export async function deployLab(profile: LabProfile): Promise<LabSession> {
  const res = await apiFetch<LabSession>('/labs/deploy', {
    method: 'POST',
    body: JSON.stringify({ profileId: profile.id }),
  });
  if (res.online && res.data) return res.data;

  // Simulated session metadata (egress-isolated topology is enforced server-side).
  return {
    sessionId: 'sim-' + Math.random().toString(36).slice(2, 9),
    status: 'running',
    expiresAt: Date.now() + profile.ttlSeconds * 1000,
    nodes: profile.nodes.map((n, i) => ({
      hostname: n.hostname,
      role: n.role,
      ip: `10.10.${20 + i}.${10 + i}`,
    })),
    simulated: true,
  };
}

export async function destroyLab(sessionId: string): Promise<void> {
  await apiFetch(`/labs/${sessionId}`, { method: 'DELETE' });
}

export async function validateFlag(
  roomId: string,
  questionId: string,
  answer: string,
): Promise<{ correct: boolean; points?: number; simulated: boolean }> {
  const res = await apiFetch<{ correct: boolean; points: number }>('/flags/validate', {
    method: 'POST',
    body: JSON.stringify({ roomId, questionId, answer }),
  });
  if (res.online && res.data) return { ...res.data, simulated: false };
  // Offline acceptance heuristic: any non-trivial answer counts (mock mode only).
  return { correct: answer.trim().length >= 2, simulated: true };
}
