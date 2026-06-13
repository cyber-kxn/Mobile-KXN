// Lab topology profiles. Each maps to an ephemeral, egress-isolated Docker
// deployment. `egress: 'none'` ⇒ NetworkMode "none". `egress: 'internal'` ⇒
// containers share a private bridge created with `internal: true` (no route to
// the internet), enforcing the platform's hard isolation requirement.

export interface LabNodeSpec {
  hostname: string;
  image: string;
  role: 'attacker' | 'target' | 'pivot';
}

export interface LabProfileSpec {
  id: string;
  name: string;
  nodes: LabNodeSpec[];
  ttlSeconds: number;
  egress: 'none' | 'internal';
  /** Per-user concurrent session cap for this profile. */
  maxPerUser: number;
}

export const PROFILES: Record<string, LabProfileSpec> = {
  'lp-linux-single': {
    id: 'lp-linux-single',
    name: 'Single Linux host',
    nodes: [{ hostname: 'forge', image: 'nethex/lab-linux-base', role: 'target' }],
    ttlSeconds: 3600,
    egress: 'none',
    maxPerUser: 2,
  },
  'lp-privesc': {
    id: 'lp-privesc',
    name: 'Hardened Linux target',
    nodes: [{ hostname: 'vault', image: 'nethex/lab-linux-privesc', role: 'target' }],
    ttlSeconds: 5400,
    egress: 'none',
    maxPerUser: 2,
  },
  'lp-web-portal': {
    id: 'lp-web-portal',
    name: 'Web portal + DB',
    nodes: [
      { hostname: 'kali', image: 'nethex/lab-attacker', role: 'attacker' },
      { hostname: 'portal', image: 'nethex/lab-web-portal', role: 'target' },
      { hostname: 'db', image: 'nethex/lab-postgres', role: 'target' },
    ],
    ttlSeconds: 5400,
    egress: 'internal',
    maxPerUser: 1,
  },
  'lp-ad-forest': {
    id: 'lp-ad-forest',
    name: 'AD forest',
    nodes: [
      { hostname: 'kali', image: 'nethex/lab-attacker', role: 'attacker' },
      { hostname: 'dc01', image: 'nethex/lab-windows-dc', role: 'target' },
      { hostname: 'ws01', image: 'nethex/lab-windows-ws', role: 'target' },
    ],
    ttlSeconds: 7200,
    egress: 'internal',
    maxPerUser: 1,
  },
  'lp-llm-app': {
    id: 'lp-llm-app',
    name: 'Vulnerable LLM chat app',
    nodes: [
      { hostname: 'kali', image: 'nethex/lab-attacker', role: 'attacker' },
      { hostname: 'chatapp', image: 'nethex/lab-llm-app', role: 'target' },
    ],
    ttlSeconds: 3600,
    egress: 'internal',
    maxPerUser: 2,
  },
};

export function getProfile(id: string): LabProfileSpec | undefined {
  return PROFILES[id];
}
